"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowRight, ShieldAlert } from "lucide-react";
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
    // Row 1
    {
      id: "symptom",
      title: "Symptom Intake",
      subtitle: "Free-text symptoms + DTC codes",
      linkHref: "/diagnostics/new",
    },
    {
      id: "bayesian",
      title: "Bayesian Reasoning",
      subtitle: "Prior scoring + posterior updates per test result",
      isHighlighted: true,
      linkHref: "/diagnostics/TRQ-2026-0941/workflow",
    },
    {
      id: "rag",
      title: "RAG Knowledge Base",
      subtitle: "Retrieval over real DTC procedures",
      linkHref: "/diagnostics/TRQ-2026-0941",
    },
    {
      id: "testing",
      title: "Guided Testing",
      subtitle: "Info-gain picks the next best test",
      linkHref: "/diagnostics/TRQ-2026-0941/workflow",
    },
    // Row 2
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
      subtitle: "Aggregate fault trends across the fleet",
      linkHref: "/fleet",
    },
    {
      id: "reports",
      title: "Exportable Reports",
      subtitle: "Markdown/PDF session reports",
      linkHref: "/reports/TRQ-2026-0941",
    },
  ];

  /* 8 CUSTOM FLAT/ISOMETRIC TECHNICAL MINI-ILLUSTRATIONS */
  const renderTechnicalIllustration = (id: string, isWhite: boolean) => {
    const mainColor = isWhite ? "#FFFFFF" : "#E5402C";
    const lightTone = isWhite ? "rgba(255,255,255,0.75)" : "#F7A3B1";
    const darkTone = isWhite ? "rgba(255,255,255,0.4)" : "#BC132E";
    const shadowTone = isWhite ? "rgba(0,0,0,0.12)" : "rgba(229,64,44,0.12)";

    switch (id) {
      case "symptom":
        // Isometric Handheld Diagnostic Scanner
        return (
          <svg width="64" height="48" viewBox="0 0 64 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <ellipse cx="32" cy="40" rx="22" ry="6" fill={shadowTone} />
            <path d="M16 18 L34 10 L48 18 L30 26 Z" fill={lightTone} />
            <path d="M16 18 L30 26 L30 36 L16 28 Z" fill={mainColor} />
            <path d="M30 26 L48 18 L48 28 L30 36 Z" fill={darkTone} />
            {/* Screen */}
            <path d="M22 18 L34 13 L42 18 L30 23 Z" fill={isWhite ? "rgba(255,255,255,0.9)" : "#FDE8EB"} />
            {/* DTC Text Lines */}
            <line x1="26" y1="18" x2="36" y2="18" stroke={mainColor} strokeWidth="1.5" />
            <line x1="28" y1="21" x2="38" y2="21" stroke={darkTone} strokeWidth="1.5" />
          </svg>
        );

      case "bayesian":
        // Isometric Decision Tree / Probability Matrix
        return (
          <svg width="64" height="48" viewBox="0 0 64 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <ellipse cx="32" cy="40" rx="24" ry="6" fill={shadowTone} />
            {/* Root Node */}
            <circle cx="32" cy="14" r="5" fill={mainColor} />
            {/* Branches */}
            <line x1="32" y1="19" x2="20" y2="29" stroke={lightTone} strokeWidth="2" />
            <line x1="32" y1="19" x2="44" y2="29" stroke={lightTone} strokeWidth="2" />
            {/* Left Node */}
            <circle cx="20" cy="30" r="4.5" fill={lightTone} />
            {/* Right Node (Active High Confidence) */}
            <circle cx="44" cy="30" r="5.5" fill={mainColor} />
            <circle cx="44" cy="30" r="2" fill={isWhite ? "#CF3722" : "#FFFFFF"} />
            {/* Waveform curve */}
            <path d="M12 36 Q32 30, 52 36" stroke={isWhite ? "#FFFFFF" : darkTone} strokeWidth="1.5" fill="none" />
          </svg>
        );

      case "rag":
        // Isometric Document Manual & Knowledge Database Stack
        return (
          <svg width="64" height="48" viewBox="0 0 64 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <ellipse cx="32" cy="42" rx="22" ry="5" fill={shadowTone} />
            {/* Base Database Cylinder */}
            <path d="M16 28 C16 24, 48 24, 48 28 L48 36 C48 40, 16 40, 16 36 Z" fill={mainColor} />
            <ellipse cx="32" cy="28" rx="16" ry="4" fill={lightTone} />
            {/* Top Document Page */}
            <path d="M20 12 L36 6 L44 12 L28 18 Z" fill={isWhite ? "rgba(255,255,255,0.9)" : "#FDE8EB"} />
            <path d="M20 12 L28 18 L28 24 L20 18 Z" fill={mainColor} />
            <path d="M28 18 L44 12 L44 18 L28 24 Z" fill={darkTone} />
          </svg>
        );

      case "testing":
        // Isometric Multimeter Gauge & Test Probe
        return (
          <svg width="64" height="48" viewBox="0 0 64 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <ellipse cx="32" cy="40" rx="20" ry="5" fill={shadowTone} />
            {/* Meter Body */}
            <path d="M18 18 L34 10 L46 17 L30 25 Z" fill={lightTone} />
            <path d="M18 18 L30 25 L30 35 L18 28 Z" fill={mainColor} />
            <path d="M30 25 L46 17 L46 27 L30 35 Z" fill={darkTone} />
            {/* Dial Arc */}
            <path d="M25 18 A 6 6 0 0 1 37 15" stroke={isWhite ? "#FFFFFF" : "#1A1A1A"} strokeWidth="1.5" fill="none" />
            <line x1="31" y1="18" x2="35" y2="14" stroke={mainColor} strokeWidth="1.5" />
            {/* Probe Needle */}
            <line x1="42" y1="22" x2="54" y2="34" stroke={isWhite ? "#FFFFFF" : "#1A1A1A"} strokeWidth="1.5" />
          </svg>
        );

      case "torqlock":
        // Isometric Shield & Precision Calibration Lock
        return (
          <svg width="64" height="48" viewBox="0 0 64 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <ellipse cx="32" cy="41" rx="20" ry="5" fill={shadowTone} />
            {/* Shield Outline */}
            <path d="M32 10 L46 16 C46 28, 32 36, 32 36 C32 36, 18 28, 18 16 Z" fill={mainColor} />
            {/* Inner Crest */}
            <path d="M32 14 L42 18 C42 27, 32 32, 32 32 C32 32, 22 27, 22 18 Z" fill={lightTone} />
            {/* Checkmark Lock */}
            <path d="M27 22 L31 26 L38 19" stroke={isWhite ? "#CF3722" : "#FFFFFF"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          </svg>
        );

      case "cost":
        // Isometric Itemized Quote / Parts Ledger
        return (
          <svg width="64" height="48" viewBox="0 0 64 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <ellipse cx="32" cy="40" rx="22" ry="5" fill={shadowTone} />
            {/* Ledger Clipboard */}
            <path d="M16 16 L34 8 L48 16 L30 24 Z" fill={lightTone} />
            <path d="M16 16 L30 24 L30 35 L16 27 Z" fill={mainColor} />
            <path d="M30 24 L48 16 L48 27 L30 35 Z" fill={darkTone} />
            {/* Currency Symbol / Rows */}
            <path d="M24 16 L38 16" stroke={isWhite ? "rgba(255,255,255,0.8)" : "#FFFFFF"} strokeWidth="1.5" />
            <path d="M26 20 L40 20" stroke={isWhite ? "rgba(255,255,255,0.8)" : "#FFFFFF"} strokeWidth="1.5" />
            <circle cx="40" cy="27" r="2" fill={isWhite ? "#FFFFFF" : "#10B981"} />
          </svg>
        );

      case "fleet":
        // Isometric Telemetry Nodes & Fleet Frequency Cluster
        return (
          <svg width="64" height="48" viewBox="0 0 64 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <ellipse cx="32" cy="40" rx="24" ry="6" fill={shadowTone} />
            {/* Hexagonal Mesh Base */}
            <path d="M20 18 L32 11 L44 18 L32 25 Z" fill={lightTone} />
            <path d="M20 18 L32 25 L32 35 L20 28 Z" fill={mainColor} />
            <path d="M32 25 L44 18 L44 28 L32 35 Z" fill={darkTone} />
            {/* Node Beacons */}
            <circle cx="24" cy="16" r="2.5" fill={isWhite ? "#FFFFFF" : "#E5402C"} />
            <circle cx="32" cy="11" r="2.5" fill={isWhite ? "#FFFFFF" : "#E5402C"} />
            <circle cx="40" cy="16" r="2.5" fill={isWhite ? "#FFFFFF" : "#E5402C"} />
            <line x1="24" y1="16" x2="32" y2="11" stroke={isWhite ? "#FFFFFF" : darkTone} strokeWidth="1" />
            <line x1="32" y1="11" x2="40" y2="16" stroke={isWhite ? "#FFFFFF" : darkTone} strokeWidth="1" />
          </svg>
        );

      case "reports":
        // Isometric Service Audit Report Document & Stamp
        return (
          <svg width="64" height="48" viewBox="0 0 64 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <ellipse cx="32" cy="40" rx="20" ry="5" fill={shadowTone} />
            {/* Stacked Sheets */}
            <path d="M18 14 L34 7 L46 14 L30 21 Z" fill={isWhite ? "rgba(255,255,255,0.9)" : "#FDE8EB"} />
            <path d="M18 18 L34 11 L46 18 L30 25 Z" fill={lightTone} />
            <path d="M18 18 L30 25 L30 35 L18 28 Z" fill={mainColor} />
            <path d="M30 25 L46 18 L46 28 L30 35 Z" fill={darkTone} />
            {/* Official Inspection Seal */}
            <circle cx="36" cy="22" r="3" fill={isWhite ? "#CF3722" : "#10B981"} />
          </svg>
        );

      default:
        return null;
    }
  };

  return (
    <section id="capabilities" className="relative w-full bg-[#F6F6F5] py-24 lg:py-28">
      <div className="max-w-[1280px] mx-auto px-6 space-y-12">
        
        {/* SECTION HEADER */}
        <div className="space-y-3 max-w-2xl">
          {/* Eyebrow Label with small red dot */}
          <div className="inline-flex items-center gap-2 text-[12px] font-medium tracking-[0.08em] uppercase text-[#9A9A9A]">
            <span className="w-2 h-2 rounded-full bg-[#E5402C]" />
            <span>CAPABILITIES</span>
          </div>

          {/* Section Heading */}
          <h2 className="text-[28px] sm:text-[34px] font-normal tracking-[-0.01em] text-[#1A1A1A]">
            How TORQ diagnoses a fault
          </h2>

          <p className="text-[14px] text-[#6E6E6E] leading-relaxed">
            From symptom intake to a confidence-scored root cause and verified repair spec — every step is auditable.
          </p>
        </div>

        {/* 4 COLS × 2 ROWS CAPABILITIES GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {capabilities.map((cap) => {
            const isSelected = Boolean(selectedCapability === cap.id || cap.isHighlighted);

            return (
              <div
                key={cap.id}
                onClick={() => setSelectedCapability(cap.id)}
                className={`group relative rounded-[20px] p-6 transition-all duration-200 cursor-pointer min-h-[190px] flex flex-col justify-between ${
                  isSelected
                    ? "bg-[#E5402C] text-white shadow-[0_16px_36px_rgba(229,64,44,0.28)] translate-y-[-4px]"
                    : "bg-white text-[#1A1A1A] border border-[#EBEBEA] shadow-[0_1px_3px_rgba(0,0,0,0.04)] hover:shadow-[0_10px_25px_rgba(0,0,0,0.06)] hover:translate-y-[-4px]"
                }`}
              >
                {/* Top: Technical Mini-Illustration */}
                <div className="flex items-start justify-between">
                  <div className="transition-transform duration-200 group-hover:scale-105">
                    {renderTechnicalIllustration(cap.id, isSelected)}
                  </div>

                  {/* Highlight indicator */}
                  {isSelected && (
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-white/20 text-white">
                      Core Engine
                    </span>
                  )}
                </div>

                {/* Bottom: Label & Subtitle */}
                <div className="pt-4 flex items-end justify-between">
                  <div>
                    <h3
                      className={`text-[15px] font-medium tracking-tight ${
                        isSelected ? "text-white font-semibold" : "text-[#1A1A1A]"
                      }`}
                    >
                      {cap.title}
                    </h3>
                    <p
                      className={`text-[12px] mt-0.5 leading-snug line-clamp-2 ${
                        isSelected ? "text-white/80" : "text-[#6E6E6E]"
                      }`}
                    >
                      {cap.subtitle}
                    </p>
                  </div>

                  {/* Active Card Link */}
                  {isSelected && (
                    <Link
                      href={cap.linkHref}
                      className="text-[12px] font-medium text-white flex items-center gap-1 shrink-0 ml-2 group-hover:underline"
                    >
                      <span>Learn more</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* BOTTOM CALLOUT BANNER: ESCALATION SAFETY NET */}
        <div className="bg-white rounded-[20px] p-6 sm:p-8 border border-[#EBEBEA] flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
          <div className="space-y-1">
            <span className="text-[11px] font-semibold tracking-wider uppercase text-[#E5402C] flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-[#E5402C]" />
              ESCALATION SAFETY NET
            </span>
            <h4 className="text-[18px] font-medium text-[#1A1A1A]">
              Confidence below 40%? TORQ tells you to escalate, not guess.
            </h4>
            <p className="text-[13px] text-[#6E6E6E] max-w-xl leading-relaxed">
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
    </section>
  );
};
