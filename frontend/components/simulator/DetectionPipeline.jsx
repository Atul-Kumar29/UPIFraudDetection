"use client";

import { CheckCircle2, AlertTriangle, ShieldCheck } from "lucide-react";

export default function DetectionPipeline({ result }) {
  if (!result) {
    return (
      <div className="bg-[#FAF7F2] border border-[#EAE2D6] rounded-2xl p-6 shadow-2xs text-center">
        <h3 className="font-editorial text-lg font-bold text-[#2C3228]">
          Simulation Evaluation
        </h3>
        <p className="text-xs text-[#6B7265] mt-1">
          Select a scenario above and click &quot;Test Scenario&quot; to see evaluation results.
        </p>
      </div>
    );
  }

  const isHighRisk = result.riskLevel === "CRITICAL" || result.riskLevel === "HIGH";

  return (
    <div className="bg-[#FAF7F2] border border-[#EAE2D6] rounded-2xl p-6 shadow-2xs space-y-5">
      <div className="flex items-center justify-between pb-3 border-b border-[#EAE2D6]">
        <div>
          <h3 className="font-editorial text-xl font-bold text-[#2C3228]">
            Simulation Result
          </h3>
          <p className="text-xs text-[#6B7265] mt-0.5">
            Risk evaluation for selected transaction
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span
            className={`px-3 py-1 rounded-lg text-xs font-bold inline-flex items-center gap-1.5 ${
              isHighRisk
                ? "bg-[#FEE2E2] text-[#DC2626] border border-[#FCA5A5]"
                : "bg-[#ECFCCB] text-[#365314] border border-[#D9F99D]"
            }`}
          >
            {isHighRisk ? (
              <AlertTriangle className="w-4 h-4 text-[#DC2626]" />
            ) : (
              <ShieldCheck className="w-4 h-4 text-[#65A30D]" />
            )}
            <span>Risk Level: {result.riskLevel}</span>
          </span>
        </div>
      </div>

      {/* Flagged Signals / Deviations */}
      {result.deviations && result.deviations.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-[#2C3228] uppercase tracking-wider">
            Detected Risk Factors
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {result.deviations.map((dev, idx) => (
              <div
                key={idx}
                className="bg-[#F4EFEA] border border-[#EAE2D6] rounded-xl p-3.5 space-y-1"
              >
                <p className="text-xs font-bold text-[#2C3228] flex items-center justify-between">
                  <span>{dev.title}</span>
                </p>
                <p className="text-xs text-[#555E4E]">{dev.detail}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
