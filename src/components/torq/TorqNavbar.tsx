"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, ArrowRight, Wrench, Wifi, WifiOff, Globe, Award } from "lucide-react";
import { PillButton } from "./PillButton";
import { useTorqStore } from "@/lib/store";

export const TorqNavbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isOfflineMode, toggleOfflineMode, language, setLanguage } = useTorqStore();

  const cycleLanguage = () => {
    if (language === "en") setLanguage("hi");
    else if (language === "hi") setLanguage("mr");
    else setLanguage("en");
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 15);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Diagnostics", href: "/diagnostics/TRQ-2026-0941" },
    { label: "Fleet Intelligence", href: "/fleet" },
    { label: "Reports", href: "/reports/TRQ-2026-0941" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full pt-3 px-4 sm:px-6 pointer-events-none transition-all duration-300">
      {/* FLOATING CURVED NAVBAR CONTAINER */}
      <div
        className={`max-w-[1240px] mx-auto pointer-events-auto rounded-full bg-white/95 backdrop-blur-md border border-black/[0.08] px-4 sm:px-6 h-[68px] flex items-center justify-between transition-all duration-300 ${
          scrolled
            ? "shadow-[0_12px_36px_rgba(0,0,0,0.1)] border-black/[0.12] bg-white/98"
            : "shadow-[0_4px_20px_rgba(0,0,0,0.05)]"
        }`}
      >
        {/* Left: TORQ Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 sm:gap-3 group">
          <div className="w-10 h-10 bg-[#E5402C] rounded-xl flex items-center justify-center text-white font-bold text-lg tracking-tight shadow-sm group-hover:bg-[#CF3722] transition-colors">
            <span className="font-sans font-extrabold text-xl leading-none">
              T
            </span>
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-xl sm:text-2xl tracking-[-0.03em] text-[#111827] leading-none">
              TORQ
            </span>
            <span className="text-[10px] font-semibold italic tracking-wide text-[#E5402C] mt-0.5 hidden md:inline">
              PACCAR Diagnostic Copilot
            </span>
          </div>
        </Link>

        {/* Center: Desktop Nav Links */}
        <nav className="hidden lg:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-[14px] font-medium text-[#374151] hover:text-[#E5402C] transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right Actions: Offline Toggle + Language + Master Tech Badge + CTA */}
        <div className="hidden lg:flex items-center gap-2.5">
          {/* Technician Badge */}
          <span className="hidden xl:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-amber-50 text-amber-900 border border-amber-300">
            <Award className="w-3.5 h-3.5 text-amber-600" />
            <span>L2 Master Tech</span>
          </span>

          {/* Regional Language Selector */}
          <button
            type="button"
            onClick={cycleLanguage}
            title="Toggle language: English / हिन्दी / मराठी"
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-full text-xs font-bold bg-gray-100 hover:bg-gray-200 text-gray-800 border border-gray-200 transition-colors"
          >
            <Globe className="w-3.5 h-3.5 text-gray-600" />
            <span>{language === "hi" ? "हिन्दी" : language === "mr" ? "मराठी" : "EN"}</span>
          </button>

          {/* Offline Mode Toggle Pill */}
          <button
            type="button"
            onClick={toggleOfflineMode}
            title={isOfflineMode ? "Running in Edge Offline Mode. Click to connect Live Cloud." : "Connected to Live Cloud. Click to simulate Edge Offline Mode."}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border transition-all ${
              isOfflineMode
                ? "bg-amber-100 text-amber-900 border-amber-400 shadow-sm"
                : "bg-emerald-50 text-emerald-800 border-emerald-300"
            }`}
          >
            {isOfflineMode ? (
              <>
                <WifiOff className="w-3.5 h-3.5 text-amber-700 animate-pulse" />
                <span>Offline Edge</span>
              </>
            ) : (
              <>
                <Wifi className="w-3.5 h-3.5 text-emerald-600" />
                <span>Live Cloud</span>
              </>
            )}
          </button>

          <Link href="/diagnostics/new">
            <PillButton variant="solid" size="sm">
              New Diagnosis
            </PillButton>
          </Link>
        </div>


        {/* Mobile / Tablet Compact Toggle */}
        <div className="flex lg:hidden items-center gap-2">
          <Link href="/diagnostics/new">
            <PillButton variant="solid" size="sm" showIcon={false}>
              New
            </PillButton>
          </Link>

          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-full text-[#111827] hover:text-[#E5402C] hover:bg-gray-100 transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown - Floating Curved Style */}
      {mobileMenuOpen && (
        <div className="lg:hidden pointer-events-auto max-w-[1240px] mx-auto mt-2 rounded-[24px] bg-white/95 backdrop-blur-md border border-black/[0.08] px-6 py-6 shadow-2xl space-y-4 animate-in fade-in slide-in-from-top-2 duration-200">
          <nav className="flex flex-col space-y-3">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-base font-semibold text-[#111827] hover:text-[#E5402C] py-1 transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="pt-4 border-t border-black/[0.06] flex flex-col gap-2.5">
            <Link href="/diagnostics/new" onClick={() => setMobileMenuOpen(false)}>
              <PillButton variant="solid" size="md" className="w-full justify-center">
                New Diagnosis
              </PillButton>
            </Link>
            <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)}>
              <PillButton variant="outline" size="md" className="w-full justify-center">
                Session History
              </PillButton>
            </Link>
            <Link href="/fleet" onClick={() => setMobileMenuOpen(false)}>
              <PillButton variant="light" size="md" showIcon={false} className="w-full justify-center">
                Fleet Portal
              </PillButton>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
