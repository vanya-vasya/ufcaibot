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
      toast.error('Please enter email to continue');
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
        toast.success('Payment token created successfully');
      } else {
        console.error('Payment token creation failed:', data);
        toast.error(data.error || 'Failed to create payment token');
        onError?.(data);
      }
    } catch (error) {
      console.error('Payment token creation error:', error);
      toast.error('Server connection error');
      onError?.(error);
    } finally {
      setIsLoading(false);
    }
  };

  const openPaymentWidget = () => {
    if (!paymentUrl) return;
    toast('Redirecting to payment page...');
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
            toast.error('Payment failed');
            onError?.(data.transaction);
            break;
          case 'pending':
            toast('Payment processing...');
            break;
          case 'canceled':
            toast('Payment cancelled');
            onCancel?.();
            break;
        }
      }
    } catch (error) {
      console.error('Payment status check error:', error);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto bg-white border-border">
      <CardHeader>
        <CardTitle className="text-foreground font-heading">Secure Payment</CardTitle>
        <CardDescription className="text-muted-foreground">
          Amount to pay: {amount.toFixed(2)} {currency}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!paymentToken ? (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="payment-email" className="text-foreground">
                Email for notifications
              </Label>
              <Input
                id="payment-email"
                type="email"
                placeholder="your-email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                required
                className="bg-white border-input text-foreground focus-visible:ring-ring"
              />
            </div>

            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">
                <span className="font-medium text-foreground">Order:</span> {orderId}
              </p>
              {description && (
                <p className="text-sm text-muted-foreground">
                  <span className="font-medium text-foreground">Description:</span> {description}
                </p>
              )}
            </div>

            <Button
              onClick={createPaymentToken}
              disabled={isLoading || !email}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <Loader />
                  Creating token...
                </span>
              ) : (
                'Create Payment Token'
              )}
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
              <p className="text-sm text-primary font-medium">
                ✅ Payment token created successfully
              </p>
              <p className="text-xs text-muted-foreground mt-1 font-mono">
                Token: {paymentToken}
              </p>
            </div>

            <div className="space-y-2">
              <Button
                onClick={openPaymentWidget}
                disabled={!paymentUrl}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md"
              >
                Proceed to Payment
              </Button>

              <Button
                onClick={checkPaymentStatus}
                variant="outline"
                className="w-full border-input text-foreground hover:bg-accent"
              >
                Check Payment Status
              </Button>
            </div>

            <div className="text-xs text-muted-foreground space-y-1">
              <p>• You will be redirected to the secure payment page</p>
              <p>• Complete your payment with credit/debit card</p>
              <p>• You will return here after payment completion</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
