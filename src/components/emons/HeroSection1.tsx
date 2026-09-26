"use client";

import React, { useState } from "react";
import Image from "next/image";
import { 
  Building2, 
  ArrowRight, 
  Plus, 
  CheckCircle2, 
  ShieldCheck, 
  Truck, 
  Compass, 
  PhoneCall, 
  MessageSquare,
  Sparkles,
  Layers,
  MapPin
} from "lucide-react";
import { PillButton } from "./PillButton";

export const HeroSection1: React.FC = () => {
  const [activeHotspot, setActiveHotspot] = useState(false);

  return (
    <section className="relative w-full bg-[#DCE7DE] py-12 md:py-16 overflow-hidden">
      
      {/* Faint Abstract Line / Blob Background Decorations */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <circle cx="10%" cy="20%" r="220" fill="#B7CEC1" opacity="0.3" />
          <circle cx="85%" cy="75%" r="300" fill="#B7CEC1" opacity="0.4" />
          <path
            d="M -100 200 C 300 150, 600 450, 1400 300"
            fill="none"
            stroke="#7C9C8C"
            strokeWidth="1.5"
            strokeDasharray="6 8"
            opacity="0.25"
          />
        </svg>
      </div>

      <div className="relative max-w-[1280px] mx-auto px-6">
        
        {/* FRAMED ILLUSTRATION CONTAINER */}
        <div className="relative w-full rounded-[16px] overflow-hidden bg-white shadow-[0_20px_60px_rgba(26,26,26,0.08)] border border-white/60">
          
          {/* THIN NAV BAR STRIP ALONG TOP OF ILLUSTRATION (Product Screenshot UI) */}
          <div className="w-full h-11 bg-white/95 backdrop-blur-sm border-b border-[#F6F6F5] px-4 sm:px-6 flex items-center justify-between z-20 relative">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-1.5">
                <div className="w-5 h-5 bg-[#E5402C] rounded-[4px] flex items-center justify-center text-white text-[10px] font-black italic">
                  E
                </div>
                <span className="font-semibold text-xs tracking-tight text-[#1A1A1A]">
                  emons
                </span>
              </div>
              <div className="hidden sm:flex items-center gap-4 text-[11px] font-medium text-[#6E6E6E]">
                <span className="text-[#1A1A1A]">Logistik</span>
                <span>Spedition</span>
                <span>Netzwerk</span>
                <span>Standorte</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="hidden md:inline-flex items-center gap-1 text-[11px] text-[#9A9A9A]">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Live Hub Status: Active
              </span>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  className="px-2.5 py-1 text-[11px] font-medium text-[#E5402C] border border-[#F6C9BE] rounded-full hover:bg-[#FDF2F0] transition-colors"
                >
                  Sendungsverfolgung
                </button>
                <button
                  type="button"
                  className="px-2.5 py-1 text-[11px] font-medium text-white bg-[#E5402C] rounded-full hover:bg-[#CF3722] transition-colors flex items-center gap-1"
                >
                  <MessageSquare className="w-3 h-3" />
                  <span>Live Chat</span>
                </button>
              </div>
            </div>
          </div>

          {/* MAIN ISOMETRIC WAREHOUSE VISUAL */}
          <div className="relative w-full h-[460px] sm:h-[580px] lg:h-[680px]">
            <Image
              src="/images/emons_warehouse_iso.jpg"
              alt="Emons European Logistics Center and Loading Dock Isometric View"
              fill
              priority
              className="object-cover object-center"
              sizes="(max-width: 1280px) 100vw, 1280px"
            />

            {/* OVERLAY GRADIENT FOR READABILITY */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/15 via-transparent to-transparent pointer-events-none" />

            {/* FLOATING CARD 1: TOP-RIGHT "Logistikzentrum Laderampe" */}
            <div className="hidden md:block absolute top-6 right-6 w-[310px] bg-white/95 backdrop-blur-md rounded-[16px] p-5 shadow-[0_12px_36px_rgba(26,26,26,0.12)] border border-white/80 z-20">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#FAF4F2] text-[#E5402C] flex items-center justify-center shrink-0 border border-[#F6C9BE]/50">
                  <Building2 className="w-4 h-4" />
                </div>
                <div className="space-y-0.5">
                  <h4 className="text-[14px] font-semibold text-[#1A1A1A] leading-tight">
                    Logistikzentrum Laderampe
                  </h4>
                  <p className="text-[12px] text-[#6E6E6E] leading-snug">
                    Hub Köln-Gremberghoven Central Hub
                  </p>
                </div>
              </div>

              {/* Stats List (4 Rows) */}
              <div className="mt-4 pt-3 border-t border-[#F6F6F5] space-y-2 text-[12px]">
                <div className="flex items-center justify-between">
                  <span className="text-[#6E6E6E]">Warehouses</span>
                  <span className="font-semibold text-[#1A1A1A]">150+ locations</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#6E6E6E]">On-time delivery</span>
                  <span className="font-semibold text-emerald-600">99.2% rate</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#6E6E6E]">Shipments processed</span>
                  <span className="font-semibold text-[#1A1A1A]">1M+ per annum</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#6E6E6E]">Years of service</span>
                  <span className="font-semibold text-[#1A1A1A]">95 years</span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-[#F6F6F5] flex justify-between items-center">
                <a
                  href="#services"
                  className="text-[12px] font-semibold text-[#E5402C] hover:text-[#CF3722] flex items-center gap-1 group"
                >
                  <span>Our Logistics Solutions</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </a>
              </div>
            </div>

            {/* FLOATING CARD 2: BOTTOM-LEFT "Logistiklösungen mit Emons" */}
            <div className="hidden sm:block absolute bottom-6 left-6 max-w-[380px] bg-white/95 backdrop-blur-md rounded-[16px] p-6 shadow-[0_12px_36px_rgba(26,26,26,0.12)] border border-white/80 z-20 space-y-4">
              <div className="space-y-1.5">
                <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-[#9A9A9A]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#E5402C]" />
                  Corporate Freight Intelligence
                </span>
                <h3 className="text-[18px] font-medium tracking-tight text-[#1A1A1A] leading-snug">
                  Logistiklösungen mit Emons
                </h3>
                <p className="text-[13px] text-[#6E6E6E] leading-relaxed">
                  Tailored multi-modal transport and contract logistics. Connecting central European supply chains with zero emission corridor routing.
                </p>
              </div>

              {/* Two Pill CTA Buttons */}
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <PillButton variant="solid" size="sm">
                  Our logistics services
                </PillButton>
                <PillButton variant="outline" size="sm">
                  Our freight forwarding
                </PillButton>
              </div>

              {/* Cluster of 5 Tiny Circular Outline Icon Buttons */}
              <div className="pt-2 border-t border-[#F6F6F5] flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  {[Truck, Layers, Compass, ShieldCheck, MapPin].map((Icon, idx) => (
                    <button
                      key={idx}
                      type="button"
                      className="w-7 h-7 rounded-full border border-[#F6C9BE] text-[#E5402C] hover:bg-[#FDF2F0] hover:border-[#F2A28E] flex items-center justify-center transition-colors"
                      title="Emons Service Indicator"
                    >
                      <Icon className="w-3.5 h-3.5 stroke-[1.75]" />
                    </button>
                  ))}
                </div>
                <span className="text-[11px] font-medium text-[#9A9A9A]">
                  ISO 9001:2015
                </span>
              </div>
            </div>

            {/* FLOATING HOTSPOT MARKER (+) MID-SCENE */}
            <div className="absolute top-[48%] left-[45%] z-20">
              <button
                type="button"
                onClick={() => setActiveHotspot(!activeHotspot)}
                className="relative group w-8 h-8 rounded-full bg-[#E5402C] text-white flex items-center justify-center shadow-lg hover:bg-[#CF3722] hover:scale-105 transition-all"
                title="Loading Bay Sensor Telemetry"
              >
                <span className="absolute inset-0 rounded-full bg-[#E5402C] animate-ping opacity-30" />
                <Plus className={`w-4 h-4 transition-transform duration-200 ${activeHotspot ? "rotate-45" : ""}`} />
              </button>

              {/* Interactive Tooltip Card */}
              {activeHotspot && (
                <div className="absolute left-10 top-0 w-60 bg-white rounded-xl p-3.5 shadow-xl border border-[#F6F6F5] text-xs z-30 animate-in fade-in zoom-in-95 duration-150">
                  <div className="font-semibold text-[#1A1A1A] flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    Bay 14: Electric Fleet Loading
                  </div>
                  <p className="text-[#6E6E6E] text-[11px] mt-1 leading-snug">
                    Real-time automated dock management. Fast-turnaround turnarounds under 35 mins.
                  </p>
                </div>
              )}
            </div>

            {/* BOTTOM-RIGHT PARTIALLY VISIBLE PILL CTA */}
            <div className="hidden lg:flex absolute bottom-6 right-6 items-center gap-2 z-20">
              <PillButton variant="light" size="sm">
                Zu allen Leistungen
              </PillButton>
            </div>

          </div>

        </div>

        {/* MOBILE FALLBACK STACKED CARDS (So information is perfectly readable on phones) */}
        <div className="mt-6 md:hidden space-y-4">
          <div className="bg-white rounded-[16px] p-5 shadow-sm border border-white space-y-3">
            <h4 className="text-[16px] font-semibold text-[#1A1A1A]">
              Logistikzentrum Laderampe
            </h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2 bg-[#F6F6F5] rounded-lg">
                <span className="text-[#6E6E6E] block text-[10px]">Warehouses</span>
                <span className="font-bold text-[#1A1A1A]">150+ Hubs</span>
              </div>
              <div className="p-2 bg-[#F6F6F5] rounded-lg">
                <span className="text-[#6E6E6E] block text-[10px]">On-time Rate</span>
                <span className="font-bold text-emerald-600">99.2%</span>
              </div>
            </div>
            <div className="flex gap-2 pt-1">
              <PillButton variant="solid" size="sm">
                Our logistics services
              </PillButton>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
