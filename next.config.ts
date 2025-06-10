import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['via.placeholder.com', "randomuser.me", 'your-server.com'],
  },
  eslint: {
    ignoreDuringBuilds: true, // Ignore ESLint during builds (optional)
  },
};

export default nextConfig;
