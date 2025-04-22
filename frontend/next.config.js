/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: [
    'recharts',
    'react-smooth',
    'd3-interpolate',
    'd3-color',
    'd3-format',
    'd3-time',
    'd3-time-format'
  ],
  webpack: (config, { isServer }) => {
    // Fix for nested dependencies in recharts
    config.resolve.alias = {
      ...config.resolve.alias,
      'react-transition-group': require.resolve('react-transition-group'),
    };
    return config;
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;
