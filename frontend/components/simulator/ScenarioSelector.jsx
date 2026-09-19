"use client";

import { Play } from "lucide-react";
import { useState, useEffect } from "react";
import { fetchSimulatorScenarios } from "../../lib/api";

export default function ScenarioSelector({ selected, onSelect, onRun, isRunning }) {
  const [scenarios, setScenarios] = useState([]);

  useEffect(() => {
    fetchSimulatorScenarios().then((data) => {
      setScenarios(data);
      if (!selected && data.length > 0) {
        onSelect(data[0]);
      }
    });
  }, []);

  return (
    <div className="bg-[#FAF7F2] border border-[#EAE2D6] rounded-2xl p-6 shadow-2xs space-y-4">
      <div>
        <h3 className="font-editorial text-xl font-bold text-[#2C3228]">
          Select Scenario
        </h3>
        <p className="text-xs text-[#6B7265] mt-0.5">
          Choose a scenario to simulate transaction risk response.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {scenarios.map((sc) => {
          const isSelected = selected?.id === sc.id;
          return (
            <button
              key={sc.id}
              onClick={() => onSelect(sc)}
              className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? "bg-[#8B9A6E] text-white border-[#8B9A6E] shadow-2xs"
                  : "bg-[#F4EFEA] text-[#2C3228] border-[#EAE2D6] hover:border-[#8B9A6E]/50"
              }`}
            >
              <span className="text-xs font-bold block">{sc.name}</span>
              <span
                className={`text-[10px] font-medium mt-2 inline-block px-1.5 py-0.5 rounded ${
                  isSelected
                    ? "bg-white/20 text-white"
                    : "bg-[#EAE2D6] text-[#555E4E]"
                }`}
              >
                Risk: {sc.risk}
              </span>
            </button>
          );
        })}
      </div>

      <div className="pt-2 flex items-center gap-3">
        <button
          onClick={onRun}
          disabled={isRunning || !selected}
          className="px-6 py-3 rounded-xl bg-[#8B9A6E] hover:bg-[#78875C] text-white font-semibold text-xs transition-all shadow-xs flex items-center gap-2 cursor-pointer disabled:opacity-60"
        >
          <Play className="w-4 h-4 fill-white" />
          <span>{isRunning ? "Evaluating..." : "Test Scenario"}</span>
        </button>
      </div>
    </div>
  );
}
