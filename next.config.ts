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
  },

  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://127.0.0.1:8000/api/:path*',
      },
      {
        source: '/auth/:path*',
        destination: 'http://127.0.0.1:8000/auth/:path*',
      },
    ];
  },
};

export default nextConfig;