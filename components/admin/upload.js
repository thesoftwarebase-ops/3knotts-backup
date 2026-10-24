"use client";

// Uploads go through our own API route (POST multipart to /api/admin/media),
// which forwards to ImageKit server-side. The private key never reaches the
// browser. Returns the storable path plus ImageKit's file id.
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
  if (!res.ok || !data.ok || !data.path || !data.fileId) {
    throw new Error(data.error || "Upload failed.");
  }
  return { path: data.path, fileId: data.fileId };
}

export function adminToken() {
  return sessionStorage.getItem("admin-jwt") || "";
}

export function authHeaders() {
  return { "Content-Type": "application/json", Authorization: `Bearer ${adminToken()}` };
}

// Delete a single ImageKit asset. Swallow errors so callers never block
// on cleanup failures — an orphaned file is cheaper than a broken upload.
export async function deleteAssetRef(src, fileId = "") {
  const ref = String(src || "").trim();
  const id = String(fileId || "").trim();
  if (!id && (!ref || ref.startsWith("/"))) return;
  try {
    await fetch("/api/admin/media", {
      method: "DELETE",
      headers: authHeaders(),
      body: JSON.stringify({ fileId: id, filePath: ref })
    });
  } catch {}
}
