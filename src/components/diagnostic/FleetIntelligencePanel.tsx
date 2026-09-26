"use client";

import React from "react";
import { BarChart3, AlertTriangle, TrendingDown, Clock, ShieldAlert, CheckCircle2, DollarSign } from "lucide-react";
import type { FleetIntelligenceData } from "@/lib/api";

interface FleetIntelligencePanelProps {
  data: FleetIntelligenceData;
  currentCost?: number;
}

export function FleetIntelligencePanel({ data, currentCost }: FleetIntelligencePanelProps) {
  if (!data || data.total_cases === 0) return null;

  // Comparison with current estimate
  let comparisonText = "";
  if (currentCost && data.avg_cost > 0) {
    const diffPct = Math.round(((currentCost - data.avg_cost) / data.avg_cost) * 100);
    if (diffPct <= -1) {
      comparisonText = `${Math.abs(diffPct)}% below historical fleet average ✅`;
    } else if (diffPct >= 1) {
      comparisonText = `${diffPct}% above historical fleet benchmark (requires justification)`;
    } else {
      comparisonText = "Exact match with fleet historical benchmark";
    }
  }

  return (
    <div className="p-6 sm:p-7 bg-white rounded-[24px] border border-black/[0.08] shadow-[0_2px_12px_rgba(0,0,0,0.03)] space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-black/[0.06] pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-600 flex items-center justify-center">
            <BarChart3 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-extrabold tracking-tight text-[#111827] flex items-center gap-2">
              <span>Fleet-Wide Intelligence & Pattern Alert</span>
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-200">
                Intangles Telemetry
              </span>
            </h3>
            <p className="text-xs text-[#6B7280]">
              Aggregated from {data.total_cases} verified repair records across Indian logistics corridors
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-semibold px-3 py-1 rounded-full bg-gray-100 text-[#374151] border border-gray-200">
            {data.period_days}-Day Lookback
          </span>
        </div>
      </div>

      {/* Pattern Alert Box */}
      <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <div className="text-xs font-bold text-amber-900 uppercase tracking-wider">
            Pattern Detection Alert
          </div>
          <p className="text-xs text-amber-800 leading-relaxed font-medium">
            {data.alert_message}
          </p>
        </div>
      </div>

      {/* 3 Metric Pills */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-3.5 rounded-xl bg-gray-50 border border-black/[0.06]">
          <div className="text-[10px] font-mono uppercase text-[#6B7280] font-bold">Avg Repair Turnaround</div>
          <div className="text-xl font-extrabold font-mono text-[#111827] mt-1 flex items-baseline gap-1">
            {data.avg_labor_hours} <span className="text-xs font-normal text-[#6B7280]">hours</span>
          </div>
          <div className="text-[11px] text-emerald-700 mt-0.5 flex items-center gap-1 font-medium">
            <Clock className="w-3 h-3" />
            <span>Dealer SLA Benchmark</span>
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-gray-50 border border-black/[0.06]">
          <div className="text-[10px] font-mono uppercase text-[#6B7280] font-bold">Historical Fleet Avg Cost</div>
          <div className="text-xl font-extrabold font-mono text-[#111827] mt-1">
            ₹{data.avg_cost.toLocaleString()}
          </div>
          {comparisonText && (
            <div className="text-[11px] text-[#4B5563] mt-0.5 font-medium">
              {comparisonText}
            </div>
          )}
        </div>

        <div className="p-3.5 rounded-xl bg-gray-50 border border-black/[0.06]">
          <div className="text-[10px] font-mono uppercase text-[#6B7280] font-bold">Common Wear Cluster</div>
          <div className="text-base font-extrabold font-mono text-[#111827] mt-1">
            {data.common_mileage_range}
          </div>
          <div className="text-[11px] text-[#6B7280] mt-0.5">
            Component fatigue peak window
          </div>
        </div>
      </div>

      {/* Resolution Breakdown Distribution */}
      <div className="space-y-3 pt-1">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-[#111827] uppercase tracking-wider text-[11px]">
            Historical Fleet Resolution Frequency
          </span>
          <span className="text-[#6B7280] font-mono text-[11px]">
            {data.resolution_breakdown.length} resolution pathways recorded
          </span>
        </div>

        <div className="space-y-2.5">
          {data.resolution_breakdown.map((res, i) => (
            <div key={i} className="space-y-1">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="text-[#374151] flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>{res.root_cause}</span>
                  <span className="text-[#6B7280] font-mono text-[11px]">({res.count} cases)</span>
                </span>
                <span className="font-mono text-[#111827]">{res.percentage}%</span>
              </div>
              <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    i === 0 ? "bg-[#E5402C]" : "bg-slate-400"
                  }`}
                  style={{ width: `${res.percentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Fleet TCO & Fuel Penalty Impact */}
      {data.fleet_tco_impact && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-red-50/70 to-orange-50/50 border border-red-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#E5402C] text-white flex items-center justify-center shrink-0 shadow-sm mt-0.5">
              <TrendingDown className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-extrabold uppercase tracking-wider text-[#E5402C]">
                Unrepaired TCO Penalty (Fleet Economic Impact)
              </div>
              <p className="text-xs text-[#374151] mt-0.5 leading-relaxed">
                If unaddressed: ~15% fuel efficiency penalty ={" "}
                <span className="font-bold text-[#111827]">
                  ₹{data.fleet_tco_impact.monthly_fuel_penalty_inr.toLocaleString()}/month loss per truck
                </span>
                . Risk: {data.fleet_tco_impact.unrepaired_risk}.
              </p>
            </div>
          </div>
          <div className="shrink-0 sm:text-right border-t sm:border-t-0 sm:border-l border-red-200/60 pt-2 sm:pt-0 sm:pl-4">
            <div className="text-xs text-[#6B7280]">Payback Period</div>
            <div className="text-xl font-extrabold font-mono text-[#111827]">
              {data.fleet_tco_impact.payback_period_months} <span className="text-xs font-normal text-[#6B7280]">mo</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
