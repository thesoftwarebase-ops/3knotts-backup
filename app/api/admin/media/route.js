import { NextResponse } from "next/server";
import { verifySession, bearerToken } from "@/lib/admin-auth";
import { deleteAsset } from "@/lib/cloudinary";
import { site } from "@/data/site";

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
