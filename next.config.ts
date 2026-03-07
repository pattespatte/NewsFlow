import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Use 'export' for GitHub Pages static deployment
  // Use 'standalone' for server deployment (Vercel, Node.js)
  output: process.env.GITHUB_PAGES === "true" ? "export" : "standalone",

  // Disable server features for static export
  ...(process.env.GITHUB_PAGES === "true" ? {
    images: { unoptimized: true },
  } : {}),

  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
};

export default nextConfig;
