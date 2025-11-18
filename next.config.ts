import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  
  // Explicitly acknowledge both bundlers exist
  turbopack: {}, // This silences the warning
  
  // Disable Fast Refresh temporarily
  webpack: (config, { dev, isServer }) => {
    if (dev && !isServer) {
      config.optimization.runtimeChunk = false;
    }
    return config;
  }
};

export default nextConfig;