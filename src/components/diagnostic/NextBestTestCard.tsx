"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowRight, AlertTriangle, HelpCircle, CheckCircle2, XCircle, Sparkles } from "lucide-react";
import { TORQLockBadge } from "./TORQLockBadge";
import { NextBestTest } from "@/lib/mockData";

interface NextBestTestCardProps {
  test: NextBestTest;
  sessionId: string;
}

export const NextBestTestCard: React.FC<NextBestTestCardProps> = ({ test, sessionId }) => {
  const [showRationale, setShowRationale] = useState(false);

  return (
    <div className="p-7 sm:p-8 rounded-[24px] bg-white border border-black/[0.08] shadow-[0_4px_20px_rgba(0,0,0,0.04)] relative overflow-hidden space-y-6">
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#E5402C] via-[#E5402C]/80 to-transparent" />

      {/* Header with Step indicator & TORQ-LOCK */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-black/[0.06] pb-4">
        <div className="flex items-center gap-3">
          <span className="w-8 h-8 rounded-full bg-[#E5402C] text-white flex items-center justify-center font-mono font-bold text-sm shadow-sm">
            {test.testNumber}
          </span>
          <div>
            <div className="text-xs uppercase font-extrabold tracking-wider text-[#E5402C] flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>HERO RECOMMENDATION • NEXT BEST TEST</span>
            </div>
          </div>
        </div>
        <TORQLockBadge verified={test.isTorqLockVerified} specCode="MX-FL-22" />
      </div>

      {/* Title & Core Test */}
      <div className="space-y-2">
        <h3 className="text-2xl font-extrabold tracking-tight text-[#111827] leading-snug">
          {test.title}
        </h3>
        <p className="text-sm font-normal text-[#4B5563] leading-relaxed">
          {test.procedure}
        </p>
      </div>

      {/* Target Nominal Specs - Apple HIG rounded container */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-[18px] bg-[#FAFBFB] border border-black/[0.06]">
        <div>
          <span className="text-[11px] uppercase tracking-wider text-[#6B7280] font-bold block mb-1">
            TARGET METRIC
          </span>
          <span className="text-sm font-bold text-[#111827]">
            {test.targetMetric}
          </span>
        </div>
        <div>
          <span className="text-[11px] uppercase tracking-wider text-[#6B7280] font-bold block mb-1">
            NOMINAL OPERATING SPEC
          </span>
          <span className="text-sm font-mono font-bold text-emerald-700">
            {test.nominalRange}
          </span>
        </div>
      </div>

      {/* Safety Advisory Banner */}
      {test.safetyAdvisory && (
        <div className="flex items-start gap-3 p-4 rounded-[16px] bg-amber-50/80 border border-amber-200/80 text-xs text-amber-900">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong className="font-bold">Workshop Safety:</strong> {test.safetyAdvisory}
          </p>
        </div>
      )}

      {/* Toggle Rationale */}
      {showRationale && (
        <div className="p-4 bg-red-50/40 rounded-[16px] border border-[#F6C9BE] text-xs text-[#111827] space-y-1.5">
          <span className="font-bold text-[#E5402C] uppercase tracking-wider text-[11px] block">
            TORQ DECISION ENGINE RATIONALE
          </span>
          <p className="leading-relaxed text-[#374151] font-medium">
            {test.rationale}
          </p>
        </div>
      )}

      {/* Action Controls - Apple HIG Pill CTA */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
        <button
          type="button"
          onClick={() => setShowRationale(!showRationale)}
          className="text-xs font-bold text-[#6B7280] hover:text-[#E5402C] flex items-center gap-1.5 transition-colors"
        >
          <HelpCircle className="w-4 h-4" />
          <span>{showRationale ? "Hide reasoning" : "Why this test?"}</span>
        </button>

        <Link href={`/diagnostics/${sessionId}/workflow`}>
          <button
            type="button"
            className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-[#E5402C] hover:bg-[#CF3722] text-white text-xs font-bold tracking-tight shadow-[0_4px_16px_rgba(229,64,44,0.25)] hover:shadow-[0_6px_20px_rgba(229,64,44,0.35)] transition-all"
          >
            <span>Execute Guided Test Workflow</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </Link>
      </div>

    </div>
  );
};
