"use client";

import React, { useState } from "react";
import { ArrowRight } from "lucide-react";

interface ServiceItem {
  id: string;
  title: string;
  subtitle: string;
  isActive?: boolean;
}

export const ServicesSection: React.FC = () => {
  const [selectedService, setSelectedService] = useState<string>("rail");

  const services: ServiceItem[] = [
    // Row 1
    {
      id: "road",
      title: "Road",
      subtitle: "Full & partial truck loads across Europe",
    },
    {
      id: "rail",
      title: "Rail",
      subtitle: "Eco-friendly intermodal rail freight corridors",
      isActive: true,
    },
    {
      id: "air",
      title: "Air",
      subtitle: "Global express air cargo connections",
    },
    {
      id: "sea",
      title: "Sea",
      subtitle: "FCL and LCL container seafreight worldwide",
    },
    // Row 2
    {
      id: "customs",
      title: "Customs",
      subtitle: "Digital border clearance & tax handling",
    },
    {
      id: "logistics",
      title: "Logistics",
      subtitle: "Warehousing, pick & pack, fulfillment",
    },
    {
      id: "digital",
      title: "Digital solutions",
      subtitle: "API, real-time telemetry & e-booking",
    },
    {
      id: "benefits",
      title: "Other benefits",
      subtitle: "Special transports, hazardous & green cargo",
    },
  ];

  /* 8 CUSTOM FLAT/ISOMETRIC MINI-ILLUSTRATIONS */
  const renderIsometricIllustration = (id: string, isWhite: boolean) => {
    const mainColor = isWhite ? "#FFFFFF" : "#E5402C";
    const lightTone = isWhite ? "rgba(255,255,255,0.75)" : "#F7A3B1";
    const darkTone = isWhite ? "rgba(255,255,255,0.4)" : "#BC132E";
    const shadowTone = isWhite ? "rgba(0,0,0,0.12)" : "rgba(229,64,44,0.12)";

    switch (id) {
      case "road":
        return (
          <svg width="64" height="48" viewBox="0 0 64 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <ellipse cx="32" cy="40" rx="26" ry="7" fill={shadowTone} />
            {/* Trailer Body */}
            <path d="M12 20 L36 10 L50 18 L26 28 Z" fill={lightTone} />
            <path d="M12 20 L26 28 L26 36 L12 28 Z" fill={mainColor} />
            <path d="M26 28 L50 18 L50 26 L26 36 Z" fill={darkTone} />
            {/* Cab Front */}
            <path d="M42 22 L54 16 L58 20 L46 26 Z" fill={mainColor} />
            <path d="M46 26 L58 20 L58 32 L46 38 Z" fill={darkTone} />
            {/* Wheels */}
            <circle cx="19" cy="35" r="3.5" fill="#1A1A1A" />
            <circle cx="38" cy="37" r="3.5" fill="#1A1A1A" />
            <circle cx="52" cy="37" r="3.5" fill="#1A1A1A" />
          </svg>
        );

      case "rail":
        return (
          <svg width="64" height="48" viewBox="0 0 64 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <ellipse cx="32" cy="40" rx="26" ry="7" fill={shadowTone} />
            {/* Train Locomotive */}
            <path d="M14 18 L38 8 L52 16 L28 26 Z" fill={lightTone} />
            <path d="M14 18 L28 26 L28 36 L14 28 Z" fill={mainColor} />
            <path d="M28 26 L52 16 L52 26 L28 36 Z" fill={darkTone} />
            {/* Windshield */}
            <path d="M42 16 L48 13 L50 16 L44 19 Z" fill={isWhite ? "rgba(255,255,255,0.9)" : "#FDE8EB"} />
            {/* Pantograph */}
            <path d="M26 12 L30 5 L36 8 L32 15" stroke={isWhite ? "#FFFFFF" : "#1A1A1A"} strokeWidth="1.5" fill="none" />
            {/* Wheels */}
            <circle cx="20" cy="35" r="3" fill="#1A1A1A" />
            <circle cx="36" cy="36" r="3" fill="#1A1A1A" />
            <circle cx="46" cy="33" r="3" fill="#1A1A1A" />
          </svg>
        );

      case "air":
        return (
          <svg width="64" height="48" viewBox="0 0 64 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <ellipse cx="32" cy="42" rx="22" ry="5" fill={shadowTone} />
            {/* Airplane Body */}
            <path d="M8 26 C18 20, 42 12, 54 14 C56 15, 52 22, 42 26 C30 30, 14 30, 8 26 Z" fill={mainColor} />
            {/* Wings */}
            <path d="M22 23 L34 8 L38 12 L28 25 Z" fill={lightTone} />
            <path d="M26 27 L32 38 L36 37 L30 26 Z" fill={darkTone} />
            {/* Tail Fin */}
            <path d="M12 24 L10 14 L16 16 L16 23 Z" fill={darkTone} />
          </svg>
        );

      case "sea":
        return (
          <svg width="64" height="48" viewBox="0 0 64 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <ellipse cx="32" cy="42" rx="28" ry="6" fill={shadowTone} />
            {/* Ship Hull */}
            <path d="M10 26 L46 16 L56 22 L22 34 Z" fill={lightTone} />
            <path d="M10 26 L22 34 L22 39 L12 33 Z" fill={darkTone} />
            <path d="M22 34 L56 22 L52 30 L22 39 Z" fill={mainColor} />
            {/* Containers Stack */}
            <path d="M24 20 L36 15 L44 19 L32 24 Z" fill={isWhite ? "rgba(255,255,255,0.9)" : "#F3758A"} />
            <path d="M24 20 L32 24 L32 28 L24 24 Z" fill={isWhite ? "#FFFFFF" : "#E5402C"} />
            <path d="M32 24 L44 19 L44 23 L32 28 Z" fill={darkTone} />
          </svg>
        );

      case "customs":
        return (
          <svg width="64" height="48" viewBox="0 0 64 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <ellipse cx="32" cy="40" rx="22" ry="6" fill={shadowTone} />
            {/* Booth */}
            <path d="M18 20 L30 14 L40 19 L28 25 Z" fill={lightTone} />
            <path d="M18 20 L28 25 L28 36 L18 31 Z" fill={mainColor} />
            <path d="M28 25 L40 19 L40 30 L28 36 Z" fill={darkTone} />
            {/* Barrier Gate Arm */}
            <path d="M38 27 L56 20 L56 23 L38 30 Z" fill={isWhite ? "#FFFFFF" : "#E5402C"} />
            <path d="M44 23 L47 22 L47 25 L44 26 Z" fill={isWhite ? "#CF3722" : "#FFFFFF"} />
            <path d="M50 21 L53 20 L53 23 L50 24 Z" fill={isWhite ? "#CF3722" : "#FFFFFF"} />
          </svg>
        );

      case "logistics":
        return (
          <svg width="64" height="48" viewBox="0 0 64 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <ellipse cx="32" cy="40" rx="24" ry="6" fill={shadowTone} />
            {/* Warehouse Facility */}
            <path d="M14 18 L34 8 L50 16 L30 26 Z" fill={lightTone} />
            <path d="M14 18 L30 26 L30 36 L14 28 Z" fill={mainColor} />
            <path d="M30 26 L50 16 L50 26 L30 36 Z" fill={darkTone} />
            {/* Loading Dock Bay Door */}
            <path d="M34 26 L42 22 L42 31 L34 35 Z" fill={isWhite ? "rgba(255,255,255,0.8)" : "#FDE8EB"} />
          </svg>
        );

      case "digital":
        return (
          <svg width="64" height="48" viewBox="0 0 64 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <ellipse cx="32" cy="40" rx="22" ry="6" fill={shadowTone} />
            {/* Terminal Monitor Screen */}
            <path d="M18 16 L36 8 L48 14 L30 22 Z" fill={lightTone} />
            <path d="M18 16 L30 22 L30 32 L18 26 Z" fill={mainColor} />
            <path d="M30 22 L48 14 L48 24 L30 32 Z" fill={darkTone} />
            {/* Glowing Telemetry Graph Line */}
            <path d="M22 22 L26 20 L28 23 L34 17 L38 21" stroke={isWhite ? "#FFFFFF" : "#FDE8EB"} strokeWidth="1.5" fill="none" />
            <circle cx="34" cy="17" r="1.5" fill={isWhite ? "#FFFFFF" : "#FDE8EB"} />
          </svg>
        );

      case "benefits":
        return (
          <svg width="64" height="48" viewBox="0 0 64 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <ellipse cx="32" cy="40" rx="22" ry="6" fill={shadowTone} />
            {/* Multi-tier Hexagon Star / Badge */}
            <path d="M20 18 L32 10 L44 17 L32 25 Z" fill={lightTone} />
            <path d="M20 18 L32 25 L32 35 L20 28 Z" fill={mainColor} />
            <path d="M32 25 L44 17 L44 27 L32 35 Z" fill={darkTone} />
            {/* Eco Leaf Accent */}
            <path d="M30 14 C35 12, 38 18, 32 20 C28 20, 28 15, 30 14 Z" fill={isWhite ? "#FFFFFF" : "#10B981"} />
          </svg>
        );

      default:
        return null;
    }
  };

  return (
    <section id="services" className="relative w-full bg-[#F6F6F5] py-24 lg:py-28">
      <div className="max-w-[1280px] mx-auto px-6 space-y-12">
        
        {/* SECTION HEADER */}
        <div className="space-y-3 max-w-2xl">
          {/* Eyebrow Label with small red dot */}
          <div className="inline-flex items-center gap-2 text-[12px] font-medium tracking-[0.08em] uppercase text-[#9A9A9A]">
            <span className="w-2 h-2 rounded-full bg-[#E5402C]" />
            <span>PERFORMANCES</span>
          </div>

          {/* Section Heading */}
          <h2 className="text-[28px] sm:text-[34px] font-normal tracking-[-0.01em] text-[#1A1A1A]">
            Our wide range of services
          </h2>

          <p className="text-[14px] text-[#6E6E6E] leading-relaxed">
            From flexible overland transport to intermodal rail solutions and temperature-controlled contract logistics, discover reliable European transport infrastructure.
          </p>
        </div>

        {/* 4 COLS × 2 ROWS SERVICE GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {services.map((service) => {
            const isSelected = selectedService === service.id;

            return (
              <div
                key={service.id}
                onClick={() => setSelectedService(service.id)}
                className={`group relative rounded-[20px] p-6 transition-all duration-200 cursor-pointer min-h-[190px] flex flex-col justify-between ${
                  isSelected
                    ? "bg-[#E5402C] text-white shadow-[0_16px_36px_rgba(229,64,44,0.28)] translate-y-[-4px]"
                    : "bg-white text-[#1A1A1A] border border-[#EBEBEA] shadow-[0_1px_3px_rgba(0,0,0,0.04)] hover:shadow-[0_10px_25px_rgba(0,0,0,0.06)] hover:translate-y-[-4px]"
                }`}
              >
                {/* Top: Isometric Mini-Illustration */}
                <div className="flex items-start justify-between">
                  <div className="transition-transform duration-200 group-hover:scale-105">
                    {renderIsometricIllustration(service.id, isSelected)}
                  </div>

                  {/* Active Indicator or subtle tag */}
                  {isSelected && (
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-white/20 text-white">
                      Selected
                    </span>
                  )}
                </div>

                {/* Bottom: Label & Description */}
                <div className="pt-4 flex items-end justify-between">
                  <div>
                    <h3
                      className={`text-[15px] font-medium tracking-tight ${
                        isSelected ? "text-white font-semibold" : "text-[#1A1A1A]"
                      }`}
                    >
                      {service.title}
                    </h3>
                    <p
                      className={`text-[12px] mt-0.5 leading-snug line-clamp-1 ${
                        isSelected ? "text-white/80" : "text-[#6E6E6E]"
                      }`}
                    >
                      {service.subtitle}
                    </p>
                  </div>

                  {/* The ACTIVE card has a white "Learn more →" text link */}
                  {isSelected && (
                    <div className="text-[12px] font-medium text-white flex items-center gap-1 shrink-0 ml-2 group-hover:underline">
                      <span>Learn more</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* BOTTOM INFORMATIONAL CALLOUT STRIP */}
        <div className="bg-white rounded-[20px] p-6 sm:p-8 border border-[#EBEBEA] flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
          <div className="space-y-1">
            <span className="text-[11px] font-semibold tracking-wider uppercase text-[#E5402C]">
              SUSTAINABLE LOGISTICS INITIATIVE
            </span>
            <h4 className="text-[18px] font-medium text-[#1A1A1A]">
              Combined rail-road transports save up to 80% CO₂
            </h4>
            <p className="text-[13px] text-[#6E6E6E] max-w-xl leading-relaxed">
              Emons operates dedicated block trains connecting major European industrial ports with inland terminals, combining rail efficiency with flexible road last-mile delivery.
            </p>
          </div>

          <div className="shrink-0 flex items-center gap-3">
            <a
              href="#contacts"
              className="inline-flex items-center justify-center font-medium rounded-full text-[13px] px-5 py-2.5 bg-[#E5402C] text-white hover:bg-[#CF3722] transition-colors shadow-sm gap-2"
            >
              <span>Calculate CO₂ footprint</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

      </div>
    </section>
  );
};
