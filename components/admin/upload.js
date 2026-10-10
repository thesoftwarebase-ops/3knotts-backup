"use client";

// Uploads go through our own API route (POST multipart to /api/admin/media),
// which forwards to Cloudinary server-side. The browser never talks to
// Cloudinary directly, so cross-origin failures cannot happen.
// Returns the storable path. Throws with a readable message on failure.
export async function uploadImage(file, folder, token) {
  if (!file) throw new Error("No file chosen.");
  const form = new FormData();
  form.append("file", file);
  form.append("folder", folder);
  const res = await fetch("/api/admin/media", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: form
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || !data.ok || !data.path) {
    throw new Error(data.error || "Upload failed.");
  }
  return data.path;
}

export function adminToken() {
  return sessionStorage.getItem("admin-jwt") || "";
}

export function authHeaders() {
  return { "Content-Type": "application/json", Authorization: `Bearer ${adminToken()}` };
}
