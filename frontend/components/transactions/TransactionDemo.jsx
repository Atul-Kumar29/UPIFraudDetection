"use client";

import { SlidersHorizontal } from "lucide-react";
import { useState, useEffect } from "react";
import PaymentCard from "./PaymentCard";
import { fetchDemoScenarios, processPaymentDemoPayload } from "../../lib/api";

export default function TransactionDemo() {
  const [scenarios, setScenarios] = useState([]);
  const [selectedScenario, setSelectedScenario] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    fetchDemoScenarios().then((data) => {
      setScenarios(data);
      if (data && data.length > 1) {
        setSelectedScenario(data[1]); // Default to High Amount
      } else if (data && data.length > 0) {
        setSelectedScenario(data[0]);
      }
    });
  }, []);

  const handlePay = async (scenarioId, customData) => {
    setIsProcessing(true);
    const result = await processPaymentDemoPayload(scenarioId, customData);
    setIsProcessing(false);
    return result;
  };

  if (!selectedScenario) {
    return (
      <div className="p-12 text-center text-[#7A8272] font-mono-system text-xs">
        Loading payment demo scenarios from backend...
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12">
      {/* Top Demo Template Chips Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-[#FAF7F2] border border-[#EAE2D6] rounded-2xl p-4 shadow-2xs">
        <div className="flex items-center gap-2 text-xs font-mono-system font-bold text-[#6B7265] uppercase tracking-wider">
          <SlidersHorizontal className="w-4 h-4 text-[#8B9A6E]" />
          <span>TRANSACTION DEMO / TEMPLATES:</span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {scenarios.map((sc) => {
            const isSelected = selectedScenario.id === sc.id;
            return (
              <button
                key={sc.id}
                onClick={() => setSelectedScenario(sc)}
                className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
                  isSelected
                    ? "bg-[#8B9A6E] text-white shadow-xs"
                    : "bg-[#F4EFEA] text-[#555E4E] hover:bg-[#EAE2D6] border border-[#EAE2D6]"
                }`}
              >
                {sc.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Payment Card surface */}
      <PaymentCard
        scenario={selectedScenario}
        onPay={handlePay}
        isProcessing={isProcessing}
      />
    </div>
  );
}
