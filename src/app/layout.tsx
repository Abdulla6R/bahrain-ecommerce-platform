import type { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getLocale, getMessages } from 'next-intl/server';
import { Cairo, Amiri, Inter } from 'next/font/google';
import BahrainMantineProvider from '@/providers/MantineProvider';
import './globals.css';

// Configure Arabic fonts with proper subsets and display optimization
const cairo = Cairo({
  subsets: ['arabic', 'latin'],
  display: 'swap',
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-cairo',
  fallback: ['Tahoma', 'Arial', 'sans-serif'],
});

const amiri = Amiri({
  subsets: ['arabic', 'latin'],
  display: 'swap',
  weight: ['400', '700'],
  variable: '--font-amiri',
  fallback: ['Traditional Arabic', 'Times New Roman', 'serif'],
});

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-inter',
  fallback: ['-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
});

export const metadata: Metadata = {
  title: {
    default: 'تندز - المتجر الإلكتروني الرائد في البحرين',
    template: '%s | Tendzd - Bahrain E-commerce'
  },
  description: 'منصة التجارة الإلكترونية الرائدة في مملكة البحرين - تسوق من أفضل المتاجر المحلية والعالمية',
  keywords: [
    'تسوق', 'البحرين', 'تجارة إلكترونية', 'متجر إلكتروني',
    'shopping', 'bahrain', 'ecommerce', 'online store',
    'tendzd', 'multi-vendor', 'marketplace'
  ],
  authors: [{ name: 'Tendzd', url: 'https://tendzd.com' }],
  creator: 'Tendzd',
  publisher: 'Tendzd',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://tendzd.com'),
  alternates: {
    canonical: '/',
    languages: {
      'ar': '/ar',
      'en': '/en',
    },
  },
  openGraph: {
    type: 'website',
    locale: 'ar_BH',
    alternateLocale: 'en_US',
    url: '/',
    siteName: 'Tendzd',
    title: 'تندز - المتجر الإلكتروني الرائد في البحرين',
    description: 'تسوق من أفضل المتاجر في مملكة البحرين',
    images: [
      {
        url: '/og-image-ar.jpg',
        width: 1200,
        height: 630,
        alt: 'تندز - متجر إلكتروني',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'تندز - المتجر الإلكتروني الرائد في البحرين',
    description: 'تسوق من أفضل المتاجر في مملكة البحرين',
    images: ['/twitter-image-ar.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
  category: 'technology',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = await getLocale();
  const messages = await getMessages();
  const isRTL = locale === 'ar';

  return (
    <html 
      lang={locale} 
      dir={isRTL ? 'rtl' : 'ltr'}
      className={`${cairo.variable} ${amiri.variable} ${inter.variable}`}
    >
      <head>
        {/* Preconnect to font sources for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* DNS prefetch for external services */}
        <link rel="dns-prefetch" href="//api.benefit.bh" />
        <link rel="dns-prefetch" href="//cdn.tendzd.com" />
        
        {/* Viewport meta for mobile optimization */}
        <meta 
          name="viewport" 
          content="width=device-width, initial-scale=1, shrink-to-fit=no, viewport-fit=cover" 
        />
        
        {/* Theme color for PWA */}
        <meta name="theme-color" content="#FFA500" />
        <meta name="msapplication-navbutton-color" content="#FFA500" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        
        {/* Apple Touch Icon */}
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        
        {/* Preload critical resources */}
        <link
          rel="preload"
          href="/images/logo.webp"
          as="image"
          type="image/webp"
        />
        
        {/* Critical CSS for font rendering */}
        <style dangerouslySetInnerHTML={{
          __html: `
            /* Prevent FOUT (Flash of Unstyled Text) */
            @font-face {
              font-family: 'Cairo';
              font-display: swap;
              src: local('Cairo');
            }
            @font-face {
              font-family: 'Amiri';
              font-display: swap;
              src: local('Amiri');
            }
            
            /* Optimize Arabic text rendering */
            html[dir="rtl"] {
              text-rendering: optimizeLegibility;
              -webkit-font-feature-settings: "liga" 1, "calt" 1;
              font-feature-settings: "liga" 1, "calt" 1;
            }
            
            /* Improve number display in Arabic context */
            .numbers-ltr {
              direction: ltr;
              unicode-bidi: embed;
            }
            
            /* Ensure proper text direction for mixed content */
            .bidi-isolate {
              unicode-bidi: isolate;
            }
          `
        }} />
      </head>
      <body 
        className={`
          min-h-screen antialiased
          ${isRTL ? 'font-cairo text-arabic' : 'font-inter'}
          text-gray-900 bg-gray-50
          selection:bg-tendzd-yellow-200 selection:text-tendzd-orange-900
        `}
        suppressHydrationWarning
      >
        <NextIntlClientProvider 
          locale={locale} 
          messages={messages}
          timeZone="Asia/Bahrain"
        >
          <BahrainMantineProvider locale={locale}>
            {/* Skip to main content for accessibility */}
            <a
              href="#main-content"
              className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 
                         bg-tendzd-orange-500 text-white px-4 py-2 rounded-lg font-semibold
                         focus:z-50 focus:outline-none focus:ring-2 focus:ring-white"
            >
              {isRTL ? 'الانتقال إلى المحتوى الرئيسي' : 'Skip to main content'}
            </a>
            
            {/* Main application content */}
            <div id="root" className="flex flex-col min-h-screen">
              {children}
            </div>
            
            {/* Global loading indicator */}
            <div id="global-loading" className="hidden">
              <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center">
                <div className="bg-white rounded-2xl p-6 shadow-strong">
                  <div className="flex items-center space-x-3 rtl:space-x-reverse">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-tendzd-orange-500"></div>
                    <span className="text-gray-700 font-medium">
                      {isRTL ? 'جارٍ التحميل...' : 'Loading...'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Performance monitoring script */}
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  // Monitor Core Web Vitals
                  if ('performance' in window && 'PerformanceObserver' in window) {
                    new PerformanceObserver((entryList) => {
                      const entries = entryList.getEntries();
                      entries.forEach((entry) => {
                        if (entry.entryType === 'largest-contentful-paint') {
                          console.log('LCP:', entry.startTime);
                        }
                        if (entry.entryType === 'first-input') {
                          console.log('FID:', entry.processingStart - entry.startTime);
                        }
                        if (entry.entryType === 'layout-shift') {
                          if (!entry.hadRecentInput) {
                            console.log('CLS:', entry.value);
                          }
                        }
                      });
                    }).observe({
                      type: 'largest-contentful-paint',
                      buffered: true
                    });
                    
                    new PerformanceObserver((entryList) => {
                      entryList.getEntries().forEach((entry) => {
                        console.log('FID:', entry.processingStart - entry.startTime);
                      });
                    }).observe({
                      type: 'first-input',
                      buffered: true
                    });
                    
                    new PerformanceObserver((entryList) => {
                      let clsValue = 0;
                      entryList.getEntries().forEach((entry) => {
                        if (!entry.hadRecentInput) {
                          clsValue += entry.value;
                        }
                      });
                      console.log('CLS:', clsValue);
                    }).observe({
                      type: 'layout-shift',
                      buffered: true
                    });
                  }
                  
                  // Service Worker registration for PWA
                  if ('serviceWorker' in navigator && '${process.env.NODE_ENV}' === 'production') {
                    window.addEventListener('load', () => {
                      navigator.serviceWorker.register('/sw.js')
                        .then((registration) => {
                          console.log('SW registered: ', registration);
                        })
                        .catch((registrationError) => {
                          console.log('SW registration failed: ', registrationError);
                        });
                    });
                  }
                `,
              }}
            />
          </BahrainMantineProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}