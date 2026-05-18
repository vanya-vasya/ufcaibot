import { fetchPaymentHistory } from "@/lib/api-limit";
import { CreditCard } from "lucide-react";

const formatDate = (date: Date | string | null): string => {
  if (!date) return "—";
  return new Intl.DateTimeFormat("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
};

const formatAmount = (amount: number | null, currency: string | null): string => {
  const value = (amount ?? 0) / 100;
  const symbol = currency === "GBP" ? "£" : currency === "EUR" ? "€" : currency === "USD" ? "$" : currency ?? "";
  return `-${symbol}${value.toFixed(2)}`;
};

const PaymentsPage = async () => {
  const transactions = await fetchPaymentHistory();

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-5xl mx-auto px-4 py-16">

        {/* Header */}
        <div className="flex flex-col items-center gap-3 mb-10">
          <div className="w-14 h-14 rounded-full bg-black flex items-center justify-center shadow-md">
            <CreditCard className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-black">Payments</h1>
          <p className="text-sm text-gray-400">Payment history made easy, all in one place</p>
        </div>

        {/* Table */}
        <div className="rounded-xl border border-gray-200 overflow-hidden">
          {!transactions || transactions.length === 0 ? (
            <div className="py-16 text-center text-gray-400 text-sm">
              No payment history yet.
            </div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-white">
                <tr>
                  <th className="py-4 pl-6 pr-3 text-left text-sm font-semibold text-gray-800">
                    ID
                  </th>
                  <th className="px-4 py-4 text-left text-sm font-semibold text-gray-800">
                    Payment Date
                  </th>
                  <th className="px-4 py-4 text-left text-sm font-semibold text-gray-800">
                    Payment Amount
                  </th>
                  <th className="px-4 py-4 text-left text-sm font-semibold text-gray-800">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {transactions.map((tx, index) => (
                  <tr key={index} className="hover:bg-gray-50 transition-colors">
                    <td className="py-4 pl-6 pr-3 text-sm font-medium text-gray-900 whitespace-nowrap">
                      {tx.id.slice(-12)}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-600 whitespace-nowrap">
                      {formatDate((tx as any).paid_at ?? (tx as any).createdAt)}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-600 whitespace-nowrap">
                      {formatAmount((tx as any).amount, (tx as any).currency)}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-600 whitespace-nowrap">
                      {(tx as any).status
                        ? (tx as any).status.charAt(0).toUpperCase() + (tx as any).status.slice(1)
                        : "Completed"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentsPage;
