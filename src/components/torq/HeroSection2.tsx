"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { MessageSquare, HelpCircle, ArrowRight, ShieldCheck, Activity } from "lucide-react";
import { PillButton } from "./PillButton";

export const HeroSection2: React.FC = () => {
  const [showSupportModal, setShowSupportModal] = useState(false);

  return (
    <section className="relative w-full bg-white pt-12 sm:pt-16 pb-20 lg:pb-28 overflow-hidden">
      
      {/* THIN SPARSE RED CURVED LINE-ART DOODLES BEHIND TRUCK IMAGE ONLY (Never crossing stats) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <svg
          className="w-full h-full"
          viewBox="0 0 1440 700"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Subtle arcs sweeping strictly in the right half behind the truck */}
          <path
            d="M 680 140 C 880 70, 1140 230, 1420 130"
            stroke="#E5402C"
            strokeWidth="1.2"
            strokeDasharray="4 6"
            opacity="0.18"
          />
          <path
            d="M 740 420 C 960 340, 1200 460, 1460 360"
            stroke="#E5402C"
            strokeWidth="1"
            opacity="0.14"
          />
          <circle cx="1140" cy="230" r="3.5" fill="#E5402C" opacity="0.25" />
        </svg>
      </div>

      <div className="relative max-w-[1280px] mx-auto px-6">
        
        {/* EDITORIAL SPLIT GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* LEFT SIDE: HEADLINE, CTAs, STATS, SUPPORTING PARAGRAPH (6 COLS - ONE UNIFIED VERTICAL FLOW) */}
          <div className="lg:col-span-6 space-y-7 z-10">
            
            {/* Eyebrow Label */}
            <div className="inline-flex items-center gap-2 text-[12px] font-bold tracking-[0.08em] uppercase text-[#6B7280]">
              <span className="w-2 h-2 rounded-full bg-[#E5402C]" />
              <span>AI DIAGNOSTIC COPILOT · BUILT FOR PACCAR</span>
            </div>

            {/* UNIFIED 3-LINE HEADLINE (Calm, single sentence, only "diagnosis" and "TORQ" bolded) */}
            <h1 className="text-[36px] sm:text-[48px] lg:text-[54px] tracking-[-0.03em] text-[#1A1A1A] leading-[1.12] font-normal">
              <span className="block">Your fleet&apos;s downtime.</span>
              <span className="block">Our <strong className="font-bold text-[#1A1A1A]">diagnosis</strong>.</span>
              <span className="block">Welcome to <strong className="font-bold text-[#1A1A1A]">TORQ</strong>.</span>
            </h1>

            {/* Two Outlined Pill Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <Link href="/diagnostics/new">
                <PillButton variant="outline" size="md">
                  Start a diagnosis
                </PillButton>
              </Link>

              <Link href="/diagnostics/TRQ-2026-0941">
                <PillButton variant="outline" size="md">
                  See it in action
                </PillButton>
              </Link>
            </div>

            {/* STATS ROW — Unified baseline alignment, one accent color (87% confidence), no stray lines */}
            <div className="pt-6 border-t border-black/[0.08] grid grid-cols-3 gap-4 text-left">
              <div>
                <span className="block text-2xl font-bold text-[#1A1A1A] tracking-tight font-mono">15,000+</span>
                <span className="text-[12px] text-[#6B7280] leading-snug block mt-1">DTC codes in knowledge base</span>
              </div>
              <div>
                <span className="block text-2xl font-bold text-[#1A1A1A] tracking-tight font-mono">40%</span>
                <span className="text-[12px] text-[#6B7280] leading-snug block mt-1">Faster root-cause ID vs. manual</span>
              </div>
              <div>
                <span className="block text-2xl font-bold text-[#E5402C] tracking-tight font-mono">87%</span>
                <span className="text-[12px] text-[#6B7280] leading-snug block mt-1">Avg. diagnostic confidence</span>
              </div>
            </div>

            {/* CONNECTED SUPPORTING PARAGRAPH (Directly under stats, max-w-[380px], completing the vertical flow) */}
            <div className="pt-2 max-w-[380px]">
              <p className="text-[14px] font-normal text-[#6B7280] leading-[1.65]">
                TORQ combines a Bayesian diagnostic engine with retrieval over real repair procedures, so technicians get a ranked, confidence-scored root cause — not a guess — in minutes, not hours.
              </p>
            </div>

          </div>

          {/* RIGHT SIDE: TRUCK PHOTO ALONE WITH CONTACT SHADOW (NO BOX, NO ORPHANED TEXT) */}
          <div className="lg:col-span-6 relative flex items-center justify-center lg:justify-end">
            <div className="relative w-full max-w-[620px] aspect-[960/660] transition-transform duration-500 hover:scale-[1.01]">
              <Image
                src="/images/torq_red_truck.jpg"
                alt="TORQ Heavy Duty Commercial Vehicle Fleet Diagnostic Copilot"
                fill
                priority
                className="object-contain object-center"
                sizes="(max-width: 1024px) 100vw, 620px"
              />
            </div>
          </div>

        </div>

      </div>

      {/* BOTTOM-RIGHT CORNER: FLOATING WORKSHOP ASSISTANT WIDGET */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col gap-2.5">
        
        {/* Chat / Assistant Button */}
        <button
          type="button"
          onClick={() => setShowSupportModal(!showSupportModal)}
          aria-label="Open TORQ Copilot Assistant"
          className="w-12 h-12 rounded-full bg-white text-[#E5402C] shadow-[0_8px_24px_rgba(26,26,26,0.12)] border border-[#F6C9BE]/60 flex items-center justify-center hover:bg-[#FDF2F0] hover:scale-105 active:scale-95 transition-all"
          title="TORQ Diagnostic Copilot Assistant"
        >
          <Activity className="w-5 h-5 stroke-[1.75]" />
        </button>

        {/* Help Info Button */}
        <button
          type="button"
          onClick={() => alert("Paccar Hackathon Diagnostic Dispatch: Use the New Diagnosis button to trigger live RAG Bayesian inference.")}
          aria-label="Diagnostic Guidelines"
          className="w-12 h-12 rounded-full bg-white text-[#E5402C] shadow-[0_8px_24px_rgba(26,26,26,0.12)] border border-[#F6C9BE]/60 flex items-center justify-center hover:bg-[#FDF2F0] hover:scale-105 active:scale-95 transition-all"
          title="TORQ Diagnostic Help"
        >
          <HelpCircle className="w-5 h-5 stroke-[1.75]" />
        </button>

      </div>

      {/* Floating Copilot Modal */}
      {showSupportModal && (
        <div className="fixed bottom-24 right-6 z-50 w-80 bg-white rounded-[20px] p-5 shadow-[0_20px_50px_rgba(26,26,26,0.18)] border border-[#F6F6F5] animate-in fade-in slide-in-from-bottom-4 duration-200">
          <div className="flex items-center justify-between pb-3 border-b border-[#F6F6F5]">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-sm font-semibold text-[#1A1A1A]">TORQ Live Copilot</span>
            </div>
            <button
              onClick={() => setShowSupportModal(false)}
              className="text-[#9A9A9A] hover:text-[#1A1A1A] text-xs"
            >
              ✕
            </button>
          </div>
          <p className="text-xs text-[#6E6E6E] mt-2.5 leading-relaxed">
            Ready to isolate complex DTC codes on PACCAR MX-13 or Cummins X15 engines?
          </p>
          <div className="mt-3.5 space-y-2">
            <Link href="/diagnostics/new" className="block">
              <PillButton variant="solid" size="sm" className="w-full">
                Start new diagnosis
              </PillButton>
            </Link>
            <Link href="/diagnostics/TRQ-2026-0941/workflow" className="block">
              <PillButton variant="outline" size="sm" className="w-full" showIcon={false}>
                Open guided workflow
              </PillButton>
            </Link>
          </div>
        </div>
      )}

    </section>
  );
};
