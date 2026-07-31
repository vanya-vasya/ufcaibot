import { redirect } from "next/navigation";

const PaymentHistoryPage = () => {
  redirect("/dashboard/payments");
};

export default PaymentHistoryPage;
