import { NextResponse } from "next/server";
import { verifySession, bearerToken } from "@/lib/admin-auth";
import { deleteAsset, signUpload, getCloudinaryConfig } from "@/lib/cloudinary";
import { site } from "@/data/site";

const ERR = site.dashboard.errors;

async function authed(request) {
  return verifySession(bearerToken(request));
}

function denied() {
  return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
}

// Server-side upload: the browser posts the file here, this route
// forwards it to Cloudinary. Browser never touches Cloudinary, so
// cross-origin (CORS) failures are impossible by construction.
export async function POST(request) {
  if (!(await authed(request))) return denied();
  let form;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json({ ok: false, error: site.dashboard.errors.badRequest }, { status: 400 });
  }
  const file = form.get("file");
  const folder = String(form.get("folder") || "all-in-one-dream-place/uploads");
  if (!file || typeof file.arrayBuffer !== "function") {
    return NextResponse.json({ ok: false, error: ERR.noFile }, { status: 400 });
  }
  if (typeof file.size === "number" && file.size > 12 * 1024 * 1024) {
    return NextResponse.json({ ok: false, error: ERR.tooLarge }, { status: 413 });
  }
  // Every new upload is normalized to WebP here. Already-hosted files
  // are never touched — only what comes through this endpoint.
  let payload;
  try {
    const sharp = (await import("sharp")).default;
    const webp = await sharp(Buffer.from(await file.arrayBuffer()))
      .rotate()
      .webp({ quality: 82 })
      .toBuffer();
    payload = new Blob([webp], { type: "image/webp" });
  } catch {
    return NextResponse.json({ ok: false, error: ERR.notImage }, { status: 400 });
  }
  try {
    const { cloudName, apiKey } = getCloudinaryConfig();
    const signed = signUpload({ folder, resourceType: "image" });
    const out = new FormData();
    out.append("file", payload, "photo.webp");
    out.append("api_key", apiKey);
    out.append("timestamp", String(signed.timestamp));
    out.append("folder", signed.folder);
    out.append("signature", signed.signature);
    const up = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
      method: "POST",
      body: out
    });
    const done = await up.json().catch(() => ({}));
    if (!up.ok || done.error || !done.public_id) {
      throw new Error(done?.error?.message || ERR.uploadFailed);
    }
    return NextResponse.json({ ok: true, path: `${done.public_id}.${done.format}` });
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
  const publicId = String(body.publicId || "").trim();
  if (!publicId || publicId.startsWith("/")) {
    return NextResponse.json({ ok: false, error: "Nothing to delete." }, { status: 400 });
  }
  try {
    await deleteAsset(publicId, body.resourceType === "video" ? "video" : "image");
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ ok: false, error: e.message || "Delete failed." }, { status: 400 });
  }
}
