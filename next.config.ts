import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["randomuser.me"],
  },
  eslint: {
    ignoreDuringBuilds: true, // Ignore ESLint during builds (optional)
  },
};

export default nextConfig;
