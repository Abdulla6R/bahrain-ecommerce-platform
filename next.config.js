/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  output: 'export',
  trailingSlash: true,
  
  // Static export configuration
  images: {
    unoptimized: true,
  },

  // Environment variables
  env: {
    VAT_RATE: '0.10',
    DEFAULT_CURRENCY: 'BHD',
    TIMEZONE: 'Asia/Bahrain',
  },
  
  // Optimizations
  poweredByHeader: false,
  compress: true,
};

module.exports = nextConfig;