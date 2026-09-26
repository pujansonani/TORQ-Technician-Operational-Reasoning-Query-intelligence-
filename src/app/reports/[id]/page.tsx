"use client";

import React from "react";
import Link from "next/link";
import { 
  Printer, 
  Download, 
  ArrowLeft, 
  CheckCircle2, 
  ShieldCheck, 
  Truck, 
  Wrench, 
  FileText,
  Clock,
  Sparkles
} from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { TORQLockBadge } from "@/components/diagnostic/TORQLockBadge";
import { useTorqStore } from "@/lib/store";
import { formatCurrencyINR } from "@/lib/utils";

export default function DiagnosticReportPage({ params }: { params: { id: string } }) {
  const { activeSession } = useTorqStore();

  const handlePrint = () => {
    window.print();
  };

  const handleExportPDF = () => {
    window.print();
  };

  const partsTotal = activeSession.repairEstimate.parts.reduce((sum, p) => sum + p.costINR, 0);
  const laborTotal = activeSession.repairEstimate.laborHours * activeSession.repairEstimate.laborRateINR;
  const grandTotal = partsTotal + laborTotal + activeSession.repairEstimate.consumablesINR;

  return (
    <AppShell>
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* ACTION BAR (Hidden in print) - Apple HIG Pill Controls */}
        <div className="flex items-center justify-between no-print pb-4 border-b border-black/[0.06]">
          <Link href={`/diagnostics/${activeSession.id}`}>
            <button
              type="button"
              className="inline-flex items-center gap-2 text-xs font-bold text-[#4B5563] hover:text-[#111827] px-4 py-2 rounded-full border border-black/[0.1] bg-white hover:bg-gray-50 transition-all shadow-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Assessment</span>
            </button>
          </Link>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-2 text-xs font-bold text-[#111827] px-5 py-2.5 rounded-full border border-black/[0.1] bg-white hover:bg-gray-50 transition-all shadow-sm"
            >
              <Printer className="w-4 h-4 text-[#E5402C]" />
              <span>Print Report</span>
            </button>
            <button
              type="button"
              onClick={handleExportPDF}
              className="inline-flex items-center gap-2 text-xs font-bold text-white px-6 py-2.5 rounded-full bg-[#E5402C] hover:bg-[#CF3722] transition-all shadow-[0_4px_16px_rgba(229,64,44,0.25)]"
            >
              <Download className="w-4 h-4" />
              <span>Export PDF</span>
            </button>
          </div>
        </div>

        {/* PRINTABLE SERVICE DOCUMENT CONTAINER - APPLE HIG CARDS */}
        <div className="bg-white rounded-[24px] border border-black/[0.08] p-8 sm:p-12 shadow-[0_4px_24px_rgba(0,0,0,0.04)] space-y-8 text-[#111827]">
          
          {/* REPORT HEADER */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 border-b-2 border-[#111827] pb-6">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#E5402C] text-white flex items-center justify-center font-bold text-lg">
                  T
                </div>
                <span className="text-2xl font-extrabold tracking-tight text-[#111827]">
                  TORQ
                </span>
                <span className="text-xs uppercase font-extrabold text-[#E5402C] px-2.5 py-0.5 rounded-full bg-red-50 border border-[#F6C9BE]">
                  PACCAR COPILOT
                </span>
              </div>
              <h1 className="text-xl font-extrabold text-[#111827] tracking-tight">
                Vehicle Diagnostic & Service Audit Report
              </h1>
              <p className="text-xs text-[#6B7280]">
                Official Evidence-Based Diagnostic Record • Authorized Workshop Copy
              </p>
            </div>

            <div className="text-left sm:text-right space-y-1 text-xs">
              <div>
                <span className="text-[#6B7280]">Session ID: </span>
                <span className="font-mono font-bold text-[#111827]">{activeSession.id}</span>
              </div>
              <div>
                <span className="text-[#6B7280]">Audit Date: </span>
                <span className="font-mono">{new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span>
              </div>
              <div>
                <span className="text-[#6B7280]">Technician: </span>
                <span className="font-bold text-[#111827]">Master Tech ID #TK-849</span>
              </div>
              <div className="pt-1.5">
                <TORQLockBadge verified={true} specCode="MX-FL-22" />
              </div>
            </div>
          </div>

          {/* VEHICLE & TELEMETRY IDENTIFICATION */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 rounded-[18px] bg-[#FAFBFB] border border-black/[0.06] text-xs">
            <div>
              <span className="text-[#6B7280] uppercase font-bold text-[10px] block mb-1">TRUCK UNIT</span>
              <span className="font-extrabold text-[#111827] font-mono text-sm block">{activeSession.truckId}</span>
              <span className="text-[#4B5563] block truncate">{activeSession.truckModel}</span>
            </div>
            <div>
              <span className="text-[#6B7280] uppercase font-bold text-[10px] block mb-1">POWERTRAIN</span>
              <span className="font-bold text-[#111827] block">{activeSession.engine}</span>
              <span className="text-[#4B5563] block">{activeSession.mileage.toLocaleString()} mi</span>
            </div>
            <div>
              <span className="text-[#6B7280] uppercase font-bold text-[10px] block mb-1">ACTIVE DTC</span>
              <span className="font-bold text-[#E5402C] font-mono text-sm block">{activeSession.dtc}</span>
              <span className="text-[#4B5563] block truncate">SPN {activeSession.spn} / FMI {activeSession.fmi}</span>
            </div>
            <div>
              <span className="text-[#6B7280] uppercase font-bold text-[10px] block mb-1">DIAGNOSTIC STATUS</span>
              <span className="font-bold text-emerald-700 block text-sm">
                {activeSession.status === "Root-Cause-Confirmed" ? "CONFIRMED" : "ASSESSED"}
              </span>
              <span className="text-emerald-600 block">100% Verified</span>
            </div>
          </div>

          {/* REPORTED SYMPTOMS & OBSERVATION */}
          <div className="space-y-2.5">
            <h2 className="text-xs uppercase font-extrabold tracking-wider text-[#6B7280]">
              1. REPORTED SYMPTOMS & FIELD OBSERVATIONS
            </h2>
            <div className="p-5 rounded-[16px] bg-[#FAFBFB] border border-black/[0.06] text-xs leading-relaxed text-[#111827] italic font-medium">
              &ldquo;{activeSession.symptomText}&rdquo;
            </div>
          </div>

          {/* EVIDENCE REVIEWED */}
          <div className="space-y-2.5">
            <h2 className="text-xs uppercase font-extrabold tracking-wider text-[#6B7280]">
              2. OEM EVIDENCE & BULLETINS SYNTHESIZED
            </h2>
            <div className="space-y-2.5">
              {activeSession.evidence.map((ev) => (
                <div key={ev.id} className="p-4 rounded-[16px] bg-white border border-black/[0.08] text-xs space-y-1 shadow-sm">
                  <div className="flex items-center justify-between text-[#6B7280]">
                    <span className="font-bold text-[#111827]">{ev.sourceType} • {ev.source}</span>
                    <span className="font-mono font-bold text-[#E5402C]">{ev.relevanceScore}% Correlation</span>
                  </div>
                  <p className="text-[#374151]">&ldquo;{ev.claim}&rdquo;</p>
                </div>
              ))}
            </div>
          </div>

          {/* TESTS PERFORMED & CONFIDENCE PROGRESSION */}
          <div className="space-y-2.5">
            <h2 className="text-xs uppercase font-extrabold tracking-wider text-[#6B7280]">
              3. TESTS EXECUTED & CONFIDENCE EVOLUTION
            </h2>
            <div className="border border-black/[0.08] rounded-[18px] overflow-hidden text-xs">
              <table className="w-full text-left">
                <thead className="bg-[#FAFBFB] border-b border-black/[0.06] text-[#6B7280] font-bold uppercase text-[10px] tracking-wider">
                  <tr>
                    <th className="p-3.5">Test Procedure</th>
                    <th className="p-3.5">Nominal Specification</th>
                    <th className="p-3.5">Observed Value</th>
                    <th className="p-3.5 text-right">Outcome</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/[0.05]">
                  <tr>
                    <td className="p-3.5 font-bold text-[#111827]">
                      Low-Pressure Fuel Delivery Supply Test
                    </td>
                    <td className="p-3.5 font-mono text-[#4B5563]">
                      5.5 – 6.5 bar (80 – 94 PSI)
                    </td>
                    <td className="p-3.5 font-mono text-[#111827] font-bold">
                      {activeSession.testHistory[0]?.measuredValue || "4.1 bar (Below Spec)"}
                    </td>
                    <td className="p-3.5 text-right font-mono font-bold text-[#E5402C]">
                      {activeSession.testHistory[0]?.result || "FAIL"}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* CONFIRMED ROOT CAUSE & REPAIR ACTION */}
          <div className="space-y-2.5">
            <h2 className="text-xs uppercase font-extrabold tracking-wider text-[#6B7280]">
              4. CONFIRMED ROOT CAUSE & ACTION PLAN
            </h2>
            <div className="p-6 rounded-[18px] bg-emerald-50/70 border border-emerald-300 space-y-2">
              <div className="flex items-center gap-2 text-emerald-950 font-extrabold text-sm">
                <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                <span>
                  {activeSession.confirmedRootCause || "Primary Fuel Restriction at Water Separator & Secondary Micron Filter"}
                </span>
              </div>
              <p className="text-xs text-emerald-900/90 leading-relaxed font-medium">
                Replaced primary spin-on filter element and water separator bowl assembly. Purged low-pressure fuel circuit. Verified rail pressure returned to 6.2 bar at 1,800 RPM. Cleared fault code SPN 94 / FMI 1.
              </p>
            </div>
          </div>

          {/* ITEMISED REPAIR ESTIMATE */}
          <div className="space-y-2.5">
            <h2 className="text-xs uppercase font-extrabold tracking-wider text-[#6B7280]">
              5. AUTHORIZED PARTS & LABOR BREAKDOWN
            </h2>
            <div className="border border-black/[0.08] rounded-[18px] overflow-hidden text-xs">
              <table className="w-full text-left">
                <thead className="bg-[#FAFBFB] border-b border-black/[0.06] text-[#6B7280] font-bold uppercase text-[10px] tracking-wider">
                  <tr>
                    <th className="p-3.5">Description</th>
                    <th className="p-3.5">Part # / Hours</th>
                    <th className="p-3.5 text-right">Amount (INR)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/[0.05]">
                  {activeSession.repairEstimate.parts.map((p) => (
                    <tr key={p.partNumber}>
                      <td className="p-3.5 text-[#111827] font-medium">{p.name}</td>
                      <td className="p-3.5 font-mono text-[#6B7280]">{p.partNumber}</td>
                      <td className="p-3.5 text-right font-mono font-bold text-[#111827]">{formatCurrencyINR(p.costINR)}</td>
                    </tr>
                  ))}
                  <tr>
                    <td className="p-3.5 text-[#111827] font-medium">Technician Labor (Diagnostic & Replacement)</td>
                    <td className="p-3.5 font-mono text-[#6B7280]">{activeSession.repairEstimate.laborHours} hrs @ {formatCurrencyINR(activeSession.repairEstimate.laborRateINR)}</td>
                    <td className="p-3.5 text-right font-mono font-bold text-[#111827]">{formatCurrencyINR(laborTotal)}</td>
                  </tr>
                  <tr>
                    <td className="p-3.5 text-[#111827] font-medium">Workshop Consumables & Environmental Disposal</td>
                    <td className="p-3.5 font-mono text-[#6B7280]">Standard Kit</td>
                    <td className="p-3.5 text-right font-mono font-bold text-[#111827]">{formatCurrencyINR(activeSession.repairEstimate.consumablesINR)}</td>
                  </tr>
                  <tr className="bg-[#FAFBFB] font-extrabold text-sm">
                    <td colSpan={2} className="p-4 text-[#111827]">TOTAL ESTIMATED REPAIR</td>
                    <td className="p-4 text-right font-mono text-[#E5402C] text-base">{formatCurrencyINR(grandTotal)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* SIGNATURES & COMPLIANCE FOOTER */}
          <div className="pt-8 border-t border-black/[0.06] grid grid-cols-2 gap-8 text-xs text-[#6B7280]">
            <div className="space-y-6">
              <p className="font-medium">Certified Service Technician Signature:</p>
              <div className="border-b border-dashed border-black/20 w-48" />
              <p className="text-[11px]">Authorized PACCAR Service Center</p>
            </div>
            <div className="space-y-6 text-right">
              <p className="font-medium">Fleet Maintenance Manager Signoff:</p>
              <div className="border-b border-dashed border-black/20 w-48 ml-auto" />
              <p className="text-[11px] font-bold text-[#111827]">TORQ AI Diagnostic Copilot v2.4 Engine</p>
            </div>
          </div>

        </div>

      </div>
    </AppShell>
  );
}
