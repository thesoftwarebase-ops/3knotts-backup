/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "res.cloudinary.com", pathname: "/**" }
      // When you move off Cloudinary, add your self-hosted media host here, e.g.:
      // { protocol: "https", hostname: "media.allinonedreamplace.in", pathname: "/**" },
    ]
  }
};

export default nextConfig;
