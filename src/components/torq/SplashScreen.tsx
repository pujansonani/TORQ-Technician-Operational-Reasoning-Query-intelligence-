"use client";

import React, { useState, useEffect } from "react";

interface SplashScreenProps {
  onComplete?: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState("Connecting to PACCAR Diagnostic Bus...");
  const [isExiting, setIsExiting] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  const handleDismiss = () => {
    setIsExiting(true);
    setTimeout(() => {
      setIsDismissed(true);
      if (onComplete) onComplete();
    }, 700);
  };

  useEffect(() => {
    // Stage 1: Initial progress
    const t1 = setTimeout(() => {
      setProgress(35);
      setStatusText("Indexing SAE J1939 Fault Codes & OEM Service Manuals...");
    }, 500);

    // Stage 2: Mid progress
    const t2 = setTimeout(() => {
      setProgress(75);
      setStatusText("Calibrating Bayesian Telemetry Graph across 1,450 Fleet Units...");
    }, 1200);

    // Stage 3: Full progress & verification
    const t3 = setTimeout(() => {
      setProgress(100);
      setStatusText("TORQ-LOCK™ Specification Verified • Ready");
    }, 1900);

    // Stage 4: Trigger exit fade
    const t4 = setTimeout(() => {
      handleDismiss();
    }, 2500);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, []);

  if (isDismissed) return null;

  return (
    <div
      onClick={handleDismiss}
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden bg-[#070101] text-white transition-all duration-700 ease-out select-none cursor-pointer ${
        isExiting ? "opacity-0 scale-[1.04] pointer-events-none" : "opacity-100 scale-100"
      }`}
      title="Click anywhere to skip directly to homepage"
    >
      {/* 1. APPLE HIG RED-BLACK RADIAL & LINEAR GRADIENT BACKGROUND */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Deep ambient red radial glow in the center */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(229,64,44,0.42)_0%,rgba(180,24,12,0.20)_35%,rgba(8,2,2,0.96)_75%)]" />
        
        {/* Subtle top spotlight */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[850px] h-[450px] bg-gradient-to-b from-[#E5402C]/28 via-transparent to-transparent blur-3xl opacity-70" />
      </div>

      {/* 2. APPLE HIG GEOMETRIC HIGH-TECH GRID */}
      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(to_right,rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[size:48px_48px] [mask-image:radial-gradient(ellipse_at_center,black_45%,transparent_85%)] opacity-85" />

      {/* 3. MINIMALIST CENTER BRAND CONTENT (No Logo, No Copilot Pill, No Workshop Button) */}
      <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-4xl mx-auto space-y-8 animate-in fade-in zoom-in-95 duration-700">
        
        {/* Brand Name - ALL CAPS BOLD METALLIC GRADIENT */}
        <div className="space-y-4">
          <h1 className="text-7xl sm:text-9xl md:text-[10rem] font-black tracking-[-0.04em] text-white drop-shadow-[0_12px_50px_rgba(0,0,0,0.9)] leading-none">
            <span className="bg-clip-text text-transparent bg-gradient-to-b from-white via-neutral-100 to-neutral-400">
              TORQ
            </span>
          </h1>

          {/* Premium Tagline with Bold Italic Hierarchy */}
          <div className="max-w-2xl mx-auto pt-2 space-y-2">
            <p className="text-2xl sm:text-3xl md:text-4xl tracking-tight text-neutral-200 font-normal leading-tight">
              <span className="font-extrabold text-white">Precision Diagnostic Intelligence.</span>{" "}
              <span className="italic font-bold text-[#FF6B57]">Zero Guesswork.</span>
            </p>
            <p className="text-xs sm:text-sm text-neutral-400 font-mono tracking-widest uppercase pt-1">
              NEXT-BEST-TEST INFERENCE • BAYESIAN RAG • HEAVY-DUTY FLEET TELEMETRY
            </p>
          </div>
        </div>

        {/* 4. APPLE HIG PROGRESS BAR & TELEMETRY STATUS */}
        <div className="w-full max-w-lg mx-auto space-y-3 pt-4">
          {/* Progress Track */}
          <div className="w-full h-2 rounded-full bg-white/10 backdrop-blur-md p-0.5 border border-white/15 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#E5402C] via-[#FF6B57] to-white transition-all duration-500 ease-out shadow-[0_0_12px_rgba(229,64,44,0.8)]"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Dynamic Status Text */}
          <div className="flex items-center justify-between text-xs font-mono text-neutral-400 px-1">
            <span className="flex items-center gap-2 truncate max-w-[320px] sm:max-w-md text-left">
              <span className="w-2 h-2 rounded-full bg-[#E5402C] animate-pulse shrink-0" />
              <span className="truncate">{statusText}</span>
            </span>
            <span className="font-bold text-neutral-300 shrink-0">{progress}%</span>
          </div>
        </div>

      </div>

    </div>
  );
};
