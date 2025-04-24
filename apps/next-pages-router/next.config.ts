import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  images: {
    remotePatterns: [new URL('http://localhost:8008/**'), new URL('https://wp.rawshaping.com/**')],
  },
};

export default nextConfig;
