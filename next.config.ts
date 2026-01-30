import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,

  // Enable standalone output for Docker
  output: 'standalone',

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
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';
    return [
      {
        source: '/api/:path*',
        destination: `${apiUrl}/api/:path*`,
      },
      {
        source: '/auth/:path*',
        destination: `${apiUrl}/auth/:path*`,
      },
    ];
  },
};

export default nextConfig;