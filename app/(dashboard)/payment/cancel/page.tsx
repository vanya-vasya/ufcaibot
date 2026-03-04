"use client";

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { XCircle, ArrowLeft, RefreshCw, AlertTriangle } from 'lucide-react';
import { Loader } from '@/components/loader';

interface TransactionData {
  transaction_id?: string;
  order_id?: string;
  amount?: string;
  currency?: string;
  status?: string;
  error_message?: string;
  customer_email?: string;
}

const PaymentCancelPage = () => {
  const [transactionData, setTransactionData] = useState<TransactionData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const searchParams = useSearchParams();

  useEffect(() => {
    const fetchTransactionData = async () => {
      const token = searchParams.get('token');
      const orderId = searchParams.get('order_id');

      if (!token && !orderId) {
        setTransactionData({ order_id: 'Unknown', status: 'canceled' });
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
          setTransactionData({
            order_id: orderId || 'Unknown',
            status: 'canceled',
          });
        }
      } catch (err) {
        console.error('Error fetching transaction data:', err);
        setTransactionData({
          order_id: searchParams.get('order_id') || 'Unknown',
          status: 'canceled',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchTransactionData();
  }, [searchParams]);

  const getStatusInfo = (status?: string) => {
    switch (status) {
      case 'failed':
        return {
          icon: <XCircle className="w-16 h-16 text-gray-900" />,
          title: 'Payment failed',
          description: 'Your payment could not be processed.',
        };
      case 'canceled':
        return {
          icon: <AlertTriangle className="w-16 h-16 text-gray-500" />,
          title: 'Payment cancelled',
          description: 'You cancelled the payment process.',
        };
      default:
        return {
          icon: <XCircle className="w-16 h-16 text-gray-400" />,
          title: 'Payment incomplete',
          description: 'The payment process was interrupted.',
        };
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="text-center">
          <Loader />
          <p className="mt-4 text-gray-500 text-sm">Checking payment status...</p>
        </div>
      </div>
    );
  }

  const statusInfo = getStatusInfo(transactionData?.status);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <Card className="w-full max-w-lg border-gray-200">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            {statusInfo.icon}
          </div>
          <CardTitle className="text-2xl text-gray-900">
            {statusInfo.title}
          </CardTitle>
          <CardDescription className="text-gray-500">
            {statusInfo.description}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {transactionData && (
            <div className="bg-gray-50 border border-gray-200 p-4 rounded-lg space-y-3">
              <h3 className="font-semibold text-gray-900 text-sm uppercase tracking-wide">
                Transaction Info
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
                  <span className="text-gray-900 font-semibold capitalize">
                    {transactionData.status}
                  </span>
                </div>
              )}

              {transactionData.error_message && (
                <div className="mt-3 p-3 bg-gray-100 border border-gray-200 rounded">
                  <p className="text-sm text-gray-700">
                    <span className="font-semibold">Reason:</span> {transactionData.error_message}
                  </p>
                </div>
              )}
            </div>
          )}

          <div className="border-t pt-4">
            {transactionData?.status === 'failed' ? (
              <div className="space-y-2">
                <p className="text-sm text-gray-500 font-medium">Common reasons for failure:</p>
                <ul className="text-sm text-gray-500 list-disc list-inside space-y-1">
                  <li>Insufficient funds on the card</li>
                  <li>Card is blocked or expired</li>
                  <li>Incorrect card details entered</li>
                  <li>Temporary issue with your bank</li>
                </ul>
              </div>
            ) : (
              <p className="text-sm text-gray-500">
                You can try again or return to the dashboard to restart the payment.
              </p>
            )}
          </div>

          <div className="flex flex-col space-y-3">
            <Link href="/dashboard" className="w-full">
              <Button className="w-full bg-black hover:bg-black/85 text-white">
                <RefreshCw className="w-4 h-4 mr-2" />
                Try Again
              </Button>
            </Link>

            <Link href="/dashboard" className="w-full">
              <Button variant="outline" className="w-full border-gray-300 text-gray-900 hover:bg-gray-100">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
          </div>

          <div className="text-center">
            <p className="text-xs text-gray-400">
              If the issue persists, please contact our support team.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentCancelPage;
