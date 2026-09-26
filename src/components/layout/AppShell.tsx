import React from "react";
import { TopNav } from "./TopNav";

interface AppShellProps {
  children: React.ReactNode;
}

export const AppShell: React.FC<AppShellProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-surface-subtle text-industrial-dark">
      <TopNav />
      <main className="flex-1 w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
        {children}
      </main>
      <footer className="w-full bg-white border-t border-surface-border py-6 text-xs text-industrial-muted">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-industrial-dark">TORQ</span>
            <span>— AI Diagnostic Copilot for Truck Service Technicians</span>
          </div>
          <div className="flex items-center gap-4 text-industrial-steel">
            <span>PACCAR Technical Hackathon MVP</span>
            <span>•</span>
            <span>Evidence-Based Reasoning Engine</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
