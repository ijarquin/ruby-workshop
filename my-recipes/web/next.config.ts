import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'imagesvc.meredithcorp.io',
      },
      {
        protocol: 'https',
        hostname: 'www.allrecipes.com',
      },
    ],
  },
};

export default nextConfig;
