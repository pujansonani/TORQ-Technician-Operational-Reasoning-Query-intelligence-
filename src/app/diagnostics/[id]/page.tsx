"use client";

import React from "react";
import Link from "next/link";
import { 
  ArrowRight, 
  Wrench, 
  FileText, 
  RotateCcw, 
  CheckCircle2, 
  Clock, 
  Truck, 
  SlidersHorizontal,
  ChevronRight,
  ShieldCheck,
  Sparkles
} from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { Badge } from "@/components/ui/Badge";
import { ConfidenceBar } from "@/components/diagnostic/ConfidenceBar";
import { NextBestTestCard } from "@/components/diagnostic/NextBestTestCard";
import { EvidenceCard } from "@/components/diagnostic/EvidenceCard";
import { RepairCostEstimator } from "@/components/diagnostic/RepairCostEstimator";
import { TORQLockBadge } from "@/components/diagnostic/TORQLockBadge";
import { useTorqStore } from "@/lib/store";
import { formatTimeAgo } from "@/lib/utils";

export default function DiagnosisResultPage({ params }: { params: { id: string } }) {
  const { activeSession, resetDemoSession } = useTorqStore();

  const leadingCandidate = activeSession.candidates.reduce((prev, current) => 
    (prev.currentConfidence > current.currentConfidence) ? prev : current
  );

  return (
    <AppShell>
      <div className="space-y-10">
        
        {/* HEADER BAR: SESSION METADATA & ACTIONS - APPLE HIG TYPOGRAPHY */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-black/[0.06]">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider bg-gray-100 text-[#111827] border border-gray-200">
                SESSION {activeSession.id}
              </span>
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold tracking-tight border ${
                activeSession.status === "Root-Cause-Confirmed"
                  ? "bg-emerald-50 text-emerald-800 border-emerald-300"
                  : "bg-blue-50 text-blue-800 border-blue-300"
              }`}>
                {activeSession.status === "Root-Cause-Confirmed" ? "ROOT CAUSE CONFIRMED" : "ASSESSMENT IN PROGRESS"}
              </span>
              <TORQLockBadge verified={true} />
            </div>
            
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#111827]">
              Diagnostic <span className="italic font-bold text-[#E5402C]">Assessment</span>
            </h1>

            <div className="flex flex-wrap items-center gap-3 text-xs text-[#4B5563] pt-1 font-medium">
              <span className="flex items-center gap-1.5 font-bold text-[#111827]">
                <Truck className="w-4 h-4 text-[#E5402C]" />
                {activeSession.truckModel} ({activeSession.truckId})
              </span>
              <span>•</span>
              <span className="font-mono">{activeSession.engine}</span>
              <span>•</span>
              <span className="font-mono font-bold text-[#E5402C]">{activeSession.dtc}</span>
              <span>•</span>
              <span className="text-[#6B7280]">{formatTimeAgo(activeSession.updatedAt)}</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={resetDemoSession}
              className="text-xs font-bold text-[#4B5563] hover:text-[#111827] px-4 py-2.5 rounded-full border border-black/[0.1] bg-white hover:bg-gray-50 flex items-center gap-1.5 transition-all shadow-sm"
              title="Reset Demo Scenario"
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
                <span>Service Report</span>
              </button>
            </Link>

            <Link href={`/diagnostics/${activeSession.id}/workflow`}>
              <button
                type="button"
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#E5402C] hover:bg-[#CF3722] text-white text-xs font-bold tracking-tight shadow-[0_4px_16px_rgba(229,64,44,0.25)] transition-all"
              >
                <Wrench className="w-4 h-4" />
                <span>Guided Workflow</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </Link>
          </div>
        </div>

        {/* TOP BANNER: EVIDENCE-BACKED SUMMARY - APPLE HIG CARD */}
        <div className="p-6 rounded-[24px] bg-gradient-to-r from-red-50/60 via-white to-red-50/30 border border-[#F6C9BE] flex flex-col sm:flex-row sm:items-center justify-between gap-5 shadow-[0_2px_12px_rgba(229,64,44,0.06)]">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-[#E5402C] text-white flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-extrabold uppercase tracking-wider text-[#E5402C]">
                EVIDENCE-BACKED ROOT HYPOTHESIS
              </div>
              <h2 className="text-lg sm:text-xl font-extrabold text-[#111827] mt-0.5">
                {leadingCandidate.name} <span className="font-mono text-[#E5402C] italic">({leadingCandidate.currentConfidence}% Confidence)</span>
              </h2>
              <p className="text-xs sm:text-sm text-[#4B5563] mt-1 font-normal max-w-2xl leading-relaxed">
                {leadingCandidate.description}
              </p>
            </div>
          </div>

          {activeSession.confirmedRootCause ? (
            <div className="sm:text-right shrink-0">
              <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-300 text-xs font-bold">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                CONFIRMED BY HYDRAULIC TEST
              </span>
            </div>
          ) : (
            <Link href={`/diagnostics/${activeSession.id}/workflow`} className="shrink-0">
              <button
                type="button"
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-[#111827] hover:bg-black text-white text-xs font-bold transition-all shadow-sm"
              >
                <span>Run Next Best Test</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </Link>
          )}
        </div>

        {/* 2-COLUMN CORE DIAGNOSTIC WORKSPACE */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* LEFT COLUMN: DIAGNOSTIC REASONING & EVIDENCE (7 COLS) */}
          <div className="lg:col-span-7 space-y-8">
            
            {/* HERO NEXT BEST TEST CARD */}
            <NextBestTestCard test={activeSession.nextBestTest} sessionId={activeSession.id} />

            {/* WHY TORQ THINKS THIS (EVIDENCE SECTION) */}
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-extrabold tracking-tight text-[#111827]">
                    Why TORQ Thinks This
                  </h3>
                  <p className="text-xs text-[#6B7280]">
                    Cross-referenced evidence citations with relevance rankings
                  </p>
                </div>
                <span className="inline-flex px-3 py-1 rounded-full text-[11px] font-mono font-bold bg-gray-100 text-[#111827] border border-gray-200">
                  3 SOURCES SYNTHESIZED
                </span>
              </div>

              <div className="space-y-3.5">
                {activeSession.evidence.map((ev) => (
                  <EvidenceCard key={ev.id} evidence={ev} />
                ))}
              </div>
            </section>

            {/* TEST HISTORY / AUDIT LOG */}
            {activeSession.testHistory.length > 0 && (
              <div className="p-6 bg-white rounded-[24px] border border-black/[0.08] shadow-[0_2px_12px_rgba(0,0,0,0.03)] space-y-4">
                <h3 className="text-base font-extrabold tracking-tight text-[#111827]">
                  Executed Diagnostic Tests ({activeSession.testHistory.length})
                </h3>
                <div className="space-y-2.5">
                  {activeSession.testHistory.map((item, idx) => (
                    <div key={idx} className="p-4 rounded-[16px] bg-[#FAFBFB] border border-black/[0.06] flex items-center justify-between text-xs">
                      <div>
                        <span className="font-bold text-[#111827] block text-sm">{item.testName}</span>
                        <span className="text-[#4B5563] font-mono text-xs">{item.measuredValue}</span>
                      </div>
                      <span className={`inline-flex px-3 py-1 rounded-full text-xs font-bold ${
                        item.result === "FAIL"
                          ? "bg-red-50 text-[#E5402C] border border-[#F6C9BE]"
                          : item.result === "PASS"
                          ? "bg-emerald-50 text-emerald-800 border border-emerald-300"
                          : "bg-amber-50 text-amber-800 border border-amber-300"
                      }`}>
                        {item.result}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

          {/* RIGHT COLUMN: CONFIDENCE DISTRIBUTION & REPAIR ESTIMATOR (5 COLS) */}
          <div className="lg:col-span-5 space-y-8">
            
            {/* CONFIDENCE DISTRIBUTION CARD */}
            <div className="p-7 bg-white rounded-[24px] border border-black/[0.08] shadow-[0_2px_12px_rgba(0,0,0,0.03)] space-y-5">
              <div className="border-b border-black/[0.06] pb-4 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-extrabold tracking-tight text-[#111827]">
                    Ranked Candidate Causes
                  </h3>
                  <p className="text-xs text-[#6B7280]">
                    Live Bayesian distribution re-weighted by test results
                  </p>
                </div>
                <span className="text-xs font-mono font-bold text-[#E5402C] uppercase tracking-wider">
                  {activeSession.candidates.length} CANDIDATES
                </span>
              </div>

              <div className="space-y-3.5">
                {activeSession.candidates.map((cand, idx) => (
                  <ConfidenceBar
                    key={cand.id}
                    label={cand.name}
                    confidence={cand.currentConfidence}
                    subsystem={cand.subsystem}
                    isLeading={idx === 0}
                  />
                ))}
              </div>

              <div className="pt-3 border-t border-black/[0.05] text-[11px] text-[#6B7280] flex items-center justify-between">
                <span>Confidence re-weights instantly upon test submission</span>
                <Link href={`/diagnostics/${activeSession.id}/workflow`} className="text-[#E5402C] font-bold hover:underline">
                  Submit Result &rarr;
                </Link>
              </div>
            </div>

            {/* REPAIR COST ESTIMATOR */}
            <RepairCostEstimator estimate={activeSession.repairEstimate} />

          </div>

        </div>

      </div>
    </AppShell>
  );
}
