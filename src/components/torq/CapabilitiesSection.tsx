"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowRight, ShieldAlert, Cpu } from "lucide-react";
import { PillButton } from "./PillButton";

interface CapabilityItem {
  id: string;
  title: string;
  subtitle: string;
  isHighlighted?: boolean;
  linkHref: string;
}

export const CapabilitiesSection: React.FC = () => {
  const [selectedCapability, setSelectedCapability] = useState<string>("bayesian");

  const capabilities: CapabilityItem[] = [
    {
      id: "symptom",
      title: "Symptom Intake",
      subtitle: "Free-text symptoms + DTC codes",
      linkHref: "/diagnostics/new",
    },
    {
      id: "bayesian",
      title: "Bayesian Reasoning Engine",
      subtitle: "Dynamic prior scoring + posterior confidence updates per physical test outcome",
      isHighlighted: true,
      linkHref: "/diagnostics/TRQ-2026-0941/workflow",
    },
    {
      id: "rag",
      title: "RAG Knowledge Base",
      subtitle: "Retrieval over verified OEM service procedures",
      linkHref: "/diagnostics/TRQ-2026-0941",
    },
    {
      id: "testing",
      title: "Guided Testing",
      subtitle: "Information-gain picks the next best test",
      linkHref: "/diagnostics/TRQ-2026-0941/workflow",
    },
    {
      id: "torqlock",
      title: "TORQ-LOCK Validation",
      subtitle: "Strips unverified numeric specs from LLM output",
      linkHref: "/settings",
    },
    {
      id: "cost",
      title: "Cost Estimation",
      subtitle: "Parts + labor roll-up per diagnosis",
      linkHref: "/diagnostics/TRQ-2026-0941",
    },
    {
      id: "fleet",
      title: "Fleet Intelligence",
      subtitle: "Aggregate fault trends across 1,450 units",
      linkHref: "/fleet",
    },
    {
      id: "reports",
      title: "Exportable Reports",
      subtitle: "Printable workshop PDF service audit copies",
      linkHref: "/reports/TRQ-2026-0941",
    },
  ];

  /* CUSTOM FLAT/ISOMETRIC TECHNICAL MINI-ILLUSTRATIONS */
  const renderTechnicalIllustration = (id: string, isWhite: boolean) => {
    const mainColor = isWhite ? "#FFFFFF" : "#E5402C";
    const lightTone = isWhite ? "rgba(255,255,255,0.75)" : "#F7A3B1";
    const darkTone = isWhite ? "rgba(255,255,255,0.4)" : "#BC132E";
    const shadowTone = isWhite ? "rgba(0,0,0,0.12)" : "rgba(229,64,44,0.12)";

    switch (id) {
      case "symptom":
        return (
          <svg width="60" height="44" viewBox="0 0 64 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <ellipse cx="32" cy="40" rx="22" ry="6" fill={shadowTone} />
            <path d="M16 18 L34 10 L48 18 L30 26 Z" fill={lightTone} />
            <path d="M16 18 L30 26 L30 36 L16 28 Z" fill={mainColor} />
            <path d="M30 26 L48 18 L48 28 L30 36 Z" fill={darkTone} />
            <path d="M22 18 L34 13 L42 18 L30 23 Z" fill={isWhite ? "rgba(255,255,255,0.9)" : "#FDE8EB"} />
            <line x1="26" y1="18" x2="36" y2="18" stroke={mainColor} strokeWidth="1.5" />
            <line x1="28" y1="21" x2="38" y2="21" stroke={darkTone} strokeWidth="1.5" />
          </svg>
        );

      case "bayesian":
        return (
          <svg width="68" height="48" viewBox="0 0 64 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <ellipse cx="32" cy="40" rx="24" ry="6" fill={shadowTone} />
            <circle cx="32" cy="14" r="7" fill={mainColor} />
            <line x1="32" y1="21" x2="20" y2="30" stroke={mainColor} strokeWidth="2" strokeDasharray="3 3" />
            <line x1="32" y1="21" x2="44" y2="30" stroke={mainColor} strokeWidth="2" strokeDasharray="3 3" />
            <circle cx="18" cy="32" r="5" fill={lightTone} />
            <circle cx="46" cy="32" r="5" fill={isWhite ? "#FFFFFF" : "#10B981"} />
            <circle cx="32" cy="14" r="2.5" fill={isWhite ? "#CF3722" : "#FFFFFF"} />
          </svg>
        );

      case "rag":
        return (
          <svg width="60" height="44" viewBox="0 0 64 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <ellipse cx="32" cy="41" rx="20" ry="5" fill={shadowTone} />
            <path d="M14 18 C14 14, 28 10, 32 14 C36 10, 50 14, 50 18 L50 32 C50 28, 36 24, 32 28 C28 24, 14 28, 14 32 Z" fill={mainColor} />
            <path d="M16 20 C16 17, 28 13, 32 17 L32 30 C28 26, 16 30, 16 30 Z" fill={lightTone} />
            <path d="M48 20 C48 17, 36 13, 32 17 L32 30 C36 26, 48 30, 48 30 Z" fill={isWhite ? "#FDE8EB" : "#FFFFFF"} />
            <circle cx="38" cy="24" r="4.5" stroke={isWhite ? "#CF3722" : "#E5402C"} strokeWidth="1.5" />
            <line x1="41" y1="27" x2="45" y2="31" stroke={isWhite ? "#CF3722" : "#E5402C"} strokeWidth="1.5" />
          </svg>
        );

      case "testing":
        return (
          <svg width="60" height="44" viewBox="0 0 64 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <ellipse cx="32" cy="40" rx="22" ry="5" fill={shadowTone} />
            <path d="M22 14 L30 8 L36 14 L28 20 Z" fill={lightTone} />
            <path d="M22 14 L28 20 L26 38 L20 32 Z" fill={mainColor} />
            <path d="M28 20 L36 14 L34 32 L26 38 Z" fill={darkTone} />
            <path d="M30 18 L48 28 L44 34 L26 24 Z" fill={mainColor} />
          </svg>
        );

      case "torqlock":
        return (
          <svg width="60" height="44" viewBox="0 0 64 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <ellipse cx="32" cy="41" rx="20" ry="5" fill={shadowTone} />
            <path d="M32 10 L46 16 C46 28, 32 36, 32 36 C32 36, 18 28, 18 16 Z" fill={mainColor} />
            <path d="M32 14 L42 18 C42 27, 32 32, 32 32 C32 32, 22 27, 22 18 Z" fill={lightTone} />
            <path d="M27 22 L31 26 L38 19" stroke={isWhite ? "#CF3722" : "#FFFFFF"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          </svg>
        );

      case "cost":
        return (
          <svg width="60" height="44" viewBox="0 0 64 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <ellipse cx="32" cy="40" rx="22" ry="5" fill={shadowTone} />
            <path d="M16 16 L34 8 L48 16 L30 24 Z" fill={lightTone} />
            <path d="M16 16 L30 24 L30 35 L16 27 Z" fill={mainColor} />
            <path d="M30 24 L48 16 L48 27 L30 35 Z" fill={darkTone} />
            <circle cx="40" cy="27" r="2" fill={isWhite ? "#FFFFFF" : "#10B981"} />
          </svg>
        );

      case "fleet":
        return (
          <svg width="60" height="44" viewBox="0 0 64 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <ellipse cx="32" cy="40" rx="24" ry="6" fill={shadowTone} />
            <path d="M20 18 L32 11 L44 18 L32 25 Z" fill={lightTone} />
            <path d="M20 18 L32 25 L32 35 L20 28 Z" fill={mainColor} />
            <path d="M32 25 L44 18 L44 28 L32 35 Z" fill={darkTone} />
            <circle cx="24" cy="16" r="2.5" fill={isWhite ? "#FFFFFF" : "#E5402C"} />
            <circle cx="32" cy="11" r="2.5" fill={isWhite ? "#FFFFFF" : "#E5402C"} />
          </svg>
        );

      case "reports":
        return (
          <svg width="60" height="44" viewBox="0 0 64 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <ellipse cx="32" cy="40" rx="20" ry="5" fill={shadowTone} />
            <path d="M18 14 L34 7 L46 14 L30 21 Z" fill={isWhite ? "rgba(255,255,255,0.9)" : "#FDE8EB"} />
            <path d="M18 18 L34 11 L46 18 L30 25 Z" fill={lightTone} />
            <path d="M18 18 L30 25 L30 35 L18 28 Z" fill={mainColor} />
            <path d="M30 25 L46 18 L46 28 L30 35 Z" fill={darkTone} />
            <circle cx="36" cy="22" r="3" fill={isWhite ? "#CF3722" : "#10B981"} />
          </svg>
        );

      default:
        return null;
    }
  };

  return (
    <section id="capabilities" className="relative w-full bg-[#F6F6F5] pt-16 sm:pt-24 pb-28 sm:pb-36 overflow-hidden">
      {/* SEAMLESS GRADIENT BLEND FROM HERO 2 (White to #F6F6F5) */}
      <div className="absolute inset-x-0 top-0 h-28 sm:h-44 bg-gradient-to-b from-white via-white/50 to-transparent pointer-events-none" />

      <div className="relative z-20 max-w-[1280px] mx-auto px-4 sm:px-6 space-y-10">
        
        {/* SECTION HEADER */}
        <div className="space-y-2.5 max-w-2xl">
          <div className="inline-flex items-center gap-2 text-[12px] font-bold tracking-[0.08em] uppercase text-[#6E6E6E]">
            <span className="w-2 h-2 rounded-full bg-[#E5402C]" />
            <span>DIAGNOSTIC ARCHITECTURE</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#111827]">
            How TORQ diagnoses a fault
          </h2>

          <p className="text-sm text-[#4B5563] leading-relaxed font-normal">
            From symptom intake to confidence-scored root causes and verified OEM repair specs — every inference step is auditable.
          </p>
        </div>

        {/* ASYMMETRIC DELIBERATE LAYOUT BREAK (Featured 2-Col Bayesian Engine + 1-Col Capabilities) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {capabilities.map((cap) => {
            const isFeatured = cap.id === "bayesian";
            const isSelected = selectedCapability === cap.id || isFeatured;

            if (isFeatured) {
              return (
                <div
                  key={cap.id}
                  onClick={() => setSelectedCapability(cap.id)}
                  className="sm:col-span-2 group relative rounded-[20px] p-7 bg-[#E5402C] text-white shadow-[0_4px_20px_rgba(229,64,44,0.18)] flex flex-col justify-between cursor-pointer transition-all duration-200"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="space-y-1">
                      <span className="text-[10px] uppercase font-mono font-bold tracking-widest px-2.5 py-1 rounded-full bg-white/20 text-white inline-block">
                        CORE PROBABILISTIC ENGINE
                      </span>
                      <h3 className="text-xl font-extrabold text-white tracking-tight mt-1">
                        {cap.title}
                      </h3>
                      <p className="text-xs text-white/85 max-w-sm leading-relaxed">
                        {cap.subtitle}
                      </p>
                    </div>

                    <div className="shrink-0 p-2 rounded-xl bg-white/10 backdrop-blur-sm self-start">
                      {renderTechnicalIllustration(cap.id, true)}
                    </div>
                  </div>

                  {/* Asymmetric Telemetry Callout Inside Featured Card */}
                  <div className="mt-5 pt-4 border-t border-white/20 grid grid-cols-3 gap-2 text-xs font-mono">
                    <div className="p-2 rounded-lg bg-white/10">
                      <span className="text-[10px] text-white/70 block uppercase">Prior (SPN 94)</span>
                      <span className="font-bold text-white text-sm">62.0%</span>
                    </div>
                    <div className="p-2 rounded-lg bg-white/10">
                      <span className="text-[10px] text-white/70 block uppercase">Test Likelihood</span>
                      <span className="font-bold text-white text-sm">0.94</span>
                    </div>
                    <div className="p-2 rounded-lg bg-white/15 border border-white/20">
                      <span className="text-[10px] text-white/80 block uppercase">Posterior Conf.</span>
                      <span className="font-bold text-white text-sm">84.2%</span>
                    </div>
                  </div>

                  <div className="pt-4 flex items-center justify-between">
                    <span className="text-[11px] font-mono text-white/75">
                      Formula: P(H|E) = α · P(E|H) · P(H)
                    </span>
                    <Link
                      href={cap.linkHref}
                      className="text-xs font-bold text-white flex items-center gap-1.5 hover:underline"
                    >
                      <span>Interactive Workflow</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              );
            }

            return (
              <div
                key={cap.id}
                onClick={() => setSelectedCapability(cap.id)}
                className="group relative rounded-[20px] p-5 sm:p-6 bg-white text-[#111827] border border-black/[0.06] shadow-[0_2px_8px_rgba(0,0,0,0.03)] hover:shadow-[0_4px_16px_rgba(0,0,0,0.06)] hover:-translate-y-0.5 transition-all duration-200 cursor-pointer min-h-[190px] flex flex-col justify-between"
              >
                {/* Top: Technical Mini-Illustration */}
                <div className="flex items-start justify-between">
                  <div className="transition-transform duration-200 group-hover:scale-105">
                    {renderTechnicalIllustration(cap.id, false)}
                  </div>
                </div>

                {/* Bottom: Label & Subtitle */}
                <div className="pt-4 space-y-1">
                  <h3 className="text-[15px] font-bold tracking-tight text-[#111827]">
                    {cap.title}
                  </h3>
                  <p className="text-xs text-[#6B7280] leading-snug line-clamp-2">
                    {cap.subtitle}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* BOTTOM CALLOUT BANNER: ESCALATION SAFETY NET (Low-Opacity Soft Shadow) */}
        <div className="bg-white rounded-[20px] p-6 sm:p-8 border border-black/[0.06] flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-[0_2px_12px_rgba(0,0,0,0.03)]">
          <div className="space-y-1">
            <span className="text-[11px] font-bold tracking-wider uppercase text-[#E5402C] flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-[#E5402C]" />
              ESCALATION SAFETY NET
            </span>
            <h4 className="text-lg font-extrabold text-[#111827]">
              Confidence below 40%? TORQ tells you to escalate, not guess.
            </h4>
            <p className="text-xs sm:text-sm text-[#4B5563] max-w-xl leading-relaxed font-normal">
              When top and second causes are too close to call, TORQ flags the session for senior technician review instead of forcing a low-confidence answer.
            </p>
          </div>

          <div className="shrink-0 flex items-center gap-3">
            <Link href="/diagnostics/TRQ-2026-0941">
              <PillButton variant="solid" size="md">
                See escalation logic
              </PillButton>
            </Link>
          </div>
        </div>

      </div>

      {/* SEAMLESS GRADIENT BLEND TO FOOTER (#1A1A1A) */}
      <div className="absolute inset-x-0 bottom-0 h-44 sm:h-60 bg-gradient-to-b from-transparent via-[#2A2A2A]/40 to-[#1A1A1A] pointer-events-none z-10" />
    </section>
  );
};
