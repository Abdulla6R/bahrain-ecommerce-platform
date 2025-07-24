import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    const { validationURL, merchantIdentifier } = await request.json();

    if (!validationURL || !merchantIdentifier) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate that the validation URL is from Apple
    const allowedDomains = ['apple-pay-gateway.apple.com', 'apple-pay-gateway-nc.apple.com'];
    const url = new URL(validationURL);
    
    if (!allowedDomains.includes(url.hostname)) {
      return NextResponse.json(
        { error: 'Invalid validation URL' },
        { status: 400 }
      );
    }

    // Load Apple Pay merchant certificate and key
    // In production, these should be loaded from secure storage
    const certPath = process.env.APPLE_PAY_CERT_PATH || '/certs/apple-pay-cert.pem';
    const keyPath = process.env.APPLE_PAY_KEY_PATH || '/certs/apple-pay-key.pem';

    let cert: string;
    let key: string;

    try {
      cert = fs.readFileSync(path.resolve(certPath), 'utf8');
      key = fs.readFileSync(path.resolve(keyPath), 'utf8');
    } catch (error) {
      console.error('Failed to load Apple Pay certificates:', error);
      return NextResponse.json(
        { error: 'Certificate configuration error' },
        { status: 500 }
      );
    }

    // Create merchant validation payload
    const merchantValidationPayload = {
      merchantIdentifier: merchantIdentifier,
      domainName: process.env.NEXT_PUBLIC_DOMAIN || 'localhost:3000',
      displayName: 'Tendzd - Bahrain E-commerce'
    };

    // Make request to Apple Pay for merchant validation
    const appleResponse = await fetch(validationURL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(merchantValidationPayload),
      // In a real implementation, you would configure HTTPS with the merchant certificate
      // This is a simplified version for development
    });

    if (!appleResponse.ok) {
      const errorText = await appleResponse.text();
      console.error('Apple Pay validation failed:', errorText);
      
      return NextResponse.json(
        { error: 'Merchant validation failed' },
        { status: 400 }
      );
    }

    const merchantSession = await appleResponse.json();

    // Log successful validation (remove in production)
    console.log('Apple Pay merchant validation successful');

    return NextResponse.json(merchantSession);

  } catch (error) {
    console.error('Apple Pay merchant validation error:', error);
    
    return NextResponse.json(
      { 
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}