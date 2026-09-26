"use client";

import React from "react";
import { HeroSection1 } from "@/components/emons/HeroSection1";
import { EmonsNavbar } from "@/components/emons/EmonsNavbar";
import { HeroSection2 } from "@/components/emons/HeroSection2";
import { ServicesSection } from "@/components/emons/ServicesSection";
import { EmonsFooter } from "@/components/emons/EmonsFooter";

export default function EmonsLandingPage() {
  return (
    <main className="min-h-screen bg-white text-[#1A1A1A] font-sans antialiased selection:bg-[#E5402C]/15 selection:text-[#E5402C]">
      
      {/* 1. HERO SECTION 1 — Product Screenshot Style Hero (Soft Mint Full-Width Background) */}
      <HeroSection1 />

      {/* 2. NAVBAR — Sticky White Nav Bar Between the Two Hero Sections */}
      <EmonsNavbar />

      {/* 3. HERO SECTION 2 — Editorial Split Hero (White Background, Red Semi Truck, 3-Line Headline) */}
      <HeroSection2 />

      {/* 4. SERVICES SECTION — Light Gray Soft Background, 4x2 Grid, Active Rail Card */}
      <ServicesSection />

      {/* 5. EMONS FOOTER */}
      <EmonsFooter />

    </main>
  );
}
