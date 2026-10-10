// Central media URL builder. Components must NOT build Cloudinary URLs.
// NEXT_PUBLIC_MEDIA_URL is the single media base:
//   Cloudinary now:  https://res.cloudinary.com/YOUR_CLOUD_NAME
//   Self-hosted later: https://media.yourdomain.com
function baseUrl() {
  const raw = process.env.NEXT_PUBLIC_MEDIA_URL || "";
  return raw.replace(/\/+$/, "");
}

function isCloudinary(base) {
  return base.includes("cloudinary.com");
}

function alreadyHasUploadSegment(base) {
  return base.includes("/video/upload") || base.includes("/image/upload") || base.includes("/upload/");
}

function join(base, path) {
  const clean = String(path || "").replace(/^\/+/, "");
  if (!clean) return base || "/";
  if (!base) return `/${clean}`;
  return `${base}/${clean}`;
}

// Generic file (posters, local fallbacks)
export function mediaUrl(path) {
  return join(baseUrl(), path);
}

// Video delivery: leading "/" = local /public file, returned as-is.
// Otherwise prefixed with NEXT_PUBLIC_MEDIA_URL (Cloudinary for now).
export function mediaVideo(path) {
  const clean = String(path || "");
  if (clean.startsWith("/")) return clean;
  const base = baseUrl();
  const stripped = clean.replace(/^\/+/, "");
  if (!base) return `/${stripped}`;
  if (isCloudinary(base) && !alreadyHasUploadSegment(base)) {
    return `${base}/video/upload/${stripped}`;
  }
  return `${base}/${stripped}`;
}

// Poster frame pulled from the Cloudinary video itself (seconds in).
// Local /public videos return "" — pair them with a poster image instead.
export function mediaVideoPoster(videoPath, seconds = 1) {
  const raw = String(videoPath || "");
  if (!raw || raw.startsWith("/")) return "";
  const base = baseUrl();
  const clean = raw.replace(/^\/+/, "").replace(/\.[a-z0-9]+$/i, "");
  if (!base || !clean) return "";
  if (isCloudinary(base) && !alreadyHasUploadSegment(base)) {
    return `${base}/video/upload/so_${seconds}/${clean}.jpg`;
  }
  return "";
}
// Image delivery: leading "/" = local /public file, returned as-is.
export function mediaImage(path) {
  const raw = String(path || "");
  if (raw.startsWith("/")) return raw;
  const base = baseUrl();
  const clean = String(path || "").replace(/^\/+/, "");
  if (!base) return `/${clean}`;
  if (isCloudinary(base) && !alreadyHasUploadSegment(base)) {
    return `${base}/image/upload/${clean}`;
  }
  return `${base}/${clean}`;
}
