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
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
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
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* ACTION BAR (Hidden in print) */}
        <div className="flex items-center justify-between no-print border-b border-surface-border pb-4">
          <Link href={`/diagnostics/${activeSession.id}`}>
            <button className="flex items-center gap-2 text-xs font-semibold text-industrial-steel hover:text-paccar-blue transition-colors">
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Assessment</span>
            </button>
          </Link>

          <div className="flex items-center gap-3">
            <Button variant="secondary" size="sm" onClick={handlePrint} className="gap-2">
              <Printer className="w-4 h-4" />
              <span>Print Report</span>
            </Button>
            <Button size="sm" onClick={handleExportPDF} className="gap-2 font-semibold">
              <Download className="w-4 h-4" />
              <span>Export PDF</span>
            </Button>
          </div>
        </div>

        {/* PRINTABLE SERVICE DOCUMENT CONTAINER */}
        <div className="bg-white rounded-card border border-surface-border p-8 sm:p-12 shadow-sm space-y-8 text-industrial-dark">
          
          {/* REPORT HEADER */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 border-b-2 border-industrial-dark pb-6">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded bg-paccar-blue text-white flex items-center justify-center font-bold font-mono">
                  T
                </div>
                <span className="text-2xl font-bold tracking-tight text-industrial-dark">
                  TORQ
                </span>
                <span className="text-xs uppercase font-bold text-paccar-blue px-2 py-0.5 rounded bg-paccar-softblue">
                  PACCAR COPILOT
                </span>
              </div>
              <h1 className="text-lg font-semibold text-industrial-steel">
                Vehicle Diagnostic & Service Audit Report
              </h1>
              <p className="text-xs text-industrial-muted">
                Official Evidence-Based Diagnostic Record • Authorized Workshop Copy
              </p>
            </div>

            <div className="text-left sm:text-right space-y-1 text-xs">
              <div>
                <span className="text-industrial-muted">Session ID: </span>
                <span className="font-mono font-bold">{activeSession.id}</span>
              </div>
              <div>
                <span className="text-industrial-muted">Audit Date: </span>
                <span className="font-mono">{new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span>
              </div>
              <div>
                <span className="text-industrial-muted">Technician: </span>
                <span className="font-semibold">Master Tech ID #TK-849</span>
              </div>
              <div className="pt-1">
                <TORQLockBadge verified={true} specCode="MX-FL-22" />
              </div>
            </div>
          </div>

          {/* VEHICLE & TELEMETRY IDENTIFICATION */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-input bg-surface-subtle border border-surface-border text-xs">
            <div>
              <span className="text-industrial-muted uppercase font-medium block">TRUCK UNIT</span>
              <span className="font-semibold text-industrial-dark font-mono text-sm">{activeSession.truckId}</span>
              <span className="text-industrial-steel block truncate">{activeSession.truckModel}</span>
            </div>
            <div>
              <span className="text-industrial-muted uppercase font-medium block">POWERTRAIN</span>
              <span className="font-semibold text-industrial-dark">{activeSession.engine}</span>
              <span className="text-industrial-steel block">{activeSession.mileage.toLocaleString()} mi</span>
            </div>
            <div>
              <span className="text-industrial-muted uppercase font-medium block">ACTIVE DTC</span>
              <span className="font-bold text-paccar-red font-mono text-sm">{activeSession.dtc}</span>
              <span className="text-industrial-steel block truncate">SPN {activeSession.spn} / FMI {activeSession.fmi}</span>
            </div>
            <div>
              <span className="text-industrial-muted uppercase font-medium block">DIAGNOSTIC STATUS</span>
              <span className="font-semibold text-emerald-700 block text-sm">
                {activeSession.status === "Root-Cause-Confirmed" ? "CONFIRMED" : "ASSESSED"}
              </span>
              <span className="text-industrial-steel block">100% Verified</span>
            </div>
          </div>

          {/* REPORTED SYMPTOMS & OBSERVATION */}
          <div className="space-y-2">
            <h2 className="text-xs uppercase font-bold tracking-wider text-industrial-steel">
              1. REPORTED SYMPTOMS & FIELD OBSERVATIONS
            </h2>
            <div className="p-4 rounded-input bg-surface-subtle border border-surface-border text-xs leading-relaxed text-industrial-dark">
              &ldquo;{activeSession.symptomText}&rdquo;
            </div>
          </div>

          {/* EVIDENCE REVIEWED */}
          <div className="space-y-2">
            <h2 className="text-xs uppercase font-bold tracking-wider text-industrial-steel">
              2. OEM EVIDENCE & BULLETINS SYNTHESIZED
            </h2>
            <div className="space-y-2">
              {activeSession.evidence.map((ev) => (
                <div key={ev.id} className="p-3 rounded-input border border-surface-border text-xs space-y-1">
                  <div className="flex items-center justify-between text-industrial-muted">
                    <span className="font-semibold text-industrial-steel">{ev.sourceType} • {ev.source}</span>
                    <span className="font-mono">{ev.relevanceScore}% Correlation</span>
                  </div>
                  <p className="text-industrial-dark">&ldquo;{ev.claim}&rdquo;</p>
                </div>
              ))}
            </div>
          </div>

          {/* TESTS PERFORMED & CONFIDENCE PROGRESSION */}
          <div className="space-y-2">
            <h2 className="text-xs uppercase font-bold tracking-wider text-industrial-steel">
              3. TESTS EXECUTED & CONFIDENCE EVOLUTION
            </h2>
            <div className="border border-surface-border rounded-input overflow-hidden text-xs">
              <table className="w-full text-left">
                <thead className="bg-surface-subtle border-b border-surface-border text-industrial-steel font-semibold">
                  <tr>
                    <th className="p-3">Test Procedure</th>
                    <th className="p-3">Nominal Specification</th>
                    <th className="p-3">Observed Value</th>
                    <th className="p-3 text-right">Outcome</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-border">
                  <tr>
                    <td className="p-3 font-semibold text-industrial-dark">
                      Low-Pressure Fuel Delivery Supply Test
                    </td>
                    <td className="p-3 font-mono text-industrial-steel">
                      5.5 – 6.5 bar (80 – 94 PSI)
                    </td>
                    <td className="p-3 font-mono text-industrial-dark">
                      {activeSession.testHistory[0]?.measuredValue || "4.1 bar (Below Spec)"}
                    </td>
                    <td className="p-3 text-right font-mono font-bold text-paccar-red">
                      {activeSession.testHistory[0]?.result || "FAIL"}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* CONFIRMED ROOT CAUSE & REPAIR ACTION */}
          <div className="space-y-2">
            <h2 className="text-xs uppercase font-bold tracking-wider text-industrial-steel">
              4. CONFIRMED ROOT CAUSE & ACTION PLAN
            </h2>
            <div className="p-5 rounded-input bg-emerald-50/70 border border-emerald-300 space-y-2">
              <div className="flex items-center gap-2 text-emerald-900 font-bold text-sm">
                <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                <span>
                  {activeSession.confirmedRootCause || "Primary Fuel Restriction at Water Separator & Secondary Micron Filter"}
                </span>
              </div>
              <p className="text-xs text-emerald-900/80 leading-relaxed">
                Replaced primary spin-on filter element and water separator bowl assembly. Purged low-pressure fuel circuit. Verified rail pressure returned to 6.2 bar at 1,800 RPM. Cleared fault code SPN 94 / FMI 1.
              </p>
            </div>
          </div>

          {/* ITEMISED REPAIR ESTIMATE */}
          <div className="space-y-2">
            <h2 className="text-xs uppercase font-bold tracking-wider text-industrial-steel">
              5. AUTHORIZED PARTS & LABOR BREAKDOWN
            </h2>
            <div className="border border-surface-border rounded-input overflow-hidden text-xs">
              <table className="w-full text-left">
                <thead className="bg-surface-subtle border-b border-surface-border text-industrial-steel font-semibold">
                  <tr>
                    <th className="p-3">Description</th>
                    <th className="p-3">Part # / Hours</th>
                    <th className="p-3 text-right">Amount (INR)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-border">
                  {activeSession.repairEstimate.parts.map((p) => (
                    <tr key={p.partNumber}>
                      <td className="p-3 text-industrial-dark">{p.name}</td>
                      <td className="p-3 font-mono text-industrial-muted">{p.partNumber}</td>
                      <td className="p-3 text-right font-mono">{formatCurrencyINR(p.costINR)}</td>
                    </tr>
                  ))}
                  <tr>
                    <td className="p-3 text-industrial-dark">Technician Labor (Diagnostic & Replacement)</td>
                    <td className="p-3 font-mono text-industrial-muted">{activeSession.repairEstimate.laborHours} hrs @ {formatCurrencyINR(activeSession.repairEstimate.laborRateINR)}</td>
                    <td className="p-3 text-right font-mono">{formatCurrencyINR(laborTotal)}</td>
                  </tr>
                  <tr>
                    <td className="p-3 text-industrial-dark">Workshop Consumables & Environmental Disposal</td>
                    <td className="p-3 font-mono text-industrial-muted">Standard Kit</td>
                    <td className="p-3 text-right font-mono">{formatCurrencyINR(activeSession.repairEstimate.consumablesINR)}</td>
                  </tr>
                  <tr className="bg-surface-subtle font-bold text-sm">
                    <td colSpan={2} className="p-3 text-industrial-dark">TOTAL ESTIMATED REPAIR</td>
                    <td className="p-3 text-right font-mono text-industrial-dark">{formatCurrencyINR(grandTotal)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* SIGNATURES & COMPLIANCE FOOTER */}
          <div className="pt-8 border-t border-surface-border grid grid-cols-2 gap-8 text-xs text-industrial-muted">
            <div className="space-y-6">
              <p>Certified Service Technician Signature:</p>
              <div className="border-b border-dashed border-industrial-steel/40 w-48" />
              <p className="text-[11px]">Authorized PACCAR Service Center</p>
            </div>
            <div className="space-y-6 text-right">
              <p>Fleet Maintenance Manager Signoff:</p>
              <div className="border-b border-dashed border-industrial-steel/40 w-48 ml-auto" />
              <p className="text-[11px]">TORQ AI Diagnostic Copilot v2.4 Engine</p>
            </div>
          </div>

        </div>

      </div>
    </AppShell>
  );
}
