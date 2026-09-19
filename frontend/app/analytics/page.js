import AppShell from "../../components/layout/AppShell";
import AnalyticsCharts from "../../components/analytics/AnalyticsCharts";
import { fetchAnalyticsData } from "../../lib/api";

export const metadata = {
  title: "Analytics & Intelligence • UPI Sentinel",
  description: "Network health trends, risk grade distribution, and behavioural signal analytics.",
};

export default async function AnalyticsPage() {
  const analyticsData = await fetchAnalyticsData();

  return (
    <AppShell>
      {/* Header */}
      <div className="flex items-center justify-between gap-4 pb-2">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-[#2C3228]">
            Analytics &amp; Intelligence
          </h1>
          <p className="text-xs lg:text-sm text-[#6B7265] max-w-2xl leading-relaxed mt-1">
            Macro insights into transaction volumes, risk distribution, and signal contribution trends.
          </p>
        </div>
      </div>

      <AnalyticsCharts data={analyticsData} />
    </AppShell>
  );
}
