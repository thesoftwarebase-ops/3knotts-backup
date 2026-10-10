"use client";

// Shared upload: file → signed Cloudinary upload → storable path.
// Throws with a readable message on failure.
export async function uploadImage(file, folder, token) {
  const signRes = await fetch("/api/media/sign", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ folder, resourceType: "image" })
  });
  const signed = await signRes.json().catch(() => ({}));
  if (!signRes.ok || !signed.ok) {
    throw new Error(signed.error || "Upload signing failed.");
  }
  const form = new FormData();
  form.append("file", file);
  form.append("api_key", signed.apiKey);
  form.append("timestamp", String(signed.timestamp));
  form.append("folder", signed.folder);
  if (signed.publicId) form.append("public_id", signed.publicId);
  form.append("signature", signed.signature);
  const up = await fetch(`https://api.cloudinary.com/v1_1/${signed.cloudName}/image/upload`, {
    method: "POST",
    body: form
  });
  const done = await up.json().catch(() => ({}));
  if (!up.ok || done.error || !done.public_id) {
    throw new Error(done?.error?.message || "Upload failed.");
  }
  return `${done.public_id}.${done.format}`;
}

export function adminToken() {
  return sessionStorage.getItem("admin-jwt") || "";
}

export function authHeaders() {
  return { "Content-Type": "application/json", Authorization: `Bearer ${adminToken()}` };
}
