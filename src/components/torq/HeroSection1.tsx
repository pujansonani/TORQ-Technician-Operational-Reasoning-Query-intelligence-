"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  ArrowRight, 
  Plus, 
  Wrench, 
  Cpu, 
  Gauge, 
  ShieldCheck, 
  FileCheck,
  Activity,
  CheckCircle2,
  SlidersHorizontal,
  Layers
} from "lucide-react";
import { PillButton } from "./PillButton";

export const HeroSection1: React.FC = () => {
  const [activeHotspot, setActiveHotspot] = useState(false);

  return (
    <section className="relative w-full bg-[#DCE7DE] py-12 md:py-16 overflow-hidden">
      
      {/* Faint Abstract Line / Blob Background Decorations */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
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

      <div className="relative max-w-[1280px] mx-auto px-6">
        
        {/* FRAMED ILLUSTRATION CONTAINER */}
        <div className="relative w-full rounded-[16px] overflow-hidden bg-white shadow-[0_20px_60px_rgba(26,26,26,0.08)] border border-white/60">
          
          {/* THIN NAV BAR STRIP ALONG TOP OF ILLUSTRATION (Product Diagnostic Screenshot UI) */}
          <div className="w-full h-11 bg-white/95 backdrop-blur-sm border-b border-[#F6F6F5] px-4 sm:px-6 flex items-center justify-between z-20 relative">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-1.5">
                <div className="w-5 h-5 bg-[#E5402C] rounded-[4px] flex items-center justify-center text-white text-[10px] font-black">
                  T
                </div>
                <span className="font-extrabold text-xs tracking-tight text-[#111827]">
                  TORQ
                </span>
              </div>
              <div className="hidden sm:flex items-center gap-4 text-[11px] font-medium text-[#6E6E6E]">
                <span className="text-[#1A1A1A] font-semibold">Diagnostic Bay 01</span>
                <span>J1939 CAN Bus</span>
                <span>Live Telemetry</span>
                <span>DAVIE4 Bridge</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="hidden md:inline-flex items-center gap-1 text-[11px] text-[#9A9A9A]">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                CAN Link: Active (250 kbps)
              </span>
              <div className="flex items-center gap-1.5">
                <Link href="/dashboard">
                  <button
                    type="button"
                    className="px-2.5 py-1 text-[11px] font-medium text-[#E5402C] border border-[#F6C9BE] rounded-full hover:bg-[#FDF2F0] transition-colors"
                  >
                    Session Tracking
                  </button>
                </Link>
                <Link href="/diagnostics/TRQ-2026-0941">
                  <button
                    type="button"
                    className="px-2.5 py-1 text-[11px] font-medium text-white bg-[#E5402C] rounded-full hover:bg-[#CF3722] transition-colors flex items-center gap-1"
                  >
                    <Activity className="w-3 h-3" />
                    <span>Live Diagnosis</span>
                  </button>
                </Link>
              </div>
            </div>
          </div>

          {/* MAIN ISOMETRIC DIAGNOSTIC BAY VISUAL */}
          <div className="relative w-full h-[460px] sm:h-[580px] lg:h-[680px]">
            <Image
              src="/images/torq_diagnostic_bay_iso.jpg"
              alt="TORQ Heavy Duty Truck Service Bay Diagnostic Isometric View"
              fill
              priority
              className="object-cover object-center"
              sizes="(max-width: 1280px) 100vw, 1280px"
            />

            {/* FLOATING CARD 1: TOP-RIGHT "TORQ Diagnostic Engine" */}
            <div className="hidden md:block absolute top-6 right-6 w-[320px] bg-white/95 backdrop-blur-md rounded-[16px] p-5 shadow-[0_12px_36px_rgba(26,26,26,0.12)] border border-white/80 z-20">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#FAF4F2] text-[#E5402C] flex items-center justify-center shrink-0 border border-[#F6C9BE]/50">
                  <Activity className="w-4 h-4" />
                </div>
                <div className="space-y-0.5">
                  <h4 className="text-[14px] font-semibold text-[#1A1A1A] leading-tight">
                    TORQ Diagnostic Engine
                  </h4>
                  <p className="text-[12px] text-[#6E6E6E] leading-snug">
                    Live inference — Paccar Fleet Network
                  </p>
                </div>
              </div>

              {/* Stats List (4 Rows) */}
              <div className="mt-4 pt-3 border-t border-[#F6F6F5] space-y-2 text-[12px]">
                <div className="flex items-center justify-between">
                  <span className="text-[#6E6E6E]">DTC codes indexed</span>
                  <span className="font-semibold text-[#1A1A1A] font-mono">15,000+</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#6E6E6E]">Diagnosis confidence avg</span>
                  <span className="font-semibold text-emerald-600 font-mono">87%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#6E6E6E]">Avg. time-to-cause</span>
                  <span className="font-semibold text-[#1A1A1A] font-mono">4.2 min</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#6E6E6E]">Escalation rate</span>
                  <span className="font-semibold text-emerald-600 font-mono">&lt; 12%</span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-[#F6F6F5] flex justify-between items-center">
                <a
                  href="#capabilities"
                  className="text-[12px] font-semibold text-[#E5402C] hover:text-[#CF3722] flex items-center gap-1 group"
                >
                  <span>How TORQ reasons</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </a>
              </div>
            </div>

            {/* FLOATING CARD 2: BOTTOM-LEFT "Diagnose faster with TORQ" */}
            <div className="hidden sm:block absolute bottom-6 left-6 max-w-[380px] bg-white/95 backdrop-blur-md rounded-[16px] p-6 shadow-[0_12px_36px_rgba(26,26,26,0.12)] border border-white/80 z-20 space-y-4">
              <div className="space-y-1.5">
                <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-[#9A9A9A]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#E5402C]" />
                  AI-ASSISTED DIAGNOSTICS
                </span>
                <h3 className="text-[18px] font-medium tracking-tight text-[#1A1A1A] leading-snug">
                  Diagnose faster with TORQ
                </h3>
                <p className="text-[13px] text-[#6E6E6E] leading-relaxed">
                  Bayesian reasoning over DTC codes and symptoms, backed by a RAG knowledge base — TORQ narrows down root cause and tells you the next test to run.
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

              {/* Diagnostic Icons Row & Attribution */}
              <div className="pt-2 border-t border-[#F6F6F5] flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  {[Wrench, Cpu, Gauge, ShieldCheck, FileCheck].map((Icon, idx) => (
                    <div
                      key={idx}
                      className="w-7 h-7 rounded-full border border-[#F6C9BE] text-[#E5402C] bg-white flex items-center justify-center shadow-xs"
                      title="TORQ Diagnostic Engine Modular Component"
                    >
                      <Icon className="w-3.5 h-3.5 stroke-[1.75]" />
                    </div>
                  ))}
                </div>
                <span className="text-[11px] font-medium text-[#9A9A9A]">
                  Built for Paccar India Hackathon
                </span>
              </div>
            </div>

            {/* FLOATING HOTSPOT MARKER (+) MID-SCENE */}
            <div className="absolute top-[48%] left-[48%] z-20">
              <button
                type="button"
                onClick={() => setActiveHotspot(!activeHotspot)}
                className="relative group w-8 h-8 rounded-full bg-[#E5402C] text-white flex items-center justify-center shadow-lg hover:bg-[#CF3722] hover:scale-105 transition-all"
                title="Live Port Telemetry"
              >
                <span className="absolute inset-0 rounded-full bg-[#E5402C] animate-ping opacity-30" />
                <Plus className={`w-4 h-4 transition-transform duration-200 ${activeHotspot ? "rotate-45" : ""}`} />
              </button>

              {/* Interactive Telemetry Tooltip */}
              {activeHotspot && (
                <div className="absolute left-10 top-0 w-64 bg-white rounded-xl p-3.5 shadow-xl border border-[#F6F6F5] text-xs z-30 animate-in fade-in zoom-in-95 duration-150">
                  <div className="font-semibold text-[#1A1A1A] flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    J1939 CAN Port: Active Stream
                  </div>
                  <p className="text-[#6E6E6E] text-[11px] mt-1 leading-snug">
                    Telemetry: SPN 94 / FMI 1 (Fuel Delivery Pressure). Live Bayesian prior initialized at 62% confidence.
                  </p>
                </div>
              )}
            </div>

          </div>

        </div>

        {/* MOBILE FALLBACK STACKED CARDS */}
        <div className="mt-6 md:hidden space-y-4">
          <div className="bg-white rounded-[16px] p-5 shadow-sm border border-white space-y-3">
            <h4 className="text-[16px] font-semibold text-[#1A1A1A]">
              TORQ Diagnostic Engine
            </h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2 bg-[#F6F6F5] rounded-lg">
                <span className="text-[#6E6E6E] block text-[10px]">DTC Database</span>
                <span className="font-bold text-[#1A1A1A]">15,000+ Codes</span>
              </div>
              <div className="p-2 bg-[#F6F6F5] rounded-lg">
                <span className="text-[#6E6E6E] block text-[10px]">Avg Confidence</span>
                <span className="font-bold text-emerald-600">87%</span>
              </div>
            </div>
            <div className="flex gap-2 pt-1">
              <Link href="/diagnostics/new" className="w-full">
                <PillButton variant="solid" size="sm" className="w-full">
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
