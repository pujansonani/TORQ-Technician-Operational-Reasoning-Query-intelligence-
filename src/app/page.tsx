"use client";

import React, { useState } from "react";
import { TorqNavbar } from "@/components/torq/TorqNavbar";
import { HeroSection1 } from "@/components/torq/HeroSection1";
import { HeroSection2 } from "@/components/torq/HeroSection2";
import { CapabilitiesSection } from "@/components/torq/CapabilitiesSection";
import { TorqFooter } from "@/components/torq/TorqFooter";
import { SplashScreen } from "@/components/torq/SplashScreen";

export default function TorqLandingPage() {
  const [showSplash, setShowSplash] = useState(true);

  return (
    <>
      {/* CINEMATIC APPLE HIG SPLASH SCREEN (Red/Black Gradient + Grid + Bold/Italic Tagline) */}
      {showSplash && <SplashScreen onComplete={() => setShowSplash(false)} />}

      <main className="min-h-screen bg-white text-[#111827] font-sans antialiased selection:bg-[#E5402C]/15 selection:text-[#E5402C]">
        
        {/* 1. FLOATING CURVED NAVBAR */}
        <TorqNavbar />

        {/* 2. HERO SECTION 1 — Diagnostic Bay Isometric Hero with Live Telemetry Overlays */}
        <div className="-mt-20 pt-20">
          <HeroSection1 />
        </div>

        {/* 3. HERO SECTION 2 — Editorial Split Hero: "Your fleet's downtime. Our diagnosis. Welcome to TORQ." */}
        <HeroSection2 />

        {/* 4. CAPABILITIES SECTION — How TORQ Diagnoses a Fault (8 Technical Cards, Bayesian Reasoning Highlighted) */}
        <CapabilitiesSection />

        {/* 5. TORQ FOOTER — PACCAR India Hackathon Attribution & Technical Documentation */}
        <TorqFooter />

      </main>
    </>
  );
}
