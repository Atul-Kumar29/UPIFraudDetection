"use client";

import { ArrowLeftRight, Power, Clock } from "lucide-react";

export default function KpiCard({ type, data }) {
  if (type === "volume") {
    return (
      <div className="bg-[#FAF7F2] border border-[#EAE2D6] rounded-2xl p-6 flex flex-col justify-between shadow-2xs">
        <div>
          <div className="flex items-center justify-between text-xs font-semibold text-[#7A8272] uppercase mb-3">
            <span>Total Volume Monitored</span>
            <ArrowLeftRight className="w-4 h-4 text-[#8B9A6E]" />
          </div>
          <h2 className="text-3xl font-bold text-[#2C3228] mb-2">
            {data?.volumeMonitored || "₹4.82 Cr"}
          </h2>
          <p className="text-xs text-[#6B7265] leading-relaxed">
            {data?.volumeSubtitle || "14,210 transactions today · 99.8% within baseline"}
          </p>
        </div>
        <div className="mt-6">
          <div className="w-full bg-[#EAE2D6] h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-[#8B9A6E] h-full rounded-full transition-all duration-500"
              style={{ width: `${data?.volumeProgress || 99.8}%` }}
            />
          </div>
        </div>
      </div>
    );
  }

  if (type === "anomalies") {
    return (
      <div className="bg-[#FAF7F2] border border-[#EAE2D6] rounded-2xl p-6 flex flex-col justify-between shadow-2xs">
        <div>
          <div className="flex items-center justify-between text-xs font-semibold text-[#7A8272] uppercase mb-3">
            <span>Anomalies Flagged</span>
            <Power className="w-4 h-4 text-[#DC2626]" />
          </div>
          <h2 className="text-3xl font-bold text-[#2C3228] mb-2">
            {data?.anomaliesFlagged || "28 cases"}
          </h2>
          <p className="text-xs text-[#6B7265] leading-relaxed">
            0.19% rate ·{" "}
            <span className="text-[#DC2626] font-semibold">
              6 currently under active triage
            </span>
          </p>
        </div>
        <div className="mt-6">
          <div className="w-full bg-[#EAE2D6] h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-[#DC2626] h-full rounded-full transition-all duration-500"
              style={{ width: `${data?.anomaliesProgress || 19}%` }}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#FAF7F2] border border-[#EAE2D6] rounded-2xl p-6 flex flex-col justify-between shadow-2xs">
      <div>
        <div className="flex items-center justify-between text-xs font-semibold text-[#7A8272] uppercase mb-3">
          <span>Avg Investigation Time</span>
          <Clock className="w-4 h-4 text-[#8B9A6E]" />
        </div>
        <h2 className="text-3xl font-bold text-[#2C3228] mb-2">
          {data?.avgInvestigationTime || "4.2 mins"}
        </h2>
        <p className="text-xs text-[#6B7265] leading-relaxed">
          {data?.avgSubtitle || "Well within 15 min team SLA (98.4% resolved)"}
        </p>
      </div>
      <div className="mt-6">
        <div className="w-full bg-[#EAE2D6] h-1.5 rounded-full overflow-hidden">
          <div
            className="bg-[#8B9A6E] h-full rounded-full transition-all duration-500"
            style={{ width: `${data?.avgProgress || 85}%` }}
          />
        </div>
      </div>
    </div>
  );
}
