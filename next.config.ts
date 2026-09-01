import path from 'path';
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  webpack: (config) => ({
    ...config,
    resolve: {
      ...config.resolve,
      alias: {
        ...config.resolve?.alias,
        '@': path.resolve(__dirname, 'src'),
      },
    },
  }),
  env: {
    // The mock LLM lives in a route handler inside this app; swapping in a
    // real gateway is a one-line change here.
    NEXT_PUBLIC_API_BASE_URL: '/api',
  },
};

export default nextConfig;
