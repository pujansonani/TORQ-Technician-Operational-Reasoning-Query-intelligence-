"use client";

import React, { useState, useEffect } from "react";
import { ArrowRight, Sparkles, ShieldCheck, Activity } from "lucide-react";

interface SplashScreenProps {
  onComplete?: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState("Connecting to PACCAR Diagnostic Bus...");
  const [isExiting, setIsExiting] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    // Stage 1: Initial progress
    const t1 = setTimeout(() => {
      setProgress(35);
      setStatusText("Indexing SAE J1939 Fault Codes & OEM Service Manuals...");
    }, 600);

    // Stage 2: Mid progress
    const t2 = setTimeout(() => {
      setProgress(75);
      setStatusText("Calibrating Bayesian Telemetry Graph across 1,450 Fleet Units...");
    }, 1400);

    // Stage 3: Full progress & verification
    const t3 = setTimeout(() => {
      setProgress(100);
      setStatusText("TORQ-LOCK™ Specification Verified • Ready");
    }, 2200);

    // Stage 4: Trigger exit fade
    const t4 = setTimeout(() => {
      handleDismiss();
    }, 2800);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, []);

  const handleDismiss = () => {
    setIsExiting(true);
    setTimeout(() => {
      setIsDismissed(true);
      if (onComplete) onComplete();
    }, 700);
  };

  if (isDismissed) return null;

  return (
    <div
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden bg-[#070101] text-white transition-all duration-700 ease-out select-none ${
        isExiting ? "opacity-0 scale-[1.04] pointer-events-none" : "opacity-100 scale-100"
      }`}
    >
      {/* 1. APPLE HIG RED-BLACK RADIAL & LINEAR GRADIENT BACKGROUND */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Deep ambient red radial glow in the center */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_42%,rgba(229,64,44,0.38)_0%,rgba(180,24,12,0.18)_35%,rgba(10,2,2,0.95)_75%)]" />
        
        {/* Subtle top spotlight */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-[#E5402C]/25 via-transparent to-transparent blur-3xl opacity-60" />
      </div>

      {/* 2. APPLE HIG GEOMETRIC HIGH-TECH GRID */}
      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(to_right,rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[size:48px_48px] [mask-image:radial-gradient(ellipse_at_center,black_45%,transparent_85%)] opacity-80" />

      {/* 3. CENTER BRAND CONTENT */}
      <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-3xl mx-auto space-y-8 animate-in fade-in zoom-in-95 duration-700">
        
        {/* App Emblem Badge with Apple HIG Rounded Glass Contour */}
        <div className="relative group">
          <div className="absolute -inset-2 bg-gradient-to-r from-[#E5402C] via-[#FF6B57] to-[#B91C1C] rounded-[32px] blur-xl opacity-70 group-hover:opacity-100 transition duration-1000 animate-pulse" />
          <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-[28px] bg-gradient-to-b from-[#E5402C] to-[#991B1B] p-[1.5px] shadow-[0_12px_40px_rgba(229,64,44,0.5)]">
            <div className="w-full h-full rounded-[26px] bg-gradient-to-b from-[#CF3722] to-[#7F1D1D] flex items-center justify-center border border-white/20 backdrop-blur-xl">
              <span className="font-sans font-black text-5xl sm:text-6xl text-white tracking-tighter drop-shadow-md">
                T
              </span>
            </div>
          </div>
        </div>

        {/* Brand Name - ALL CAPS BOLD METALLIC GRADIENT */}
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-mono font-bold tracking-widest text-white/90 shadow-inner">
            <Sparkles className="w-3.5 h-3.5 text-[#FF6B57]" />
            <span>PACCAR DIAGNOSTIC COPILOT</span>
          </div>

          <h1 className="text-6xl sm:text-8xl md:text-9xl font-black tracking-[-0.04em] text-white drop-shadow-[0_10px_40px_rgba(0,0,0,0.9)]">
            <span className="bg-clip-text text-transparent bg-gradient-to-b from-white via-neutral-100 to-neutral-400">
              TORQ
            </span>
          </h1>

          {/* Premium Tagline with Bold Italic Hierarchy */}
          <div className="max-w-xl mx-auto pt-1">
            <p className="text-xl sm:text-2xl md:text-3xl tracking-tight text-neutral-200 font-normal leading-snug">
              <span className="font-extrabold text-white">Precision Diagnostic Intelligence.</span>{" "}
              <span className="italic font-bold text-[#FF6B57]">Zero Guesswork.</span>
            </p>
            <p className="text-xs sm:text-sm text-neutral-400 font-mono tracking-wider uppercase mt-2">
              Next-Best-Test Inference • Bayesian RAG • Heavy-Duty Fleet Telemetry
            </p>
          </div>
        </div>

        {/* 4. APPLE HIG PROGRESS BAR & TELEMETRY STATUS */}
        <div className="w-full max-w-md mx-auto space-y-3 pt-2">
          {/* Progress Track */}
          <div className="w-full h-2 rounded-full bg-white/10 backdrop-blur-md p-0.5 border border-white/15 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#E5402C] via-[#FF6B57] to-white transition-all duration-500 ease-out shadow-[0_0_12px_rgba(229,64,44,0.8)]"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Dynamic Status Text */}
          <div className="flex items-center justify-between text-xs font-mono text-neutral-400 px-1">
            <span className="flex items-center gap-1.5 truncate max-w-[280px] sm:max-w-xs text-left">
              <span className="w-2 h-2 rounded-full bg-[#E5402C] animate-pulse shrink-0" />
              <span className="truncate">{statusText}</span>
            </span>
            <span className="font-bold text-neutral-300 shrink-0">{progress}%</span>
          </div>
        </div>

        {/* 5. DIRECT SKIP / ENTER EXPERIENCE PILL BUTTON */}
        <div className="pt-2">
          <button
            type="button"
            onClick={handleDismiss}
            className="group inline-flex items-center gap-2.5 px-7 py-3 rounded-full bg-white/10 hover:bg-white/20 active:scale-95 text-white text-xs sm:text-sm font-bold tracking-tight border border-white/20 backdrop-blur-xl transition-all shadow-[0_4px_20px_rgba(0,0,0,0.3)] hover:shadow-[0_6px_24px_rgba(229,64,44,0.3)]"
          >
            <span>Enter Workshop</span>
            <ArrowRight className="w-4 h-4 text-[#FF6B57] group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

      </div>

      {/* Subtle Bottom Footer Note */}
      <div className="absolute bottom-6 text-center text-[11px] font-mono text-neutral-500">
        TORQ v2.4 • Built for PACCAR India Hackathon 2026 • Kenworth & Peterbilt Certified
      </div>
    </div>
  );
};
