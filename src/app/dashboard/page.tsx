"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  Activity, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Wrench, 
  Mic, 
  Camera, 
  ArrowRight, 
  ChevronRight,
  Sparkles,
  BarChart2
} from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";
import { RECENT_DIAGNOSTICS_DATA, FLEET_STATISTICS } from "@/lib/mockData";
import { useTorqStore } from "@/lib/store";
import { formatCurrencyINR } from "@/lib/utils";

export default function DashboardPage() {
  const router = useRouter();
  const { activeSession, createNewSession } = useTorqStore();

  // Quick diagnosis state
  const [truckId, setTruckId] = useState("KW-704");
  const [model, setModel] = useState("Kenworth T680 Next Gen");
  const [engine, setEngine] = useState("PACCAR MX-13 455 HP");
  const [symptom, setSymptom] = useState("Engine loses power under load and hesitates during acceleration above 1,400 RPM.");
  const [dtc, setDtc] = useState("SPN 94 / FMI 1");
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAnalyze = (e: React.FormEvent) => {
    e.preventDefault();
    setIsAnalyzing(true);
    setTimeout(() => {
      createNewSession({
        truckId,
        truckModel: model,
        engine,
        symptomText: symptom,
        dtc,
      });
      router.push(`/diagnostics/${activeSession.id}`);
    }, 1200);
  };

  return (
    <AppShell>
      <div className="space-y-8">
        
        {/* Title Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-surface-border pb-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-industrial-dark">
              Good morning, Technician.
            </h1>
            <p className="text-sm text-industrial-steel mt-1">
              Here&apos;s what needs attention today across the PACCAR service bays.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/diagnostics/new">
              <Button size="md" className="gap-2 font-semibold">
                <Wrench className="w-4 h-4" />
                <span>New Diagnosis</span>
              </Button>
            </Link>
          </div>
        </div>

        {/* TOP ROW: 4 METRIC CARDS */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-5 bg-white space-y-2">
            <div className="flex items-center justify-between text-xs text-industrial-steel">
              <span className="font-semibold uppercase tracking-wider">ACTIVE DIAGNOSTICS</span>
              <Activity className="w-4 h-4 text-paccar-blue" />
            </div>
            <div className="text-3xl sm:text-4xl font-semibold font-mono tracking-tight text-industrial-dark">
              04
            </div>
            <div className="text-xs text-industrial-muted">
              2 awaiting test validation
            </div>
          </Card>

          <Card className="p-5 bg-white space-y-2">
            <div className="flex items-center justify-between text-xs text-industrial-steel">
              <span className="font-semibold uppercase tracking-wider">RESOLVED TODAY</span>
              <CheckCircle2 className="w-4 h-4 text-status-success" />
            </div>
            <div className="text-3xl sm:text-4xl font-semibold font-mono tracking-tight text-industrial-dark">
              08
            </div>
            <div className="text-xs text-emerald-700 font-medium">
              100% first-time fix rate
            </div>
          </Card>

          <Card className="p-5 bg-white space-y-2">
            <div className="flex items-center justify-between text-xs text-industrial-steel">
              <span className="font-semibold uppercase tracking-wider">AVG DIAGNOSTIC TIME</span>
              <Clock className="w-4 h-4 text-paccar-blue" />
            </div>
            <div className="text-3xl sm:text-4xl font-semibold font-mono tracking-tight text-industrial-dark">
              2.4 <span className="text-base font-normal text-industrial-muted">hrs</span>
            </div>
            <div className="text-xs text-industrial-muted">
              -35% vs conventional manual
            </div>
          </Card>

          <Card className="p-5 bg-white space-y-2">
            <div className="flex items-center justify-between text-xs text-industrial-steel">
              <span className="font-semibold uppercase tracking-wider">FLEET ALERTS</span>
              <AlertTriangle className="w-4 h-4 text-status-warning" />
            </div>
            <div className="text-3xl sm:text-4xl font-semibold font-mono tracking-tight text-amber-700">
              03
            </div>
            <div className="text-xs text-amber-700 font-medium">
              DTC SPN 94 spike observed
            </div>
          </Card>
        </div>

        {/* PRIMARY INTAKE CARD: "START A DIAGNOSIS" */}
        <Card className="p-6 md:p-8 bg-white border-l-4 border-l-paccar-blue" elevated>
          <div className="max-w-4xl space-y-6">
            <div>
              <div className="flex items-center gap-2 text-xs uppercase font-bold tracking-widest text-paccar-blue">
                <Sparkles className="w-4 h-4" />
                <span>QUICK DIAGNOSTIC INTAKE</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-semibold text-industrial-dark mt-1">
                Start a diagnosis
              </h2>
              <p className="text-sm text-industrial-steel mt-1">
                Input the observed vehicle symptoms and fault code to trigger RAG evidence retrieval.
              </p>
            </div>

            <form onSubmit={handleAnalyze} className="space-y-4">
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-industrial-steel uppercase tracking-wider mb-1.5">
                    TRUCK ID / UNIT #
                  </label>
                  <input
                    type="text"
                    value={truckId}
                    onChange={(e) => setTruckId(e.target.value)}
                    className="w-full h-11 px-3.5 bg-surface text-industrial-dark text-sm rounded-input border border-surface-border focus:outline-none focus:ring-2 focus:ring-paccar-blue/20 focus:border-paccar-blue"
                    placeholder="e.g. KW-704"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-industrial-steel uppercase tracking-wider mb-1.5">
                    MODEL
                  </label>
                  <input
                    type="text"
                    value={model}
                    onChange={(e) => setModel(e.target.value)}
                    className="w-full h-11 px-3.5 bg-surface text-industrial-dark text-sm rounded-input border border-surface-border focus:outline-none focus:ring-2 focus:ring-paccar-blue/20 focus:border-paccar-blue"
                    placeholder="e.g. Kenworth T680"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-industrial-steel uppercase tracking-wider mb-1.5">
                    ENGINE & MILEAGE
                  </label>
                  <input
                    type="text"
                    value={engine}
                    onChange={(e) => setEngine(e.target.value)}
                    className="w-full h-11 px-3.5 bg-surface text-industrial-dark text-sm rounded-input border border-surface-border focus:outline-none focus:ring-2 focus:ring-paccar-blue/20 focus:border-paccar-blue"
                    placeholder="e.g. PACCAR MX-13 455 HP"
                    required
                  />
                </div>
              </div>

              {/* Symptom Input with Voice Icon */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold text-industrial-steel uppercase tracking-wider">
                    OBSERVED SYMPTOM
                  </label>
                  <span className="text-[11px] text-industrial-muted flex items-center gap-1">
                    <Mic className="w-3.5 h-3.5 text-paccar-blue" />
                    Voice dictation ready
                  </span>
                </div>
                <div className="relative">
                  <textarea
                    rows={2}
                    value={symptom}
                    onChange={(e) => setSymptom(e.target.value)}
                    className="w-full p-3.5 bg-surface text-industrial-dark text-sm rounded-input border border-surface-border focus:outline-none focus:ring-2 focus:ring-paccar-blue/20 focus:border-paccar-blue pr-12"
                    placeholder="Describe what the technician or driver is experiencing..."
                    required
                  />
                  <button
                    type="button"
                    title="Simulate Voice Input"
                    onClick={() => alert("Voice input activated: Listening to technician notes...")}
                    className="absolute right-3 top-3 p-2 rounded-md hover:bg-surface-muted text-industrial-steel hover:text-paccar-blue transition-colors"
                  >
                    <Mic className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Fault Code with OCR Icon */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-semibold text-industrial-steel uppercase tracking-wider">
                      DTC / FAULT CODE (SPN / FMI)
                    </label>
                    <span className="text-[11px] text-industrial-muted flex items-center gap-1">
                      <Camera className="w-3.5 h-3.5 text-paccar-blue" />
                      OCR scanner ready
                    </span>
                  </div>
                  <div className="relative">
                    <input
                      type="text"
                      value={dtc}
                      onChange={(e) => setDtc(e.target.value)}
                      className="w-full h-11 px-3.5 font-mono bg-surface text-industrial-dark text-sm rounded-input border border-surface-border focus:outline-none focus:ring-2 focus:ring-paccar-blue/20 focus:border-paccar-blue pr-12"
                      placeholder="e.g. SPN 94 / FMI 1"
                      required
                    />
                    <button
                      type="button"
                      title="Simulate Camera OCR Scan"
                      onClick={() => alert("DTC OCR Camera activated: Scanning cluster diagnostic display...")}
                      className="absolute right-3 top-2.5 p-1.5 rounded-md hover:bg-surface-muted text-industrial-steel hover:text-paccar-blue transition-colors"
                    >
                      <Camera className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-end">
                  <Button
                    type="submit"
                    size="lg"
                    isLoading={isAnalyzing}
                    className="w-full sm:w-auto px-8 gap-2 font-semibold shadow"
                  >
                    <span>Analyze</span>
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>

            </form>
          </div>
        </Card>

        {/* RECENT DIAGNOSTICS TABLE */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-industrial-dark">
                Recent Diagnostics
              </h2>
              <p className="text-xs text-industrial-muted">
                Active and logged service sessions in this workshop
              </p>
            </div>
            <Link href="/diagnostics/TRQ-2026-0941" className="text-xs font-semibold text-paccar-blue hover:underline">
              View all sessions &rarr;
            </Link>
          </div>

          <div className="bg-white rounded-card border border-surface-border overflow-hidden shadow-card">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-surface-subtle border-b border-surface-border text-xs uppercase font-semibold text-industrial-steel tracking-wider">
                  <tr>
                    <th className="py-3.5 px-4">Truck</th>
                    <th className="py-3.5 px-4">DTC</th>
                    <th className="py-3.5 px-4">Observed Issue</th>
                    <th className="py-3.5 px-4">Confidence</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4">Updated</th>
                    <th className="py-3.5 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-border">
                  {RECENT_DIAGNOSTICS_DATA.map((row) => (
                    <tr key={row.id} className="hover:bg-surface-subtle/70 transition-colors">
                      <td className="py-3.5 px-4 font-semibold text-industrial-dark">
                        {row.truck}
                      </td>
                      <td className="py-3.5 px-4 font-mono text-xs">
                        <Badge variant="outline" size="sm" className="font-mono">
                          {row.dtc}
                        </Badge>
                      </td>
                      <td className="py-3.5 px-4 text-industrial-steel">
                        {row.issue}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-mono font-semibold text-paccar-blue">
                          {row.confidence}%
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <Badge
                          variant={
                            row.status === "Resolved"
                              ? "success"
                              : row.status === "Root-Cause-Confirmed"
                              ? "paccar"
                              : "warning"
                          }
                          size="sm"
                        >
                          {row.status}
                        </Badge>
                      </td>
                      <td className="py-3.5 px-4 text-xs text-industrial-muted">
                        {row.updated}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <Link href={`/diagnostics/${row.id}`}>
                          <Button variant="ghost" size="sm" className="text-xs text-paccar-blue hover:text-paccar-deep">
                            Resume
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* FLEET INTELLIGENCE PREVIEW (CLEARLY LABELED DEMO DATA) */}
        <section className="p-6 rounded-card bg-surface-subtle border border-surface-border space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <BarChart2 className="w-5 h-5 text-paccar-blue" />
              <h3 className="text-base font-semibold text-industrial-dark">
                Fleet Intelligence Live Correlation
              </h3>
            </div>
            <Badge variant="outline" size="sm" className="bg-amber-50 text-amber-800 border-amber-300 font-mono text-[10px]">
              DEMO DATA (PACCAR 1,450 TRUCK TELEMETRY CLUSTER)
            </Badge>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
            <div className="p-4 rounded-input bg-white border border-surface-border">
              <span className="text-xs uppercase font-semibold text-industrial-steel block">
                SIMILAR CASES IDENTIFIED
              </span>
              <span className="text-2xl font-bold font-mono text-industrial-dark mt-1 block">
                {FLEET_STATISTICS.similarCasesCount} cases
              </span>
              <span className="text-xs text-industrial-muted">
                18 resolved by fuel-system inspection
              </span>
            </div>

            <div className="p-4 rounded-input bg-white border border-surface-border">
              <span className="text-xs uppercase font-semibold text-industrial-steel block">
                FIRST-TIME FIX SUCCESS RATE
              </span>
              <span className="text-2xl font-bold font-mono text-emerald-700 mt-1 block">
                {FLEET_STATISTICS.resolutionRatePercent}%
              </span>
              <span className="text-xs text-emerald-600 font-medium">
                Correlated with Next-Best-Test 01
              </span>
            </div>

            <div className="p-4 rounded-input bg-white border border-surface-border">
              <span className="text-xs uppercase font-semibold text-industrial-steel block">
                AVERAGE REPAIR COST
              </span>
              <span className="text-2xl font-bold font-mono text-industrial-dark mt-1 block">
                {formatCurrencyINR(FLEET_STATISTICS.averageRepairCostINR)}
              </span>
              <span className="text-xs text-industrial-muted">
                Avg shop time: {FLEET_STATISTICS.averageDiagnosticHours} hrs
              </span>
            </div>
          </div>
        </section>

      </div>
    </AppShell>
  );
}
