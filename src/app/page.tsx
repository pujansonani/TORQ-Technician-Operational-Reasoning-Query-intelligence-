"use client";

import React from "react";
import Link from "next/link";
import { 
  Wrench, 
  ShieldCheck, 
  ArrowRight, 
  Zap, 
  Activity, 
  Gauge, 
  CheckCircle2, 
  SlidersHorizontal,
  ChevronRight,
  Database
} from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { TORQLockBadge } from "@/components/diagnostic/TORQLockBadge";

export default function LandingPage() {
  return (
    <AppShell>
      <div className="space-y-16 py-4">
        
        {/* HERO SECTION */}
        <section className="relative rounded-feature overflow-hidden bg-industrial-dark text-white p-8 md:p-14 border border-surface-borderDark/20 shadow-elevated">
          
          {/* Subtle Industrial Grid Background Pattern */}
          <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
          
          {/* Ambient Lighting Gradient */}
          <div className="absolute -top-32 -left-32 w-96 h-96 bg-paccar-blue/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-paccar-red/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Hero Content */}
            <div className="lg:col-span-7 space-y-6">
              
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-white/90 border border-white/15 text-xs font-semibold tracking-wider uppercase">
                <span className="w-2 h-2 rounded-full bg-paccar-red animate-pulse" />
                AI DIAGNOSTIC INTELLIGENCE • PACCAR WORKSHOP COPILOT
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight leading-[1.08]">
                Diagnose with evidence. <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 via-white to-slate-200">
                  Repair with confidence.
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-300 max-w-xl leading-relaxed font-normal">
                TORQ empowers heavy-duty technicians to move from raw symptoms and fault codes directly to evidence-backed test procedures, dynamic confidence updates, and verified repair decisions.
              </p>

              {/* Workflow Stepper Line */}
              <div className="pt-2 pb-4">
                <div className="text-[11px] font-mono tracking-widest text-slate-400 uppercase mb-2">
                  EVIDENCE-BASED COGNITIVE LOOP
                </div>
                <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-slate-300">
                  <span className="px-2.5 py-1 rounded bg-white/10 text-white">Input DTC / Symptoms</span>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                  <span className="px-2.5 py-1 rounded bg-white/10 text-white">Retrieve Evidence</span>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                  <span className="px-2.5 py-1 rounded bg-paccar-blue/60 text-white font-semibold">Next-Best-Test</span>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                  <span className="px-2.5 py-1 rounded bg-emerald-950/60 border border-emerald-500/30 text-emerald-300">Confirm Cause</span>
                </div>
              </div>

              {/* Hero Action CTAs */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link href="/diagnostics/new">
                  <Button size="lg" className="bg-paccar-blue hover:bg-paccar-deep text-white gap-2 font-semibold shadow-lg">
                    <Wrench className="w-4 h-4" />
                    <span>Start New Diagnosis</span>
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>

                <Link href="/dashboard">
                  <Button size="lg" variant="secondary" className="gap-2 bg-white/10 text-white border-white/20 hover:bg-white/20">
                    <Activity className="w-4 h-4" />
                    <span>Technician Dashboard</span>
                  </Button>
                </Link>
              </div>

            </div>

            {/* Right Hero Diagnostic Overlay Card (Realistic Industrial Software Interface) */}
            <div className="lg:col-span-5">
              <div className="bg-surface rounded-card p-6 border border-surface-border text-industrial-dark shadow-2xl space-y-4">
                
                {/* Overlay Header */}
                <div className="flex items-center justify-between border-b border-surface-border pb-3">
                  <div className="flex items-center gap-2">
                    <Badge variant="paccar" size="sm" className="font-mono font-bold">
                      SPN 94 / FMI 1
                    </Badge>
                    <span className="text-xs text-industrial-steel font-medium">Kenworth T680 MX-13</span>
                  </div>
                  <TORQLockBadge verified={true} />
                </div>

                {/* Subsystem & Core Observation */}
                <div>
                  <div className="text-[11px] uppercase tracking-wider text-industrial-caption font-semibold">
                    DETECTED SUBSYSTEM
                  </div>
                  <div className="text-sm font-semibold text-industrial-dark">
                    High-Pressure Common Rail Fuel Circuit
                  </div>
                  <p className="text-xs text-industrial-steel mt-1">
                    &ldquo;Engine loses power under load and hesitates during acceleration.&rdquo;
                  </p>
                </div>

                {/* Ranked Confidence Bars Preview */}
                <div className="space-y-2 pt-1 border-t border-surface-border/60">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-industrial-dark">Top Cause: Fuel Delivery Restriction</span>
                    <span className="font-mono font-bold text-paccar-blue">72%</span>
                  </div>
                  <div className="w-full h-2 bg-surface-muted rounded-full overflow-hidden">
                    <div className="h-full bg-paccar-blue rounded-full w-[72%]" />
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-industrial-muted pt-1">
                    <span>Fuel Pressure Sensor Bias</span>
                    <span className="font-mono">18%</span>
                  </div>
                </div>

                {/* Next Best Test Action Callout */}
                <div className="p-3 bg-paccar-softblue/60 rounded-input border border-blue-200 text-xs space-y-1">
                  <div className="flex items-center justify-between text-paccar-blue font-bold tracking-wide uppercase text-[10px]">
                    <span>HERO NEXT BEST TEST</span>
                    <span>TEST 01</span>
                  </div>
                  <div className="font-semibold text-industrial-dark">
                    Measure fuel rail pressure at idle & 1,800 RPM
                  </div>
                  <p className="text-industrial-steel text-[11px]">
                    Expected Nominal: 5.5 – 6.5 bar (80 – 94 PSI)
                  </p>
                </div>

                <Link href="/diagnostics/TRQ-2026-0941" className="block">
                  <Button variant="outline" size="sm" className="w-full gap-1.5 text-xs text-paccar-blue hover:text-paccar-deep">
                    <span>Inspect Active Assessment Session</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Button>
                </Link>

              </div>
            </div>

          </div>
        </section>

        {/* 3 CORE PILLARS SECTION (EMONS INDUSTRIAL STYLE) */}
        <section className="space-y-6">
          <div className="max-w-2xl">
            <span className="text-xs font-mono font-bold text-paccar-blue tracking-widest uppercase">
              DESIGNED FOR THE SHOP FLOOR
            </span>
            <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-industrial-dark mt-1">
              Industrial engineering tools, not a chat interface.
            </h2>
            <p className="text-sm text-industrial-steel mt-2">
              Technicians don&apos;t have time to converse with generic bots. TORQ provides structured cards, verifiable specifications, and interactive decision trees.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <Card className="p-6 bg-white space-y-3">
              <div className="w-10 h-10 rounded-input bg-paccar-softblue flex items-center justify-center text-paccar-blue font-bold">
                01
              </div>
              <h3 className="text-base font-semibold text-industrial-dark">
                Symptom + DTC Fusion
              </h3>
              <p className="text-sm text-industrial-steel leading-relaxed">
                Seamlessly correlate driver complaints with SPN/FMI telemetry codes rather than troubleshooting in isolation.
              </p>
            </Card>

            <Card className="p-6 bg-white space-y-3">
              <div className="w-10 h-10 rounded-input bg-blue-50 flex items-center justify-center text-paccar-deep font-bold">
                02
              </div>
              <h3 className="text-base font-semibold text-industrial-dark">
                Live Confidence Distribution
              </h3>
              <p className="text-sm text-industrial-steel leading-relaxed">
                Ranked probability bars dynamically update the moment a technician logs a mechanical test pass or fail result.
              </p>
            </Card>

            <Card className="p-6 bg-white space-y-3">
              <div className="w-10 h-10 rounded-input bg-emerald-50 flex items-center justify-center text-emerald-700 font-bold">
                03
              </div>
              <h3 className="text-base font-semibold text-industrial-dark">
                TORQ-Lock™ Specification Verifier
              </h3>
              <p className="text-sm text-industrial-steel leading-relaxed">
                Prevents hallucinated torque or pressure limits by cross-checking all numeric ranges against verified OEM engineering literature.
              </p>
            </Card>

          </div>
        </section>

      </div>
    </AppShell>
  );
}
