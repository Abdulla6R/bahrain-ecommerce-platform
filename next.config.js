const createNextIntlPlugin = require('next-intl/plugin');

const withNextIntl = createNextIntlPlugin('./src/i18n.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  
  // Image optimization
  images: {
    domains: [
      'localhost',
      'tendzd.bh',
      's3.me-south-1.amazonaws.com',
      'cdn.tendzd.bh'
    ],
    formats: ['image/webp', 'image/avif'],
  },

  // Environment variables
  env: {
    VAT_RATE: process.env.VAT_RATE || '0.10',
    DEFAULT_CURRENCY: process.env.DEFAULT_CURRENCY || 'BHD',
    TIMEZONE: process.env.TIMEZONE || 'Asia/Bahrain',
  },
  
  // Disable problematic features for Netlify
  poweredByHeader: false,
  compress: true,
};

module.exports = withNextIntl(nextConfig);