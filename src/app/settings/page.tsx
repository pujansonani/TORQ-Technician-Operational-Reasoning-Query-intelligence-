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
  RotateCcw
} from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { useTorqStore } from "@/lib/store";

export default function SettingsPage() {
  const { demoMode, setDemoMode, resetDemoSession } = useTorqStore();

  const [technicianName, setTechnicianName] = useState("Siddhi (Lead Diagnostics)");
  const [workshopName, setWorkshopName] = useState("PACCAR Regional Service Center #402");
  const [laborRate, setLaborRate] = useState("1000");
  const [safetyStrictness, setSafetyStrictness] = useState("Strict (TORQ-Lock Enforced)");
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  return (
    <AppShell>
      <div className="max-w-3xl mx-auto space-y-8 py-4">
        
        {/* Header */}
        <div className="border-b border-surface-border pb-4">
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-industrial-dark">
            Workshop Settings & Configuration
          </h1>
          <p className="text-sm text-industrial-steel mt-1">
            Configure dealership parameters, labor standards, and TORQ-Lock safety verification levels.
          </p>
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          
          {/* PROFILE & TECHNICIAN */}
          <Card className="p-6 bg-white space-y-4" elevated>
            <div className="flex items-center gap-2 border-b border-surface-border pb-3">
              <User className="w-4 h-4 text-paccar-blue" />
              <h2 className="text-base font-semibold text-industrial-dark">
                Technician Profile
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-industrial-steel uppercase tracking-wider mb-1.5">
                  LEAD TECHNICIAN NAME
                </label>
                <input
                  type="text"
                  value={technicianName}
                  onChange={(e) => setTechnicianName(e.target.value)}
                  className="w-full h-11 px-3.5 bg-surface text-industrial-dark text-sm rounded-input border border-surface-border focus:outline-none focus:ring-2 focus:ring-paccar-blue/20 focus:border-paccar-blue"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-industrial-steel uppercase tracking-wider mb-1.5">
                  DEALER / WORKSHOP FACILITY
                </label>
                <input
                  type="text"
                  value={workshopName}
                  onChange={(e) => setWorkshopName(e.target.value)}
                  className="w-full h-11 px-3.5 bg-surface text-industrial-dark text-sm rounded-input border border-surface-border focus:outline-none focus:ring-2 focus:ring-paccar-blue/20 focus:border-paccar-blue"
                />
              </div>
            </div>
          </Card>

          {/* PRICING & LABOR STANDARDS */}
          <Card className="p-6 bg-white space-y-4" elevated>
            <div className="flex items-center gap-2 border-b border-surface-border pb-3">
              <Building2 className="w-4 h-4 text-paccar-blue" />
              <h2 className="text-base font-semibold text-industrial-dark">
                Workshop Commercial Rates
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-industrial-steel uppercase tracking-wider mb-1.5">
                  STANDARD LABOR RATE (INR / HR)
                </label>
                <input
                  type="number"
                  value={laborRate}
                  onChange={(e) => setLaborRate(e.target.value)}
                  className="w-full h-11 px-3.5 font-mono bg-surface text-industrial-dark text-sm rounded-input border border-surface-border focus:outline-none focus:ring-2 focus:ring-paccar-blue/20 focus:border-paccar-blue"
                />
                <span className="text-[11px] text-industrial-muted mt-1 block">
                  Used for real-time customer repair cost approximations
                </span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-industrial-steel uppercase tracking-wider mb-1.5">
                  CURRENCY FORMAT
                </label>
                <input
                  type="text"
                  value="INR (₹)"
                  disabled
                  className="w-full h-11 px-3.5 bg-surface-subtle text-industrial-muted text-sm rounded-input border border-surface-border cursor-not-allowed"
                />
              </div>
            </div>
          </Card>

          {/* TORQ-LOCK & AI REASONING */}
          <Card className="p-6 bg-white space-y-4" elevated>
            <div className="flex items-center gap-2 border-b border-surface-border pb-3">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <h2 className="text-base font-semibold text-industrial-dark">
                TORQ-Lock™ Specification Verifier
              </h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-industrial-steel uppercase tracking-wider mb-1.5">
                  SPECIFICATION SAFETY ENFORCEMENT LEVEL
                </label>
                <select
                  value={safetyStrictness}
                  onChange={(e) => setSafetyStrictness(e.target.value)}
                  className="w-full h-11 px-3.5 bg-surface text-industrial-dark text-sm rounded-input border border-surface-border focus:outline-none focus:ring-2 focus:ring-paccar-blue/20 focus:border-paccar-blue"
                >
                  <option value="Strict (TORQ-Lock Enforced)">Strict (Require OEM Reference Document ID)</option>
                  <option value="Standard">Standard (Advisory Warnings Only)</option>
                  <option value="Permissive">Permissive (Include Heuristic Estimates)</option>
                </select>
                <span className="text-[11px] text-industrial-muted mt-1 block">
                  Strict mode blocks AI from suggesting test pressure ranges without official PACCAR reference numbers.
                </span>
              </div>

              <div className="p-3.5 rounded-input bg-surface-subtle border border-surface-border flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-industrial-dark block">
                    Hackathon Deterministic Demo Mode
                  </span>
                  <span className="text-[11px] text-industrial-muted">
                    Allows judges to inspect instant deterministic state transitions for SPN 94
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setDemoMode(!demoMode)}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all border ${
                    demoMode
                      ? "bg-amber-100 text-amber-900 border-amber-300"
                      : "bg-surface text-industrial-steel border-surface-border"
                  }`}
                >
                  {demoMode ? "ACTIVE (DEMO)" : "DISABLED"}
                </button>
              </div>
            </div>
          </Card>

          {/* SUBMIT ACTIONS */}
          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={resetDemoSession}
              className="text-xs font-medium text-industrial-steel hover:text-paccar-blue flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset All Session Data</span>
            </button>

            <Button type="submit" size="lg" className="px-8 font-semibold shadow">
              {isSaved ? (
                <span className="flex items-center gap-2 text-white">
                  <Check className="w-4 h-4" />
                  <span>Preferences Saved</span>
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Save className="w-4 h-4" />
                  <span>Save Settings</span>
                </span>
              )}
            </Button>
          </div>

        </form>

      </div>
    </AppShell>
  );
}
