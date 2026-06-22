import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Bir nechta lockfile bo'lgani uchun workspace root'ni shu loyihaga qotiramiz.
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;
