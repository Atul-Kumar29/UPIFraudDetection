import AppShell from "../../components/layout/AppShell";
import { fetchTransactionById, fetchTransactions } from "../../lib/api";
import { EvidenceCard, RiskScoreBadge } from "../../components/investigation/EvidenceCard";
import Link from "next/link";
import { AlertCircle } from "lucide-react";

export const metadata = {
  title: "Case Investigation • UPI Sentinel",
  description: "Detailed transaction review and action panel.",
};

export default async function InvestigationPage({ searchParams }) {
  const params = await searchParams;
  const id = params?.id || "TX10291";
  const tx = await fetchTransactionById(id);
  const allTx = await fetchTransactions();

  return (
    <AppShell>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-2">
        <div className="space-y-1">
          <h1 className="text-2xl lg:text-3xl font-bold text-[#2C3228]">
            Case Investigation
          </h1>
          <p className="text-xs lg:text-sm text-[#6B7265] max-w-2xl leading-relaxed">
            Review transaction details and confirm flag status.
          </p>
        </div>

        {/* Case Selector Dropdown */}
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-xs font-medium text-[#7A8272]">SELECT CASE:</span>
          <form action="/investigations" method="GET">
            <select
              name="id"
              defaultValue={tx.id}
              className="bg-[#FAF7F2] border border-[#EAE2D6] rounded-xl px-3 py-2 text-xs text-[#2C3228] font-bold focus:outline-none focus:border-[#8B9A6E]"
            >
              {allTx.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.id} - {t.user} ({t.amountFormatted})
                </option>
              ))}
            </select>
          </form>
        </div>
      </div>

      {/* Main Case Summary Header Card */}
      <div className="bg-[#FAF7F2] border border-[#EAE2D6] rounded-2xl p-6 shadow-2xs grid grid-cols-1 md:grid-cols-4 gap-6 items-center">
        <div className="md:col-span-3 space-y-3">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-bold text-[#2C3228]">
              {tx.user}
            </h2>
            <span className="text-xs px-2.5 py-0.5 rounded-md bg-[#EAE2D6] text-[#555E4E] font-medium">
              VPA: {tx.vpa}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs text-[#555E4E] pt-2 border-t border-[#EAE2D6]/80">
            <div>
              <span className="text-[10px] text-[#8E9688] block uppercase">AMOUNT</span>
              <span className="font-bold text-[#2C3228] text-base">{tx.amountFormatted}</span>
            </div>
            <div>
              <span className="text-[10px] text-[#8E9688] block uppercase">TIME</span>
              <span className="font-semibold text-[#2C3228]">{tx.timestamp}</span>
            </div>
            <div>
              <span className="text-[10px] text-[#8E9688] block uppercase">RRN</span>
              <span className="font-semibold text-[#2C3228]">{tx.rrn}</span>
            </div>
            <div>
              <span className="text-[10px] text-[#8E9688] block uppercase">PAYEE MERCHANT</span>
              <span className="font-semibold text-[#2C3228]">{tx.merchant}</span>
            </div>
          </div>
        </div>

        {/* Risk Score */}
        <div className="flex justify-start md:justify-end">
          <RiskScoreBadge score={tx.riskScore} level={tx.riskLevel} />
        </div>
      </div>

      {/* Prominent Evidence Breakdown Section */}
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-bold text-[#2C3228]">
            Flagged Reasons
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {tx.evidence?.map((ev, idx) => (
            <EvidenceCard
              key={idx}
              title={ev.title}
              description={ev.description}
              severity={ev.severity}
            />
          ))}

          {/* Standard supplementary evidence cards if specific case lacks items */}
          {(!tx.evidence || tx.evidence.length < 2) && (
            <>
              <EvidenceCard
                title="Unusual Amount"
                description={`Transaction amount (${tx.amountFormatted}) is significantly higher than the user's normal average.`}
                severity="CRITICAL"
              />
              <EvidenceCard
                title="New Device"
                description={`Device (${tx.device}) is not previously recognized for this user.`}
                severity="HIGH"
              />
            </>
          )}
        </div>
      </div>

      {/* Technical Metadata & Action Panel */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#FAF7F2] border border-[#EAE2D6] rounded-2xl p-5 space-y-3 text-xs">
          <h4 className="font-bold text-[#2C3228] border-b border-[#EAE2D6] pb-2 uppercase tracking-wider text-[11px]">
            Device &amp; Location Details
          </h4>
          <div className="space-y-2 text-[11px]">
            <div className="flex justify-between">
              <span className="text-[#7A8272]">Device Model:</span>
              <span className="font-semibold text-[#2C3228]">{tx.device}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#7A8272]">Location:</span>
              <span className="font-semibold text-[#2C3228]">{tx.location}</span>
            </div>
          </div>
        </div>

        {/* Action Panel */}
        <div className="md:col-span-2 bg-[#FAF7F2] border border-[#EAE2D6] rounded-2xl p-5 space-y-4">
          <h4 className="text-base font-bold text-[#2C3228]">
            Take Action
          </h4>
          <p className="text-xs text-[#6B7265]">
            Review the details above and select an appropriate disposition action.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button className="px-5 py-2.5 rounded-xl bg-[#8B9A6E] hover:bg-[#78875C] text-white text-xs font-semibold shadow-2xs transition-all cursor-pointer">
              Mark as Safe
            </button>
            <button className="px-5 py-2.5 rounded-xl bg-[#DC2626] hover:bg-[#B91C1C] text-white text-xs font-semibold shadow-2xs transition-all cursor-pointer">
              Confirm Fraud &amp; Block
            </button>
            <button className="px-5 py-2.5 rounded-xl bg-[#EAE2D6] text-[#555E4E] hover:bg-[#DDD4C5] text-xs font-semibold transition-all cursor-pointer">
              Request Verification
            </button>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
