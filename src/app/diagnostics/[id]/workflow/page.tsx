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
  Activity,
  Gauge
} from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
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
      <div className="space-y-10">
        
        {/* Navigation Breadcrumb - Apple HIG Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-black/[0.06]">
          <div className="flex items-center gap-3">
            <Link href={`/diagnostics/${activeSession.id}`}>
              <button
                type="button"
                className="w-10 h-10 rounded-full border border-black/[0.1] bg-white hover:bg-gray-50 flex items-center justify-center transition-all text-[#111827] shadow-sm"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#E5402C]">
                  TORQ GUIDED WORKFLOW
                </span>
                <span className="text-[#9CA3AF]">•</span>
                <span className="text-xs font-mono font-bold text-[#111827] bg-gray-100 px-2 py-0.5 rounded-full border border-gray-200">
                  {activeSession.truckId}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#111827] mt-0.5">
                Guided Workshop <span className="italic font-bold text-[#E5402C]">Execution</span>
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => {
                resetDemoSession();
                setHasSubmitted(false);
                setMeasuredPressure("4.1");
                setSelectedOutcome("FAIL");
              }}
              className="text-xs font-bold text-[#4B5563] hover:text-[#111827] px-4 py-2.5 rounded-full border border-black/[0.1] bg-white hover:bg-gray-50 flex items-center gap-1.5 transition-all shadow-sm"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset State</span>
            </button>

            <Link href={`/reports/${activeSession.id}`}>
              <button
                type="button"
                className="text-xs font-bold text-[#111827] px-5 py-2.5 rounded-full border border-black/[0.1] bg-white hover:bg-gray-50 flex items-center gap-2 transition-all shadow-sm"
              >
                <FileText className="w-4 h-4 text-[#E5402C]" />
                <span>View Report</span>
              </button>
            </Link>
          </div>
        </div>

        {/* 2-COLUMN WORKFLOW LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* LEFT: VERTICAL PROGRESS RAIL (4 COLS) */}
          <div className="lg:col-span-4 space-y-5">
            <h3 className="text-xs uppercase font-extrabold tracking-wider text-[#6B7280]">
              DIAGNOSTIC TEST SEQUENCE
            </h3>

            <div className="space-y-3.5">
              {steps.map((st, idx) => {
                const isCurrent = activeStep === (idx + 1);
                return (
                  <div
                    key={st.num}
                    onClick={() => setActiveStep(idx + 1)}
                    className={`p-5 rounded-[20px] cursor-pointer transition-all duration-200 border ${
                      isCurrent
                        ? "border-[#E5402C] ring-2 ring-[#E5402C]/15 bg-white shadow-md"
                        : "hover:border-black/[0.12] bg-[#FAFBFB] border-black/[0.06]"
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs mb-2">
                      <span className="font-mono font-bold text-[#E5402C]">STAGE {st.num}</span>
                      <span
                        className={`inline-flex px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          st.status === "COMPLETED" || st.status === "LOCKED"
                            ? "bg-emerald-50 text-emerald-800 border border-emerald-300"
                            : st.status === "IN PROGRESS" || st.status === "RECOMMENDED"
                            ? "bg-red-50 text-[#E5402C] border border-[#F6C9BE]"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {st.status}
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-[#111827] leading-snug">
                      {st.title}
                    </h4>
                    <p className="text-xs text-[#6B7280] mt-1.5 line-clamp-2">
                      {st.summary}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* LIVE CONFIDENCE DISTRIBUTION MINI CARD */}
            <div className="p-6 bg-white rounded-[24px] border border-black/[0.08] shadow-[0_2px_12px_rgba(0,0,0,0.03)] space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-[#111827] uppercase tracking-wider">
                  LIVE CONFIDENCE DISTRIBUTION
                </span>
                <Activity className="w-4 h-4 text-[#E5402C]" />
              </div>

              <div className="space-y-2.5">
                {activeSession.candidates.map((cand, idx) => (
                  <ConfidenceBar
                    key={cand.id}
                    label={cand.name.split("(")[0]}
                    confidence={cand.currentConfidence}
                    isLeading={idx === 0}
                  />
                ))}
              </div>

              <div className="text-[11px] text-[#6B7280] pt-2 border-t border-black/[0.05] leading-relaxed">
                {hasSubmitted
                  ? "✓ Confidence updated dynamically based on measured pressure outcome."
                  : "Submit test results below to observe real-time Bayesian re-weighting."}
              </div>
            </div>
          </div>

          {/* RIGHT: MAIN TEST EXECUTION PANEL (8 COLS) */}
          <div className="lg:col-span-8 space-y-6">
            
            <div className="p-8 sm:p-10 bg-white rounded-[24px] border border-black/[0.08] shadow-[0_4px_24px_rgba(0,0,0,0.04)] space-y-8">
              
              {/* Header with Title and Verification */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-black/[0.06] pb-5">
                <div>
                  <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#E5402C] uppercase tracking-wider">
                    <Gauge className="w-3.5 h-3.5" />
                    <span>STEP 02 OF 04 • MECHANICAL PRESSURE TEST</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#111827] mt-1.5">
                    Measure Low-Pressure Fuel Delivery Supply
                  </h2>
                </div>
                <TORQLockBadge verified={true} specCode="SPEC-MX-FL-22" />
              </div>

              {/* Instructions & What to Check */}
              <div className="space-y-4">
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#6B7280]">
                  PROCEDURAL INSTRUCTIONS
                </h3>
                <p className="text-sm text-[#374151] leading-relaxed font-normal">
                  Connect pressure test gauge kit (PACCAR Tool #194-2201) to the Schrader valve on the fuel filter module. Bleed any trapped air. Crank engine to normal operating temperature and measure static and dynamic load pressures.
                </p>

                {/* Target Metric Specifications - Apple HIG Container */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-5 rounded-[18px] bg-[#FAFBFB] border border-black/[0.06]">
                  <div>
                    <span className="text-[11px] font-bold text-[#6B7280] uppercase tracking-wider block mb-1">
                      TARGET MEASUREMENT
                    </span>
                    <span className="text-base font-bold text-[#111827]">
                      Feed Delivery at 1,800 RPM
                    </span>
                  </div>
                  <div>
                    <span className="text-[11px] font-bold text-[#6B7280] uppercase tracking-wider block mb-1">
                      TORQ-LOCK VERIFIED NOMINAL SPEC
                    </span>
                    <span className="text-base font-mono font-extrabold text-emerald-700">
                      5.5 – 6.5 bar (80 – 94 PSI)
                    </span>
                  </div>
                </div>

                {/* Safety Warning */}
                <div className="flex items-start gap-3 p-4 rounded-[16px] bg-amber-50/80 border border-amber-200/80 text-xs text-amber-900">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <p className="leading-relaxed">
                    <strong className="font-bold">Safety Precaution:</strong> Fuel system operates under continuous pressure. Relieve pressure at the test port before disconnecting fitting. Keep clean dry absorbent pads nearby.
                  </p>
                </div>
              </div>

              {/* INTERACTIVE TEST RESULT ENTRY FORM */}
              <form onSubmit={handleSubmitResult} className="space-y-6 pt-6 border-t border-black/[0.06]">
                <div className="space-y-4">
                  <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#6B7280]">
                    RECORD PHYSICAL MEASUREMENT
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-start">
                    <div>
                      <label className="block text-xs font-bold text-[#374151] uppercase tracking-wider mb-2">
                        Observed Pressure (bar)
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        value={measuredPressure}
                        onChange={(e) => setMeasuredPressure(e.target.value)}
                        className="w-full h-12 px-4 font-mono font-bold text-base bg-[#FAFBFB] text-[#111827] rounded-xl border border-black/[0.12] focus:outline-none focus:ring-2 focus:ring-[#E5402C]/20 focus:border-[#E5402C] transition-all"
                        placeholder="e.g. 4.1"
                        required
                      />
                      <span className="text-[11px] text-[#6B7280] mt-1.5 block">
                        4.1 bar indicates excessive restriction (&lt; 4.8 bar threshold)
                      </span>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#374151] uppercase tracking-wider mb-2">
                        Test Evaluation Verdict
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        <button
                          type="button"
                          onClick={() => setSelectedOutcome("PASS")}
                          className={`h-12 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-1.5 border ${
                            selectedOutcome === "PASS"
                              ? "bg-emerald-600 text-white border-emerald-600 shadow-sm"
                              : "bg-[#FAFBFB] text-[#4B5563] border-black/[0.1] hover:bg-gray-100"
                          }`}
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>PASS</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setSelectedOutcome("FAIL")}
                          className={`h-12 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-1.5 border ${
                            selectedOutcome === "FAIL"
                              ? "bg-[#E5402C] text-white border-[#E5402C] shadow-sm"
                              : "bg-[#FAFBFB] text-[#4B5563] border-black/[0.1] hover:bg-gray-100"
                          }`}
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          <span>FAIL</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setSelectedOutcome("INCONCLUSIVE")}
                          className={`h-12 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-1.5 border ${
                            selectedOutcome === "INCONCLUSIVE"
                              ? "bg-amber-600 text-white border-amber-600 shadow-sm"
                              : "bg-[#FAFBFB] text-[#4B5563] border-black/[0.1] hover:bg-gray-100"
                          }`}
                        >
                          <HelpCircle className="w-3.5 h-3.5" />
                          <span>INCONC.</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-3">
                  <span className="text-xs text-[#6B7280]">
                    Submitting recalculates ranked causes and locks diagnostic evidence.
                  </span>

                  <button
                    type="submit"
                    className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-[#E5402C] hover:bg-[#CF3722] text-white text-xs font-bold tracking-tight shadow-[0_4px_16px_rgba(229,64,44,0.25)] transition-all"
                  >
                    <span>Submit Test Result</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>

              {/* POST-SUBMISSION RESULTS & RECOMMENDATIONS */}
              {hasSubmitted && (
                <div className="p-7 rounded-[22px] bg-[#FAFBFB] border border-black/[0.08] space-y-4 animate-in fade-in duration-300">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <Sparkles className="w-5 h-5 text-[#E5402C]" />
                      <h4 className="text-base font-extrabold text-[#111827]">
                        {selectedOutcome === "FAIL"
                          ? "Root Cause Confirmed: Fuel Starvation"
                          : "Primary Hypothesis Ruled Out: Sensor Electrical Fault Advised"}
                      </h4>
                    </div>
                    <span className={`inline-flex px-3.5 py-1 rounded-full text-xs font-bold ${
                      selectedOutcome === "FAIL"
                        ? "bg-red-50 text-[#E5402C] border border-[#F6C9BE]"
                        : "bg-blue-50 text-blue-800 border border-blue-300"
                    }`}>
                      CONFIDENCE: {selectedOutcome === "FAIL" ? "84%" : "78%"}
                    </span>
                  </div>

                  <p className="text-sm text-[#4B5563] leading-relaxed">
                    {selectedOutcome === "FAIL"
                      ? "Because measured fuel supply pressure was 4.1 bar (substantially below the 5.5 bar threshold), electronic sensor bias is eliminated. The failure is directly attributed to fuel delivery restriction at the primary water separator and secondary filter cartridge."
                      : "Because measured hydraulic pressure was within nominal tolerances (5.8 bar), fuel delivery restrictions are eliminated. The issue is confirmed as electronic rail sensor calibration drift."}
                  </p>

                  <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-black/[0.06]">
                    <div className="text-xs text-[#6B7280]">
                      Ready to generate customer quote or dispatch service ticket
                    </div>

                    <div className="flex items-center gap-3">
                      <Link href={`/diagnostics/${activeSession.id}`}>
                        <button
                          type="button"
                          className="px-5 py-2.5 rounded-full border border-black/[0.1] bg-white hover:bg-gray-50 text-[#111827] text-xs font-bold transition-all shadow-sm"
                        >
                          Review Assessment
                        </button>
                      </Link>
                      <Link href={`/reports/${activeSession.id}`}>
                        <button
                          type="button"
                          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#E5402C] hover:bg-[#CF3722] text-white text-xs font-bold tracking-tight shadow-[0_4px_16px_rgba(229,64,44,0.25)] transition-all"
                        >
                          <FileText className="w-4 h-4" />
                          <span>Generate Diagnostic Report</span>
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>
              )}

            </div>

          </div>

        </div>

      </div>
    </AppShell>
  );
}
