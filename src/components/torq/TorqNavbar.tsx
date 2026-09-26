"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Search, Menu, X, Cpu, Sparkles } from "lucide-react";
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
    { label: "Docs", href: "#capabilities" },
  ];

  return (
    <header
      className={`sticky top-0 z-50 w-full bg-white transition-all duration-200 ${
        scrolled ? "shadow-[0_4px_20px_rgba(0,0,0,0.06)] border-b border-[#F6F6F5]" : "border-b border-transparent"
      }`}
    >
      <div className="max-w-[1280px] mx-auto px-6 h-[72px] flex items-center justify-between">
        
        {/* Left: TORQ Logo ('T' square badge + lowercase 'torq' wordmark) */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 bg-[#E5402C] rounded-xl flex items-center justify-center text-white font-bold text-lg tracking-tight shadow-sm group-hover:bg-[#CF3722] transition-colors">
            <span className="font-sans font-extrabold text-xl leading-none">
              T
            </span>
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-2xl tracking-[-0.03em] text-[#1A1A1A] leading-none">
              torq
            </span>
            <span className="text-[10px] font-medium tracking-tight text-[#9A9A9A] mt-0.5 hidden sm:inline">
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
              className="text-[14px] font-medium text-[#1A1A1A] hover:text-[#E5402C] transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right Actions */}
        <div className="hidden xl:flex items-center gap-3">
          
          {/* AI Engine Status Badge */}
          <div className="flex items-center gap-1.5 px-3 py-1 bg-[#FAF4F2] border border-[#F6C9BE]/70 rounded-full text-xs text-[#1A1A1A]">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-medium text-[11px] text-[#6E6E6E]">Groq · Llama 3.3 70B:</span>
            <span className="font-semibold text-[11px] text-[#E5402C]">Active</span>
          </div>

          {/* Search Icon */}
          <button
            type="button"
            aria-label="Search Diagnostic Database"
            className="w-8 h-8 rounded-full flex items-center justify-center text-[#1A1A1A] hover:text-[#E5402C] hover:bg-[#F6F6F5] transition-colors"
          >
            <Search className="w-4 h-4 stroke-[1.75]" />
          </button>

          {/* Right Pills */}
          <Link href="/diagnostics/new">
            <PillButton variant="outline" size="sm">
              New Diagnosis
            </PillButton>
          </Link>

          <Link href="/dashboard">
            <PillButton variant="outline" size="sm">
              Session History
            </PillButton>
          </Link>

          <Link href="/fleet">
            <PillButton variant="light" size="sm" showIcon={false}>
              Fleet Portal
            </PillButton>
          </Link>

        </div>

        {/* Mobile / Tablet Compact Right Action */}
        <div className="flex xl:hidden items-center gap-2">
          <Link href="/diagnostics/new">
            <PillButton variant="solid" size="sm" showIcon={false}>
              New Diagnosis
            </PillButton>
          </Link>

          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-[#1A1A1A] hover:text-[#E5402C] transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-white border-b border-[#F6F6F5] px-6 py-6 shadow-xl space-y-4 animate-in fade-in slide-in-from-top-2 duration-150">
          
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#FAF4F2] border border-[#F6C9BE]/70 rounded-full text-xs text-[#1A1A1A] w-fit">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[11px] text-[#6E6E6E]">Groq Llama 3.3 70B:</span>
            <span className="font-semibold text-[11px] text-[#E5402C]">Active Engine</span>
          </div>

          <nav className="flex flex-col space-y-3">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-base font-medium text-[#1A1A1A] hover:text-[#E5402C] py-1"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="pt-4 border-t border-[#F6F6F5] flex flex-col gap-2.5">
            <Link href="/diagnostics/new">
              <PillButton variant="solid" size="md" className="w-full">
                New Diagnosis
              </PillButton>
            </Link>
            <Link href="/dashboard">
              <PillButton variant="outline" size="md" className="w-full">
                Session History
              </PillButton>
            </Link>
            <Link href="/fleet">
              <PillButton variant="light" size="md" showIcon={false} className="w-full">
                Fleet Portal
              </PillButton>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
