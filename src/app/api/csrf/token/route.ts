// CSRF token generation endpoint
// Provides secure CSRF tokens for forms and AJAX requests

import { NextRequest, NextResponse } from 'next/server';
import { generateCSRFTokenForRequest } from '@/lib/csrf';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    // Generate CSRF token
    const { token, response } = await generateCSRFTokenForRequest(request);
    
    // Get session info for additional context
    const session = await getServerSession(authOptions);
    
    // Add security headers
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
    
    return response;
    
  } catch (error) {
    console.error('CSRF token generation error:', error);
    
    return NextResponse.json(
      {
        error: 'Failed to generate CSRF token',
        code: 'CSRF_TOKEN_ERROR'
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  // Same as GET but for POST requests that might need CSRF tokens
  return GET(request);
}