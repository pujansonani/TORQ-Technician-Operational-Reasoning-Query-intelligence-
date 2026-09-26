"use client";

import React from "react";
import { WifiOff, AlertTriangle } from "lucide-react";
import { TorqNavbar } from "@/components/torq/TorqNavbar";
import { TorqFooter } from "@/components/torq/TorqFooter";
import { useTorqStore } from "@/lib/store";

interface AppShellProps {
  children: React.ReactNode;
}

export const AppShell: React.FC<AppShellProps> = ({ children }) => {
  const { isOfflineMode } = useTorqStore();

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] text-[#111827] selection:bg-[#E5402C]/15 selection:text-[#E5402C]">
      {/* Offline Mode Warning Banner */}
      {isOfflineMode && (
        <div className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 text-black px-4 py-1.5 text-center text-xs font-extrabold flex items-center justify-center gap-2 shadow-md">
          <WifiOff className="w-4 h-4 animate-pulse" />
          <span>📡 Edge Offline Mode Active — Operating without cloud dependency using local service manuals & edge telemetry.</span>
        </div>
      )}

      {/* Unified True Top Sticky Navbar */}
      <div className={isOfflineMode ? "pt-7" : ""}>
        <TorqNavbar />
      </div>
      
      {/* Apple HIG Content Container */}
      <main className="flex-1 w-full max-w-[1280px] mx-auto px-6 pt-24 sm:pt-28 pb-8 md:pb-12">
        {children}
      </main>

      {/* SEAMLESS GRADIENT BLEND TO FOOTER (#1A1A1A) */}
      <div className="w-full h-24 sm:h-36 bg-gradient-to-b from-[#F8FAFC] to-[#1A1A1A] pointer-events-none" />

      {/* Unified Modern Footer */}
      <TorqFooter />
    </div>
  );
};

