import { NextResponse } from "next/server";
import { verifySession, bearerToken } from "@/lib/admin-auth";
import { deleteAsset, uploadAsset } from "@/lib/imagekit";
import { site } from "@/data/site";

const ERR = site.dashboard.errors;

async function authed(request) {
  return verifySession(bearerToken(request));
}

function denied() {
  return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
}

// Server-side upload: the browser posts the file here, this route
// normalizes it and sends it to ImageKit. The private ImageKit key never
// reaches the browser.
export async function POST(request) {
  if (!(await authed(request))) return denied();
  let form;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json({ ok: false, error: site.dashboard.errors.badRequest }, { status: 400 });
  }
  const file = form.get("file");
  const folder = String(form.get("folder") || "3knotts/uploads");
  if (!file || typeof file.arrayBuffer !== "function") {
    return NextResponse.json({ ok: false, error: ERR.noFile }, { status: 400 });
  }
  const isVideo = file.type?.startsWith("video/");
  const sizeLimit = isVideo ? 10 * 1024 * 1024 : 12 * 1024 * 1024;
  if (typeof file.size === "number" && file.size > sizeLimit) {
    return NextResponse.json({ ok: false, error: isVideo ? "Video must be under 10MB." : ERR.tooLarge }, { status: 413 });
  }
  // Every new image upload is normalized to WebP here. Videos pass through unchanged.
  // Already-hosted files are never touched — only what comes through this endpoint.
  let payload;
  let fileName;
  if (isVideo) {
    payload = file;
    fileName = file.name || "video.mp4";
  } else {
    try {
      const sharp = (await import("sharp")).default;
      const buf = Buffer.from(await file.arrayBuffer());
      const meta = await sharp(buf).metadata().catch(() => null);
      if (!meta || !meta.format) {
        return NextResponse.json({ ok: false, error: ERR.notImage }, { status: 400 });
      }
      const webp = await sharp(buf).rotate().webp({ quality: 82 }).toBuffer();
      payload = new Blob([webp], { type: "image/webp" });
      fileName = "photo.webp";
    } catch (e) {
      const msg = (e?.message || "").toLowerCase();
      if (msg.includes("format") || msg.includes("image") || msg.includes("vips")) {
        return NextResponse.json({ ok: false, error: ERR.notImage }, { status: 400 });
      }
      return NextResponse.json({ ok: false, error: "Image processing failed. Try a different file." }, { status: 400 });
    }
  }
  try {
    const uploaded = await uploadAsset({ data: payload, fileName, folder });
    return NextResponse.json({ ok: true, ...uploaded });
  } catch (e) {
    return NextResponse.json({ ok: false, error: e.message || ERR.uploadFailed }, { status: 500 });
  }
}

export async function DELETE(request) {
  const token = bearerToken(request);
  if (!(await verifySession(token))) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: site.dashboard.errors.badRequest }, { status: 400 });
  }
  const fileId = String(body.fileId || "").trim();
  const filePath = String(body.filePath || body.publicId || "").trim();
  if (!fileId && (!filePath || filePath.startsWith("/"))) {
    return NextResponse.json({ ok: false, error: "Nothing to delete." }, { status: 400 });
  }
  try {
    return NextResponse.json({ ok: true, ...(await deleteAsset({ fileId, filePath })) });
  } catch (e) {
    return NextResponse.json({ ok: false, error: e.message || "Delete failed." }, { status: 400 });
  }
}
