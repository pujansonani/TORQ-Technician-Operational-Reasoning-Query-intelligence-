"use client";

import React from "react";
import { 
  BarChart3, 
  TrendingUp, 
  Clock, 
  CheckCircle2, 
  Truck, 
  AlertTriangle,
  ArrowUpRight,
  Database,
  Sparkles
} from "lucide-react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  CartesianGrid 
} from "recharts";
import { AppShell } from "@/components/layout/AppShell";
import { FLEET_STATISTICS } from "@/lib/mockData";
import { formatCurrencyINR } from "@/lib/utils";

export default function FleetIntelligencePage() {
  return (
    <AppShell>
      <div className="space-y-10">
        
        {/* Header - Apple HIG Typography */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 pb-6 border-b border-black/[0.06]">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-300 font-mono text-[11px] font-bold">
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                DEMO DATA (1,450 TRUCK PACCAR FLEET TELEMETRY)
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#111827]">
              Fleet <span className="italic font-bold text-[#E5402C]">Intelligence</span>
            </h1>
            <p className="text-sm sm:text-base text-[#4B5563] max-w-2xl font-normal leading-relaxed">
              Transform historical repair outcomes into decisive diagnostic evidence across connected Kenworth and Peterbilt units.
            </p>
          </div>
        </div>

        {/* 4 TOP AGGREGATE METRICS - APPLE HIG CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          
          <div className="p-6 bg-white rounded-[20px] border border-black/[0.07] shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)] transition-all duration-300 relative group overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#E5402C] to-[#E5402C]/30 opacity-80" />
            <span className="text-xs font-bold text-[#6B7280] uppercase tracking-wider block mb-2">
              Similar DTC Cases
            </span>
            <span className="text-4xl font-extrabold font-mono text-[#111827] block">
              {FLEET_STATISTICS.similarCasesCount}
            </span>
            <span className="text-xs text-[#6B7280] mt-2 block font-medium">
              Identical SPN 94 fault signatures
            </span>
          </div>

          <div className="p-6 bg-white rounded-[20px] border border-black/[0.07] shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)] transition-all duration-300 relative group overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-emerald-200 opacity-80" />
            <span className="text-xs font-bold text-[#6B7280] uppercase tracking-wider block mb-2">
              Resolution Accuracy
            </span>
            <span className="text-4xl font-extrabold font-mono text-emerald-700 block">
              {FLEET_STATISTICS.resolutionRatePercent}%
            </span>
            <span className="text-xs text-emerald-600 font-bold mt-2 block">
              18 resolved by fuel inspection
            </span>
          </div>

          <div className="p-6 bg-white rounded-[20px] border border-black/[0.07] shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)] transition-all duration-300 relative group overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-blue-200 opacity-80" />
            <span className="text-xs font-bold text-[#6B7280] uppercase tracking-wider block mb-2">
              Average Repair Cost
            </span>
            <span className="text-4xl font-extrabold font-mono text-[#111827] block">
              {formatCurrencyINR(FLEET_STATISTICS.averageRepairCostINR)}
            </span>
            <span className="text-xs text-[#6B7280] mt-2 block font-medium">
              Standard dealer benchmark
            </span>
          </div>

          <div className="p-6 bg-white rounded-[20px] border border-black/[0.07] shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)] transition-all duration-300 relative group overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 to-amber-200 opacity-80" />
            <span className="text-xs font-bold text-[#6B7280] uppercase tracking-wider block mb-2">
              Avg Diagnostic Duration
            </span>
            <span className="text-4xl font-extrabold font-mono text-[#111827] block">
              {FLEET_STATISTICS.averageDiagnosticHours} <span className="text-xl font-normal text-[#6B7280]">hrs</span>
            </span>
            <span className="text-xs text-[#6B7280] mt-2 block font-medium">
              Down from 3.8 hrs baseline
            </span>
          </div>
        </div>

        {/* CHARTS ROW (RECHARTS CLEAN APPLE HIG DATA VIZ) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Chart 1: DTC Code Frequency */}
          <div className="p-7 sm:p-8 bg-white rounded-[24px] border border-black/[0.08] shadow-[0_2px_12px_rgba(0,0,0,0.03)] space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-extrabold tracking-tight text-[#111827]">
                  DTC Recurrence Across Fleet
                </h3>
                <p className="text-xs text-[#6B7280]">
                  Most frequent engine fault codes logged in the last 90 days
                </p>
              </div>
              <span className="inline-flex px-3 py-1 rounded-full text-xs font-mono font-bold bg-red-50 text-[#E5402C] border border-[#F6C9BE]">
                PACCAR MX-13
              </span>
            </div>

            <div className="h-64 w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={FLEET_STATISTICS.dtcDistribution} layout="vertical" margin={{ left: 20, right: 20, top: 10, bottom: 10 }}>
                  <XAxis type="number" hide />
                  <YAxis dataKey="code" type="category" width={90} tick={{ fontSize: 12, fill: "#374151", fontWeight: 600 }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#FFFFFF", borderRadius: "14px", border: "1px solid rgba(0,0,0,0.08)", boxShadow: "0 4px 16px rgba(0,0,0,0.06)", fontSize: "12px" }}
                    formatter={(val: unknown) => [`${Number(val) || 0} cases`, "Frequency"]}
                  />
                  <Bar dataKey="count" fill="#E5402C" radius={[0, 8, 8, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 2: Resolution Time Trend */}
          <div className="p-7 sm:p-8 bg-white rounded-[24px] border border-black/[0.08] shadow-[0_2px_12px_rgba(0,0,0,0.03)] space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-extrabold tracking-tight text-[#111827]">
                  Mean Diagnostic Time Trend
                </h3>
                <p className="text-xs text-[#6B7280]">
                  Hours saved per technician with TORQ guided workflows
                </p>
              </div>
              <span className="text-xs font-mono font-bold text-emerald-700 flex items-center gap-1 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                <TrendingUp className="w-3.5 h-3.5" /> -25% DURATION
              </span>
            </div>

            <div className="h-64 w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={FLEET_STATISTICS.trendData} margin={{ left: 10, right: 10, top: 10, bottom: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                  <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#6B7280" }} />
                  <YAxis domain={[1.5, 4]} tick={{ fontSize: 12, fill: "#6B7280" }} unit="h" />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#FFFFFF", borderRadius: "14px", border: "1px solid rgba(0,0,0,0.08)", boxShadow: "0 4px 16px rgba(0,0,0,0.06)", fontSize: "12px" }}
                    formatter={(val: unknown) => [`${Number(val) || 0} hrs`, "Diagnostic Duration"]}
                  />
                  <Line type="monotone" dataKey="resolvedHours" stroke="#E5402C" strokeWidth={3} dot={{ r: 4, fill: "#E5402C" }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>

        {/* SIMILAR CASES DETAILED AUDIT - APPLE HIG CARDS */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-extrabold tracking-tight text-[#111827]">
                Correlated Historical Case Summaries
              </h3>
              <p className="text-xs text-[#6B7280]">
                Showing 4 most recent similar signatures across service bays
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {[
              {
                truck: "PB-579 #4102",
                engine: "PACCAR MX-13",
                mileage: "138,400 mi",
                rootCause: "Primary fuel filter restriction (> 0.8 bar differential pressure)",
                test: "Fuel Rail Mechanical Pressure Test (FAIL: 4.0 bar)",
                timeToFix: "2.2 hrs",
                cost: "₹5,900",
              },
              {
                truck: "KW-T680 #2819",
                engine: "PACCAR MX-13",
                mileage: "162,100 mi",
                rootCause: "Water separator bowl sediment clogging suction pipe",
                test: "Fuel Rail Mechanical Pressure Test (FAIL: 3.9 bar)",
                timeToFix: "2.5 hrs",
                cost: "₹6,150",
              },
              {
                truck: "KW-W990 #1940",
                engine: "Cummins X15",
                mileage: "98,300 mi",
                rootCause: "Fuel rail sensor signal wiring chafed against chassis bracket",
                test: "Sensor 5V Reference Ground Continuity (FAIL)",
                timeToFix: "3.1 hrs",
                cost: "₹4,200",
              },
              {
                truck: "PB-389 #3310",
                engine: "PACCAR MX-13",
                mileage: "189,500 mi",
                rootCause: "High pressure fuel pump suction control valve stuck partially open",
                test: "Fuel Rail Mechanical Pressure Test (PASS: 6.1 bar) -> Pump return flow (FAIL)",
                timeToFix: "4.5 hrs",
                cost: "₹24,500",
              },
            ].map((c, i) => (
              <div key={i} className="p-6 bg-white rounded-[22px] border border-black/[0.08] shadow-[0_2px_12px_rgba(0,0,0,0.03)] space-y-3.5 hover:shadow-[0_6px_20px_rgba(0,0,0,0.06)] transition-all">
                <div className="flex items-center justify-between border-b border-black/[0.06] pb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center text-[#E5402C]">
                      <Truck className="w-4 h-4" />
                    </div>
                    <span className="font-extrabold text-sm text-[#111827]">{c.truck}</span>
                  </div>
                  <span className="text-xs font-mono text-[#6B7280]">{c.mileage}</span>
                </div>

                <div className="space-y-2 text-xs">
                  <div>
                    <span className="text-[#6B7280] font-bold uppercase tracking-wider block text-[10px]">CONFIRMED RESOLUTION</span>
                    <span className="font-bold text-[#111827] text-sm mt-0.5 block">{c.rootCause}</span>
                  </div>
                  <div>
                    <span className="text-[#6B7280] font-bold uppercase tracking-wider block text-[10px]">DECISIVE TEST PERFORMED</span>
                    <span className="text-[#374151] font-mono text-xs mt-0.5 block">{c.test}</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-black/[0.05] flex items-center justify-between text-xs font-mono text-[#4B5563]">
                  <span>Fix Time: <strong className="text-[#111827]">{c.timeToFix}</strong></span>
                  <span className="font-bold text-[#E5402C] text-sm">{c.cost}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

      </div>
    </AppShell>
  );
}
