import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [new URL('http://localhost:8008/**')],
  },
  experimental: {
    viewTransition: true,
  },

};

export default nextConfig;
