import createIntlMiddleware from 'next-intl/middleware';
import { NextRequest } from 'next/server';

// Create the internationalization middleware
const intlMiddleware = createIntlMiddleware({
  // A list of all locales that are supported
  locales: ['ar', 'en'],
  
  // Used when no locale matches
  defaultLocale: 'ar',
  
  // Use locale prefix only when needed
  localePrefix: 'as-needed'
});

export default function middleware(request: NextRequest) {
  // Handle internationalization
  return intlMiddleware(request);
}

export const config = {
  // Match only internationalized pathnames
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']
};