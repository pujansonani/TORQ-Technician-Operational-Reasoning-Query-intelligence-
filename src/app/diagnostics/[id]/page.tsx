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
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
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
      <div className="space-y-8">
        
        {/* HEADER BAR: SESSION METADATA & ACTIONS */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-surface-border pb-4">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-mono font-bold text-paccar-blue uppercase tracking-wider">
                SESSION {activeSession.id}
              </span>
              <span className="text-industrial-caption">•</span>
              <Badge variant={activeSession.status === "Root-Cause-Confirmed" ? "success" : "paccar"} size="sm">
                {activeSession.status === "Root-Cause-Confirmed" ? "ROOT CAUSE CONFIRMED" : "ASSESSMENT IN PROGRESS"}
              </Badge>
              <TORQLockBadge verified={true} />
            </div>
            
            <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-industrial-dark">
              Diagnostic Assessment
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-xs text-industrial-steel pt-0.5">
              <span className="flex items-center gap-1.5 font-medium">
                <Truck className="w-3.5 h-3.5 text-paccar-blue" />
                {activeSession.truckModel} ({activeSession.truckId})
              </span>
              <span>•</span>
              <span className="font-mono">{activeSession.engine}</span>
              <span>•</span>
              <span className="font-mono font-semibold text-paccar-red">{activeSession.dtc}</span>
              <span>•</span>
              <span className="text-industrial-muted">{formatTimeAgo(activeSession.updatedAt)}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={resetDemoSession}
              className="text-xs font-medium text-industrial-steel hover:text-paccar-blue px-3 py-2 rounded-input border border-surface-border bg-white flex items-center gap-1.5 transition-colors"
              title="Reset Demo Scenario"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset State</span>
            </button>

            <Link href={`/reports/${activeSession.id}`}>
              <Button variant="secondary" size="md" className="gap-2">
                <FileText className="w-4 h-4" />
                <span>Service Report</span>
              </Button>
            </Link>

            <Link href={`/diagnostics/${activeSession.id}/workflow`}>
              <Button size="md" className="gap-2 font-semibold">
                <Wrench className="w-4 h-4" />
                <span>Guided Workflow</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>

        {/* TOP BANNER: EVIDENCE-BACKED SUMMARY */}
        <div className="p-4 sm:p-5 rounded-card bg-paccar-softblue border border-blue-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-paccar-blue text-white flex items-center justify-center shrink-0 mt-0.5">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-paccar-blue">
                EVIDENCE-BACKED ROOT HYPOTHESIS
              </div>
              <h2 className="text-base sm:text-lg font-semibold text-industrial-dark">
                {leadingCandidate.name} ({leadingCandidate.currentConfidence}% Confidence)
              </h2>
              <p className="text-xs text-industrial-steel mt-0.5">
                {leadingCandidate.description}
              </p>
            </div>
          </div>

          {activeSession.confirmedRootCause ? (
            <div className="sm:text-right shrink-0">
              <Badge variant="success" size="md" className="font-semibold gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                CONFIRMED BY HYDRAULIC TEST
              </Badge>
            </div>
          ) : (
            <Link href={`/diagnostics/${activeSession.id}/workflow`} className="shrink-0">
              <Button size="sm" className="gap-1.5 text-xs font-semibold">
                <span>Run Next Best Test</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Button>
            </Link>
          )}
        </div>

        {/* 2-COLUMN CORE DIAGNOSTIC WORKSPACE */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* LEFT COLUMN: DIAGNOSTIC REASONING & EVIDENCE (7 COLS) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* HERO NEXT BEST TEST CARD */}
            <NextBestTestCard test={activeSession.nextBestTest} sessionId={activeSession.id} />

            {/* WHY TORQ THINKS THIS (EVIDENCE SECTION) */}
            <section className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-semibold text-industrial-dark">
                    Why TORQ Thinks This
                  </h3>
                  <p className="text-xs text-industrial-muted">
                    Cross-referenced evidence citations with relevance rankings
                  </p>
                </div>
                <Badge variant="outline" size="sm" className="font-mono text-[10px]">
                  3 SOURCES SYNTHESIZED
                </Badge>
              </div>

              <div className="space-y-3">
                {activeSession.evidence.map((ev) => (
                  <EvidenceCard key={ev.id} evidence={ev} />
                ))}
              </div>
            </section>

            {/* TEST HISTORY / AUDIT LOG */}
            {activeSession.testHistory.length > 0 && (
              <Card className="p-5 bg-white space-y-3">
                <h3 className="text-sm font-semibold text-industrial-dark">
                  Executed Diagnostic Tests ({activeSession.testHistory.length})
                </h3>
                <div className="space-y-2">
                  {activeSession.testHistory.map((item, idx) => (
                    <div key={idx} className="p-3 rounded-input bg-surface-subtle border border-surface-border flex items-center justify-between text-xs">
                      <div>
                        <span className="font-semibold text-industrial-dark block">{item.testName}</span>
                        <span className="text-industrial-steel font-mono">{item.measuredValue}</span>
                      </div>
                      <Badge variant={item.result === "FAIL" ? "danger" : item.result === "PASS" ? "success" : "warning"}>
                        {item.result}
                      </Badge>
                    </div>
                  ))}
                </div>
              </Card>
            )}

          </div>

          {/* RIGHT COLUMN: CONFIDENCE DISTRIBUTION & REPAIR ESTIMATOR (5 COLS) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* CONFIDENCE DISTRIBUTION CARD */}
            <Card className="p-6 bg-white space-y-4">
              <div className="border-b border-surface-border pb-3 flex items-center justify-between">
                <div>
                  <h3 className="text-base font-semibold text-industrial-dark">
                    Ranked Candidate Causes
                  </h3>
                  <p className="text-xs text-industrial-muted">
                    Live dynamic distribution re-weighted by test results
                  </p>
                </div>
                <span className="text-xs font-mono font-semibold text-paccar-blue">
                  {activeSession.candidates.length} CANDIDATES
                </span>
              </div>

              <div className="space-y-3">
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

              <div className="pt-2 border-t border-surface-border/60 text-[11px] text-industrial-steel flex items-center justify-between">
                <span>Confidence re-weights instantly upon test submission</span>
                <Link href={`/diagnostics/${activeSession.id}/workflow`} className="text-paccar-blue font-semibold hover:underline">
                  Submit Result &rarr;
                </Link>
              </div>
            </Card>

            {/* REPAIR COST ESTIMATOR */}
            <RepairCostEstimator estimate={activeSession.repairEstimate} />

          </div>

        </div>

      </div>
    </AppShell>
  );
}
