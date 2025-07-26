/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  
  // Basic image configuration for Netlify
  images: {
    unoptimized: true,
  },

  // Environment variables
  env: {
    VAT_RATE: process.env.VAT_RATE || '0.10',
    DEFAULT_CURRENCY: process.env.DEFAULT_CURRENCY || 'BHD',
    TIMEZONE: process.env.TIMEZONE || 'Asia/Bahrain',
  },
  
  // Netlify optimizations
  poweredByHeader: false,
  compress: true,
};

module.exports = nextConfig;