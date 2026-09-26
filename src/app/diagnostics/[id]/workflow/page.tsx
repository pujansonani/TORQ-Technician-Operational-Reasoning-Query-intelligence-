"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle2, 
  XCircle, 
  HelpCircle, 
  ShieldCheck, 
  AlertTriangle,
  RotateCcw,
  Sparkles,
  FileText,
  Activity
} from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { ConfidenceBar } from "@/components/diagnostic/ConfidenceBar";
import { TORQLockBadge } from "@/components/diagnostic/TORQLockBadge";
import { useTorqStore } from "@/lib/store";

export default function DiagnosticWorkflowPage({ params }: { params: { id: string } }) {
  const { activeSession, updateTestOutcome, resetDemoSession } = useTorqStore();

  const [activeStep, setActiveStep] = useState<number>(2); // Step 02 is our primary interactive test
  const [measuredPressure, setMeasuredPressure] = useState<string>("4.1");
  const [selectedOutcome, setSelectedOutcome] = useState<"PASS" | "FAIL" | "INCONCLUSIVE">("FAIL");
  const [hasSubmitted, setHasSubmitted] = useState<boolean>(false);

  const handleSubmitResult = (e: React.FormEvent) => {
    e.preventDefault();
    updateTestOutcome(selectedOutcome, `${measuredPressure} bar (Nominal: 5.5 - 6.5 bar)`);
    setHasSubmitted(true);
  };

  const steps = [
    {
      num: "01",
      title: "Visual & Sensor Inspection",
      status: "COMPLETED",
      summary: "Inspect fuel delivery line quick-connects, harness pins, and fuel level. No external leaks detected.",
    },
    {
      num: "02",
      title: "Fuel Pressure & Restriction Test",
      status: hasSubmitted ? "COMPLETED" : "IN PROGRESS",
      summary: "Connect mechanical pressure test gauge to primary filter test port. Measure idle and 1,800 RPM pressure.",
    },
    {
      num: "03",
      title: "Electrical & Rail Sensor Verification",
      status: hasSubmitted && selectedOutcome === "PASS" ? "RECOMMENDED" : "STANDBY",
      summary: "Measure 5V reference supply and signal ground resistance to ECU pin J2-44.",
    },
    {
      num: "04",
      title: "Root Cause Confirmation & Work Order",
      status: hasSubmitted && selectedOutcome === "FAIL" ? "LOCKED" : "PENDING",
      summary: "Issue replacement order for primary fuel filter element and bleed circuit.",
    },
  ];

  return (
    <AppShell>
      <div className="space-y-8">
        
        {/* Navigation Breadcrumb */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-surface-border pb-4">
          <div className="flex items-center gap-3">
            <Link href={`/diagnostics/${activeSession.id}`}>
              <button className="p-2 rounded-input border border-surface-border bg-white hover:bg-surface-subtle transition-colors text-industrial-steel">
                <ArrowLeft className="w-4 h-4" />
              </button>
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-paccar-blue">BRANCHING DIAGNOSTIC WORKFLOW</span>
                <span className="text-industrial-caption">•</span>
                <Badge variant="outline" size="sm">{activeSession.truckId}</Badge>
              </div>
              <h1 className="text-xl sm:text-2xl font-semibold text-industrial-dark">
                Guided Workshop Execution
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                resetDemoSession();
                setHasSubmitted(false);
                setMeasuredPressure("4.1");
                setSelectedOutcome("FAIL");
              }}
              className="text-xs font-medium text-industrial-steel hover:text-paccar-blue px-3 py-2 rounded-input border border-surface-border bg-white flex items-center gap-1.5 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Test State</span>
            </button>

            <Link href={`/reports/${activeSession.id}`}>
              <Button variant="secondary" size="md" className="gap-2">
                <FileText className="w-4 h-4" />
                <span>View Report</span>
              </Button>
            </Link>
          </div>
        </div>

        {/* 2-COLUMN WORKFLOW LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* LEFT: VERTICAL PROGRESS RAIL (4 COLS) */}
          <div className="lg:col-span-4 space-y-4">
            <h3 className="text-xs uppercase font-semibold tracking-wider text-industrial-steel">
              DIAGNOSTIC TEST SEQUENCE
            </h3>

            <div className="space-y-3">
              {steps.map((st, idx) => {
                const isCurrent = activeStep === (idx + 1);
                return (
                  <Card
                    key={st.num}
                    onClick={() => setActiveStep(idx + 1)}
                    className={`p-4 cursor-pointer transition-all ${
                      isCurrent
                        ? "border-paccar-blue ring-2 ring-paccar-blue/15 bg-white"
                        : "hover:border-surface-borderDark bg-surface-subtle"
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="font-mono font-bold text-paccar-blue">STEP {st.num}</span>
                      <Badge
                        variant={
                          st.status === "COMPLETED" || st.status === "LOCKED"
                            ? "success"
                            : st.status === "IN PROGRESS" || st.status === "RECOMMENDED"
                            ? "paccar"
                            : "default"
                        }
                        size="sm"
                      >
                        {st.status}
                      </Badge>
                    </div>
                    <h4 className="text-sm font-semibold text-industrial-dark leading-snug">
                      {st.title}
                    </h4>
                    <p className="text-xs text-industrial-muted mt-1 line-clamp-2">
                      {st.summary}
                    </p>
                  </Card>
                );
              })}
            </div>

            {/* LIVE CONFIDENCE DISTRIBUTION MINI CARD */}
            <Card className="p-5 bg-white space-y-3 border-t-2 border-t-paccar-blue">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-industrial-dark uppercase tracking-wider">
                  LIVE CONFIDENCE DISTRIBUTION
                </span>
                <Activity className="w-3.5 h-3.5 text-paccar-blue" />
              </div>

              <div className="space-y-2">
                {activeSession.candidates.map((cand, idx) => (
                  <ConfidenceBar
                    key={cand.id}
                    label={cand.name.split("(")[0]}
                    confidence={cand.currentConfidence}
                    isLeading={idx === 0}
                  />
                ))}
              </div>

              <div className="text-[11px] text-industrial-muted pt-2 border-t border-surface-border">
                {hasSubmitted
                  ? "✓ Confidence updated based on actual test outcome."
                  : "Submit test results below to observe real-time Bayesian re-weighting."}
              </div>
            </Card>
          </div>

          {/* RIGHT: MAIN TEST EXECUTION PANEL (8 COLS) */}
          <div className="lg:col-span-8 space-y-6">
            
            <Card className="p-6 sm:p-8 bg-white space-y-6" elevated>
              
              {/* Header with Title and Verification */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-surface-border pb-4">
                <div>
                  <span className="text-xs font-mono font-bold text-paccar-blue">
                    STEP 02 OF 04 • MECHANICAL PRESSURE TEST
                  </span>
                  <h2 className="text-2xl font-semibold text-industrial-dark mt-1">
                    Measure Low-Pressure Fuel Delivery Supply
                  </h2>
                </div>
                <TORQLockBadge verified={true} specCode="SPEC-MX-FL-22" />
              </div>

              {/* Instructions & What to Check */}
              <div className="space-y-3">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-industrial-steel">
                  PROCEDURAL INSTRUCTIONS
                </h3>
                <p className="text-sm text-industrial-dark leading-relaxed">
                  Connect pressure test gauge kit (PACCAR Tool #194-2201) to the Schrader valve on the fuel filter module. Bleed any trapped air. Crank engine to normal operating temperature and measure static and dynamic load pressures.
                </p>

                {/* Target Metric Specifications */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-input bg-surface-subtle border border-surface-border">
                  <div>
                    <span className="text-xs font-semibold text-industrial-muted uppercase block">
                      TARGET MEASUREMENT
                    </span>
                    <span className="text-base font-semibold text-industrial-dark">
                      Feed Delivery at 1,800 RPM
                    </span>
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-industrial-muted uppercase block">
                      VERIFIED NOMINAL SPEC
                    </span>
                    <span className="text-base font-mono font-bold text-emerald-700">
                      5.5 – 6.5 bar (80 – 94 PSI)
                    </span>
                  </div>
                </div>

                {/* Safety Warning */}
                <div className="flex items-start gap-2.5 p-3 rounded-input bg-amber-50 border border-amber-200 text-xs text-amber-900">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <p>
                    <strong>Safety Precaution:</strong> Fuel system operates under continuous pressure. Relieve pressure at the test port before disconnecting fitting. Keep clean dry absorbent pads nearby.
                  </p>
                </div>
              </div>

              {/* INTERACTIVE TEST RESULT ENTRY FORM */}
              <form onSubmit={handleSubmitResult} className="space-y-6 pt-4 border-t border-surface-border">
                <div className="space-y-3">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-industrial-steel">
                    RECORD PHYSICAL MEASUREMENT
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                    <div>
                      <label className="block text-xs font-semibold text-industrial-steel uppercase tracking-wider mb-1.5">
                        OBSERVED PRESSURE (BAR)
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        value={measuredPressure}
                        onChange={(e) => setMeasuredPressure(e.target.value)}
                        className="w-full h-11 px-3.5 font-mono text-base bg-surface text-industrial-dark rounded-input border border-surface-border focus:outline-none focus:ring-2 focus:ring-paccar-blue/20 focus:border-paccar-blue"
                        placeholder="e.g. 4.1"
                        required
                      />
                      <span className="text-[11px] text-industrial-muted mt-1 block">
                        4.1 bar indicates excessive restriction (&lt; 4.8 bar minimum)
                      </span>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-industrial-steel uppercase tracking-wider mb-1.5">
                        TEST EVALUATION VERDICT
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        <button
                          type="button"
                          onClick={() => setSelectedOutcome("PASS")}
                          className={`h-11 rounded-input font-semibold text-xs transition-all flex items-center justify-center gap-1.5 border ${
                            selectedOutcome === "PASS"
                              ? "bg-emerald-600 text-white border-emerald-600 shadow"
                              : "bg-surface text-industrial-steel border-surface-border hover:bg-surface-subtle"
                          }`}
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>PASS</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setSelectedOutcome("FAIL")}
                          className={`h-11 rounded-input font-semibold text-xs transition-all flex items-center justify-center gap-1.5 border ${
                            selectedOutcome === "FAIL"
                              ? "bg-paccar-red text-white border-paccar-red shadow"
                              : "bg-surface text-industrial-steel border-surface-border hover:bg-surface-subtle"
                          }`}
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          <span>FAIL</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setSelectedOutcome("INCONCLUSIVE")}
                          className={`h-11 rounded-input font-semibold text-xs transition-all flex items-center justify-center gap-1.5 border ${
                            selectedOutcome === "INCONCLUSIVE"
                              ? "bg-amber-600 text-white border-amber-600 shadow"
                              : "bg-surface text-industrial-steel border-surface-border hover:bg-surface-subtle"
                          }`}
                        >
                          <HelpCircle className="w-3.5 h-3.5" />
                          <span>INCONC.</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <span className="text-xs text-industrial-steel">
                    Submitting recalculates ranked causes and locks diagnostic evidence.
                  </span>

                  <Button type="submit" size="lg" className="px-8 font-semibold shadow">
                    <span>Submit Test Result</span>
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              </form>

              {/* POST-SUBMISSION RESULTS & RECOMMENDATIONS */}
              {hasSubmitted && (
                <div className="p-6 rounded-card bg-surface-subtle border border-surface-border space-y-4 animate-in fade-in duration-300">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-status-success" />
                      <h4 className="text-base font-semibold text-industrial-dark">
                        {selectedOutcome === "FAIL"
                          ? "Root Cause Confirmed: Fuel Starvation"
                          : "Primary Hypothesis Ruled Out: Sensor Electrical Fault Advised"}
                      </h4>
                    </div>
                    <Badge variant={selectedOutcome === "FAIL" ? "danger" : "paccar"} size="md">
                      CONFIDENCE: {selectedOutcome === "FAIL" ? "84%" : "78%"}
                    </Badge>
                  </div>

                  <p className="text-sm text-industrial-steel leading-relaxed">
                    {selectedOutcome === "FAIL"
                      ? "Because measured fuel supply pressure was 4.1 bar (substantially below the 5.5 bar threshold), electronic sensor bias is eliminated. The failure is directly attributed to fuel delivery restriction at the primary water separator and secondary filter cartridge."
                      : "Because measured hydraulic pressure was within nominal tolerances (5.8 bar), fuel delivery restrictions are eliminated. The issue is confirmed as electronic rail sensor calibration drift."}
                  </p>

                  <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-surface-border">
                    <div className="text-xs text-industrial-muted">
                      Ready to generate customer quote or dispatch service ticket
                    </div>

                    <div className="flex items-center gap-2">
                      <Link href={`/diagnostics/${activeSession.id}`}>
                        <Button variant="secondary" size="md">
                          Review Assessment
                        </Button>
                      </Link>
                      <Link href={`/reports/${activeSession.id}`}>
                        <Button size="md" className="gap-2 font-semibold">
                          <FileText className="w-4 h-4" />
                          <span>Generate Diagnostic Report</span>
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              )}

            </Card>

          </div>

        </div>

      </div>
    </AppShell>
  );
}
