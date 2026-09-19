import AppShell from "../components/layout/AppShell";
import OverviewDashboard from "../components/dashboard/OverviewDashboard";
import { fetchOverviewData, fetchTransactions } from "../lib/api";

export const metadata = {
  title: "Fraud Intelligence Overview • UPI Sentinel",
  description:
    "Real-time fraud intelligence overview, anomaly scoring, and priority case triage across UPI switch nodes.",
};

export default async function OverviewPage() {
  const [overviewData, transactionsData] = await Promise.all([
    fetchOverviewData().catch(() => null),
    fetchTransactions().catch(() => []),
  ]);

  return (
    <AppShell>
      <OverviewDashboard
        initialOverview={overviewData}
        initialTransactions={transactionsData}
      />
    </AppShell>
  );
}
