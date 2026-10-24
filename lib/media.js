// Central media URL builder. Components must NOT build ImageKit URLs.
// NEXT_PUBLIC_MEDIA_URL is the single media base:
//   ImageKit now:    https://ik.imagekit.io/YOUR_IMAGEKIT_ID
//   Self-hosted later: https://media.yourdomain.com
function baseUrl() {
  const raw = process.env.NEXT_PUBLIC_MEDIA_URL || "";
  return raw.replace(/\/+$/, "");
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
// Otherwise prefixed with NEXT_PUBLIC_MEDIA_URL.
export function mediaVideo(path) {
  const clean = String(path || "");
  if (clean.startsWith("/")) return clean;
  return join(baseUrl(), clean);
}

// Poster frame pulled from the ImageKit video itself (seconds in).
// Local /public videos return "" — pair them with a poster image instead.
export function mediaVideoPoster(videoPath, seconds = 1) {
  const raw = String(videoPath || "");
  if (!raw || raw.startsWith("/")) return "";
  const base = baseUrl();
  const clean = raw.replace(/^\/+/, "");
  if (!base || !clean) return "";
  return `${base}/${clean}/ik-thumbnail.jpg?tr=so-${encodeURIComponent(seconds)}`;
}
// Image delivery: leading "/" = local /public file, returned as-is.
export function mediaImage(path) {
  const raw = String(path || "");
  if (raw.startsWith("/")) return raw;
  return join(baseUrl(), path);
}
