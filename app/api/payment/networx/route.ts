import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

function createSignature(data: Record<string, any>, secretKey: string): string {
  const sortedParams = Object.keys(data)
    .sort()
    .reduce((obj: Record<string, any>, key) => {
      obj[key] = data[key];
      return obj;
    }, {});

  const signString = Object.entries(sortedParams)
    .map(([key, value]) => `${key}=${value}`)
    .join('&');

  return crypto
    .createHmac('sha256', secretKey)
    .update(signString)
    .digest('hex');
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { amount, currency = 'USD', orderId, description, customerEmail } = body;

    if (!amount || !orderId) {
      return NextResponse.json(
        { error: 'Amount and orderId are required' },
        { status: 400 }
      );
    }

    const shopId = process.env.SECURE_PROCESSOR_SHOP_ID || '29959';
    const secretKey = process.env.SECURE_PROCESSOR_SECRET_KEY || 'dbfb6f4e977f49880a6ce3c939f1e7be645a5bb2596c04d9a3a7b32d52378950';
    const apiUrl = process.env.SECURE_PROCESSOR_API_URL || 'https://checkout.secure-processor.com/ctp/api/checkouts';
    const returnUrl = 'https://www.ufcaibot.com/payment/success';
    const notificationUrl = 'https://www.ufcaibot.com/api/webhooks/secure-processor';
    const testMode = process.env.SECURE_PROCESSOR_TEST_MODE === 'true';

    const requestData = {
      checkout: {
        test: testMode,
        transaction_type: 'payment',
        order: {
          amount: amount * 100,
          currency: currency,
          description: description || 'Payment for order',
          tracking_id: orderId,
        },
        customer: {
          email: customerEmail || 'customer@example.com',
        },
        settings: {
          return_url: returnUrl,
          notification_url: notificationUrl,
        },
      },
    };

    if (testMode) {
      const testToken = `test_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const testTransactionId = `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      return NextResponse.json({
        success: true,
        token: testToken,
        payment_url: `https://checkout.secure-processor.com/ctp/pay/${testToken}`,
        checkout_id: testTransactionId,
        test_mode: true,
        message: 'Test payment checkout created successfully (development mode)',
      });
    }

    try {
      const processorResponse = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Basic ${Buffer.from(`${shopId}:${secretKey}`).toString('base64')}`,
          'X-API-Version': '2',
        },
        body: JSON.stringify(requestData),
      });

      if (!processorResponse.ok) {
        const errorData = await processorResponse.text();
        console.error('Secure Processor API Error:', errorData);
        return NextResponse.json(
          {
            error: 'Failed to create payment token',
            details: `API returned ${processorResponse.status}: ${errorData}`,
          },
          { status: 400 }
        );
      }

      const processorResult = await processorResponse.json();

      if (processorResult.checkout?.token && processorResult.checkout?.redirect_url) {
        return NextResponse.json({
          success: true,
          token: processorResult.checkout.token,
          payment_url: processorResult.checkout.redirect_url,
          checkout_id: processorResult.checkout.token,
        });
      } else {
        console.error('Secure Processor API unexpected response:', processorResult);
        return NextResponse.json(
          {
            error: 'Payment checkout creation failed',
            details: processorResult.error || processorResult.message || 'Unknown error',
          },
          { status: 400 }
        );
      }
    } catch (fetchError) {
      console.error('Network error calling Secure Processor API:', fetchError);
      return NextResponse.json(
        {
          error: 'Failed to connect to payment gateway',
          details: fetchError instanceof Error ? fetchError.message : 'Network error',
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Payment creation error:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.json(
        { error: 'Payment token is required' },
        { status: 400 }
      );
    }

    const shopId = process.env.SECURE_PROCESSOR_SHOP_ID || '29959';
    const secretKey = process.env.SECURE_PROCESSOR_SECRET_KEY || 'dbfb6f4e977f49880a6ce3c939f1e7be645a5bb2596c04d9a3a7b32d52378950';
    const apiBaseUrl = 'https://checkout.secure-processor.com/ctp/api/checkouts';

    const processorResponse = await fetch(`${apiBaseUrl}/${token}`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        Authorization: `Basic ${Buffer.from(`${shopId}:${secretKey}`).toString('base64')}`,
        'X-API-Version': '2',
      },
    });

    const processorResult = await processorResponse.json();

    if (!processorResponse.ok) {
      console.error('Secure Processor Status API Error:', processorResult);
      return NextResponse.json(
        { error: 'Failed to check payment status', details: processorResult },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      status: processorResult.status,
      transaction: processorResult,
    });
  } catch (error) {
    console.error('Payment status check error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
