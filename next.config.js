const createNextIntlPlugin = require('next-intl/plugin');

const withNextIntl = createNextIntlPlugin('./src/i18n.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  turbopack: {
    rules: {
      // Turbopack configuration for better Arabic font loading
      '*.woff2': {
        loaders: ['file-loader'],
        as: '*.woff2',
      },
    },
  },
  

  // Image optimization for Arabic content and RTL layouts
  images: {
    domains: [
      'localhost',
      'tendzd.bh',
      's3.me-south-1.amazonaws.com', // Bahrain AWS region
      'cdn.tendzd.bh'
    ],
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  // Security headers for PDPL compliance
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains',
          },
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-eval' 'unsafe-inline' *.benefit.bh", // Benefit Pay
              "style-src 'self' 'unsafe-inline' fonts.googleapis.com",
              "font-src 'self' fonts.gstatic.com",
              "img-src 'self' data: blob: s3.me-south-1.amazonaws.com",
              "connect-src 'self' *.benefit.bh *.tendzd.bh",
            ].join('; '),
          },
        ],
      },
      {
        // Cache Arabic fonts more aggressively
        source: '/fonts/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },

  // Redirects for Arabic URL patterns
  async redirects() {
    return [
      // Redirect Arabic store patterns
      {
        source: '/متجر/:slug*',
        destination: '/ar/store/:slug*',
        permanent: true,
      },
      // Redirect Arabic product patterns
      {
        source: '/منتج/:slug*',
        destination: '/ar/product/:slug*',
        permanent: true,
      },
      // Legacy English routes to Arabic default
      {
        source: '/shop/:slug*',
        destination: '/ar/store/:slug*',
        permanent: false,
      },
    ];
  },

  // Webpack configuration for Arabic font optimization
  webpack: (config, { dev, isServer }) => {
    // Optimize Arabic font loading
    config.module.rules.push({
      test: /\.(woff|woff2|eot|ttf|otf)$/,
      use: {
        loader: 'url-loader',
        options: {
          limit: 8192,
          fallback: 'file-loader',
          publicPath: '/_next/static/fonts/',
          outputPath: 'static/fonts/',
        },
      },
    });

    // Arabic text processing optimization
    if (!dev && !isServer) {
      config.optimization.splitChunks.cacheGroups.arabic = {
        name: 'arabic-chunks',
        test: /[\u0600-\u06FF]/,
        chunks: 'all',
        priority: 10,
      };
    }

    return config;
  },

  // Environment variables for Bahrain compliance
  env: {
    VAT_RATE: process.env.VAT_RATE || '0.10',
    DEFAULT_CURRENCY: process.env.DEFAULT_CURRENCY || 'BHD',
    TIMEZONE: process.env.TIMEZONE || 'Asia/Bahrain',
    ENABLE_HIJRI_CALENDAR: process.env.ENABLE_HIJRI_CALENDAR || 'true',
    PDPL_CONSENT_REQUIRED: process.env.PDPL_CONSENT_REQUIRED || 'true',
  },

  // Output configuration for deployment
  output: 'standalone',
  
  // Compression for better performance in Middle East
  compress: true,
  
  // Power preference for Arabic text rendering
  poweredByHeader: false,
  
  // Trailing slash for Arabic URL consistency
  trailingSlash: false,
  
  // Additional configuration can be added here
};

module.exports = withNextIntl(nextConfig);