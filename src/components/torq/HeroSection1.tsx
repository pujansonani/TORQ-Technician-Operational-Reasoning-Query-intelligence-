"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Wrench, Cpu, Gauge, ShieldCheck, FileCheck } from "lucide-react";
import { PillButton } from "./PillButton";

export const HeroSection1: React.FC = () => {
  return (
    <section className="relative w-full bg-[#DCE7DE] py-8 md:py-12 overflow-hidden">
      
      {/* Faint Abstract Line Background */}
      <div className="absolute inset-0 pointer-events-none opacity-30">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <circle cx="10%" cy="20%" r="220" fill="#B7CEC1" opacity="0.3" />
          <circle cx="85%" cy="75%" r="300" fill="#B7CEC1" opacity="0.4" />
          <path
            d="M -100 200 C 300 150, 600 450, 1400 300"
            fill="none"
            stroke="#7C9C8C"
            strokeWidth="1.5"
            strokeDasharray="6 8"
            opacity="0.25"
          />
        </svg>
      </div>

      <div className="relative max-w-[1280px] mx-auto px-4 sm:px-6">
        
        {/* UNFRAMED FULL-BLEED ILLUSTRATION CONTAINER (Soft 20px radius, no nested browser frame) */}
        <div className="relative w-full rounded-[20px] overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.06)]">
          
          {/* MAIN ISOMETRIC DIAGNOSTIC BAY VISUAL */}
          <div className="relative w-full h-[480px] sm:h-[600px] lg:h-[700px]">
            <Image
              src="/images/torq_diagnostic_bay_iso.jpg"
              alt="TORQ Heavy Duty Truck Service Bay Diagnostic Isometric View"
              fill
              priority
              className="object-cover object-center"
              sizes="(max-width: 1280px) 100vw, 1280px"
            />

            {/* IN-SCENE HUD / TELEMETRY OVERLAY STRIP (Not a second website header, but a slim dark glass readout) */}
            <div className="absolute top-5 left-5 z-20">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/45 backdrop-blur-md border border-white/10 text-[11px] font-mono text-white/90 shadow-sm">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Bay 01 · J1939 CAN Bus · 250 kbps · Telemetry: Live</span>
              </div>
            </div>

            {/* FLOATING CARD 1: TOP-RIGHT TABULAR DATA READOUT (De-genericized, tabular, monospace, no stock icon) */}
            <div className="hidden md:block absolute top-5 right-5 w-[310px] bg-white/95 backdrop-blur-md rounded-[18px] p-5 shadow-[0_4px_16px_rgba(0,0,0,0.06)] border border-black/[0.06] z-20">
              <div className="border-b border-black/[0.06] pb-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#6E6E6E]">
                    TELEMETRY READOUT
                  </span>
                  <span className="inline-flex items-center gap-1 text-[10px] font-mono text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    ONLINE
                  </span>
                </div>
                <h4 className="text-[15px] font-extrabold text-[#111827] mt-1 tracking-tight">
                  TORQ Diagnostic Engine
                </h4>
              </div>

              {/* Tabular Monospace Metrics */}
              <div className="py-3 space-y-2.5 text-xs font-mono">
                <div className="flex items-center justify-between text-[#4B5563]">
                  <span className="text-[11px] text-[#6E6E6E]">DTC codes indexed</span>
                  <span className="font-bold text-[#111827] tabular-nums">15,000+</span>
                </div>
                <div className="flex items-center justify-between text-[#4B5563] pt-1 border-t border-black/[0.04]">
                  <span className="text-[11px] text-[#6E6E6E]">Confidence avg</span>
                  <span className="font-bold text-emerald-600 tabular-nums">87.4%</span>
                </div>
                <div className="flex items-center justify-between text-[#4B5563] pt-1 border-t border-black/[0.04]">
                  <span className="text-[11px] text-[#6E6E6E]">Avg. time-to-cause</span>
                  <span className="font-bold text-[#111827] tabular-nums">4.2 min</span>
                </div>
                <div className="flex items-center justify-between text-[#4B5563] pt-1 border-t border-black/[0.04]">
                  <span className="text-[11px] text-[#6E6E6E]">Escalation threshold</span>
                  <span className="font-bold text-[#111827] tabular-nums">&lt; 40.0%</span>
                </div>
              </div>

              <div className="pt-2.5 border-t border-black/[0.06] flex justify-between items-center text-xs">
                <a
                  href="#capabilities"
                  className="font-bold text-[#E5402C] hover:text-[#CF3722] flex items-center gap-1 group text-xs"
                >
                  <span>View Bayesian model</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </a>
              </div>
            </div>

            {/* FLOATING CARD 2: BOTTOM-LEFT "Diagnose faster with TORQ" (Product-First, No Duplicate Footer Caption) */}
            <div className="hidden sm:block absolute bottom-5 left-5 max-w-[370px] bg-white/95 backdrop-blur-md rounded-[18px] p-6 shadow-[0_4px_16px_rgba(0,0,0,0.06)] border border-black/[0.06] z-20 space-y-4">
              <div className="space-y-1.5">
                <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[#6B7280]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#E5402C]" />
                  Bayesian Root Cause Reasoning
                </span>
                <h3 className="text-lg font-extrabold tracking-tight text-[#111827] leading-snug">
                  Diagnose faster with TORQ
                </h3>
                <p className="text-xs sm:text-[13px] text-[#4B5563] leading-relaxed font-normal">
                  Inference over DTC codes and driver symptoms, backed by a verified RAG knowledge base. TORQ narrows down root causes and prescribes the Next-Best-Test.
                </p>
              </div>

              {/* Two Pill CTA Buttons */}
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <Link href="/diagnostics/new">
                  <PillButton variant="solid" size="sm">
                    Start a diagnosis
                  </PillButton>
                </Link>
                <a href="#capabilities">
                  <PillButton variant="outline" size="sm">
                    View methodology
                  </PillButton>
                </a>
              </div>

              {/* Functional Diagnostic Line Icons (Consistent 1.5px stroke, no mix-and-match) */}
              <div className="pt-3 border-t border-black/[0.05] flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  {[Wrench, Cpu, Gauge, ShieldCheck, FileCheck].map((Icon, idx) => (
                    <div
                      key={idx}
                      className="w-7 h-7 rounded-lg border border-[#F6C9BE] text-[#E5402C] bg-red-50/50 flex items-center justify-center"
                      title="TORQ Diagnostic Module"
                    >
                      <Icon className="w-3.5 h-3.5 stroke-[1.5]" />
                    </div>
                  ))}
                </div>
                <span className="text-[11px] font-mono text-[#6B7280]">
                  J1939 Verified
                </span>
              </div>
            </div>

          </div>

        </div>

        {/* MOBILE FALLBACK STACKED CARDS */}
        <div className="mt-5 md:hidden space-y-4">
          <div className="bg-white rounded-[18px] p-5 shadow-[0_2px_10px_rgba(0,0,0,0.04)] border border-black/[0.06] space-y-3">
            <h4 className="text-base font-extrabold text-[#111827]">
              TORQ Diagnostic Engine
            </h4>
            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <div className="p-3 bg-[#F8FAFC] rounded-xl border border-black/[0.04]">
                <span className="text-[#6E6E6E] block text-[10px] uppercase">DTC Database</span>
                <span className="font-bold text-[#111827] text-sm mt-0.5 block">15,000+ Codes</span>
              </div>
              <div className="p-3 bg-[#F8FAFC] rounded-xl border border-black/[0.04]">
                <span className="text-[#6E6E6E] block text-[10px] uppercase">Avg Confidence</span>
                <span className="font-bold text-emerald-600 text-sm mt-0.5 block">87.4%</span>
              </div>
            </div>
            <div className="pt-2">
              <Link href="/diagnostics/new" className="w-full block">
                <PillButton variant="solid" size="sm" className="w-full justify-center">
                  Start a diagnosis
                </PillButton>
              </Link>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
