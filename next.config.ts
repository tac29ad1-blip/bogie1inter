import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ['@prisma/client', 'prisma'],
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'obs-ect.line-scdn.net' },
      { protocol: 'https', hostname: '*.line-scdn.net' },
    ],
  },
  async redirects() {
    return [
      // /category/:slug → /products/:slug (รองรับลิงก์เก่า)
      {
        source: '/category/:slug',
        destination: '/products/:slug',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
