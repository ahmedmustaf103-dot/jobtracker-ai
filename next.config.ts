import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Keep PDF extraction out of the Next bundler (serverless-safe unpdf build).
  serverExternalPackages: ["unpdf"],
};

export default nextConfig;
