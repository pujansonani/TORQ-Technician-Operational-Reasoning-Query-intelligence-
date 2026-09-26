"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, ArrowRight, Wrench } from "lucide-react";
import { PillButton } from "./PillButton";

export const TorqNavbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
    { label: "Capabilities", href: "#capabilities" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full pt-3 px-4 sm:px-6 pointer-events-none transition-all duration-300">
      {/* FLOATING CURVED NAVBAR CONTAINER */}
      <div
        className={`max-w-[1240px] mx-auto pointer-events-auto rounded-full bg-white/95 backdrop-blur-md border border-black/[0.08] px-5 sm:px-7 h-[68px] flex items-center justify-between transition-all duration-300 ${
          scrolled
            ? "shadow-[0_12px_36px_rgba(0,0,0,0.1)] border-black/[0.12] bg-white/98"
            : "shadow-[0_4px_20px_rgba(0,0,0,0.05)]"
        }`}
      >
        {/* Left: TORQ Brand Logo ('T' square badge + bold uppercase 'TORQ' wordmark) */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 bg-[#E5402C] rounded-xl flex items-center justify-center text-white font-bold text-lg tracking-tight shadow-sm group-hover:bg-[#CF3722] transition-colors">
            <span className="font-sans font-extrabold text-xl leading-none">
              T
            </span>
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-2xl tracking-[-0.03em] text-[#111827] leading-none">
              TORQ
            </span>
            <span className="text-[10px] font-semibold italic tracking-wide text-[#E5402C] mt-0.5 hidden sm:inline">
              PACCAR Diagnostic Copilot
            </span>
          </div>
        </Link>

        {/* Center: Desktop Nav Links */}
        <nav className="hidden lg:flex items-center gap-8">
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

        {/* Right Actions: Apple HIG Pill CTAs (No Groq Pill, No Search Icon) */}
        <div className="hidden lg:flex items-center gap-3">
          <Link href="/dashboard">
            <PillButton variant="outline" size="sm">
              Session History
            </PillButton>
          </Link>

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
