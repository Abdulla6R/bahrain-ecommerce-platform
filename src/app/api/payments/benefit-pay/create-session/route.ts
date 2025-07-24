import { NextRequest, NextResponse } from 'next/server';
import { nanoid } from 'nanoid';

export async function POST(request: NextRequest) {
  try {
    const { amount, currency, items, locale, returnUrl, cancelUrl } = await request.json();

    // Validate required fields
    if (!amount || !currency || !items || !returnUrl || !cancelUrl) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Generate unique session ID
    const sessionId = `bp_session_${nanoid(32)}`;
    const reference = `TENDZD_${Date.now()}`;

    // Create BenefitPay session payload
    const sessionPayload = {
      merchantId: process.env.BENEFIT_PAY_MERCHANT_ID,
      merchantKey: process.env.BENEFIT_PAY_MERCHANT_KEY,
      sessionId: sessionId,
      amount: amount.toFixed(3),
      currency: currency,
      description: locale === 'ar' ? 'دفع طلب تندز' : 'Tendzd Order Payment',
      reference: reference,
      returnUrl: returnUrl,
      cancelUrl: cancelUrl,
      notificationUrl: `${process.env.NEXT_PUBLIC_APP_URL}/api/payments/benefit-pay/webhook`,
      items: items.map((item: any) => ({
        name: locale === 'ar' ? item.nameAr || item.name : item.name,
        quantity: item.quantity,
        price: item.price.toFixed(3),
        currency: currency
      })),
      customer: {
        locale: locale,
        country: 'BH'
      },
      ui: {
        theme: {
          primaryColor: '#FFA500',
          locale: locale
        }
      },
      features: {
        threeDSecure: true, // Always enforce 3D Secure for Bahrain
        saveCard: false,
        enableWallet: true
      }
    };

    // Call BenefitPay API to create session
    const benefitPayResponse = await fetch(`${process.env.BENEFIT_PAY_API_URL}/sessions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.BENEFIT_PAY_API_KEY}`,
        'X-Merchant-Id': process.env.BENEFIT_PAY_MERCHANT_ID || ''
      },
      body: JSON.stringify(sessionPayload)
    });

    if (!benefitPayResponse.ok) {
      const errorData = await benefitPayResponse.json();
      console.error('BenefitPay API Error:', errorData);
      
      return NextResponse.json(
        { 
          error: locale === 'ar' 
            ? 'فشل في إنشاء جلسة الدفع' 
            : 'Failed to create payment session',
          details: errorData
        },
        { status: 500 }
      );
    }

    const benefitPaySession = await benefitPayResponse.json();

    // Store session data in Redis for reference
    // In production, you would use Redis here
    // await redis.setex(`payment_session:${sessionId}`, 3600, JSON.stringify({
    //   sessionId,
    //   reference,
    //   amount,
    //   currency,
    //   items,
    //   status: 'created',
    //   createdAt: new Date().toISOString()
    // }));

    return NextResponse.json({
      sessionId: sessionId,
      reference: reference,
      redirectUrl: benefitPaySession.redirectUrl,
      qrCode: benefitPaySession.qrCode,
      status: 'created'
    });

  } catch (error) {
    console.error('Payment session creation error:', error);
    
    return NextResponse.json(
      { 
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}