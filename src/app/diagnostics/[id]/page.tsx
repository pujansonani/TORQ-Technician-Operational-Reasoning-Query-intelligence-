"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { 
  ArrowRight, 
  Wrench, 
  FileText, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Loader2, 
  ChevronRight, 
  ShieldCheck, 
  Sparkles, 
  TrendingUp, 
  Truck, 
  Layers, 
  Cpu, 
  Info,
  Share2,
  Printer,
  Compass,
  AlertOctagon,
  Activity,
  Zap,
  Gauge
} from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { FleetIntelligencePanel } from "@/components/diagnostic/FleetIntelligencePanel";
import { fetchSession, submitTestResult, type SessionState } from "@/lib/api";

export default function DiagnosisResultPage() {
  const params = useParams();
  const sessionId = params.id as string;

  const [session, setSession] = useState<SessionState | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [testOutcome, setTestOutcome] = useState<"pass" | "fail" | "inconclusive">("fail");
  const [testNotes, setTestNotes] = useState<string>("");
  const [isSubmittingTest, setIsSubmittingTest] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handlePrint = () => {
    window.print();
  };

  const handleWhatsAppShare = () => {
    if (!session) return;
    const truckStr = session.truck_info 
      ? `${session.truck_info.brand} ${session.truck_info.model} (${session.truck_info.year}) - VIN: ...${session.truck_info.vin.slice(-6)}` 
      : "Commercial Fleet Truck";
    const topCause = session.root_cause || session.candidate_causes[0]?.name || "Diagnostic Finding";
    const costStr = session.cost_estimate ? `₹${Math.round(session.cost_estimate.total).toLocaleString()}` : "Estimate Pending";
    const text = `*TORQ Diagnostic Assessment & Service Estimate*\n\n🚛 *Vehicle:* ${truckStr}\n⚠️ *Fault Code:* ${session.dtc_codes.join(", ")}\n🔍 *Leading Hypothesis:* ${topCause}\n💰 *PACCAR Estimate:* ${costStr}\n⏱️ *Status:* ${session.status.toUpperCase()}\n\nSession ID: ${session.session_id.slice(0, 8).toUpperCase()}`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, "_blank");
  };

  const handleSubmitTest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.recommended_test || isSubmittingTest) return;
    setIsSubmittingTest(true);
    setSubmitError(null);
    try {
      await submitTestResult(sessionId, {
        test_id: session.recommended_test.test_id,
        result: testOutcome,
        notes: testNotes.trim() || `Marked as ${testOutcome.toUpperCase()}`,
      });
      // Re-fetch fresh full session state
      const freshSession = await fetchSession(sessionId);
      setSession(freshSession);
      setTestNotes("");
    } catch (err: any) {
      setSubmitError(err.message || "Failed to submit test outcome");
    } finally {
      setIsSubmittingTest(false);
    }
  };

  useEffect(() => {
    if (!sessionId) return;
    fetchSession(sessionId)
      .then(setSession)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [sessionId]);

  if (loading) {
    return (
      <AppShell>
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-[#6B7280]">
          <div className="relative">
            <div className="w-12 h-12 rounded-full border-4 border-red-100 border-t-[#E5402C] animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-[#E5402C]" />
            </div>
          </div>
          <p className="text-sm font-semibold text-[#111827]">Synthesizing Bayesian diagnostic telemetry...</p>
        </div>
      </AppShell>
    );
  }

  if (error || !session) {
    return (
      <AppShell>
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600">
            <AlertTriangle className="w-8 h-8" />
          </div>
          <p className="text-base font-bold text-[#111827]">{error || "Diagnostic session not found"}</p>
          <Link href="/diagnostics/new" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#E5402C] text-white text-xs font-bold hover:bg-[#CF3722] transition-all">
            <span>Start a new diagnosis</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </AppShell>
    );
  }

  const topCandidate = session.candidate_causes[0];
  const confidencePct = Math.round(session.confidence_score);

  return (
    <AppShell>
      <div className="space-y-8 animate-in fade-in duration-300">

        {/* APPLE HIG COCKPIT HEADER */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-black/[0.06]">
          <div className="space-y-2.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider bg-gray-100 text-[#111827] border border-gray-200 shadow-2xs">
                SESSION {session.session_id.slice(0, 8).toUpperCase()}
              </span>
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold tracking-tight border ${
                session.status === "resolved"
                  ? "bg-emerald-50 text-emerald-800 border-emerald-300"
                  : session.should_escalate
                  ? "bg-amber-50 text-amber-800 border-amber-300"
                  : "bg-blue-50 text-blue-800 border-blue-300"
              }`}>
                <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                  session.status === "resolved" ? "bg-emerald-500" : session.should_escalate ? "bg-amber-500 animate-pulse" : "bg-blue-500 animate-pulse"
                }`} />
                {session.status === "resolved" ? "ROOT CAUSE CONFIRMED" : session.should_escalate ? "ESCALATION RECOMMENDED" : "ASSESSMENT IN PROGRESS"}
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-red-50 text-[#E5402C] border border-[#F6C9BE]">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>TORQ-Lock™ Active</span>
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#111827]">
              Diagnostic <span className="italic font-bold text-[#E5402C]">Assessment</span>
            </h1>

            <div className="flex flex-wrap items-center gap-2 text-xs text-[#4B5563] pt-0.5 font-medium">
              <span className="font-mono font-bold text-[#E5402C] bg-red-50 px-2 py-0.5 rounded-md border border-red-100">
                {session.dtc_codes.join(", ")}
              </span>
              <span>•</span>
              <span className="line-clamp-1 max-w-xl text-[#374151] font-semibold">{session.symptom_text}</span>
            </div>
          </div>

          {/* ACTION BUTTON PILLS - APPLE HIG */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full border border-black/[0.08] bg-white hover:bg-gray-50 text-xs font-bold text-[#111827] shadow-[0_2px_8px_rgba(0,0,0,0.03)] hover:shadow-md transition-all active:scale-95"
              title="Print Work Order / Save PDF"
            >
              <Printer className="w-3.5 h-3.5 text-[#4B5563]" />
              <span className="hidden sm:inline">Print / PDF</span>
            </button>

            <button
              type="button"
              onClick={handleWhatsAppShare}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full border border-emerald-300 bg-emerald-50 hover:bg-emerald-100 text-xs font-bold text-emerald-900 shadow-[0_2px_8px_rgba(16,185,129,0.1)] hover:shadow-md transition-all active:scale-95"
              title="Share Estimate with Fleet Manager via WhatsApp"
            >
              <Share2 className="w-3.5 h-3.5 text-emerald-700" />
              <span>WhatsApp Estimate</span>
            </button>

            <Link href={`/diagnostics/${session.session_id}/workflow`}>
              <button
                type="button"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-emerald-300 bg-emerald-50 hover:bg-emerald-100 text-xs font-bold text-emerald-900 shadow-[0_2px_8px_rgba(16,185,129,0.1)] hover:shadow-md transition-all active:scale-95"
              >
                <Compass className="w-3.5 h-3.5 text-emerald-600" />
                <span>5-Step Guided Workflow</span>
              </button>
            </Link>

            <Link href={`/reports/${session.session_id}`}>
              <button
                type="button"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full border border-black/[0.08] bg-white hover:bg-gray-50 text-xs font-bold text-[#111827] shadow-[0_2px_8px_rgba(0,0,0,0.03)] hover:shadow-md transition-all active:scale-95"
              >
                <FileText className="w-3.5 h-3.5 text-[#E5402C]" />
                <span className="hidden sm:inline">Full Report</span>
              </button>
            </Link>

            <Link href="/diagnostics/new">
              <button
                type="button"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#E5402C] hover:bg-[#CF3722] text-white text-xs font-bold tracking-tight shadow-[0_4px_16px_rgba(229,64,44,0.25)] hover:shadow-lg transition-all active:scale-95"
              >
                <Wrench className="w-3.5 h-3.5" />
                <span>New</span>
              </button>
            </Link>
          </div>
        </div>

        {/* VEHICLE IDENTIFICATION & OPERATIONAL PROFILE CARD */}
        {session.truck_info && (
          <div className="p-6 rounded-[24px] bg-white border border-black/[0.07] shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.05)] transition-all duration-300 flex flex-col md:flex-row md:items-center justify-between gap-5 relative overflow-hidden group">
            <div className="absolute top-0 left-0 bottom-0 w-1.5 bg-gradient-to-b from-[#E5402C] to-red-300" />

            <div className="flex items-center gap-4 pl-1">
              <div className="w-12 h-12 rounded-2xl bg-red-50 border border-[#F6C9BE] flex items-center justify-center text-[#E5402C] shrink-0 shadow-sm group-hover:scale-105 transition-transform">
                <Truck className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2.5">
                  <h2 className="text-lg font-extrabold text-[#111827]">
                    {session.truck_info.brand} {session.truck_info.model} ({session.truck_info.year})
                  </h2>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-gray-100 text-[#111827] border border-gray-200">
                    {session.truck_info.engine}
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[#6B7280] font-medium">
                  <span>VIN: <span className="font-mono font-bold text-[#111827]">{session.truck_info.vin}</span></span>
                  <span>•</span>
                  <span>Odometer: <span className="font-mono font-bold text-[#111827]">{session.truck_info.mileage_km.toLocaleString()} km</span></span>
                  <span>•</span>
                  <span className={`inline-flex items-center gap-1 font-semibold ${session.truck_info.mileage_km > 250000 ? "text-amber-700" : session.truck_info.mileage_km < 75000 ? "text-blue-700" : "text-emerald-700"}`}>
                    <Gauge className="w-3.5 h-3.5" />
                    {session.truck_info.mileage_km > 250000
                      ? "High-Wear Corridor Tier (>250k km) • Mechanical fatigue weighted"
                      : session.truck_info.mileage_km < 75000
                      ? "Warranty In-Service Tier (<75k km) • Harness & sensors weighted"
                      : "Standard Fleet Operational Tier"}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 self-start md:self-auto shrink-0 pl-1 md:pl-0">
              <div className="text-right hidden sm:block">
                <div className="text-[10px] font-mono uppercase text-[#6B7280] font-bold">Chassis Platform</div>
                <div className="text-xs font-bold text-[#111827]">
                  {session.truck_info.brand.toLowerCase().includes("tata") ? "Tata Prima Heavy Haul" : session.truck_info.brand.toLowerCase().includes("ashok") ? "Ashok Leyland CRS" : session.truck_info.brand.toLowerCase().includes("volvo") ? "Volvo D13 Heavy" : "PACCAR Class 8"}
                </div>
              </div>
              <span className="px-3.5 py-1.5 rounded-full text-xs font-mono font-extrabold bg-red-50 text-[#E5402C] border border-[#F6C9BE] shadow-2xs">
                {session.dtc_codes[0]}
              </span>
            </div>
          </div>
        )}

        {/* ROOT CAUSE CONFIRMED BANNER */}
        {session.root_cause && (
          <div className="p-6 rounded-[24px] bg-gradient-to-r from-emerald-50 via-white to-emerald-50/40 border border-emerald-300 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm animate-in fade-in duration-300">
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-emerald-800">
                  DIAGNOSIS COMPLETE • ROOT CAUSE CONFIRMED
                </span>
                <h3 className="text-xl font-extrabold text-[#111827]">{session.root_cause}</h3>
              </div>
            </div>
            <Link href={`/reports/${session.session_id}`}>
              <button type="button" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-sm transition-all shrink-0">
                <FileText className="w-4 h-4" />
                <span>View Service Report</span>
              </button>
            </Link>
          </div>
        )}

        {/* AI COPILOT DIAGNOSTIC SYNTHESIS (APPLE INTELLIGENCE MISSION CONTROL CARD) */}
        {session.llm_summary && (() => {
          let summaryText = session.llm_summary;
          let causeAnalysis: Array<{
            cause_id?: string;
            assessment?: string;
            supporting_evidence?: string[];
            contradicting_evidence?: string[];
          }> = [];

          try {
            const parsed = JSON.parse(session.llm_summary);
            if (parsed && typeof parsed === "object") {
              summaryText = parsed.summary || "";
              causeAnalysis = Array.isArray(parsed.cause_analysis) ? parsed.cause_analysis : [];
            }
          } catch {
            const match = session.llm_summary.match(/\{[\s\S]*\}/);
            if (match) {
              try {
                const parsed = JSON.parse(match[0]);
                if (parsed && typeof parsed === "object") {
                  summaryText = parsed.summary || "";
                  causeAnalysis = Array.isArray(parsed.cause_analysis) ? parsed.cause_analysis : [];
                }
              } catch {}
            }
          }

          return (
            <div className="p-7 sm:p-8 rounded-[24px] bg-gradient-to-br from-white via-[#FCFDFE] to-red-50/15 border border-black/[0.08] shadow-[0_4px_24px_rgba(0,0,0,0.03)] space-y-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-80 h-80 bg-[#E5402C]/5 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
              
              <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 border-b border-black/[0.06] pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-red-50 border border-[#F6C9BE] flex items-center justify-center text-[#E5402C] shadow-sm">
                    <Sparkles className="w-5 h-5 text-[#E5402C]" />
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold tracking-tight text-[#111827] flex items-center gap-2">
                      <span>AI Copilot Diagnostic Synthesis</span>
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-red-50 text-[#E5402C] border border-[#F6C9BE]">
                        Technician Rationale
                      </span>
                    </h3>
                    <p className="text-xs text-[#6B7280]">
                      Multi-dimensional reasoning synthesized across PACCAR telemetry, DTC fault code, and Bayesian candidate priors
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full text-[11px] font-mono font-bold bg-gray-100 text-[#111827] border border-gray-200">
                    TORQ-Lock™ Verified
                  </span>
                </div>
              </div>

              {/* High-level Field Narrative */}
              {summaryText && (
                <div className="relative z-10 text-xs sm:text-sm text-[#374151] leading-relaxed font-sans bg-[#FAFBFB] p-5 rounded-2xl border border-black/[0.06] font-normal">
                  <span className="font-extrabold text-[#E5402C] block text-xs uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-[#E5402C]" />
                    <span>Technician Field Summary:</span>
                  </span>
                  {summaryText}
                </div>
              )}

              {/* Detailed Multi-Cause Evidence Analysis */}
              {causeAnalysis.length > 0 && (
                <div className="relative z-10 space-y-3 pt-1">
                  <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#6B7280] flex items-center gap-1.5">
                    <Activity className="w-3.5 h-3.5 text-[#E5402C]" />
                    <span>Candidate Hypothesis Differential Breakdown</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {causeAnalysis.map((item, idx) => {
                      const isHigh = (item.assessment || "").toLowerCase().includes("highly");
                      const isPossible = (item.assessment || "").toLowerCase().includes("possible");
                      return (
                        <div
                          key={idx}
                          className="p-5 rounded-2xl bg-white border border-black/[0.08] shadow-[0_2px_8px_rgba(0,0,0,0.02)] flex flex-col justify-between space-y-3 hover:border-black/[0.15] hover:shadow-md transition-all"
                        >
                          <div>
                            <div className="flex items-start justify-between gap-2 mb-2">
                              <span className="text-xs font-bold text-[#111827] tracking-wide">
                                {item.cause_id || `Candidate ${idx + 1}`}
                              </span>
                              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider ${
                                isHigh
                                  ? "bg-emerald-50 text-emerald-800 border border-emerald-300"
                                  : isPossible
                                  ? "bg-blue-50 text-blue-800 border border-blue-300"
                                  : "bg-gray-100 text-gray-700 border border-gray-200"
                              }`}>
                                {item.assessment?.split("–")[0]?.split("-")[0]?.trim() || "Evaluated"}
                              </span>
                            </div>
                            <p className="text-xs text-[#4B5563] leading-relaxed font-normal">
                              {item.assessment}
                            </p>
                          </div>

                          {item.supporting_evidence && item.supporting_evidence.length > 0 && (
                            <div className="pt-2.5 border-t border-black/[0.05] space-y-1">
                              <span className="text-[10px] font-mono text-emerald-700 block font-bold uppercase tracking-wider">
                                Supporting Field Evidence:
                              </span>
                              <ul className="text-xs text-[#374151] space-y-1 pl-3.5 list-disc marker:text-[#E5402C]">
                                {item.supporting_evidence.map((ev, eIdx) => (
                                  <li key={eIdx}>{ev}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          );
        })()}

        {/* PACCAR OEM WORKSHOP SAFETY DIRECTIVE */}
        <div className="p-5 rounded-[20px] bg-amber-500/10 border border-amber-500/30 flex items-start gap-4">
          <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center shrink-0 text-amber-700">
            <AlertOctagon className="w-5 h-5" />
          </div>
          <div className="text-xs space-y-0.5">
            <span className="font-extrabold text-amber-900 uppercase tracking-wider block">
              PACCAR OEM Workshop Safety Directive:
            </span>
            <span className="text-amber-800 font-medium leading-relaxed block">
              {session.dtc_codes[0]?.includes("110")
                ? "⚠️ HIGH THERMAL OVERPRESSURE HAZARD: System operating coolant temperature exceeds 105°C. Never release radiator pressure cap while hot. Wait minimum 30 minutes before breaking cooling circuit."
                : session.dtc_codes[0]?.includes("520322")
                ? "⚠️ CHEMICAL & EXTREME THERMAL HAZARD: SCR catalyst temperatures exceed 450°C during DPF active regeneration. Wear nitrile gloves and safety eye protection when disconnecting DEF injector couplings."
                : session.dtc_codes[0]?.includes("100")
                ? "⚠️ HYDRAULIC PRESSURE DISCHARGE: Do not disconnect oil pressure test port fittings under active engine cranking. Ensure mechanical gauge uses minimum 600 kPa rated steel braided hose."
                : session.dtc_codes[0]?.includes("3226")
                ? "⚠️ HIGH SOOT & EXHAUST DIRECTIVE: Exhaust gas temperatures exceed 600°C during active regeneration. Verify workshop exhaust extraction system is high-temp certified."
                : "⚠️ GENERAL POWERTRAIN DIRECTIVE: Disconnect battery master isolation switch before probing ECM harness connectors to prevent voltage spike damage."}
            </span>
          </div>
        </div>

        {/* FLEET-WIDE PATTERN INTELLIGENCE (THE INTANGLES ANGLE) */}
        {session.fleet_intelligence && (
          <FleetIntelligencePanel
            data={session.fleet_intelligence}
            currentCost={session.cost_estimate?.total}
          />
        )}

        {/* TOP BANNER: LEADING HYPOTHESIS */}
        {topCandidate && (
          <div className="p-7 rounded-[24px] bg-gradient-to-r from-red-50/70 via-white to-red-50/30 border border-[#F6C9BE] flex flex-col sm:flex-row sm:items-center justify-between gap-5 shadow-[0_2px_12px_rgba(229,64,44,0.06)] hover:shadow-[0_8px_24px_rgba(229,64,44,0.1)] transition-all">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[#E5402C] text-white flex items-center justify-center shrink-0 mt-0.5 shadow-md">
                <TrendingUp className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <div className="text-xs font-extrabold uppercase tracking-wider text-[#E5402C]">
                  EVIDENCE-BACKED ROOT HYPOTHESIS
                </div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-[#111827]">
                  {topCandidate.name}{" "}
                  <span className="font-mono text-[#E5402C] italic">
                    ({Math.round(topCandidate.probability * 100)}% Confidence)
                  </span>
                </h2>
                <p className="text-xs sm:text-sm text-[#4B5563] font-normal max-w-2xl leading-relaxed">
                  {topCandidate.source_snippet}
                </p>
              </div>
            </div>
            <div className="shrink-0 text-right bg-white px-5 py-3 rounded-2xl border border-black/[0.06] shadow-sm">
              <div className="text-3xl font-extrabold font-mono text-[#E5402C]">{confidencePct}%</div>
              <div className="text-[11px] font-bold text-[#6B7280] uppercase tracking-wider">Bayesian Confidence</div>
            </div>
          </div>
        )}

        {/* ESCALATION ALERT */}
        {session.should_escalate && (
          <div className="p-5 rounded-[20px] bg-amber-50 border border-amber-300 flex items-start gap-3.5 shadow-sm">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-bold text-amber-800">Escalation Recommended</p>
              <p className="text-xs text-amber-700 mt-0.5">{session.escalation_reason}</p>
            </div>
          </div>
        )}

        {/* 2-COLUMN WORKSPACE - APPLE HIG CARDS */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* LEFT: RECOMMENDED TEST + EVIDENCE */}
          <div className="lg:col-span-7 space-y-8">

            {/* NEXT BEST TEST / INTERACTIVE SUBMISSION */}
            {session.recommended_test && (
              <div className="p-7 sm:p-8 bg-white rounded-[24px] border border-black/[0.08] shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)] transition-all space-y-6">
                <div className="flex items-center justify-between">
                  <span className={`inline-flex px-3.5 py-1 rounded-full text-[11px] font-mono font-bold ${
                    session.status === "resolved"
                      ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                      : "bg-[#E5402C] text-white"
                  }`}>
                    {session.status === "resolved" ? "ADDITIONAL DIAGNOSTIC TEST AVAILABLE" : "RECOMMENDED NEXT TEST"}
                  </span>
                  <span className="text-xs text-[#6B7280] font-mono font-bold">
                    TEST ID: {session.recommended_test.test_id}
                  </span>
                </div>

                <div>
                  <h3 className="text-xl sm:text-2xl font-extrabold tracking-tight text-[#111827]">
                    {session.recommended_test.description}
                  </h3>
                  <p className="text-sm text-[#4B5563] leading-relaxed mt-2.5">
                    {session.recommended_test.reasoning}
                  </p>
                </div>

                <div className="space-y-1.5">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#6B7280] block">
                    Target Hypotheses Evaluated:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {session.recommended_test.discriminates_causes.map((c) => (
                      <span key={c} className="px-3 py-1 rounded-full text-xs font-mono font-semibold bg-gray-100 text-[#374151] border border-gray-200">
                        {c}
                      </span>
                    ))}
                  </div>
                </div>

                {/* TEST EXECUTION FORM */}
                <form onSubmit={handleSubmitTest} className="pt-5 border-t border-black/[0.06] space-y-4">
                  <div className="text-xs font-bold text-[#111827] uppercase tracking-wider">
                    Record Workshop Physical Test Outcome
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <button
                      type="button"
                      onClick={() => setTestOutcome("pass")}
                      className={`py-3 px-3 rounded-2xl border text-xs font-bold transition-all flex items-center justify-center gap-1.5 active:scale-95 ${
                        testOutcome === "pass"
                          ? "bg-emerald-600 text-white border-emerald-700 shadow-md"
                          : "bg-white hover:bg-gray-50 border-black/[0.1] text-[#374151]"
                      }`}
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>PASS</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setTestOutcome("fail")}
                      className={`py-3 px-3 rounded-2xl border text-xs font-bold transition-all flex items-center justify-center gap-1.5 active:scale-95 ${
                        testOutcome === "fail"
                          ? "bg-[#E5402C] text-white border-[#CF3722] shadow-md"
                          : "bg-white hover:bg-gray-50 border-black/[0.1] text-[#374151]"
                      }`}
                    >
                      <AlertTriangle className="w-4 h-4" />
                      <span>FAIL</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setTestOutcome("inconclusive")}
                      className={`py-3 px-3 rounded-2xl border text-xs font-bold transition-all flex items-center justify-center gap-1.5 active:scale-95 ${
                        testOutcome === "inconclusive"
                          ? "bg-amber-500 text-white border-amber-600 shadow-md"
                          : "bg-white hover:bg-gray-50 border-black/[0.1] text-[#374151]"
                      }`}
                    >
                      <span>INCONCLUSIVE</span>
                    </button>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-medium text-[#4B5563]">
                      Technician Notes / Measurements (e.g. gauge pressure, resistance ohms)
                    </label>
                    <input
                      type="text"
                      value={testNotes}
                      onChange={(e) => setTestNotes(e.target.value)}
                      placeholder="e.g. Measured 4.1 bar at 1,800 RPM (low, below 5.5 bar threshold)"
                      className="w-full px-4 py-3 rounded-xl border border-black/[0.1] bg-[#FAFBFB] text-xs font-medium text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#E5402C]/20 focus:border-[#E5402C] transition-all"
                    />
                  </div>

                  {submitError && (
                    <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700">
                      {submitError}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmittingTest}
                    className="w-full py-3.5 rounded-full bg-[#E5402C] hover:bg-[#CF3722] text-white text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-[0_4px_16px_rgba(229,64,44,0.25)] hover:shadow-[0_6px_20px_rgba(229,64,44,0.35)] disabled:opacity-50 active:scale-98"
                  >
                    {isSubmittingTest ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-white" />
                        <span>Updating Bayesian Reasoner...</span>
                      </>
                    ) : (
                      <>
                        <span>Submit Test Result & Update Bayesian Priors</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                </form>
              </div>
            )}

            {/* ALL TESTS COMPLETED BANNER */}
            {!session.recommended_test && session.completed_tests.length > 0 && (
              <div className="p-8 bg-emerald-50/50 rounded-[24px] border border-emerald-300 text-center space-y-3.5 shadow-sm">
                <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-sm">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-extrabold text-[#111827]">All Diagnostic Tests Completed</h3>
                <p className="text-xs text-[#4B5563] max-w-md mx-auto leading-relaxed">
                  All diagnostic procedures defined for this DTC have been systematically executed. Bayesian confidence has reached final conclusion.
                </p>
                <div className="pt-2">
                  <Link href={`/reports/${session.session_id}`}>
                    <button type="button" className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#E5402C] hover:bg-[#CF3722] text-white text-xs font-bold shadow-md transition-all">
                      <FileText className="w-4 h-4" />
                      <span>View Full Service Report →</span>
                    </button>
                  </Link>
                </div>
              </div>
            )}

            {/* RAG CITATIONS */}
            {session.citations.length > 0 && (
              <section className="space-y-4">
                <div>
                  <h3 className="text-lg font-extrabold tracking-tight text-[#111827]">OEM Knowledge Base Citations</h3>
                  <p className="text-xs text-[#6B7280]">Retrieved via hybrid RAG from PACCAR & multi-brand service manuals</p>
                </div>
                <div className="space-y-3">
                  {session.citations.map((c, i) => (
                    <div key={i} className="p-5 rounded-[20px] bg-white border border-black/[0.07] shadow-[0_2px_8px_rgba(0,0,0,0.02)] hover:shadow-sm transition-all">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <span className="text-xs font-bold text-[#111827] leading-tight">{c.source}</span>
                        <span className="text-[11px] font-mono font-bold text-[#E5402C] shrink-0 bg-red-50 px-2 py-0.5 rounded border border-red-100">
                          {Math.round(c.relevance_score * 100)}% match
                        </span>
                      </div>
                      <p className="text-xs text-[#4B5563] leading-relaxed font-mono bg-gray-50 p-3 rounded-xl border border-black/[0.04]">
                        {c.snippet}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* COMPLETED TESTS HISTORY */}
            {session.completed_tests.length > 0 && (
              <div className="p-7 bg-white rounded-[24px] border border-black/[0.08] shadow-[0_2px_12px_rgba(0,0,0,0.03)] space-y-4">
                <h3 className="text-base font-extrabold tracking-tight text-[#111827]">
                  Completed Tests ({session.completed_tests.length})
                </h3>
                <div className="space-y-2.5">
                  {session.completed_tests.map((t, idx) => (
                    <div key={idx} className="p-4 rounded-2xl bg-[#FAFBFB] border border-black/[0.06] flex items-center justify-between text-xs">
                      <div>
                        <span className="font-bold text-[#111827] block text-sm">{t.test_id}</span>
                        <span className="text-[#4B5563] font-mono mt-0.5 block">{t.notes || t.result}</span>
                      </div>
                      <span className={`inline-flex px-3 py-1 rounded-full text-xs font-bold ${
                        t.result === "fail" ? "bg-red-50 text-[#E5402C] border border-[#F6C9BE]"
                        : t.result === "pass" ? "bg-emerald-50 text-emerald-800 border border-emerald-300"
                        : "bg-amber-50 text-amber-800 border border-amber-300"
                      }`}>{t.result.toUpperCase()}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* RIGHT: CANDIDATES + COST */}
          <div className="lg:col-span-5 space-y-8">

            {/* CANDIDATE CAUSES - APPLE HIG PROGRESS BARS */}
            <div className="p-7 bg-white rounded-[24px] border border-black/[0.08] shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)] transition-all space-y-5">
              <div className="border-b border-black/[0.06] pb-4 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-extrabold tracking-tight text-[#111827]">Ranked Candidate Causes</h3>
                  <p className="text-xs text-[#6B7280]">Live Bayesian posterior probability</p>
                </div>
                <span className="text-xs font-mono font-bold text-[#E5402C] uppercase tracking-wider bg-red-50 px-2.5 py-1 rounded-full border border-red-100">
                  {session.candidate_causes.length} HYPOTHESES
                </span>
              </div>
              <div className="space-y-4">
                {session.candidate_causes.map((c, idx) => {
                  const pct = Math.round(c.probability * 100);
                  return (
                    <div key={c.id} className="p-3.5 rounded-2xl hover:bg-gray-50/80 transition-colors border border-transparent hover:border-black/[0.04]">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-mono font-bold ${idx === 0 ? "bg-[#E5402C] text-white" : "bg-gray-200 text-[#4B5563]"}`}>
                            {idx + 1}
                          </span>
                          <span className={`text-sm font-bold ${idx === 0 ? "text-[#111827]" : "text-[#4B5563]"}`}>{c.name}</span>
                        </div>
                        <span className={`text-sm font-mono font-bold ${idx === 0 ? "text-[#E5402C]" : "text-[#6B7280]"}`}>{pct}%</span>
                      </div>
                      <div className="h-2.5 rounded-full bg-gray-100 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-700 ${idx === 0 ? "bg-gradient-to-r from-[#E5402C] to-red-400" : "bg-gray-400"}`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* COST ESTIMATE - APPLE HIG RECEIPT */}
            {session.cost_estimate && (
              <div className="p-7 bg-white rounded-[24px] border border-black/[0.08] shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)] transition-all space-y-4">
                <div className="border-b border-black/[0.06] pb-4 flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-extrabold tracking-tight text-[#111827]">Repair Cost Estimate</h3>
                    <p className="text-xs text-[#6B7280]">Model-tailored PACCAR OEM estimate</p>
                  </div>
                  <span className="text-xs font-mono font-bold text-emerald-700 uppercase tracking-wider bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                    PARTS & LABOR
                  </span>
                </div>
                <div className="space-y-3.5">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-[#6B7280]">
                    Required OEM Components
                  </div>
                  {session.cost_estimate.parts.map((p, i) => (
                    <div key={i} className="flex justify-between items-center text-sm py-1.5 border-b border-black/[0.03]">
                      <div>
                        <span className="text-[#111827] font-semibold block">{p.description}</span>
                        <span className="text-[11px] font-mono text-[#6B7280]">Part #{p.part_number} • Qty {p.quantity}</span>
                      </div>
                      <span className="font-mono font-bold text-[#111827]">₹{(p.line_total || p.price).toLocaleString()}</span>
                    </div>
                  ))}

                  <div className="pt-2">
                    <div className="text-[11px] font-bold uppercase tracking-wider text-[#6B7280] mb-1">
                      Technician Labor & Packaging
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <div>
                        <span className="text-[#374151] font-medium block">
                          Labor ({session.cost_estimate.labor_hours} hrs @ ₹{session.cost_estimate.labor_rate_per_hour}/hr)
                        </span>
                        {session.truck_info?.model && (
                          <span className="text-[11px] text-[#6B7280] block">
                            Chassis access factor: {session.truck_info.model.toLowerCase().includes("t880") ? "Vocational armor (+25%)" : session.truck_info.model.toLowerCase().includes("389") ? "Open conventional (+5%)" : "Aero cowlings (+20%)"}
                          </span>
                        )}
                      </div>
                      <span className="font-mono font-bold text-[#111827]">
                        ₹{Math.round(session.cost_estimate.labor_hours * session.cost_estimate.labor_rate_per_hour).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {session.cost_estimate.consumables > 0 && (
                    <div className="flex justify-between items-center text-sm py-1.5 border-t border-black/[0.04]">
                      <div>
                        <span className="text-[#374151] font-medium block">Consumables & HazMat</span>
                        <span className="text-[11px] text-[#6B7280]">O-rings, sealants, solvent & environmental fee</span>
                      </div>
                      <span className="font-mono font-bold text-[#111827]">
                        ₹{Math.round(session.cost_estimate.consumables).toLocaleString()}
                      </span>
                    </div>
                  )}

                  <div className="pt-4 mt-3 border-t-2 border-black/[0.08] flex justify-between items-baseline bg-gray-50/80 -mx-3 p-3.5 rounded-2xl">
                    <div>
                      <span className="text-base font-extrabold text-[#111827]">Total Workshop Estimate</span>
                      <span className="text-[11px] text-[#6B7280] block">Excl. applicable GST</span>
                    </div>
                    <span className="text-2xl font-extrabold font-mono text-[#E5402C]">
                      ₹{Math.round(session.cost_estimate.total).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>

      </div>
    </AppShell>
  );
}
