// SERVER-ONLY Cloudinary management (signed uploads, deletes).
// Never import this from a client component — the API secret lives here.
// Delivery (public URLs) is separate: lib/media.js + NEXT_PUBLIC_MEDIA_URL.
//
// COOLIFY SWAP PLAN: when media moves self-hosted, reimplement the two
// exported functions below against your own server. Components and
// delivery URLs don't change.
import crypto from "node:crypto";

if (typeof window !== "undefined") {
  throw new Error("lib/cloudinary.js is server-only — do not import from client components");
}

export function getCloudinaryConfig() {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME || "";
  const apiKey = process.env.CLOUDINARY_API_KEY || "";
  const apiSecret = process.env.CLOUDINARY_API_SECRET || "";
  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error("CLOUDINARY_CLOUD_NAME / CLOUDINARY_API_KEY / CLOUDINARY_API_SECRET are not configured");
  }
  return { cloudName, apiKey, apiSecret };
}

const ROOT_FOLDER = "all-in-one-dream-place";

function cleanFolder(folder) {
  const f = String(folder || `${ROOT_FOLDER}/uploads`).replace(/^\/+/, "");
  if (!f.startsWith(ROOT_FOLDER)) throw new Error(`Folder must stay inside "${ROOT_FOLDER}"`);
  return f;
}

// Build a signed payload for direct browser uploads.
// Client posts to https://api.cloudinary.com/v1_1/<cloud>/<resourceType>/upload
// with: file, api_key, timestamp, folder, [public_id], signature.
export function signUpload({ folder, publicId = "", resourceType = "auto" } = {}) {
  const { cloudName, apiKey, apiSecret } = getCloudinaryConfig();
  const clean = cleanFolder(folder);
  const timestamp = Math.floor(Date.now() / 1000);
  const params = { folder: clean, timestamp };
  if (publicId) params.public_id = String(publicId);
  const toSign = Object.keys(params)
    .sort()
    .map((k) => `${k}=${params[k]}`)
    .join("&");
  const signature = crypto.createHash("sha1").update(toSign + apiSecret).digest("hex");
  return { cloudName, apiKey, timestamp, folder: clean, publicId, resourceType, signature };
}

export async function deleteAsset(publicId, resourceType = "image") {
  const { cloudName, apiKey, apiSecret } = getCloudinaryConfig();
  const auth = Buffer.from(`${apiKey}:${apiSecret}`).toString("base64");
  const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/destroy`, {
    method: "POST",
    headers: { Authorization: `Basic ${auth}`, "Content-Type": "application/json" },
    body: JSON.stringify({ public_id: publicId })
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || data.result !== "ok") {
    throw new Error(data.error?.message || "Cloudinary delete failed");
  }
  return data;
}
