import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  agentRules: false,
  images: {
    remotePatterns: [new URL('https://a.espncdn.com/i/teamlogos/**')],
  },
};

export default nextConfig;
