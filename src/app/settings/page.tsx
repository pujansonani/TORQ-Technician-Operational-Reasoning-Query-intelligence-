"use client";

import React, { useState } from "react";
import { 
  User, 
  Building2, 
  Bell, 
  Cpu, 
  ShieldCheck, 
  Info,
  Check,
  Save,
  RotateCcw,
  Sparkles,
  Sliders
} from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { useTorqStore } from "@/lib/store";

export default function SettingsPage() {
  const { demoMode, setDemoMode, resetDemoSession } = useTorqStore();

  const [technicianName, setTechnicianName] = useState("Siddhi (Lead Diagnostics)");
  const [workshopName, setWorkshopName] = useState("PACCAR Regional Service Center #402");
  const [laborRate, setLaborRate] = useState("1000");
  const [safetyStrictness, setSafetyStrictness] = useState("Strict (TORQ-LOCK Enforced)");
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  return (
    <AppShell>
      <div className="max-w-3xl mx-auto space-y-10 py-2">
        
        {/* Header - Apple HIG Typography */}
        <div className="space-y-2 pb-6 border-b border-black/[0.06]">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-red-50 text-[#E5402C] border border-[#F6C9BE]">
            <Sliders className="w-3.5 h-3.5" />
            <span>TORQ Configuration Hub</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#111827]">
            Workshop <span className="italic font-bold text-[#E5402C]">Settings</span>
          </h1>
          <p className="text-sm text-[#4B5563] max-w-xl font-normal leading-relaxed">
            Configure dealership parameters, labor standards, and TORQ-LOCK safety verification levels.
          </p>
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          
          {/* PROFILE & TECHNICIAN */}
          <div className="p-8 bg-white rounded-[24px] border border-black/[0.08] shadow-[0_4px_24px_rgba(0,0,0,0.03)] space-y-5">
            <div className="flex items-center gap-2.5 border-b border-black/[0.06] pb-4">
              <div className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center text-[#E5402C]">
                <User className="w-4 h-4" />
              </div>
              <h2 className="text-lg font-extrabold tracking-tight text-[#111827]">
                Technician Profile
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#374151] uppercase tracking-wider mb-2">
                  Lead Technician Name
                </label>
                <input
                  type="text"
                  value={technicianName}
                  onChange={(e) => setTechnicianName(e.target.value)}
                  className="w-full h-12 px-4 bg-[#FAFBFB] text-[#111827] text-sm font-medium rounded-xl border border-black/[0.12] focus:outline-none focus:ring-2 focus:ring-[#E5402C]/20 focus:border-[#E5402C] transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#374151] uppercase tracking-wider mb-2">
                  Dealer / Workshop Facility
                </label>
                <input
                  type="text"
                  value={workshopName}
                  onChange={(e) => setWorkshopName(e.target.value)}
                  className="w-full h-12 px-4 bg-[#FAFBFB] text-[#111827] text-sm font-medium rounded-xl border border-black/[0.12] focus:outline-none focus:ring-2 focus:ring-[#E5402C]/20 focus:border-[#E5402C] transition-all"
                />
              </div>
            </div>
          </div>

          {/* PRICING & LABOR STANDARDS */}
          <div className="p-8 bg-white rounded-[24px] border border-black/[0.08] shadow-[0_4px_24px_rgba(0,0,0,0.03)] space-y-5">
            <div className="flex items-center gap-2.5 border-b border-black/[0.06] pb-4">
              <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                <Building2 className="w-4 h-4" />
              </div>
              <h2 className="text-lg font-extrabold tracking-tight text-[#111827]">
                Workshop Commercial Rates
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#374151] uppercase tracking-wider mb-2">
                  Standard Labor Rate (INR / hr)
                </label>
                <input
                  type="number"
                  value={laborRate}
                  onChange={(e) => setLaborRate(e.target.value)}
                  className="w-full h-12 px-4 font-mono font-bold bg-[#FAFBFB] text-[#111827] text-sm rounded-xl border border-black/[0.12] focus:outline-none focus:ring-2 focus:ring-[#E5402C]/20 focus:border-[#E5402C] transition-all"
                />
                <span className="text-[11px] text-[#6B7280] mt-1.5 block">
                  Used for real-time customer repair cost approximations
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#374151] uppercase tracking-wider mb-2">
                  Currency Format
                </label>
                <input
                  type="text"
                  value="INR (₹)"
                  disabled
                  className="w-full h-12 px-4 bg-gray-100 text-[#6B7280] text-sm font-medium rounded-xl border border-black/[0.06] cursor-not-allowed"
                />
              </div>
            </div>
          </div>

          {/* TORQ-LOCK & AI REASONING */}
          <div className="p-8 bg-white rounded-[24px] border border-black/[0.08] shadow-[0_4px_24px_rgba(0,0,0,0.03)] space-y-5">
            <div className="flex items-center gap-2.5 border-b border-black/[0.06] pb-4">
              <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <h2 className="text-lg font-extrabold tracking-tight text-[#111827]">
                TORQ-LOCK™ Specification Verifier
              </h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#374151] uppercase tracking-wider mb-2">
                  Specification Safety Enforcement Level
                </label>
                <select
                  value={safetyStrictness}
                  onChange={(e) => setSafetyStrictness(e.target.value)}
                  className="w-full h-12 px-4 bg-[#FAFBFB] text-[#111827] text-sm font-medium rounded-xl border border-black/[0.12] focus:outline-none focus:ring-2 focus:ring-[#E5402C]/20 focus:border-[#E5402C] transition-all"
                >
                  <option value="Strict (TORQ-LOCK Enforced)">Strict (Require OEM Reference Document ID)</option>
                  <option value="Standard">Standard (Advisory Warnings Only)</option>
                  <option value="Permissive">Permissive (Include Heuristic Estimates)</option>
                </select>
                <span className="text-[11px] text-[#6B7280] mt-1.5 block">
                  Strict mode blocks AI from suggesting test pressure ranges without official PACCAR reference numbers.
                </span>
              </div>

              <div className="p-4 rounded-[16px] bg-[#FAFBFB] border border-black/[0.06] flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-[#111827] block">
                    Hackathon Deterministic Demo Mode
                  </span>
                  <span className="text-[11px] text-[#6B7280]">
                    Allows judges to inspect instant deterministic state transitions for SPN 94
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setDemoMode(!demoMode)}
                  className={`px-4 py-2 rounded-full text-xs font-bold transition-all border ${
                    demoMode
                      ? "bg-amber-100 text-amber-900 border-amber-300 shadow-sm"
                      : "bg-white text-[#6B7280] border-black/[0.1]"
                  }`}
                >
                  {demoMode ? "ACTIVE (DEMO)" : "DISABLED"}
                </button>
              </div>
            </div>
          </div>

          {/* SUBMIT ACTIONS */}
          <div className="flex items-center justify-between pt-4">
            <button
              type="button"
              onClick={resetDemoSession}
              className="text-xs font-bold text-[#6B7280] hover:text-[#111827] flex items-center gap-1.5 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset All Session Data</span>
            </button>

            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-[#E5402C] hover:bg-[#CF3722] text-white text-xs font-bold tracking-tight shadow-[0_4px_16px_rgba(229,64,44,0.25)] transition-all"
            >
              {isSaved ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Preferences Saved</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Save Settings</span>
                </>
              )}
            </button>
          </div>

        </form>

      </div>
    </AppShell>
  );
}
