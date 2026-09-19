"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeftRight,
  ShieldAlert,
  Clock,
  Cpu,
  RefreshCw,
  ArrowRight,
  Play,
} from "lucide-react";
import { runSimulation, fetchTransactions, fetchOverviewData } from "../../lib/api";

export default function OverviewDashboard({
  initialOverview,
  initialTransactions,
}) {
  const [overview, setOverview] = useState(initialOverview);
  const [transactions, setTransactions] = useState(initialTransactions || []);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Simulator Widget state
  const [selectedScenario, setSelectedScenario] = useState("high_amount");
  const [simulationResult, setSimulationResult] = useState(null);
  const [isSimulating, setIsSimulating] = useState(false);

  const kpis = overview?.kpis || {};

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      const [ovData, txData] = await Promise.all([
        fetchOverviewData().catch(() => overview),
        fetchTransactions().catch(() => transactions),
      ]);
      if (ovData) setOverview(ovData);
      if (txData) setTransactions(txData);
    } catch (err) {
      console.error("Refresh failed:", err);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleRunSimulation = async () => {
    setIsSimulating(true);
    try {
      const res = await runSimulation({ scenarioId: selectedScenario });
      setSimulationResult(res);
    } catch (err) {
      console.error("Simulation error:", err);
    } finally {
      setIsSimulating(false);
    }
  };

  const getRiskBadge = (level, score) => {
    if (level === "CRITICAL" || score >= 85) {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#FEE2E2] text-[#DC2626] border border-[#FCA5A5]/40">
          <span className="w-1.5 h-1.5 rounded-full bg-[#DC2626] animate-pulse" />
          Critical ({score || 92})
        </span>
      );
    }
    if (level === "HIGH" || score >= 60) {
      return (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-[#FEF3C7] text-[#D97706] border border-[#FDE68A]/40">
          High ({score || 78})
        </span>
      );
    }
    if (level === "MEDIUM" || score >= 20) {
      return (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-[#FEF9C3] text-[#CA8A04] border border-[#FEF08A]/40">
          Medium ({score || 45})
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-[#ECFCCB] text-[#65A30D] border border-[#D9F99D]/40">
        Low ({score || 8})
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Overview Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-3 border-b border-[#EAE2D6]">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-[#2C3228] tracking-tight mb-1">
            Fraud Intelligence Overview
          </h1>
          <p className="text-xs text-[#6B7265]">
            Real-time behavioral anomaly detection and priority triage across UPI switch nodes.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#FAF7F2] border border-[#EAE2D6] text-xs font-medium text-[#2C3228] hover:bg-white transition-all shadow-2xs disabled:opacity-60"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-[#7A8272] ${isRefreshing ? "animate-spin" : ""}`} />
            <span>{isRefreshing ? "Refreshing..." : "Refresh Feeds"}</span>
          </button>
        </div>
      </div>

      {/* Clean 4 KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Monitored Volume */}
        <div className="bg-[#FAF7F2] border border-[#EAE2D6] rounded-2xl p-5 shadow-2xs hover:border-[#D9D2C7] transition-all">
          <div className="flex items-center justify-between text-xs font-semibold text-[#7A8272] uppercase mb-2">
            <span>Total Volume Monitored</span>
            <div className="p-1.5 rounded-lg bg-[#E2E8D8]/50 text-[#8B9A6E]">
              <ArrowLeftRight className="w-4 h-4" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-[#2C3228] tracking-tight mb-1">
            {kpis?.volumeMonitored || "₹4.82 Cr"}
          </h2>
          <p className="text-[11px] text-[#6B7265]">
            {kpis?.volumeSubtitle || "14,210 transactions today · 99.8% baseline"}
          </p>
        </div>

        {/* KPI 2: Flagged Cases */}
        <div className="bg-[#FAF7F2] border border-[#EAE2D6] rounded-2xl p-5 shadow-2xs hover:border-[#D9D2C7] transition-all">
          <div className="flex items-center justify-between text-xs font-semibold text-[#7A8272] uppercase mb-2">
            <span>Anomalies Flagged</span>
            <div className="p-1.5 rounded-lg bg-[#FEE2E2]/60 text-[#DC2626]">
              <ShieldAlert className="w-4 h-4" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-[#2C3228] tracking-tight mb-1">
            {kpis?.anomaliesFlagged || "28 cases"}
          </h2>
          <p className="text-[11px] text-[#6B7265]">
            0.19% rate · <span className="text-[#DC2626] font-semibold">6 under triage</span>
          </p>
        </div>

        {/* KPI 3: Resolution Time */}
        <div className="bg-[#FAF7F2] border border-[#EAE2D6] rounded-2xl p-5 shadow-2xs hover:border-[#D9D2C7] transition-all">
          <div className="flex items-center justify-between text-xs font-semibold text-[#7A8272] uppercase mb-2">
            <span>Avg Resolution Time</span>
            <div className="p-1.5 rounded-lg bg-[#FEF3C7]/60 text-[#D97706]">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-[#2C3228] tracking-tight mb-1">
            {kpis?.avgInvestigationTime || "4.2 mins"}
          </h2>
          <p className="text-[11px] text-[#6B7265]">
            Target &lt;15 min SLA · 98.4% resolved
          </p>
        </div>

        {/* KPI 4: Engine Health */}
        <div className="bg-[#FAF7F2] border border-[#EAE2D6] rounded-2xl p-5 shadow-2xs hover:border-[#D9D2C7] transition-all">
          <div className="flex items-center justify-between text-xs font-semibold text-[#7A8272] uppercase mb-2">
            <span>ML Engine Latency</span>
            <div className="p-1.5 rounded-lg bg-[#E2E8D8]/50 text-[#8B9A6E]">
              <Cpu className="w-4 h-4" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-[#2C3228] tracking-tight mb-1">
            14 ms
          </h2>
          <p className="text-[11px] text-[#6B7265]">
            Isolation Forest v2.4 · 15 feature vectors
          </p>
        </div>
      </div>

      {/* Main Content Split: Priority Queue + Instant Test Widget */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Priority Triage Queue (Takes 2 Columns on Desktop) */}
        <div className="lg:col-span-2 bg-[#FAF7F2] border border-[#EAE2D6] rounded-2xl p-6 shadow-2xs">
          <div className="flex items-center justify-between mb-5 pb-3 border-b border-[#EAE2D6]">
            <div>
              <h2 className="text-lg font-bold text-[#2C3228] flex items-center gap-2">
                Priority Triage Queue &amp; Flagged Activity
                <span className="px-2.5 py-0.5 rounded-md bg-[#FEE2E2] text-[#DC2626] text-xs font-mono-system font-bold">
                  {transactions.length} Flagged
                </span>
              </h2>
              <p className="text-xs text-[#6B7265] mt-0.5">
                Flagged UPI transaction cases requiring investigator review.
              </p>
            </div>
            <Link
              href="/transactions"
              className="inline-flex items-center gap-1 text-xs font-semibold text-[#8B9A6E] hover:text-[#78875C] transition-colors"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Clean Transaction Rows */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#EAE2D6] text-[10px] font-mono-system font-bold text-[#7A8272] uppercase tracking-wider">
                  <th className="pb-3 pr-4 font-semibold">ACCOUNT &amp; ID</th>
                  <th className="pb-3 px-3 font-semibold">AMOUNT</th>
                  <th className="pb-3 px-3 font-semibold">TRIGGER SIGNAL</th>
                  <th className="pb-3 px-3 font-semibold">RISK GRADE</th>
                  <th className="pb-3 pl-3 font-semibold text-right">ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EAE2D6]/60 text-xs">
                {transactions.map((row) => (
                  <tr key={row.id} className="hover:bg-[#F4EFEA]/70 transition-colors">
                    <td className="py-3.5 pr-4">
                      <p className="font-bold text-[#2C3228]">{row.user}</p>
                      <p className="font-mono-system text-[10px] text-[#7A8272]">
                        {row.id} · {row.rrn}
                      </p>
                    </td>
                    <td className="py-3.5 px-3 font-mono-system font-bold text-[#2C3228] whitespace-nowrap">
                      {row.amountFormatted || `₹${row.amount?.toLocaleString("en-IN")}`}
                    </td>
                    <td className="py-3.5 px-3 text-[#555E4E]">
                      <p className="font-medium">{row.triggerSignal}</p>
                      <p className="text-[10px] text-[#8E9688]">
                        {row.merchant} ({row.location || "India"})
                      </p>
                    </td>
                    <td className="py-3.5 px-3 whitespace-nowrap">
                      {getRiskBadge(row.riskLevel, row.riskScore)}
                    </td>
                    <td className="py-3.5 pl-4 text-right whitespace-nowrap">
                      <Link
                        href={`/investigations?id=${row.id}`}
                        className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-xl text-xs font-medium bg-[#8B9A6E] text-white hover:bg-[#78875C] transition-all shadow-2xs"
                      >
                        <span>Review</span>
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between text-[11px] font-mono-system text-[#8E9688] pt-4 mt-4 border-t border-[#EAE2D6]">
            <span>Streaming from ISO 20022 Switch Queue</span>
            <span>0.19% anomaly rate</span>
          </div>
        </div>

        {/* Instant Model Simulation Widget */}
        <div className="bg-[#FAF7F2] border border-[#EAE2D6] rounded-2xl p-6 shadow-2xs space-y-4">
          <div className="pb-3 border-b border-[#EAE2D6]">
            <h3 className="font-bold text-sm text-[#2C3228]">
              Instant Model Simulation
            </h3>
            <p className="text-[11px] text-[#6B7265] mt-0.5">
              Test payload against Isolation Forest model
            </p>
          </div>

          <div className="space-y-3.5">
            <label className="block text-xs font-semibold text-[#555E4E]">
              Select Anomaly Scenario:
            </label>
            <select
              value={selectedScenario}
              onChange={(e) => setSelectedScenario(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#EAE2D6] text-xs font-medium text-[#2C3228] focus:outline-none focus:border-[#8B9A6E]"
            >
              <option value="normal">Normal Baseline (₹450 - Chai Point)</option>
              <option value="high_amount">High Amount Spike (₹38,500 - Apex Gold)</option>
              <option value="new_device">Unbound New Device (₹52,000 - Electronics)</option>
              <option value="high_velocity">High Velocity Burst (6 txns / 90s)</option>
              <option value="location_leap">Location Leap (Mangaluru → Bengaluru)</option>
            </select>

            <button
              onClick={handleRunSimulation}
              disabled={isSimulating}
              className="w-full py-2.5 px-4 rounded-xl bg-[#2C3228] text-white text-xs font-bold hover:bg-[#3D4438] transition-all flex items-center justify-center gap-2 shadow-xs disabled:opacity-60"
            >
              <Play className={`w-3.5 h-3.5 fill-current ${isSimulating ? "animate-spin" : ""}`} />
              <span>{isSimulating ? "Running ML Model..." : "Run Scenario Test"}</span>
            </button>
          </div>

          {/* Simulation Output Display */}
          {simulationResult && (
            <div className="p-4 rounded-xl bg-[#E2E8D8]/50 border border-[#8B9A6E]/30 space-y-2.5 text-xs">
              <div className="flex items-center justify-between font-bold">
                <span className="text-[#2C3228]">Risk Score:</span>
                <span
                  className={
                    simulationResult.compositeRiskScore >= 80
                      ? "text-[#DC2626]"
                      : simulationResult.compositeRiskScore >= 50
                      ? "text-[#D97706]"
                      : "text-[#65A30D]"
                  }
                >
                  {simulationResult.compositeRiskScore} / 100 ({simulationResult.riskLevel})
                </span>
              </div>

              <div className="flex items-center justify-between text-[11px] text-[#555E4E]">
                <span>Tree Isolation Depth:</span>
                <span className="font-mono-system font-bold">
                  {simulationResult.treeDepth || "4.1"} (Avg: 11.2)
                </span>
              </div>

              {simulationResult.deviations && (
                <div className="pt-2 border-t border-[#8B9A6E]/20 space-y-1">
                  <p className="text-[10px] font-bold text-[#4A5243] uppercase tracking-wider">
                    Detected Anomaly Factors:
                  </p>
                  {simulationResult.deviations.map((dev, idx) => (
                    <div key={idx} className="flex items-start gap-1.5 text-[11px] text-[#3D4438]">
                      <span className="text-[#8B9A6E] font-bold">•</span>
                      <span>{dev.title || dev.detail}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
