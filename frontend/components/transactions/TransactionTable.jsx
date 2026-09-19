"use client";

import Link from "next/link";
import { Search, Filter, CheckCircle2 } from "lucide-react";
import { useState } from "react";

export default function TransactionTable({ transactions }) {
  const [search, setSearch] = useState("");
  const [riskFilter, setRiskFilter] = useState("ALL");

  const filtered = transactions.filter((t) => {
    const matchesSearch =
      t.user.toLowerCase().includes(search.toLowerCase()) ||
      t.id.toLowerCase().includes(search.toLowerCase()) ||
      t.rrn.includes(search) ||
      t.vpa.toLowerCase().includes(search.toLowerCase());
    const matchesRisk = riskFilter === "ALL" || t.riskLevel === riskFilter;
    return matchesSearch && matchesRisk;
  });

  const getRiskBadge = (level) => {
    switch (level) {
      case "CRITICAL":
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-[#FEE2E2] text-[#DC2626] border border-[#FCA5A5]/40">
            Critical
          </span>
        );
      case "HIGH":
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-[#FEF3C7] text-[#D97706] border border-[#FDE68A]/40">
            High Risk
          </span>
        );
      case "MEDIUM":
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-[#FEF9C3] text-[#CA8A04] border border-[#FEF08A]/40">
            Medium Risk
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-[#ECFCCB] text-[#65A30D] border border-[#D9F99D]/40">
            Low Risk
          </span>
        );
    }
  };

  return (
    <div className="bg-[#FAF7F2] border border-[#EAE2D6] rounded-2xl p-6 shadow-2xs space-y-6">
      {/* Search and Filters Header */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8E9688]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by User, Transaction ID, RRN, or VPA..."
            className="w-full pl-9 pr-4 py-2 bg-[#F4EFEA] border border-[#EAE2D6] rounded-xl text-xs text-[#2C3228] placeholder-[#8E9688] focus:outline-none focus:border-[#8B9A6E]"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-[#8E9688]" />
          <span className="text-xs font-mono-system font-semibold text-[#7A8272]">
            RISK:
          </span>
          <select
            value={riskFilter}
            onChange={(e) => setRiskFilter(e.target.value)}
            className="bg-[#F4EFEA] border border-[#EAE2D6] rounded-xl px-3 py-1.5 text-xs text-[#2C3228] font-medium focus:outline-none focus:border-[#8B9A6E]"
          >
            <option value="ALL">All Risk Levels</option>
            <option value="CRITICAL">Critical</option>
            <option value="HIGH">High Risk</option>
            <option value="MEDIUM">Medium Risk</option>
            <option value="LOW">Low Risk</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[#EAE2D6] text-[10px] font-mono-system font-bold text-[#7A8272] uppercase tracking-wider">
              <th className="pb-3 pr-4">ACCOUNT / ID</th>
              <th className="pb-3 px-4">RRN</th>
              <th className="pb-3 px-4">AMOUNT</th>
              <th className="pb-3 px-4">TRIGGER SIGNAL</th>
              <th className="pb-3 px-4">TIMESTAMP</th>
              <th className="pb-3 px-4">RISK LEVEL</th>
              <th className="pb-3 pl-4 text-right">ACTION</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#EAE2D6]/60 text-xs">
            {filtered.map((tx) => (
              <tr key={tx.id} className="hover:bg-[#F4EFEA]/50 transition-colors">
                <td className="py-3.5 pr-4">
                  <p className="font-semibold text-[#2C3228]">{tx.user}</p>
                  <p className="font-mono-system text-[10px] text-[#7A8272]">{tx.id}</p>
                </td>
                <td className="py-3.5 px-4 font-mono-system text-[#6B7265] text-[11px]">
                  {tx.rrn}
                </td>
                <td className="py-3.5 px-4 font-mono-system font-semibold text-[#2C3228]">
                  {tx.amountFormatted}
                </td>
                <td className="py-3.5 px-4 text-[#555E4E] max-w-[200px]">
                  {tx.triggerSignal}
                </td>
                <td className="py-3.5 px-4 font-mono-system text-[11px] text-[#7A8272]">
                  {tx.timestamp}
                </td>
                <td className="py-3.5 px-4">{getRiskBadge(tx.riskLevel)}</td>
                <td className="py-3.5 pl-4 text-right">
                  {tx.status === "Resolved" || tx.status === "Cleared" ? (
                    <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium bg-[#FAF7F2] text-[#8E9688] border border-[#EAE2D6]">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#8E9688]" />
                      Resolved
                    </span>
                  ) : (
                    <Link
                      href={`/investigations?id=${tx.id}`}
                      className="inline-flex items-center px-3.5 py-1.5 rounded-lg text-xs font-medium bg-[#8B9A6E] text-white hover:bg-[#78875C] transition-all shadow-2xs"
                    >
                      Review case
                    </Link>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between text-[11px] font-mono-system text-[#8E9688] pt-2 border-t border-[#EAE2D6]">
        <span>Showing {filtered.length} of {transactions.length} transactions</span>
        <span>Real-time stream active</span>
      </div>
    </div>
  );
}
