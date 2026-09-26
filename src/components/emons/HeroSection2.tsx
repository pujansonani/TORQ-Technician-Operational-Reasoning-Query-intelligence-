"use client";

import React, { useState } from "react";
import Image from "next/image";
import { MessageCircle, HelpCircle, ArrowUpRight, Phone, CheckCircle } from "lucide-react";
import { PillButton } from "./PillButton";

export const HeroSection2: React.FC = () => {
  const [showSupportModal, setShowSupportModal] = useState(false);

  return (
    <section className="relative w-full bg-white py-20 lg:py-28 overflow-hidden">
      
      {/* THIN SPARSE RED CURVED LINE-ART DOODLES (Abstract Route / Transport Paths) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <svg
          className="w-full h-full"
          viewBox="0 0 1440 700"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M 120 180 C 400 80, 750 420, 1100 220 C 1280 120, 1380 280, 1500 240"
            stroke="#E5402C"
            strokeWidth="1.2"
            strokeDasharray="4 6"
            opacity="0.18"
          />
          <path
            d="M -80 480 C 250 430, 480 620, 850 510 C 1120 420, 1320 580, 1520 460"
            stroke="#E5402C"
            strokeWidth="1"
            opacity="0.12"
          />
          <circle cx="850" cy="510" r="4" fill="#E5402C" opacity="0.25" />
          <circle cx="1100" cy="220" r="4" fill="#E5402C" opacity="0.25" />
        </svg>
      </div>

      <div className="relative max-w-[1280px] mx-auto px-6">
        
        {/* EDITORIAL SPLIT GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* LEFT SIDE: HEADLINE & ACTIONS (6 COLS) */}
          <div className="lg:col-span-6 space-y-8 z-10">
            
            {/* Eyebrow Label */}
            <div className="inline-flex items-center gap-2 text-[12px] font-medium tracking-[0.08em] uppercase text-[#9A9A9A]">
              <span className="w-2 h-2 rounded-full bg-[#E5402C]" />
              <span>FREIGHT FORWARDING • SINCE 1928</span>
            </div>

            {/* 3-Line Display Headline */}
            <h1 className="text-[34px] sm:text-[46px] lg:text-[56px] font-normal tracking-[-0.01em] text-[#1A1A1A] leading-[1.08]">
              <span className="block font-normal">Your cargo.</span>
              <span className="block font-normal">Our mission.</span>
              <span className="block font-medium">Welcome to Emons.</span>
            </h1>

            {/* Two Outlined Pill Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <PillButton variant="outline" size="md">
                Shipment tracking
              </PillButton>

              <PillButton variant="outline" size="md">
                Freight request
              </PillButton>
            </div>

            {/* Quick Metrics Strip */}
            <div className="pt-6 border-t border-[#F6F6F5] grid grid-cols-3 gap-4 text-left">
              <div>
                <span className="block text-2xl font-normal text-[#1A1A1A] tracking-tight">150+</span>
                <span className="text-[12px] text-[#6E6E6E]">Depots across Europe</span>
              </div>
              <div>
                <span className="block text-2xl font-normal text-[#1A1A1A] tracking-tight">3,500+</span>
                <span className="text-[12px] text-[#6E6E6E]">Dedicated vehicles</span>
              </div>
              <div>
                <span className="block text-2xl font-normal text-emerald-600 tracking-tight">99.2%</span>
                <span className="text-[12px] text-[#6E6E6E]">Punctuality standard</span>
              </div>
            </div>

          </div>

          {/* RIGHT SIDE: LARGE CUTOUT TRUCK PHOTO & HERITAGE COPY (6 COLS) */}
          <div className="lg:col-span-6 relative flex flex-col items-center lg:items-end">
            
            {/* Cutout Truck Photo (No background box, soft drop shadow beneath) */}
            <div className="relative w-full max-w-[560px] h-[300px] sm:h-[380px] lg:h-[420px] transition-transform duration-500 hover:scale-[1.01]">
              <Image
                src="/images/emons_red_truck.jpg"
                alt="Emons Modern Red Freight Truck Livery"
                fill
                priority
                className="object-contain object-center drop-shadow-[0_24px_32px_rgba(26,26,26,0.14)]"
                sizes="(max-width: 1024px) 100vw, 560px"
              />
            </div>

            {/* Heritage Paragraph Text (Max width ~340px) */}
            <div className="w-full max-w-[340px] mt-4 lg:mt-6 text-left self-start lg:self-end">
              <p className="text-[14px] sm:text-[15px] font-normal text-[#6E6E6E] leading-[1.7]">
                Since 1928, Emons has stood for quality, flexibility and innovation across all European freight corridors. With tailor-made transport and logistics concepts, we ensure your goods arrive safely, reliably and sustainably at their destination.
              </p>
            </div>

          </div>

        </div>

      </div>

      {/* BOTTOM-RIGHT CORNER: TWO FLOATING CIRCULAR CHAT/HELP WIDGET BUTTONS */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col gap-2.5">
        
        {/* Chat Button */}
        <button
          type="button"
          onClick={() => setShowSupportModal(!showSupportModal)}
          aria-label="Open Live Chat"
          className="w-12 h-12 rounded-full bg-white text-[#E5402C] shadow-[0_8px_24px_rgba(26,26,26,0.12)] border border-[#F6C9BE]/60 flex items-center justify-center hover:bg-[#FDF2F0] hover:scale-105 active:scale-95 transition-all"
          title="Emons Direct Dispatcher Chat"
        >
          <MessageCircle className="w-5 h-5 stroke-[1.75]" />
        </button>

        {/* Help / Call Button */}
        <button
          type="button"
          onClick={() => alert("Emons European Service Hotline: +49 (0) 221 8283-0")}
          aria-label="Call Dispatch Hotline"
          className="w-12 h-12 rounded-full bg-white text-[#E5402C] shadow-[0_8px_24px_rgba(26,26,26,0.12)] border border-[#F6C9BE]/60 flex items-center justify-center hover:bg-[#FDF2F0] hover:scale-105 active:scale-95 transition-all"
          title="Dispatcher Hotline"
        >
          <HelpCircle className="w-5 h-5 stroke-[1.75]" />
        </button>

      </div>

      {/* Floating Chat Support Drawer / Modal */}
      {showSupportModal && (
        <div className="fixed bottom-24 right-6 z-50 w-80 bg-white rounded-[20px] p-5 shadow-[0_20px_50px_rgba(26,26,26,0.18)] border border-[#F6F6F5] animate-in fade-in slide-in-from-bottom-4 duration-200">
          <div className="flex items-center justify-between pb-3 border-b border-[#F6F6F5]">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-sm font-semibold text-[#1A1A1A]">Emons Live Helpdesk</span>
            </div>
            <button
              onClick={() => setShowSupportModal(false)}
              className="text-[#9A9A9A] hover:text-[#1A1A1A] text-xs"
            >
              ✕
            </button>
          </div>
          <p className="text-xs text-[#6E6E6E] mt-2.5 leading-relaxed">
            Need an immediate freight quote or customs transit clarification? Our dispatch team is online.
          </p>
          <div className="mt-3.5 space-y-2">
            <PillButton variant="solid" size="sm" className="w-full">
              Start dispatch chat
            </PillButton>
            <PillButton variant="outline" size="sm" className="w-full" showIcon={false}>
              Schedule callback
            </PillButton>
          </div>
        </div>
      )}

    </section>
  );
};
