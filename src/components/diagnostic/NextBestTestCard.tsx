"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowRight, AlertTriangle, HelpCircle, CheckCircle2, XCircle } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { TORQLockBadge } from "./TORQLockBadge";
import { NextBestTest } from "@/lib/mockData";
import { useTorqStore } from "@/lib/store";

interface NextBestTestCardProps {
  test: NextBestTest;
  sessionId: string;
}

export const NextBestTestCard: React.FC<NextBestTestCardProps> = ({ test, sessionId }) => {
  const [showRationale, setShowRationale] = useState(false);

  return (
    <Card className="p-6 border-l-4 border-l-paccar-blue bg-white relative overflow-hidden" elevated>
      <div className="flex flex-col gap-4">
        
        {/* Header with Step indicator & TORQ-Lock */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-surface-border pb-3">
          <div className="flex items-center gap-2">
            <span className="w-7 h-7 rounded-sm bg-paccar-blue text-white flex items-center justify-center font-mono font-bold text-sm">
              {test.testNumber}
            </span>
            <span className="text-xs uppercase font-bold tracking-widest text-paccar-blue">
              HERO RECOMMENDATION • NEXT BEST TEST
            </span>
          </div>
          <TORQLockBadge verified={test.isTorqLockVerified} specCode="MX-FL-22" />
        </div>

        {/* Title & Core Test */}
        <div>
          <h3 className="text-xl font-semibold text-industrial-dark leading-snug">
            {test.title}
          </h3>
          <p className="mt-2 text-sm text-industrial-steel leading-relaxed">
            {test.procedure}
          </p>
        </div>

        {/* Target Nominal Specs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 bg-surface-subtle rounded-input border border-surface-border">
          <div>
            <span className="text-[11px] uppercase tracking-wider text-industrial-muted font-medium block">
              TARGET METRIC
            </span>
            <span className="text-sm font-semibold text-industrial-dark">
              {test.targetMetric}
            </span>
          </div>
          <div>
            <span className="text-[11px] uppercase tracking-wider text-industrial-muted font-medium block">
              NOMINAL OPERATING SPEC
            </span>
            <span className="text-sm font-mono font-bold text-emerald-700">
              {test.nominalRange}
            </span>
          </div>
        </div>

        {/* Safety Advisory Banner */}
        {test.safetyAdvisory && (
          <div className="flex items-start gap-2.5 p-3 rounded-input bg-amber-50/70 border border-amber-200 text-xs text-amber-900">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong className="font-semibold">Workshop Safety:</strong> {test.safetyAdvisory}
            </p>
          </div>
        )}

        {/* Toggle Rationale */}
        {showRationale && (
          <div className="p-3.5 bg-blue-50/60 rounded-input border border-blue-200 text-xs text-industrial-dark space-y-1">
            <span className="font-semibold text-paccar-blue uppercase tracking-wider text-[10px] block">
              DECISION ENGINE RATIONALE
            </span>
            <p className="leading-relaxed text-industrial-steel">
              {test.rationale}
            </p>
          </div>
        )}

        {/* Action Controls */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <button
            type="button"
            onClick={() => setShowRationale(!showRationale)}
            className="text-xs font-medium text-industrial-steel hover:text-paccar-blue flex items-center gap-1.5 transition-colors"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>{showRationale ? "Hide reasoning" : "Why this test?"}</span>
          </button>

          <Link href={`/diagnostics/${sessionId}/workflow`}>
            <Button size="lg" className="gap-2 font-semibold">
              <span>Execute Guided Test</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>

      </div>
    </Card>
  );
};
