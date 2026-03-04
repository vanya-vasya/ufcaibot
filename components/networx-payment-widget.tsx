"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader } from '@/components/loader';
import { toast } from 'react-hot-toast';

interface NetworkPaymentWidgetProps {
  amount: number;
  currency?: string;
  orderId: string;
  description?: string;
  customerEmail?: string;
  onSuccess?: (transactionData: any) => void;
  onError?: (error: any) => void;
  onCancel?: () => void;
}

interface PaymentResponse {
  success: boolean;
  token?: string;
  payment_url?: string;
  error?: string;
  details?: any;
  mock?: boolean;
  message?: string;
}

export const NetworkPaymentWidget: React.FC<NetworkPaymentWidgetProps> = ({
  amount,
  currency = 'USD',
  orderId,
  description,
  customerEmail,
  onSuccess,
  onError,
  onCancel,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [paymentToken, setPaymentToken] = useState<string | null>(null);
  const [paymentUrl, setPaymentUrl] = useState<string | null>(null);
  const [email, setEmail] = useState(customerEmail || '');

  const createPaymentToken = async () => {
    if (!email) {
      toast.error('Please enter your email to continue');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/payment/networx', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount, currency, orderId, description, customerEmail: email }),
      });

      const data: PaymentResponse = await response.json();

      if (data.success && data.token && data.payment_url) {
        setPaymentToken(data.token);
        setPaymentUrl(data.payment_url);
        toast.success('Payment session created. Proceed to checkout.');
      } else {
        console.error('Payment token creation failed:', data);
        toast.error(data.error || 'Failed to create payment session');
        onError?.(data);
      }
    } catch (error) {
      console.error('Payment token creation error:', error);
      toast.error('Connection error. Please try again.');
      onError?.(error);
    } finally {
      setIsLoading(false);
    }
  };

  const openPaymentWidget = () => {
    if (!paymentUrl) return;
    toast('Redirecting to secure payment page...');
    window.location.href = paymentUrl;
  };

  const checkPaymentStatus = async () => {
    if (!paymentToken) return;

    try {
      const response = await fetch(`/api/payment/networx?token=${paymentToken}`);
      const data = await response.json();

      if (data.success) {
        const status = data.transaction?.status;

        switch (status) {
          case 'success':
            toast.success('Payment completed successfully!');
            onSuccess?.(data.transaction);
            break;
          case 'failed':
            toast.error('Payment failed. Please try again.');
            onError?.(data.transaction);
            break;
          case 'pending':
            toast('Payment is still processing...');
            break;
          case 'canceled':
            toast('Payment was cancelled.');
            onCancel?.();
            break;
        }
      }
    } catch (error) {
      console.error('Payment status check error:', error);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto bg-white border-gray-200">
      <CardHeader>
        <CardTitle className="text-gray-900">Secure Payment</CardTitle>
        <CardDescription className="text-gray-500">
          Amount to pay: <span className="font-semibold text-gray-900">{amount.toFixed(2)} {currency}</span>
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!paymentToken ? (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="payment-email" className="text-gray-900 font-medium">
                Email for receipt
              </Label>
              <Input
                id="payment-email"
                type="email"
                placeholder="your-email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                required
                className="bg-white border-gray-300 text-gray-900 focus:ring-black focus:border-black"
              />
            </div>

            <div className="space-y-1">
              <p className="text-sm text-gray-500">
                <span className="font-medium text-gray-900">Order:</span> {orderId}
              </p>
              {description && (
                <p className="text-sm text-gray-500">
                  <span className="font-medium text-gray-900">Description:</span> {description}
                </p>
              )}
            </div>

            <Button
              onClick={createPaymentToken}
              disabled={isLoading || !email}
              className="w-full bg-black hover:bg-black/85 text-white font-semibold py-3 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <Loader />
                  Processing...
                </span>
              ) : (
                'Continue to Payment'
              )}
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
              <p className="text-sm text-gray-900 font-medium">
                ✅ Payment session ready
              </p>
              <p className="text-xs text-gray-500 mt-1 font-mono truncate">
                Token: {paymentToken}
              </p>
            </div>

            <div className="space-y-2">
              <Button
                onClick={openPaymentWidget}
                disabled={!paymentUrl}
                className="w-full bg-black hover:bg-black/85 text-white font-semibold py-3 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md"
              >
                Proceed to Checkout
              </Button>

              <Button
                onClick={checkPaymentStatus}
                variant="outline"
                className="w-full border-gray-300 text-gray-900 hover:bg-gray-100"
              >
                Check Payment Status
              </Button>
            </div>

            <div className="text-xs text-gray-400 space-y-1">
              <p>• You will be redirected to a secure payment page</p>
              <p>• Complete your payment with a credit or debit card</p>
              <p>• You will return here after payment is complete</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
