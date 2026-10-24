// SERVER-ONLY ImageKit management (uploads, authentication, deletes).
// The private API key never leaves the server. Public delivery is handled by
// lib/media.js using NEXT_PUBLIC_MEDIA_URL.
import ImageKit, { toFile } from "@imagekit/nodejs";

if (typeof window !== "undefined") {
  throw new Error("lib/imagekit.js is server-only — do not import from client components");
}

const ROOT_FOLDER = "3knotts";

export function getImageKitConfig() {
  const privateKey = process.env.IMAGEKIT_PRIVATE_KEY || "";
  const urlEndpoint = (process.env.NEXT_PUBLIC_MEDIA_URL || "").replace(/\/+$/, "");
  const publicKey = process.env.IMAGEKIT_PUBLIC_KEY || process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY || "";

  if (!privateKey) {
    throw new Error("IMAGEKIT_PRIVATE_KEY is not configured");
  }
  return { privateKey, publicKey, urlEndpoint };
}

let _client;
function getClient() {
  if (_client) return _client;
  const { privateKey } = getImageKitConfig();
  _client = new ImageKit({ privateKey, timeout: 15000, maxRetries: 2 });
  return _client;
}

export function cleanFolder(folder) {
  const raw = String(folder || `${ROOT_FOLDER}/uploads`)
    .replace(/^\/+/, "")
    .replace(/\/+$/, "");
  const parts = raw.split("/").filter(Boolean);
  if (!parts.length || parts[0] !== ROOT_FOLDER || parts.some((part) => part === "." || part === "..")) {
    throw new Error(`Folder must stay inside "${ROOT_FOLDER}"`);
  }
  return parts.join("/");
}

function cleanFilePath(filePath) {
  const raw = String(filePath || "").trim();
  if (!raw || raw.startsWith("http://") || raw.startsWith("https://")) return "";
  return `/${raw.replace(/^\/+/, "")}`;
}

// ImageKit client-side upload authentication. The current admin UI uses the
// server-side upload route, but this endpoint remains compatible for future
// browser upload clients without exposing the private key.
export function signUpload({ folder, publicId } = {}) {
  const client = getClient();
  const { publicKey, urlEndpoint } = getImageKitConfig();
  if (!urlEndpoint) throw new Error("NEXT_PUBLIC_MEDIA_URL is not configured");
  const auth = client.helper.getAuthenticationParameters();
  const result = { ...auth, publicKey, urlEndpoint, folder: cleanFolder(folder) };
  if (publicId) result.publicId = publicId;
  return result;
}

export async function uploadAsset({ data, fileName = "photo.webp", folder } = {}) {
  if (!data) throw new Error("No file data received");
  const client = getClient();
  const clean = cleanFolder(folder);
  const file = await toFile(data, fileName, { type: "image/webp" });
  const uploaded = await client.files.upload({
    file,
    fileName,
    folder: clean,
    useUniqueFileName: true,
    overwriteFile: false,
    isPrivateFile: false
  });

  const path = String(uploaded.filePath || "").replace(/^\/+/, "");
  const fileId = String(uploaded.fileId || "").trim();
  if (!path || !fileId) throw new Error("ImageKit returned an incomplete upload response");
  return { path, fileId, url: uploaded.url || "" };
}

async function findFileId(filePath) {
  const normalized = cleanFilePath(filePath);
  if (!normalized) return "";
  const client = getClient();
  const escaped = normalized.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
  const assets = await client.assets.list({
    type: "file",
    searchQuery: `filePath = "${escaped}"`,
    limit: 10
  });
  const match = (assets || []).find((asset) => asset?.filePath === normalized);
  return String(match?.fileId || "").trim();
}

export async function deleteAsset({ fileId = "", filePath = "" } = {}) {
  const client = getClient();
  const id = String(fileId || "").trim() || (await findFileId(filePath));
  if (!id) return { deleted: false, missing: true };
  await client.files.delete(id);
  return { deleted: true, fileId: id };
}
