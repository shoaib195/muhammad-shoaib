import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Silence Next 16 default-Turbopack warning when a webpack() hook exists
  turbopack: {},
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.simpleicons.org",
      },
    ],
  },
  // Avoid HMR thrash from Next rewriting agent rule files during `next dev`
  webpack: (config, { dev }) => {
    if (dev) {
      config.watchOptions = {
        ...config.watchOptions,
        ignored: ["**/node_modules/**", "**/.git/**", "**/AGENTS.md", "**/CLAUDE.md"],
      };
    }
    return config;
  },
};

export default nextConfig;
