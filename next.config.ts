import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Set the output file tracing root to fix the lockfile warning
  outputFileTracingRoot: __dirname,
  
  // Ensure environment variables are properly loaded
  env: {
    DATABASE_URL: process.env.DATABASE_URL,
  },
};

export default nextConfig;
