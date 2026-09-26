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
  TrendingUp
} from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { fetchSession, type SessionState } from "@/lib/api";

export default function DiagnosisResultPage() {
  const params = useParams();
  const sessionId = params.id as string;

  const [session, setSession] = useState<SessionState | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
      <div className="space-y-10">

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
              <span>{session.symptom_text.slice(0, 80)}…</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <Link href="/diagnostics/new">
              <button type="button" className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#E5402C] hover:bg-[#CF3722] text-white text-xs font-bold tracking-tight shadow-[0_4px_16px_rgba(229,64,44,0.25)] transition-all">
                <Wrench className="w-4 h-4" />
                <span>New Diagnosis</span>
              </button>
            </Link>
          </div>
        </div>

        {/* TOP BANNER: LEADING HYPOTHESIS */}
        {topCandidate && (
          <div className="p-6 rounded-[24px] bg-gradient-to-r from-red-50/60 via-white to-red-50/30 border border-[#F6C9BE] flex flex-col sm:flex-row sm:items-center justify-between gap-5 shadow-[0_2px_12px_rgba(229,64,44,0.06)]">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-[#E5402C] text-white flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                <Sparkles className="w-5 h-5" />
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
              <div className="text-2xl font-extrabold font-mono text-[#E5402C]">{confidencePct}%</div>
              <div className="text-xs text-[#6B7280]">overall confidence</div>
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

            {/* NEXT BEST TEST */}
            {session.recommended_test && (
              <div className="p-7 bg-white rounded-[24px] border border-black/[0.08] shadow-[0_2px_12px_rgba(0,0,0,0.03)] space-y-4">
                <div className="flex items-center gap-2">
                  <span className="inline-flex px-3 py-1 rounded-full text-[11px] font-mono font-bold bg-[#E5402C] text-white">NEXT BEST TEST</span>
                </div>
                <h3 className="text-xl font-extrabold tracking-tight text-[#111827]">{session.recommended_test.description}</h3>
                <p className="text-sm text-[#4B5563] leading-relaxed">{session.recommended_test.reasoning}</p>
                <div className="flex flex-wrap gap-2 pt-2">
                  {session.recommended_test.discriminates_causes.map((c) => (
                    <span key={c} className="px-2.5 py-1 rounded-full text-[11px] font-mono font-semibold bg-gray-100 text-[#374151] border border-gray-200">{c}</span>
                  ))}
                </div>
                <div className="flex items-center gap-2 text-xs text-[#6B7280]">
                  <Clock className="w-3.5 h-3.5" />
                  Test type: <span className="font-bold text-[#111827]">{session.recommended_test.test_type}</span>
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
                <div className="border-b border-black/[0.06] pb-4">
                  <h3 className="text-lg font-extrabold tracking-tight text-[#111827]">Repair Cost Estimate</h3>
                  <p className="text-xs text-[#6B7280]">Based on top candidate cause</p>
                </div>
                <div className="space-y-2">
                  {session.cost_estimate.parts.map((p, i) => (
                    <div key={i} className="flex justify-between text-sm">
                      <span className="text-[#374151] font-medium">{p.description}</span>
                      <span className="font-mono font-bold text-[#111827]">₹{p.price.toLocaleString()}</span>
                    </div>
                  ))}
                  <div className="flex justify-between text-sm">
                    <span className="text-[#374151] font-medium">Labour ({session.cost_estimate.labor_hours}h × ₹{session.cost_estimate.labor_rate_per_hour}/hr)</span>
                    <span className="font-mono font-bold text-[#111827]">₹{(session.cost_estimate.labor_hours * session.cost_estimate.labor_rate_per_hour).toLocaleString()}</span>
                  </div>
                  <div className="pt-3 mt-3 border-t border-black/[0.06] flex justify-between">
                    <span className="text-base font-extrabold text-[#111827]">Total Estimate</span>
                    <span className="text-xl font-extrabold font-mono text-[#E5402C]">₹{session.cost_estimate.total.toLocaleString()}</span>
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

