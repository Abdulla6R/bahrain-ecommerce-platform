import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { sessionId, cardData, threeDSecure } = await request.json();

    // Validate required fields
    if (!sessionId || !cardData) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate card data
    const { cardNumber, expiryMonth, expiryYear, cvv, holderName } = cardData;
    if (!cardNumber || !expiryMonth || !expiryYear || !cvv || !holderName) {
      return NextResponse.json(
        { error: 'Invalid card data' },
        { status: 400 }
      );
    }

    // Retrieve session data (in production, get from Redis)
    // const sessionData = await redis.get(`payment_session:${sessionId}`);
    
    // Create card payment payload for BenefitPay
    const cardPaymentPayload = {
      sessionId: sessionId,
      paymentMethod: 'card',
      card: {
        number: cardNumber.replace(/\s/g, ''), // Remove spaces
        expiryMonth: expiryMonth.padStart(2, '0'),
        expiryYear: expiryYear,
        cvv: cvv,
        holderName: holderName.trim()
      },
      threeDSecure: {
        enabled: threeDSecure || true, // Always enable for Bahrain
        challengePreference: 'challenge_mandated' // Enforce challenge for security
      },
      device: {
        userAgent: request.headers.get('user-agent') || '',
        ipAddress: request.headers.get('x-forwarded-for') || 
                   request.headers.get('x-real-ip') || 
                   '127.0.0.1',
        acceptHeader: request.headers.get('accept') || '*/*',
        language: request.headers.get('accept-language') || 'en'
      }
    };

    // Process card payment through BenefitPay
    const benefitPayResponse = await fetch(`${process.env.BENEFIT_PAY_API_URL}/payments/card`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.BENEFIT_PAY_API_KEY}`,
        'X-Merchant-Id': process.env.BENEFIT_PAY_MERCHANT_ID || '',
        'X-Session-Id': sessionId
      },
      body: JSON.stringify(cardPaymentPayload)
    });

    const paymentResult = await benefitPayResponse.json();

    if (!benefitPayResponse.ok) {
      console.error('BenefitPay Card Payment Error:', paymentResult);
      
      return NextResponse.json({
        status: 'failed',
        message: paymentResult.message || 'Card payment failed',
        messageAr: paymentResult.messageAr || 'فشل في الدفع بالبطاقة',
        errorCode: paymentResult.errorCode
      });
    }

    // Handle different payment statuses
    switch (paymentResult.status) {
      case 'requires_3d_secure':
        return NextResponse.json({
          status: 'requires_3d_secure',
          threeDSecureUrl: paymentResult.threeDSecureUrl,
          sessionId: sessionId
        });

      case 'completed':
        // Payment successful
        // Update session status in Redis
        // await redis.setex(`payment_session:${sessionId}`, 3600, JSON.stringify({
        //   ...sessionData,
        //   status: 'completed',
        //   transactionId: paymentResult.transactionId,
        //   completedAt: new Date().toISOString()
        // }));

        return NextResponse.json({
          status: 'completed',
          transactionId: paymentResult.transactionId,
          reference: paymentResult.reference,
          amount: paymentResult.amount,
          currency: paymentResult.currency,
          receiptUrl: paymentResult.receiptUrl
        });

      case 'failed':
        return NextResponse.json({
          status: 'failed',
          message: paymentResult.message || 'Payment failed',
          messageAr: paymentResult.messageAr || 'فشل في الدفع',
          errorCode: paymentResult.errorCode,
          declineReason: paymentResult.declineReason
        });

      case 'pending':
        return NextResponse.json({
          status: 'pending',
          message: paymentResult.message || 'Payment is being processed',
          messageAr: paymentResult.messageAr || 'جاري معالجة الدفعة',
          estimatedProcessingTime: paymentResult.estimatedProcessingTime
        });

      default:
        return NextResponse.json({
          status: 'unknown',
          message: 'Unknown payment status',
          messageAr: 'حالة دفع غير معروفة'
        });
    }

  } catch (error) {
    console.error('Card payment processing error:', error);
    
    return NextResponse.json({
      status: 'error',
      message: 'Internal server error',
      messageAr: 'خطأ في الخادم الداخلي'
    }, { status: 500 });
  }
}