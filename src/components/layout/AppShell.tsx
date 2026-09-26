import React from "react";
import { TorqNavbar } from "@/components/torq/TorqNavbar";
import { TorqFooter } from "@/components/torq/TorqFooter";

interface AppShellProps {
  children: React.ReactNode;
}

export const AppShell: React.FC<AppShellProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] text-[#111827] selection:bg-[#E5402C]/15 selection:text-[#E5402C]">
      {/* Unified True Top Sticky Navbar */}
      <TorqNavbar />
      
      {/* Apple HIG Content Container */}
      <main className="flex-1 w-full max-w-[1280px] mx-auto px-6 pt-24 sm:pt-28 pb-8 md:pb-12">
        {children}
      </main>

      {/* Unified Modern Footer */}
      <TorqFooter />
    </div>
  );
};
