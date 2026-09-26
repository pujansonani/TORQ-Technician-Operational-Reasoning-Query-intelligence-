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
  Info
} from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
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

  const handleSubmitTest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.recommended_test || isSubmittingTest) return;
    setIsSubmittingTest(true);
    setSubmitError(null);
    try {
      const resp = await submitTestResult(sessionId, {
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
          <Loader2 className="w-10 h-10 animate-spin text-[#E5402C]" />
          <p className="text-sm font-medium">Loading diagnostic session from backend...</p>
        </div>
      </AppShell>
    );
  }

  if (error || !session) {
    return (
      <AppShell>
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
          <AlertTriangle className="w-10 h-10 text-amber-500" />
          <p className="text-sm font-medium text-[#374151]">{error || "Session not found"}</p>
          <Link href="/diagnostics/new" className="text-[#E5402C] text-sm font-bold hover:underline">
            Start a new diagnosis →
          </Link>
        </div>
      </AppShell>
    );
  }

  const topCandidate = session.candidate_causes[0];
  const confidencePct = Math.round(session.confidence_score);

  return (
    <AppShell>
      <div className="space-y-8">

        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-black/[0.06]">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider bg-gray-100 text-[#111827] border border-gray-200">
                SESSION {session.session_id.slice(0, 8).toUpperCase()}
              </span>
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold tracking-tight border ${
                session.status === "resolved"
                  ? "bg-emerald-50 text-emerald-800 border-emerald-300"
                  : session.should_escalate
                  ? "bg-amber-50 text-amber-800 border-amber-300"
                  : "bg-blue-50 text-blue-800 border-blue-300"
              }`}>
                {session.status === "resolved" ? "ROOT CAUSE CONFIRMED" : session.should_escalate ? "ESCALATION RECOMMENDED" : "ASSESSMENT IN PROGRESS"}
              </span>
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-red-50 text-[#E5402C] border border-[#F6C9BE]">
                <ShieldCheck className="w-3.5 h-3.5" /> TORQ-Lock™ Active
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#111827]">
              Diagnostic <span className="italic font-bold text-[#E5402C]">Assessment</span>
            </h1>
            <div className="flex flex-wrap items-center gap-2 text-xs text-[#4B5563] pt-1 font-medium">
              <span className="font-mono font-bold text-[#E5402C]">{session.dtc_codes.join(", ")}</span>
              <span>•</span>
              <span className="line-clamp-1 max-w-xl">{session.symptom_text}</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <Link href={`/reports/${session.session_id}`}>
              <button type="button" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-black/[0.1] bg-white hover:bg-gray-50 text-xs font-bold text-[#111827] shadow-sm transition-all">
                <FileText className="w-4 h-4 text-[#E5402C]" />
                <span>View Full Report</span>
              </button>
            </Link>
            <Link href="/diagnostics/new">
              <button type="button" className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#E5402C] hover:bg-[#CF3722] text-white text-xs font-bold tracking-tight shadow-[0_4px_16px_rgba(229,64,44,0.25)] transition-all">
                <Wrench className="w-4 h-4" />
                <span>New Diagnosis</span>
              </button>
            </Link>
          </div>
        </div>

        {/* VEHICLE IDENTIFICATION & OPERATIONAL PROFILE BAR */}
        {session.truck_info && (
          <div className="p-5 sm:p-6 rounded-[22px] bg-gradient-to-r from-gray-50 via-white to-gray-50/50 border border-black/[0.08] shadow-[0_2px_12px_rgba(0,0,0,0.03)] flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-white border border-black/[0.1] shadow-sm flex items-center justify-center text-[#E5402C] shrink-0">
                <Truck className="w-6 h-6" />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2.5">
                  <h2 className="text-base sm:text-lg font-extrabold text-[#111827]">
                    {session.truck_info.brand} {session.truck_info.model} ({session.truck_info.year})
                  </h2>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-white text-[#111827] border border-black/[0.1] shadow-2xs">
                    {session.truck_info.engine}
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[#6B7280] mt-1 font-medium">
                  <span>VIN: <span className="font-mono font-semibold text-[#111827]">{session.truck_info.vin}</span></span>
                  <span>•</span>
                  <span>Odometer: <span className="font-mono font-semibold text-[#111827]">{session.truck_info.mileage_km.toLocaleString()} km</span></span>
                  <span>•</span>
                  <span className={`font-semibold ${session.truck_info.mileage_km > 250000 ? "text-amber-800" : session.truck_info.mileage_km < 75000 ? "text-blue-800" : "text-emerald-800"}`}>
                    {session.truck_info.mileage_km > 250000
                      ? "High-Wear Operating Tier (>250k km) • Mechanical fatigue weighted"
                      : session.truck_info.mileage_km < 75000
                      ? "Warranty In-Service Tier (<75k km) • Harness & sensors weighted"
                      : "Standard Fleet Operational Tier"}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 self-start md:self-auto shrink-0">
              <div className="text-right hidden sm:block">
                <div className="text-[10px] font-mono uppercase text-[#6B7280]">Chassis Platform</div>
                <div className="text-xs font-bold text-[#111827]">PACCAR Heavy Duty</div>
              </div>
              <span className="px-3.5 py-1.5 rounded-full text-xs font-mono font-extrabold bg-[#111827] text-white">
                {session.dtc_codes[0]}
              </span>
            </div>
          </div>
        )}

        {/* ROOT CAUSE CONFIRMED BANNER */}
        {session.root_cause && (
          <div className="p-6 rounded-[24px] bg-gradient-to-r from-emerald-50 via-white to-emerald-50/40 border border-emerald-300 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-sm">
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

        {/* AI COPILOT DIAGNOSTIC SYNTHESIS (TECHNICIAN POV FROM GROQ LLM) */}
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
            <div className="p-6 sm:p-7 rounded-[24px] bg-[#0E1525] text-white shadow-xl relative overflow-hidden border border-slate-800 space-y-6">
              <div className="absolute top-0 right-0 w-80 h-80 bg-[#E5402C]/10 rounded-full blur-3xl pointer-events-none" />
              
              <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#E5402C] flex items-center justify-center text-white shadow-md">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold tracking-tight text-white flex items-center gap-2">
                      <span>AI Copilot Diagnostic Synthesis</span>
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/10 text-emerald-400 border border-emerald-400/20">
                        Technician Field Rationale
                      </span>
                    </h3>
                    <p className="text-xs text-gray-400">
                      Reasoning synthesized from live PACCAR telemetry, DTC fault signatures, and Bayesian candidate priors
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full text-[11px] font-mono font-semibold bg-white/10 text-gray-200 border border-white/10">
                    TORQ-Lock™ Guardrail
                  </span>
                </div>
              </div>

              {/* High-level Field Narrative */}
              {summaryText && (
                <div className="relative z-10 text-xs sm:text-sm text-gray-200 leading-relaxed font-sans bg-black/40 p-4 rounded-xl border border-white/5 font-normal">
                  <span className="font-bold text-[#E5402C] block text-xs uppercase tracking-wider mb-1">
                    Technician Observation & Summary:
                  </span>
                  {summaryText}
                </div>
              )}

              {/* Detailed Multi-Cause Evidence Analysis */}
              {causeAnalysis.length > 0 && (
                <div className="relative z-10 space-y-3 pt-1">
                  <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-gray-400">
                    Candidate Hypothesis Differential Breakdown
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                    {causeAnalysis.map((item, idx) => {
                      const isHigh = (item.assessment || "").toLowerCase().includes("highly");
                      const isPossible = (item.assessment || "").toLowerCase().includes("possible");
                      return (
                        <div
                          key={idx}
                          className="p-4 rounded-xl bg-slate-900/80 border border-white/10 flex flex-col justify-between space-y-3"
                        >
                          <div>
                            <div className="flex items-start justify-between gap-2 mb-1.5">
                              <span className="text-xs font-bold text-white tracking-wide">
                                {item.cause_id || `Candidate ${idx + 1}`}
                              </span>
                              <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider ${
                                isHigh
                                  ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                                  : isPossible
                                  ? "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                                  : "bg-gray-700/50 text-gray-400 border border-gray-600/30"
                              }`}>
                                {item.assessment?.split("–")[0]?.split("-")[0]?.trim() || "Evaluated"}
                              </span>
                            </div>
                            <p className="text-[11px] text-gray-300 leading-snug">
                              {item.assessment}
                            </p>
                          </div>

                          {item.supporting_evidence && item.supporting_evidence.length > 0 && (
                            <div className="pt-2 border-t border-white/5 space-y-1">
                              <span className="text-[10px] font-mono text-emerald-400 block font-semibold uppercase">
                                Supporting Field Evidence:
                              </span>
                              <ul className="text-[11px] text-gray-300 space-y-0.5 pl-3 list-disc marker:text-emerald-400">
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

        {/* TOP BANNER: LEADING HYPOTHESIS */}
        {topCandidate && (
          <div className="p-6 rounded-[24px] bg-gradient-to-r from-red-50/60 via-white to-red-50/30 border border-[#F6C9BE] flex flex-col sm:flex-row sm:items-center justify-between gap-5 shadow-[0_2px_12px_rgba(229,64,44,0.06)]">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-[#E5402C] text-white flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-extrabold uppercase tracking-wider text-[#E5402C]">
                  EVIDENCE-BACKED ROOT HYPOTHESIS
                </div>
                <h2 className="text-lg sm:text-xl font-extrabold text-[#111827] mt-0.5">
                  {topCandidate.name}{" "}
                  <span className="font-mono text-[#E5402C] italic">
                    ({Math.round(topCandidate.probability * 100)}% Confidence)
                  </span>
                </h2>
                <p className="text-xs sm:text-sm text-[#4B5563] mt-1 font-normal max-w-2xl leading-relaxed">
                  {topCandidate.source_snippet}
                </p>
              </div>
            </div>
            <div className="shrink-0 text-right">
              <div className="text-3xl font-extrabold font-mono text-[#E5402C]">{confidencePct}%</div>
              <div className="text-xs text-[#6B7280]">Bayesian confidence</div>
            </div>
          </div>
        )}

        {/* ESCALATION ALERT */}
        {session.should_escalate && (
          <div className="p-4 rounded-[16px] bg-amber-50 border border-amber-300 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-bold text-amber-800">Escalation Recommended</p>
              <p className="text-xs text-amber-700 mt-0.5">{session.escalation_reason}</p>
            </div>
          </div>
        )}

        {/* 2-COLUMN WORKSPACE */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* LEFT: RECOMMENDED TEST + EVIDENCE */}
          <div className="lg:col-span-7 space-y-8">

            {/* NEXT BEST TEST / INTERACTIVE SUBMISSION */}
            {session.recommended_test && (
              <div className="p-7 bg-white rounded-[24px] border border-black/[0.08] shadow-[0_2px_12px_rgba(0,0,0,0.03)] space-y-5">
                <div className="flex items-center justify-between">
                  <span className={`inline-flex px-3 py-1 rounded-full text-[11px] font-mono font-bold ${
                    session.status === "resolved"
                      ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                      : "bg-[#E5402C] text-white"
                  }`}>
                    {session.status === "resolved" ? "ADDITIONAL DIAGNOSTIC TEST AVAILABLE" : "RECOMMENDED NEXT TEST"}
                  </span>
                  <span className="text-xs text-[#6B7280] font-mono">
                    ID: {session.recommended_test.test_id}
                  </span>
                </div>
                <div>
                  <h3 className="text-xl font-extrabold tracking-tight text-[#111827]">
                    {session.recommended_test.description}
                  </h3>
                  <p className="text-sm text-[#4B5563] leading-relaxed mt-2">
                    {session.recommended_test.reasoning}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  {session.recommended_test.discriminates_causes.map((c) => (
                    <span key={c} className="px-2.5 py-1 rounded-full text-[11px] font-mono font-semibold bg-gray-100 text-[#374151] border border-gray-200">
                      {c}
                    </span>
                  ))}
                </div>

                {/* TEST EXECUTION FORM */}
                <form onSubmit={handleSubmitTest} className="pt-4 border-t border-black/[0.06] space-y-4">
                  <div className="text-xs font-bold text-[#111827] uppercase tracking-wider">
                    Record Test Outcome
                  </div>

                  <div className="grid grid-cols-3 gap-2.5">
                    <button
                      type="button"
                      onClick={() => setTestOutcome("pass")}
                      className={`py-2.5 px-3 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                        testOutcome === "pass"
                          ? "bg-emerald-500 text-white border-emerald-600 shadow-sm"
                          : "bg-white hover:bg-gray-50 border-black/[0.1] text-[#374151]"
                      }`}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>PASS</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setTestOutcome("fail")}
                      className={`py-2.5 px-3 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                        testOutcome === "fail"
                          ? "bg-[#E5402C] text-white border-[#CF3722] shadow-sm"
                          : "bg-white hover:bg-gray-50 border-black/[0.1] text-[#374151]"
                      }`}
                    >
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span>FAIL</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setTestOutcome("inconclusive")}
                      className={`py-2.5 px-3 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                        testOutcome === "inconclusive"
                          ? "bg-amber-500 text-white border-amber-600 shadow-sm"
                          : "bg-white hover:bg-gray-50 border-black/[0.1] text-[#374151]"
                      }`}
                    >
                      <span>INCONCLUSIVE</span>
                    </button>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#4B5563] mb-1">
                      Technician Notes / Measurements (Optional)
                    </label>
                    <input
                      type="text"
                      value={testNotes}
                      onChange={(e) => setTestNotes(e.target.value)}
                      placeholder="e.g. Measured 4.1 bar at 1,800 RPM (low)"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-black/[0.1] bg-[#FAFBFB] text-xs text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#E5402C]/20 focus:border-[#E5402C]"
                    />
                  </div>

                  {submitError && (
                    <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-700">
                      {submitError}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmittingTest}
                    className="w-full py-3 rounded-full bg-[#111827] hover:bg-black text-white text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
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
              <div className="p-7 bg-emerald-50/50 rounded-[24px] border border-emerald-300 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-extrabold text-[#111827]">All Diagnostic Tests Completed</h3>
                <p className="text-xs text-[#4B5563] max-w-md mx-auto">
                  All diagnostic procedures defined for this DTC have been performed. Bayesian confidence has reached conclusion.
                </p>
                <div className="pt-2">
                  <Link href={`/reports/${session.session_id}`}>
                    <button type="button" className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#E5402C] hover:bg-[#CF3722] text-white text-xs font-bold shadow-md transition-all">
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
                  <h3 className="text-xl font-extrabold tracking-tight text-[#111827]">Knowledge Base Citations</h3>
                  <p className="text-xs text-[#6B7280]">Retrieved via RAG from DTC knowledge base</p>
                </div>
                <div className="space-y-3">
                  {session.citations.map((c, i) => (
                    <div key={i} className="p-4 rounded-[16px] bg-white border border-black/[0.07] shadow-[0_1px_6px_rgba(0,0,0,0.03)]">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <span className="text-xs font-bold text-[#111827] leading-tight">{c.source}</span>
                        <span className="text-[11px] font-mono font-bold text-[#E5402C] shrink-0">{Math.round(c.relevance_score * 100)}% match</span>
                      </div>
                      <p className="text-xs text-[#4B5563] leading-relaxed font-mono">{c.snippet}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* COMPLETED TESTS */}
            {session.completed_tests.length > 0 && (
              <div className="p-6 bg-white rounded-[24px] border border-black/[0.08] shadow-[0_2px_12px_rgba(0,0,0,0.03)] space-y-4">
                <h3 className="text-base font-extrabold tracking-tight text-[#111827]">
                  Completed Tests ({session.completed_tests.length})
                </h3>
                <div className="space-y-2.5">
                  {session.completed_tests.map((t, idx) => (
                    <div key={idx} className="p-4 rounded-[16px] bg-[#FAFBFB] border border-black/[0.06] flex items-center justify-between text-xs">
                      <div>
                        <span className="font-bold text-[#111827] block text-sm">{t.test_id}</span>
                        <span className="text-[#4B5563] font-mono">{t.notes || t.result}</span>
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

            {/* CANDIDATE CAUSES */}
            <div className="p-7 bg-white rounded-[24px] border border-black/[0.08] shadow-[0_2px_12px_rgba(0,0,0,0.03)] space-y-5">
              <div className="border-b border-black/[0.06] pb-4 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-extrabold tracking-tight text-[#111827]">Ranked Candidate Causes</h3>
                  <p className="text-xs text-[#6B7280]">Live Bayesian posterior distribution</p>
                </div>
                <span className="text-xs font-mono font-bold text-[#E5402C] uppercase tracking-wider">
                  {session.candidate_causes.length} CANDIDATES
                </span>
              </div>
              <div className="space-y-3.5">
                {session.candidate_causes.map((c, idx) => {
                  const pct = Math.round(c.probability * 100);
                  return (
                    <div key={c.id}>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className={`text-sm font-bold ${idx === 0 ? "text-[#111827]" : "text-[#4B5563]"}`}>{c.name}</span>
                        <span className={`text-sm font-mono font-bold ${idx === 0 ? "text-[#E5402C]" : "text-[#6B7280]"}`}>{pct}%</span>
                      </div>
                      <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-700 ${idx === 0 ? "bg-[#E5402C]" : "bg-gray-400"}`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* COST ESTIMATE */}
            {session.cost_estimate && (
              <div className="p-7 bg-white rounded-[24px] border border-black/[0.08] shadow-[0_2px_12px_rgba(0,0,0,0.03)] space-y-4">
                <div className="border-b border-black/[0.06] pb-4 flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-extrabold tracking-tight text-[#111827]">Repair Cost Estimate</h3>
                    <p className="text-xs text-[#6B7280]">Model-tailored PACCAR OEM estimate</p>
                  </div>
                  <span className="text-xs font-mono font-bold text-[#E5402C] uppercase tracking-wider">
                    PARTS & LABOR
                  </span>
                </div>
                <div className="space-y-3">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-[#6B7280]">
                    Required OEM Components
                  </div>
                  {session.cost_estimate.parts.map((p, i) => (
                    <div key={i} className="flex justify-between items-center text-sm py-1 border-b border-black/[0.03]">
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
                    <div className="flex justify-between items-center text-sm py-1 border-t border-black/[0.04]">
                      <div>
                        <span className="text-[#374151] font-medium block">Consumables & HazMat</span>
                        <span className="text-[11px] text-[#6B7280]">O-rings, sealants, solvent & environmental fee</span>
                      </div>
                      <span className="font-mono font-bold text-[#111827]">
                        ₹{Math.round(session.cost_estimate.consumables).toLocaleString()}
                      </span>
                    </div>
                  )}

                  <div className="pt-3 mt-3 border-t-2 border-black/[0.08] flex justify-between items-baseline">
                    <div>
                      <span className="text-base font-extrabold text-[#111827]">Total Estimate</span>
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

