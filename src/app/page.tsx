"use client";

import React from "react";
import { TorqNavbar } from "@/components/torq/TorqNavbar";
import { HeroSection1 } from "@/components/torq/HeroSection1";
import { HeroSection2 } from "@/components/torq/HeroSection2";
import { CapabilitiesSection } from "@/components/torq/CapabilitiesSection";
import { TorqFooter } from "@/components/torq/TorqFooter";

export default function TorqLandingPage() {
  return (
    <main className="min-h-screen bg-white text-[#1A1A1A] font-sans antialiased selection:bg-[#E5402C]/15 selection:text-[#E5402C]">
      
      {/* 1. NAVBAR — True Top Element, Sticky with Shadow-on-Scroll */}
      <TorqNavbar />

      {/* 2. HERO SECTION 1 — Diagnostic Bay Isometric Hero with Live Telemetry Overlays */}
      <HeroSection1 />

      {/* 3. HERO SECTION 2 — Editorial Split Hero: "Your fleet's downtime. Our diagnosis. Welcome to TORQ." */}
      <HeroSection2 />

      {/* 4. CAPABILITIES SECTION — How TORQ Diagnoses a Fault (8 Technical Cards, Bayesian Reasoning Highlighted) */}
      <CapabilitiesSection />

      {/* 5. TORQ FOOTER — Paccar India Hackathon Attribution & Technical Documentation */}
      <TorqFooter />

    </main>
  );
}
