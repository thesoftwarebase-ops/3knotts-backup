const mediaUrl = process.env.NEXT_PUBLIC_MEDIA_URL || "https://ik.imagekit.io";
let configuredMediaPattern;

try {
  const url = new URL(mediaUrl);
  configuredMediaPattern = {
    protocol: url.protocol.replace(":", ""),
    hostname: url.hostname,
    ...(url.port ? { port: url.port } : {}),
    pathname: "/**"
  };
} catch {
  configuredMediaPattern = null;
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "ik.imagekit.io", pathname: "/**" },
      ...(configuredMediaPattern &&
      !(
        configuredMediaPattern.protocol === "https" &&
        configuredMediaPattern.hostname === "ik.imagekit.io"
      )
        ? [configuredMediaPattern]
        : [])
    ]
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" }
        ]
      }
    ];
  }
};

export default nextConfig;
