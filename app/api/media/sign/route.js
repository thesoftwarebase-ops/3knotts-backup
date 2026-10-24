import { signUpload } from "@/lib/imagekit";
import { verifySession, bearerToken } from "@/lib/admin-auth";

// Returns short-lived ImageKit authentication parameters for direct browser
// uploads. The private API key never leaves the server.
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
      publicId: body.publicId
    });
    return Response.json({ ok: true, ...signed });
  } catch (e) {
    return Response.json({ ok: false, error: e.message || "Signing failed" }, { status: 500 });
  }
}
