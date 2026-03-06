import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
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
