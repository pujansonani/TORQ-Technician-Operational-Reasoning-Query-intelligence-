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
  Database
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
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { FLEET_STATISTICS } from "@/lib/mockData";
import { formatCurrencyINR } from "@/lib/utils";

export default function FleetIntelligencePage() {
  return (
    <AppShell>
      <div className="space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-surface-border pb-4">
          <div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" size="sm" className="bg-amber-50 text-amber-800 border-amber-300 font-mono text-[10px]">
                DEMO DATA (1,450 TRUCK PACCAR FLEET TELEMETRY)
              </Badge>
            </div>
            <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-industrial-dark mt-1">
              Fleet Intelligence
            </h1>
            <p className="text-sm text-industrial-steel mt-1">
              Turn previous repairs into diagnostic evidence across Kenworth and Peterbilt units.
            </p>
          </div>
        </div>

        {/* 4 TOP AGGREGATE METRICS */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-5 bg-white space-y-2">
            <span className="text-xs font-semibold text-industrial-steel uppercase tracking-wider block">
              SIMILAR DTC CASES
            </span>
            <span className="text-3xl sm:text-4xl font-mono font-bold text-industrial-dark block">
              {FLEET_STATISTICS.similarCasesCount}
            </span>
            <span className="text-xs text-industrial-muted">
              Identical SPN 94 fault signatures
            </span>
          </Card>

          <Card className="p-5 bg-white space-y-2">
            <span className="text-xs font-semibold text-industrial-steel uppercase tracking-wider block">
              RESOLUTION ACCURACY
            </span>
            <span className="text-3xl sm:text-4xl font-mono font-bold text-emerald-700 block">
              {FLEET_STATISTICS.resolutionRatePercent}%
            </span>
            <span className="text-xs text-emerald-600 font-medium">
              18 resolved by fuel inspection
            </span>
          </Card>

          <Card className="p-5 bg-white space-y-2">
            <span className="text-xs font-semibold text-industrial-steel uppercase tracking-wider block">
              AVERAGE REPAIR COST
            </span>
            <span className="text-3xl sm:text-4xl font-mono font-bold text-industrial-dark block">
              {formatCurrencyINR(FLEET_STATISTICS.averageRepairCostINR)}
            </span>
            <span className="text-xs text-industrial-muted">
              Standard dealer benchmark
            </span>
          </Card>

          <Card className="p-5 bg-white space-y-2">
            <span className="text-xs font-semibold text-industrial-steel uppercase tracking-wider block">
              AVG DIAGNOSTIC DURATION
            </span>
            <span className="text-3xl sm:text-4xl font-mono font-bold text-industrial-dark block">
              {FLEET_STATISTICS.averageDiagnosticHours} <span className="text-base font-normal text-industrial-muted">hrs</span>
            </span>
            <span className="text-xs text-industrial-muted">
              Down from 3.8 hrs baseline
            </span>
          </Card>
        </div>

        {/* CHARTS ROW (RECHARTS CLEAN DATA VIZ) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Chart 1: DTC Code Frequency */}
          <Card className="p-6 bg-white space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-semibold text-industrial-dark">
                  DTC Recurrence Across Fleet
                </h3>
                <p className="text-xs text-industrial-muted">
                  Most frequent engine fault codes logged in the last 90 days
                </p>
              </div>
              <Badge variant="outline" size="sm" className="font-mono text-xs">
                PACCAR MX-13
              </Badge>
            </div>

            <div className="h-64 w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={FLEET_STATISTICS.dtcDistribution} layout="vertical" margin={{ left: 20, right: 20, top: 10, bottom: 10 }}>
                  <XAxis type="number" hide />
                  <YAxis dataKey="code" type="category" width={80} tick={{ fontSize: 12, fill: "#475569" }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#FFFFFF", borderRadius: "8px", border: "1px solid #E4E7EC", fontSize: "12px" }}
                    formatter={(val: unknown) => [`${Number(val) || 0} cases`, "Frequency"]}
                  />
                  <Bar dataKey="count" fill="#005A9C" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Chart 2: Resolution Time Trend */}
          <Card className="p-6 bg-white space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-semibold text-industrial-dark">
                  Mean Diagnostic Time Trend
                </h3>
                <p className="text-xs text-industrial-muted">
                  Hours saved per technician with guided diagnostic workflows
                </p>
              </div>
              <span className="text-xs font-mono font-semibold text-emerald-700 flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5" /> -25% DURATION
              </span>
            </div>

            <div className="h-64 w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={FLEET_STATISTICS.trendData} margin={{ left: 10, right: 10, top: 10, bottom: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                  <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#667085" }} />
                  <YAxis domain={[1.5, 4]} tick={{ fontSize: 12, fill: "#667085" }} unit="h" />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#FFFFFF", borderRadius: "8px", border: "1px solid #E4E7EC", fontSize: "12px" }}
                    formatter={(val: unknown) => [`${Number(val) || 0} hrs`, "Diagnostic Duration"]}
                  />
                  <Line type="monotone" dataKey="resolvedHours" stroke="#005A9C" strokeWidth={3} dot={{ r: 4, fill: "#005A9C" }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>

        </div>

        {/* SIMILAR CASES DETAILED AUDIT */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-semibold text-industrial-dark">
              Correlated Historical Case Summaries
            </h3>
            <span className="text-xs text-industrial-muted">Showing 4 most recent similar signatures</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
              <Card key={i} className="p-5 bg-white space-y-3">
                <div className="flex items-center justify-between border-b border-surface-border pb-2.5">
                  <div className="flex items-center gap-2">
                    <Truck className="w-4 h-4 text-paccar-blue" />
                    <span className="font-semibold text-sm text-industrial-dark">{c.truck}</span>
                  </div>
                  <span className="text-xs font-mono text-industrial-muted">{c.mileage}</span>
                </div>

                <div className="space-y-1.5 text-xs">
                  <div>
                    <span className="text-industrial-muted font-medium block">CONFIRMED RESOLUTION</span>
                    <span className="font-semibold text-industrial-dark">{c.rootCause}</span>
                  </div>
                  <div>
                    <span className="text-industrial-muted font-medium block">DECISIVE TEST PERFORMED</span>
                    <span className="text-industrial-steel font-mono">{c.test}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-surface-border flex items-center justify-between text-xs font-mono text-industrial-steel">
                  <span>Fix Time: {c.timeToFix}</span>
                  <span className="font-bold text-industrial-dark">{c.cost}</span>
                </div>
              </Card>
            ))}
          </div>
        </section>

      </div>
    </AppShell>
  );
}
