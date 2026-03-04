"use client";

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, ArrowLeft, Receipt } from 'lucide-react';
import { Loader } from '@/components/loader';

interface TransactionData {
  transaction_id?: string;
  order_id?: string;
  amount?: string;
  currency?: string;
  status?: string;
  customer_email?: string;
}

const PaymentSuccessPage = () => {
  const [transactionData, setTransactionData] = useState<TransactionData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();

  useEffect(() => {
    const fetchTransactionData = async () => {
      const token = searchParams.get('token');
      const orderId = searchParams.get('order_id');

      if (!token && !orderId) {
        setError('Transaction data is missing. Please contact support.');
        setIsLoading(false);
        return;
      }

      try {
        const queryParam = token ? `token=${token}` : `orderId=${orderId}`;
        const response = await fetch(`/api/payment/networx?${queryParam}`);
        const data = await response.json();

        if (data.success && data.transaction) {
          setTransactionData(data.transaction);
        } else {
          setError('Unable to retrieve transaction details.');
        }
      } catch (err) {
        console.error('Error fetching transaction data:', err);
        setError('An error occurred while fetching transaction details.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTransactionData();
  }, [searchParams]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="text-center">
          <Loader />
          <p className="mt-4 text-gray-500 text-sm">Verifying your payment...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <Card className="w-full max-w-md border-gray-200">
          <CardHeader className="text-center">
            <CardTitle className="text-gray-900">Something went wrong</CardTitle>
            <CardDescription className="text-gray-500">{error}</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Link href="/dashboard">
              <Button className="bg-black hover:bg-black/85 text-white">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <Card className="w-full max-w-lg border-gray-200">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <CheckCircle className="w-16 h-16 text-black" />
          </div>
          <CardTitle className="text-2xl text-gray-900">
            Payment successful!
          </CardTitle>
          <CardDescription className="text-gray-500">
            Thank you for your payment. Your transaction has been processed successfully.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {transactionData && (
            <div className="bg-gray-50 border border-gray-200 p-4 rounded-lg space-y-3">
              <h3 className="font-semibold text-gray-900 text-sm uppercase tracking-wide">
                Transaction Details
              </h3>

              {transactionData.transaction_id && (
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 text-sm">Transaction ID</span>
                  <span className="font-mono text-sm text-gray-900">{transactionData.transaction_id}</span>
                </div>
              )}

              {transactionData.order_id && (
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 text-sm">Order ID</span>
                  <span className="font-mono text-sm text-gray-900">{transactionData.order_id}</span>
                </div>
              )}

              {transactionData.amount && transactionData.currency && (
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 text-sm">Amount</span>
                  <span className="font-semibold text-gray-900">
                    {transactionData.amount} {transactionData.currency}
                  </span>
                </div>
              )}

              {transactionData.status && (
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 text-sm">Status</span>
                  <span className="text-black font-semibold capitalize">
                    {transactionData.status}
                  </span>
                </div>
              )}

              {transactionData.customer_email && (
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 text-sm">Email</span>
                  <span className="text-sm text-gray-900">{transactionData.customer_email}</span>
                </div>
              )}
            </div>
          )}

          <div className="border-t pt-4">
            <p className="text-sm text-gray-500">
              A payment confirmation has been sent to your email. Your tokens are now available in your account.
            </p>
          </div>

          <div className="flex flex-col space-y-3">
            <Link href="/dashboard" className="w-full">
              <Button className="w-full bg-black hover:bg-black/85 text-white">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>

            <Link href="/dashboard/billing/payment-history" className="w-full">
              <Button variant="outline" className="w-full border-gray-300 text-gray-900 hover:bg-gray-100">
                <Receipt className="w-4 h-4 mr-2" />
                View Payment History
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentSuccessPage;
