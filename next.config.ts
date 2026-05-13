import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Produces .next/standalone — a minimal Node bundle that runs with `node server.js`
  // without needing node_modules on the host.
  output: 'standalone',
};

export default nextConfig;
