import createIntlMiddleware from 'next-intl/middleware';
import { NextRequest } from 'next/server';

// Create the internationalization middleware
const intlMiddleware = createIntlMiddleware({
  // A list of all locales that are supported
  locales: ['ar', 'en'],
  
  // Used when no locale matches
  defaultLocale: 'ar',
  
  // Always redirect to locale prefix
  localePrefix: 'always'
});

export default function middleware(request: NextRequest) {
  // Handle internationalization
  return intlMiddleware(request);
}

export const config = {
  // Match only internationalized pathnames
  matcher: ['/', '/(ar|en)/:path*']
};