import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Tendzd brand colors optimized for Gulf market
        'tendzd-orange': {
          50: '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          300: '#fdba74',
          400: '#fb923c',
          500: '#FFA500', // Primary orange
          600: '#ea580c',
          700: '#c2410c',
          800: '#9a3412',
          900: '#7c2d12',
          950: '#431407',
        },
        'tendzd-yellow': {
          50: '#fefce8',
          100: '#fef9c3',
          200: '#fef08a',
          300: '#fde047',
          400: '#facc15',
          500: '#FFE135', // Accent yellow
          600: '#ca8a04',
          700: '#a16207',
          800: '#854d0e',
          900: '#713f12',
          950: '#422006',
        },
        // Bahrain-appropriate neutrals
        'bahrain': {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
          950: '#020617',
        },
      },
      fontFamily: {
        // Arabic fonts with proper fallbacks
        'cairo': ['var(--font-cairo)', 'Tahoma', 'Arial', 'sans-serif'],
        'amiri': ['var(--font-amiri)', 'Traditional Arabic', 'Times New Roman', 'serif'],
        'inter': ['var(--font-inter)', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        'sans': ['var(--font-cairo)', 'var(--font-inter)', 'system-ui', 'sans-serif'],
        'serif': ['var(--font-amiri)', 'Traditional Arabic', 'Georgia', 'serif'],
      },
      fontSize: {
        // Arabic-optimized font sizes (10-15% larger for readability)
        'xs-ar': ['0.825rem', { lineHeight: '1.7' }],
        'sm-ar': ['0.975rem', { lineHeight: '1.7' }],
        'base-ar': ['1.1rem', { lineHeight: '1.7' }],
        'lg-ar': ['1.25rem', { lineHeight: '1.7' }],
        'xl-ar': ['1.375rem', { lineHeight: '1.7' }],
        '2xl-ar': ['1.65rem', { lineHeight: '1.6' }],
        '3xl-ar': ['2.1rem', { lineHeight: '1.6' }],
        '4xl-ar': ['2.5rem', { lineHeight: '1.5' }],
        '5xl-ar': ['3.3rem', { lineHeight: '1.5' }],
        '6xl-ar': ['4.1rem', { lineHeight: '1.4' }],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
        '144': '36rem',
      },
      screens: {
        'rtl': { 'raw': '[dir="rtl"]' },
        'ltr': { 'raw': '[dir="ltr"]' },
        'xs': '475px',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'slide-in-right': 'slideInRight 0.3s ease-out',
        'slide-in-left': 'slideInLeft 0.3s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideInRight: {
          '0%': { transform: 'translateX(20px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        slideInLeft: {
          '0%': { transform: 'translateX(-20px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
        'medium': '0 4px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 25px -5px rgba(0, 0, 0, 0.04)',
        'strong': '0 10px 40px -10px rgba(0, 0, 0, 0.15), 0 20px 25px -5px rgba(0, 0, 0, 0.1)',
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms')({
      strategy: 'class', // only generate classes
    }),
    require('@tailwindcss/typography'),
    // Custom RTL utilities plugin
    function ({ addUtilities, addComponents, theme }: any) {
      addUtilities({
        // RTL text alignment utilities
        '.text-start': {
          'text-align': 'start',
        },
        '.text-end': {
          'text-align': 'end',
        },
        
        // RTL margin utilities
        '.ms-auto': {
          'margin-inline-start': 'auto',
        },
        '.me-auto': {
          'margin-inline-end': 'auto',
        },
        '.ms-0': {
          'margin-inline-start': '0',
        },
        '.me-0': {
          'margin-inline-end': '0',
        },
        
        // RTL padding utilities
        '.ps-0': {
          'padding-inline-start': '0',
        },
        '.pe-0': {
          'padding-inline-end': '0',
        },
        '.ps-4': {
          'padding-inline-start': '1rem',
        },
        '.pe-4': {
          'padding-inline-end': '1rem',
        },
        
        // RTL border utilities
        '.border-s': {
          'border-inline-start-width': '1px',
        },
        '.border-e': {
          'border-inline-end-width': '1px',
        },
        '.border-s-0': {
          'border-inline-start-width': '0',
        },
        '.border-e-0': {
          'border-inline-end-width': '0',
        },
        
        // Icon flipping for RTL
        '.rtl-flip': {
          '[dir="rtl"] &': {
            transform: 'scaleX(-1)',
          },
        },
        
        // Arabic number styles
        '.numbers-arabic': {
          'font-variant-numeric': 'normal',
          'unicode-bidi': 'isolate',
        },
        '.numbers-latin': {
          'font-variant-numeric': 'lining-nums',
          'unicode-bidi': 'isolate',
        },
        
        // Better Arabic text rendering
        '.text-arabic': {
          'font-variant-ligatures': 'common-ligatures',
          'font-feature-settings': '"liga" 1, "calt" 1',
          'text-rendering': 'optimizeLegibility',
          'line-height': '1.7',
        },
        
        // Improved readability for mixed content
        '.text-mixed': {
          'unicode-bidi': 'plaintext',
          'text-align': 'start',
        },
      });

      addComponents({
        // Arabic-optimized button styles
        '.btn-arabic': {
          'font-family': theme('fontFamily.cairo'),
          'font-size': '1.1rem',
          'line-height': '1.6',
          'padding': '0.75rem 1.5rem',
          'border-radius': theme('borderRadius.lg'),
          'font-weight': '600',
        },
        
        // Arabic-optimized input styles
        '.input-arabic': {
          'font-family': theme('fontFamily.cairo'),
          'font-size': '1.05rem',
          'line-height': '1.6',
          'padding': '0.75rem 1rem',
          'border-radius': theme('borderRadius.md'),
          'text-align': 'start',
          'unicode-bidi': 'plaintext',
        },
        
        // Card component with RTL support
        '.card-rtl': {
          'background': theme('colors.white'),
          'border-radius': theme('borderRadius.xl'),
          'box-shadow': theme('boxShadow.soft'),
          'border': `1px solid ${theme('colors.gray.200')}`,
          'overflow': 'hidden',
          'transition': 'all 0.2s ease-in-out',
          '&:hover': {
            'box-shadow': theme('boxShadow.medium'),
            'transform': 'translateY(-2px)',
          },
        },
        
        // Price display component
        '.price-display': {
          'direction': 'ltr',
          'unicode-bidi': 'embed',
          'font-variant-numeric': 'tabular-nums',
          'font-weight': '600',
        },
        
        // Arabic heading styles
        '.heading-arabic': {
          'font-family': theme('fontFamily.amiri'),
          'font-weight': '700',
          'line-height': '1.4',
          'color': theme('colors.gray.900'),
        },
        
        // Product grid optimized for Arabic
        '.product-grid': {
          'display': 'grid',
          'grid-template-columns': 'repeat(auto-fill, minmax(280px, 1fr))',
          'gap': '1.5rem',
          '@media (max-width: 640px)': {
            'grid-template-columns': 'repeat(auto-fill, minmax(160px, 1fr))',
            'gap': '1rem',
          },
        },
      });
    },
  ],
  darkMode: 'class',
};

export default config;