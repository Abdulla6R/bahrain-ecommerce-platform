// CSRF Protection implementation for Bahrain multi-vendor e-commerce platform
// Provides secure token generation and validation

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

// CSRF configuration
const CSRF_CONFIG = {
  tokenLength: 32,
  tokenLifetime: 24 * 60 * 60 * 1000, // 24 hours in milliseconds
  cookieName: 'csrf-token',
  headerName: 'x-csrf-token',
  formFieldName: '_csrf',
  saltLength: 16
} as const;

interface CSRFToken {
  token: string;
  timestamp: number;
  salt: string;
  hash: string;
}

// Generate cryptographically secure CSRF token using Web Crypto API
export function generateCSRFToken(userId?: string): CSRFToken {
  const timestamp = Date.now();
  
  // Use Web Crypto API for Edge Runtime compatibility
  const saltArray = new Uint8Array(CSRF_CONFIG.saltLength);
  const tokenArray = new Uint8Array(CSRF_CONFIG.tokenLength);
  
  crypto.getRandomValues(saltArray);
  crypto.getRandomValues(tokenArray);
  
  const salt = Array.from(saltArray, byte => byte.toString(16).padStart(2, '0')).join('');
  const token = Array.from(tokenArray, byte => byte.toString(16).padStart(2, '0')).join('');
  
  // Create hash including user context if available
  const hashInput = `${token}:${timestamp}:${salt}:${userId || 'anonymous'}`;
  const hash = simpleHash(hashInput);
  
  return {
    token,
    timestamp,
    salt,
    hash
  };
}

// Simple hash function for Edge Runtime compatibility
function simpleHash(input: string): string {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    const char = input.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash).toString(16);
}

// Validate CSRF token with simple comparison (Edge Runtime compatible)
export function validateCSRFToken(
  providedToken: string,
  storedTokenData: CSRFToken,
  userId?: string
): boolean {
  try {
    // Check token expiration
    const now = Date.now();
    if (now - storedTokenData.timestamp > CSRF_CONFIG.tokenLifetime) {
      return false;
    }
    
    // Recreate expected hash
    const hashInput = `${storedTokenData.token}:${storedTokenData.timestamp}:${storedTokenData.salt}:${userId || 'anonymous'}`;
    const expectedHash = simpleHash(hashInput);
    
    // Simple comparison (in production, use more secure timing-safe comparison)
    const hashValid = expectedHash === storedTokenData.hash;
    const tokenValid = providedToken === storedTokenData.token;
    
    return hashValid && tokenValid;
    
  } catch (error) {
    console.error('CSRF token validation error:', error);
    return false;
  }
}

// Extract CSRF token from request (header, body, or query)
export function extractCSRFToken(request: NextRequest): string | null {
  // Check header first (most secure)
  const headerToken = request.headers.get(CSRF_CONFIG.headerName);
  if (headerToken) {
    return headerToken;
  }
  
  // Check query parameter (for GET requests with forms)
  const url = new URL(request.url);
  const queryToken = url.searchParams.get(CSRF_CONFIG.formFieldName);
  if (queryToken) {
    return queryToken;
  }
  
  // Note: Body token extraction would need to be done in the route handler
  // since we can't read the body multiple times in middleware
  
  return null;
}

// Store CSRF token in secure HTTP-only cookie
export function setCSRFCookie(response: NextResponse, tokenData: CSRFToken): void {
  const cookieValue = JSON.stringify({
    hash: tokenData.hash,
    timestamp: tokenData.timestamp,
    salt: tokenData.salt,
    token: tokenData.token
  });
  
  response.cookies.set(CSRF_CONFIG.cookieName, cookieValue, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: Math.floor(CSRF_CONFIG.tokenLifetime / 1000)
  });
}

// Get CSRF token from cookie
export function getCSRFTokenFromCookie(request: NextRequest): CSRFToken | null {
  try {
    const cookieValue = request.cookies.get(CSRF_CONFIG.cookieName)?.value;
    
    if (!cookieValue) {
      return null;
    }
    
    const tokenData = JSON.parse(cookieValue) as CSRFToken;
    
    // Validate token structure
    if (!tokenData.token || !tokenData.hash || !tokenData.timestamp || !tokenData.salt) {
      return null;
    }
    
    return tokenData;
  } catch (error) {
    console.error('Error parsing CSRF token cookie:', error);
    return null;
  }
}

