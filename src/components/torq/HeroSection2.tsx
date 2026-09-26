"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { MessageSquare, HelpCircle, ArrowRight, ShieldCheck, Activity } from "lucide-react";
import { PillButton } from "./PillButton";

export const HeroSection2: React.FC = () => {
  const [showSupportModal, setShowSupportModal] = useState(false);

  return (
    <section className="relative w-full bg-white py-20 lg:py-28 overflow-hidden">
      
      {/* THIN SPARSE RED CURVED LINE-ART DOODLES (Rerouted & placed behind content so it NEVER crosses through stats) */}
      <div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden">
        <svg
          className="w-full h-full"
          viewBox="0 0 1440 700"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Subtle arc rerouted above and around the text/stat region */}
          <path
            d="M 50 120 C 350 40, 650 180, 950 100 C 1180 40, 1340 180, 1500 120"
            stroke="#E5402C"
            strokeWidth="1.2"
            strokeDasharray="4 6"
            opacity="0.16"
          />
          <path
            d="M -40 380 C 220 320, 480 340, 720 280 C 1020 200, 1280 420, 1520 320"
            stroke="#E5402C"
            strokeWidth="1"
            opacity="0.10"
          />
          <circle cx="950" cy="100" r="3.5" fill="#E5402C" opacity="0.25" />
          <circle cx="720" cy="280" r="3.5" fill="#E5402C" opacity="0.25" />
        </svg>
      </div>

      <div className="relative max-w-[1280px] mx-auto px-6">
        
        {/* EDITORIAL SPLIT GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* LEFT SIDE: HEADLINE & ACTIONS (6 COLS) */}
          <div className="lg:col-span-6 space-y-8 z-10">
            
            {/* Eyebrow Label */}
            <div className="inline-flex items-center gap-2 text-[12px] font-medium tracking-[0.08em] uppercase text-[#9A9A9A]">
              <span className="w-2 h-2 rounded-full bg-[#E5402C]" />
              <span>AI DIAGNOSTIC COPILOT · BUILT FOR PACCAR</span>
            </div>

            {/* 3-Line Display Headline - Apple HIG Bold Italic Hierarchy */}
            <h1 className="text-[38px] sm:text-[50px] lg:text-[62px] tracking-[-0.03em] text-[#111827] leading-[1.05]">
              <span className="block font-extrabold">Your fleet&apos;s downtime.</span>
              <span className="block font-bold text-[#4B5563]">Our diagnosis.</span>
              <span className="block font-extrabold italic text-[#E5402C]">Welcome to TORQ.</span>
            </h1>

            {/* Two Outlined Pill Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
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

            {/* 3 Key Diagnostic Stats (Clean background, strictly isolated from decorative curves) */}
            <div className="pt-6 border-t border-[#F6F6F5] grid grid-cols-3 gap-4 text-left relative z-20 bg-white/80 backdrop-blur-xs">
              <div>
                <span className="block text-2xl font-normal text-[#1A1A1A] tracking-tight font-mono">15,000+</span>
                <span className="text-[12px] text-[#6E6E6E] leading-snug block mt-0.5">DTC codes in knowledge base</span>
              </div>
              <div>
                <span className="block text-2xl font-normal text-[#E5402C] tracking-tight font-mono">40%</span>
                <span className="text-[12px] text-[#6E6E6E] leading-snug block mt-0.5">Faster root-cause ID vs. manual</span>
              </div>
              <div>
                <span className="block text-2xl font-normal text-emerald-600 tracking-tight font-mono">87%</span>
                <span className="text-[12px] text-[#6E6E6E] leading-snug block mt-0.5">Avg. diagnostic confidence</span>
              </div>
            </div>

          </div>

          {/* RIGHT SIDE: LARGE TRUCK PHOTO & PACCAR COPILOT COPY (6 COLS) */}
          <div className="lg:col-span-6 relative flex flex-col items-center lg:items-end">
            
            {/* Cutout Truck Photo (Clean studio cutout with soft shadow) */}
            <div className="relative w-full max-w-[560px] h-[300px] sm:h-[380px] lg:h-[420px] transition-transform duration-500 hover:scale-[1.01]">
              <Image
                src="/images/torq_red_truck.jpg"
                alt="TORQ Supported Heavy Duty Commercial Vehicle Fleet"
                fill
                priority
                className="object-contain object-center drop-shadow-[0_24px_32px_rgba(26,26,26,0.14)]"
                sizes="(max-width: 1024px) 100vw, 560px"
              />
            </div>

            {/* Diagnostic Heritage Paragraph Text (Max width ~340px) */}
            <div className="w-full max-w-[340px] mt-4 lg:mt-6 text-left self-start lg:self-end">
              <p className="text-[14px] sm:text-[15px] font-normal text-[#6E6E6E] leading-[1.7]">
                TORQ combines a Bayesian diagnostic engine with retrieval over real repair procedures, so technicians get a ranked, confidence-scored root cause — not a guess — in minutes, not hours.
              </p>
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
