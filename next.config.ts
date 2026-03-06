import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  // Base path for GitHub Pages (repo name)
  basePath: process.env.GITHUB_PAGES ? '/NewsFlow' : '',
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
  // Disable image optimization for static export (not supported)
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
