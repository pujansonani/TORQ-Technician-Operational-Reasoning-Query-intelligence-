"use client";

import React from "react";
import { formatCurrencyINR } from "@/lib/utils";
import { AlertCircle, Wrench, Package, Clock, Fuel } from "lucide-react";

interface RepairCostEstimatorProps {
  estimate: {
    parts: { name: string; partNumber: string; costINR: number }[];
    laborHours: number;
    laborRateINR: number;
    consumablesINR: number;
    fuelPenaltyImpactINR: number;
  };
}

export const RepairCostEstimator: React.FC<RepairCostEstimatorProps> = ({ estimate }) => {
  const partsSubtotal = estimate.parts.reduce((sum, item) => sum + item.costINR, 0);
  const laborSubtotal = estimate.laborHours * estimate.laborRateINR;
  const estimatedTotal = partsSubtotal + laborSubtotal + estimate.consumablesINR;

  return (
    <div className="p-6 sm:p-7 bg-white rounded-[24px] border border-black/[0.08] shadow-[0_2px_12px_rgba(0,0,0,0.03)] space-y-5">
      <div className="flex items-center justify-between border-b border-black/[0.06] pb-4">
        <div>
          <h3 className="text-lg font-extrabold tracking-tight text-[#111827]">
            Estimated Repair Cost
          </h3>
          <p className="text-xs text-[#6B7280]">
            OEM standard labor times & replacement components
          </p>
        </div>
        <div className="text-right">
          <span className="text-[11px] font-bold text-[#6B7280] uppercase tracking-wider block">
            ESTIMATED TOTAL
          </span>
          <span className="text-2xl font-extrabold font-mono text-[#111827]">
            {formatCurrencyINR(estimatedTotal)}
          </span>
        </div>
      </div>

      {/* Itemized Breakdown Table */}
      <div className="space-y-4 text-sm">
        
        {/* Parts */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-[#374151]">
            <span className="flex items-center gap-1.5">
              <Package className="w-3.5 h-3.5 text-[#E5402C]" />
              PARTS (PACCAR GENUINE)
            </span>
            <span className="font-mono">{formatCurrencyINR(partsSubtotal)}</span>
          </div>
          <div className="pl-5 space-y-1.5">
            {estimate.parts.map((part) => (
              <div key={part.partNumber} className="flex items-center justify-between text-xs text-[#4B5563]">
                <span>
                  {part.name} <span className="font-mono text-[11px] text-[#9CA3AF]">({part.partNumber})</span>
                </span>
                <span className="font-mono font-semibold text-[#111827]">{formatCurrencyINR(part.costINR)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Labor */}
        <div className="space-y-1 border-t border-black/[0.05] pt-3">
          <div className="flex items-center justify-between text-xs font-bold text-[#374151]">
            <span className="flex items-center gap-1.5">
              <Wrench className="w-3.5 h-3.5 text-[#E5402C]" />
              LABOR ({estimate.laborHours} HRS @ {formatCurrencyINR(estimate.laborRateINR)}/HR)
            </span>
            <span className="font-mono">{formatCurrencyINR(laborSubtotal)}</span>
          </div>
        </div>

        {/* Consumables */}
        <div className="flex items-center justify-between text-xs font-bold text-[#374151] border-t border-black/[0.05] pt-3">
          <span className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-[#E5402C]" />
            SHOP SUPPLIES & DISPOSAL
          </span>
          <span className="font-mono">{formatCurrencyINR(estimate.consumablesINR)}</span>
        </div>

        {/* Fuel Economy Penalty Warning */}
        {estimate.fuelPenaltyImpactINR > 0 && (
          <div className="p-3.5 rounded-[16px] bg-red-50/50 border border-[#F6C9BE] text-xs text-[#111827] flex items-start gap-2.5">
            <Fuel className="w-4 h-4 text-[#E5402C] shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-[#E5402C] block">
                Estimated Fuel Penalty if Unresolved:
              </span>
              <span className="text-[#4B5563]">
                Approximately <strong className="text-[#111827]">{formatCurrencyINR(estimate.fuelPenaltyImpactINR)}/month</strong> in fuel burn penalty from low injection pressure.
              </span>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
