import { signUpload } from "@/lib/cloudinary";
import { verifySession, bearerToken } from "@/lib/admin-auth";

// Returns a short-lived signature for direct browser → Cloudinary uploads.
// The API secret never leaves the server.
// Gate: UPLOAD_TOKEN header, or a valid admin Bearer token.
export async function POST(request) {
  const required = process.env.UPLOAD_TOKEN || "";
  const uploadGate = !required || request.headers.get("x-upload-token") === required;
  const adminGate = await verifySession(bearerToken(request));
  if (!uploadGate && !adminGate) {
    return Response.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  let body = {};
  try {
    body = await request.json();
  } catch {}

  try {
    const signed = signUpload({
      folder: body.folder,
      publicId: body.publicId,
      resourceType: body.resourceType
    });
    return Response.json({ ok: true, ...signed });
  } catch (e) {
    return Response.json({ ok: false, error: e.message || "Signing failed" }, { status: 500 });
  }
}
