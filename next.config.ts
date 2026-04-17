import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ['@prisma/client', 'prisma'],
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'obs-ect.line-scdn.net' },
      { protocol: 'https', hostname: '*.line-scdn.net' },
    ],
  },
};

export default nextConfig;
