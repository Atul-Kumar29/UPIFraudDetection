import AppShell from "../components/layout/AppShell";
import KpiCard from "../components/dashboard/KpiCard";
import BehaviouralSignalBreakdown from "../components/dashboard/BehaviouralSignalBreakdown";
import { fetchOverviewData } from "../lib/api";
import { Download } from "lucide-react";

export const metadata = {
  title: "Fraud Detection Overview • UPI Sentinel",
  description:
    "Real-time overview of network health, behavioural deviations, and priority alerts across UPI switch nodes.",
};

export default async function OverviewPage() {
  const overviewData = await fetchOverviewData();

  return (
    <AppShell>
      {/* Overview Top Header & Controls */}
      <div className="flex items-center justify-between gap-4 pb-2">
        <h1 className="text-2xl lg:text-3xl font-bold text-[#2C3228]">
          Fraud Detection Overview
        </h1>

        <button className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#FAF7F2] border border-[#EAE2D6] text-xs font-medium text-[#2C3228] hover:bg-white transition-all shadow-2xs shrink-0">
          <Download className="w-3.5 h-3.5 text-[#8E9688]" />
          <span>Download Summary</span>
        </button>
      </div>

      {/* KPI Cards Row (3 Cards) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <KpiCard type="volume" data={overviewData.kpis} />
        <KpiCard type="anomalies" data={overviewData.kpis} />
        <KpiCard type="time" data={overviewData.kpis} />
      </div>

      {/* Behavioural Signal Breakdown */}
      <div>
        <BehaviouralSignalBreakdown
          signals={overviewData.behaviouralSignals}
        />
      </div>
    </AppShell>
  );
}
