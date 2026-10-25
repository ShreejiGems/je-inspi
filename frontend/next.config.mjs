/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    const endpoint = (process.env.NEXT_API_ENDPOINT || "http://localhost:1631").replace(/\/$/, "");
    return [{ source: "/api/:path*", destination: `${endpoint}/:path*` }];
  },

  images: {
    remotePatterns: [
      ...[...new Set([
        process.env.MEDIA_HOST || "localhost",
        ...(process.env.DIAMOND_MEDIA_HOSTS || "").split(",").map((host) => host.trim()).filter(Boolean),
      ])].map((hostname) => ({ protocol: "https", hostname })),
      {
        protocol: "http",
        hostname: "localhost",
      },
    ],
  },
};

export default nextConfig;