// CSRF middleware for protecting state-changing operations
export async function csrfProtection(request: NextRequest): Promise<NextResponse | null> {
  // Skip CSRF protection for safe methods
  if (['GET', 'HEAD', 'OPTIONS'].includes(request.method)) {
    return null;
  }
  
  // Skip CSRF for API endpoints that use other authentication (like API keys)
  const pathname = new URL(request.url).pathname;
  if (pathname.startsWith('/api/webhook') || pathname.startsWith('/api/auth/')) {
    return null;
  }
  
  try {
    // Get user session for context
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;
    
    // Extract CSRF token from request
    const providedToken = extractCSRFToken(request);
    
    if (!providedToken) {
      return NextResponse.json(
        {
          error: 'CSRF token missing',
          code: 'CSRF_TOKEN_MISSING',
          message: 'CSRF protection requires a valid token'
        },
        { status: 403 }
      );
    }
    
    // Get stored token from cookie
    const storedTokenData = getCSRFTokenFromCookie(request);
    
    if (!storedTokenData) {
      return NextResponse.json(
        {
          error: 'CSRF token not found',
          code: 'CSRF_TOKEN_NOT_FOUND', 
          message: 'No valid CSRF token found in session'
        },
        { status: 403 }
      );
    }
    
    // Validate token
    const isValid = validateCSRFToken(providedToken, storedTokenData, userId);
    
    if (!isValid) {
      return NextResponse.json(
        {
          error: 'Invalid CSRF token',
          code: 'CSRF_TOKEN_INVALID',
          message: 'CSRF token validation failed'
        },
        { status: 403 }
      );
    }
    
    // Token is valid, continue with request
    return null;
    
  } catch (error) {
    console.error('CSRF protection error:', error);
    
    return NextResponse.json(
      {
        error: 'CSRF protection error',
        code: 'CSRF_PROTECTION_ERROR',
        message: 'An error occurred during CSRF validation'
      },
      { status: 500 }
    );
  }
}

// Generate CSRF token for forms/AJAX requests
export async function generateCSRFTokenForRequest(request: NextRequest): Promise<{
  token: string;
  response: NextResponse;
}> {
  try {
    // Get user session for context
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;
    
    // Generate new token
    const tokenData = generateCSRFToken(userId);
    
    // Create response with token
    const response = NextResponse.json({
      csrfToken: tokenData.token,
      expiresAt: new Date(tokenData.timestamp + CSRF_CONFIG.tokenLifetime).toISOString()
    });
    
    // Set secure cookie
    setCSRFCookie(response, tokenData);
    
    return {
      token: tokenData.token,
      response
    };
    
  } catch (error) {
    console.error('Error generating CSRF token:', error);
    
    const errorResponse = NextResponse.json(
      {
        error: 'Failed to generate CSRF token',
        code: 'CSRF_GENERATION_ERROR'
      },
      { status: 500 }
    );
    
    return {
      token: '',
      response: errorResponse
    };
  }
}

// Middleware integration helper
export function withCSRFProtection(
  handler: (request: NextRequest) => Promise<NextResponse>
) {
  return async function protectedHandler(request: NextRequest): Promise<NextResponse> {
    // Apply CSRF protection
    const csrfResponse = await csrfProtection(request);
    
    if (csrfResponse) {
      // CSRF validation failed
      return csrfResponse;
    }
    
    // CSRF validation passed, continue with original handler
    return await handler(request);
  };
}

// Helper for API routes to validate CSRF from request body
export async function validateCSRFFromBody(
  request: NextRequest,
  body: any
): Promise<boolean> {
  try {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;
    
    const providedToken = body[CSRF_CONFIG.formFieldName] || body._csrf || body.csrfToken;
    
    if (!providedToken) {
      return false;
    }
    
    const storedTokenData = getCSRFTokenFromCookie(request);
    
    if (!storedTokenData) {
      return false;
    }
    
    return validateCSRFToken(providedToken, storedTokenData, userId);
    
  } catch (error) {
    console.error('CSRF body validation error:', error);
    return false;
  }
}

// React hook helper (to be used in components)
export interface CSRFTokenHook {
  token: string | null;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

// Utility to check if CSRF protection is required for a path
export function requiresCSRFProtection(pathname: string): boolean {
  // Skip CSRF for safe endpoints
  const safeEndpoints = [
    '/api/auth/',
    '/api/webhook/',
    '/api/health',
    '/api/metrics',
    '/api/csrf/token' // Endpoint to get CSRF token
  ];
  
  return !safeEndpoints.some(endpoint => pathname.startsWith(endpoint));
}

// Export configuration for use in other parts of the application
export const csrfConfig = CSRF_CONFIG;

// Types for TypeScript support
export type { CSRFToken };

export const CSRFProtection = {
  generateToken: generateCSRFToken,
  validateToken: validateCSRFToken,
  extractToken: extractCSRFToken,
  setCookie: setCSRFCookie,
  getFromCookie: getCSRFTokenFromCookie,
  middleware: csrfProtection,
  withProtection: withCSRFProtection,
  validateFromBody: validateCSRFFromBody,
  generateForRequest: generateCSRFTokenForRequest,
  requiresProtection: requiresCSRFProtection,
  config: CSRF_CONFIG
} as const;