import AppShell from "../../components/layout/AppShell";
import TransactionTable from "../../components/transactions/TransactionTable";
import TransactionDemo from "../../components/transactions/TransactionDemo";
import { fetchTransactions } from "../../lib/api";
import Link from "next/link";
import { SlidersHorizontal, Table } from "lucide-react";

export const metadata = {
  title: "Transactions • UPI Sentinel",
  description: "Real-time UPI transaction monitoring stream and payment simulator.",
};

export default async function TransactionsPage({ searchParams }) {
  const transactions = await fetchTransactions();
  const params = await searchParams;
  const viewMode = params?.view || "demo"; // default to demo view to show Reference 2!

  return (
    <AppShell>
      {/* Header */}
      <div className="flex items-center justify-between gap-4 pb-2">
        <h1 className="text-2xl lg:text-3xl font-bold text-[#2C3228]">
          Transactions
        </h1>

        {/* View mode toggle tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-[#FAF7F2] border border-[#EAE2D6] rounded-xl text-xs shrink-0">
          <Link
            href="/transactions?view=demo"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all ${
              viewMode === "demo"
                ? "bg-[#8B9A6E] text-white shadow-2xs"
                : "text-[#555E4E] hover:text-[#2C3228]"
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Payment Demo</span>
          </Link>
          <Link
            href="/transactions?view=table"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all ${
              viewMode === "table"
                ? "bg-[#8B9A6E] text-white shadow-2xs"
                : "text-[#555E4E] hover:text-[#2C3228]"
            }`}
          >
            <Table className="w-3.5 h-3.5" />
            <span>Monitoring Stream</span>
          </Link>
        </div>
      </div>

      {/* Render View */}
      {viewMode === "demo" ? (
        <TransactionDemo />
      ) : (
        <TransactionTable transactions={transactions} />
      )}
    </AppShell>
  );
}
