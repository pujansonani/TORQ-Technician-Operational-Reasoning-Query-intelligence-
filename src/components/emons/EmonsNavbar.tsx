"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Search, ChevronDown, Menu, X } from "lucide-react";
import { PillButton } from "./PillButton";

export const EmonsNavbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: "About us", href: "#about" },
    { label: "Services", href: "#services" },
    { label: "Contacts", href: "#contacts" },
    { label: "Customer area", href: "#customer-area" },
    { label: "Careers", href: "#careers" },
  ];

  return (
    <header
      className={`sticky top-0 z-50 w-full bg-white transition-all duration-200 ${
        scrolled ? "shadow-[0_4px_20px_rgba(0,0,0,0.04)]" : ""
      }`}
    >
      <div className="max-w-[1280px] mx-auto px-6 h-[72px] flex items-center justify-between">
        
        {/* Left: Emons Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 bg-[#E5402C] rounded-xl flex items-center justify-center text-white font-bold text-lg tracking-tight shadow-sm group-hover:bg-[#CF3722] transition-colors">
            <span className="italic font-serif font-black text-xl tracking-tighter">
              E
            </span>
          </div>
          <span className="font-semibold text-2xl tracking-[-0.03em] text-[#1A1A1A]">
            emons
          </span>
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
        <div className="hidden xl:flex items-center gap-2.5">
          <PillButton variant="outline" size="sm">
            Shipment tracking
          </PillButton>

          <PillButton variant="outline" size="sm">
            Freight request
          </PillButton>

          <PillButton variant="light" size="sm" showIcon={false}>
            Private customers
          </PillButton>

          {/* Search Icon */}
          <button
            type="button"
            aria-label="Search"
            className="w-8 h-8 rounded-full flex items-center justify-center text-[#1A1A1A] hover:text-[#E5402C] hover:bg-[#F6F6F5] transition-colors ml-1"
          >
            <Search className="w-4 h-4 stroke-[1.75]" />
          </button>

          {/* Language Selector */}
          <button
            type="button"
            className="flex items-center gap-1 text-[13px] font-medium text-[#1A1A1A] hover:text-[#E5402C] px-2 py-1 rounded-md hover:bg-[#F6F6F5] transition-colors"
          >
            <span>UK</span>
            <ChevronDown className="w-3.5 h-3.5 text-[#9A9A9A]" />
          </button>
        </div>

        {/* Mobile / Tablet Compact Right Action */}
        <div className="flex xl:hidden items-center gap-2">
          <PillButton variant="solid" size="sm" showIcon={false}>
            Freight request
          </PillButton>

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
            <PillButton variant="outline" size="md">
              Shipment tracking
            </PillButton>
            <PillButton variant="outline" size="md">
              Freight request
            </PillButton>
            <PillButton variant="light" size="md" showIcon={false}>
              Private customers
            </PillButton>
          </div>
        </div>
      )}
    </header>
  );
};
