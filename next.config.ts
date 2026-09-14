import type { NextConfig } from 'next';
import { withPayload } from '@payloadcms/next/withPayload';

const nextConfig: NextConfig = {
  agentRules: false,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.public.blob.vercel-storage.com',
      },
    ],
  },
  turbopack: {
    rules: {
      '*.svg': {
        condition: { not: { query: /url/ } },
        loaders: ['@svgr/webpack'],
        as: '*.js',
      },
    },
  },
};

export default withPayload(nextConfig);
