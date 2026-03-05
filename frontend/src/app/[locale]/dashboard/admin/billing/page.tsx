import BillingClient from "./components/BillingClient";

export const metadata = {
  title: "Billing | Dashboard",
  description: "Manage your subscription and billing settings.",
};

export default function BillingPage() {
  return <BillingClient />;
}
