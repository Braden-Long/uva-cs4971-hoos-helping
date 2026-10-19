import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Emits .next/standalone/server.js, which the Docker image runs directly. It
  // boots without the npx wrapper or the full next CLI, so the container on
  // Railway holds roughly half the memory.
  output: "standalone",
  // Pin the tracing root so server.js always lands at .next/standalone/ (the
  // Dockerfile CMD depends on it), even if a stray lockfile exists in a parent
  // directory.
  outputFileTracingRoot: __dirname,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
};

export default nextConfig;
