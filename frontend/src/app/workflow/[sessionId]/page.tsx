"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { fetchSession, submitTestResult } from "@/lib/api";
import { useDiagnosisStore } from "@/store/useDiagnosisStore";
import { formatCurrency, confidenceColor, formatPercent } from "@/lib/utils";
import type { SessionState, CompletedTest } from "@/types";

export default function WorkflowPage() {
  const params = useParams();
  const router = useRouter();
  const sessionId = params.sessionId as string;

  const store = useDiagnosisStore();
  const [session, setSession] = useState<SessionState | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [testResult, setTestResult] = useState("");
  const [testNotes, setTestNotes] = useState("");
  const [error, setError] = useState("");

  const loadSession = useCallback(async () => {
    try {
      const state = useDiagnosisStore.getState();
      if (state.sessionId === sessionId && state.status !== "idle") {
        // Use store data
        setSession({
          session_id: state.sessionId,
          truck_id: "",
          symptom_text: "",
          dtc_codes: state.dtcCodes,
          status: state.status === "loading" ? "active" : (state.status as any),
          candidate_causes: state.candidateCauses,
          completed_tests: state.completedTests,
          recommended_test: state.recommendedTest,
          confidence_score: state.confidenceScore,
          should_escalate: state.shouldEscalate,
          cost_estimate: state.costEstimate,
          citations: state.citations,
          root_cause: state.rootCause,
        });
        setLoading(false);
        return;
      }
      const data = await fetchSession(sessionId);
      setSession(data);
      // Sync to store
      state.setDiagnosis({
        session_id: data.session_id,
        dtc_codes: data.dtc_codes,
        candidate_causes: data.candidate_causes,
        recommended_test: data.recommended_test,
        confidence_score: data.confidence_score,
        should_escalate: data.should_escalate,
        escalation_reason: "",
        cost_estimate: data.cost_estimate,
        citations: data.citations,
        diagnosis_complete: data.status === "resolved",
        root_cause: data.root_cause,
        llm_summary: "",
      });
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [sessionId]);

  useEffect(() => {
    loadSession();
  }, [loadSession]);

  const handleSubmitResult = async () => {
    if (!session?.recommended_test || !testResult.trim()) return;
    setSubmitting(true);
    setError("");
    try {
      const response = await submitTestResult(sessionId, {
        test_id: session.recommended_test.test_id,
        result: testResult,
        notes: testNotes,
      });

      // Add to completed tests
      const completedTest: CompletedTest = {
        test_id: session.recommended_test.test_id,
        result: testResult,
        notes: testNotes,
        timestamp: new Date().toISOString(),
      };

      store.addCompletedTest(completedTest);
      store.updateFromTestResult(response);

      // Update local session state
      setSession((prev) =>
        prev
          ? {
              ...prev,
              candidate_causes: response.candidate_causes,
              recommended_test: response.recommended_test,
              confidence_score: response.confidence_score,
              should_escalate: response.should_escalate,
              cost_estimate: response.cost_estimate,
              root_cause: response.root_cause,
              status: response.diagnosis_complete ? "resolved" : response.should_escalate ? "escalated" : "active",
              completed_tests: [...prev.completed_tests, completedTest],
            }
          : null
      );

      setTestResult("");
      setTestNotes("");
    } catch (e: any) {
      setError(e.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <svg className="animate-spin h-10 w-10 mx-auto text-primary mb-4" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <p className="text-surface-500">Loading diagnostic session...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="text-center py-20">
        <p className="text-surface-500">Session not found.</p>
        <a href="/" className="text-primary hover:underline text-sm mt-2 inline-block">
          ← Back to Dashboard
        </a>
      </div>
    );
  }

  const isResolved = session.status === "resolved";
  const isEscalated = session.should_escalate;

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-2 h-8 rounded-full bg-gradient-to-b from-primary to-accent" />
            <h1 className="text-2xl font-bold text-dark">Guided Diagnosis</h1>
            <span
              className={`status-badge ${
                isResolved
                  ? "status-badge-resolved"
                  : isEscalated
                  ? "status-badge-escalated"
                  : "status-badge-active"
              }`}
            >
              {isResolved ? "✓ Resolved" : isEscalated ? "⚠ Escalate" : "● Active"}
            </span>
          </div>
          <p className="text-xs text-surface-500 ml-5 font-mono">
            Session: {sessionId.slice(0, 8)}...
          </p>
        </div>
        <div className="flex gap-3">
          <a
            href={`/report/${sessionId}`}
            className="px-4 py-2 rounded-lg border border-surface-300 text-sm font-medium
                       text-dark hover:bg-surface-200 transition-colors flex items-center gap-2"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
            </svg>
            View Report
          </a>
        </div>
      </div>

      {/* Escalation Banner */}
      {isEscalated && !isResolved && (
        <div className="mb-6 rounded-lg border-2 border-warning bg-amber-50 p-5 flex items-start gap-4 animate-slide-in">
          <div className="w-10 h-10 rounded-full bg-warning/20 flex items-center justify-center shrink-0">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-warning">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
              <line x1="12" y1="9" x2="12" y2="13" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
          </div>
          <div>
            <h3 className="font-semibold text-amber-900">Confidence Too Low — Escalate to Dealer</h3>
            <p className="text-sm text-amber-800 mt-1">
              Diagnostic confidence is {session.confidence_score.toFixed(1)}% (threshold: 40%).
              Multiple causes remain equally likely. Recommend connecting DAVIE4 or escalating
              to the dealer service team for advanced diagnostics.
            </p>
          </div>
        </div>
      )}

      {/* Resolved Banner */}
      {isResolved && session.root_cause && (
        <div className="mb-6 rounded-lg border-2 border-success bg-green-50 p-5 flex items-start gap-4 animate-slide-in">
          <div className="w-10 h-10 rounded-full bg-success/20 flex items-center justify-center shrink-0">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-success">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
          </div>
          <div>
            <h3 className="font-semibold text-green-900">Root Cause Confirmed</h3>
            <p className="text-sm text-green-800 mt-1">
              <strong>{session.root_cause}</strong> — Confidence: {session.confidence_score.toFixed(1)}%
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left column: Workflow steps */}
        <div className="lg:col-span-2 space-y-6">
          {/* Confidence Score */}
          <div className="torq-card">
            <div className="torq-card-header">
              <h2 className="font-semibold text-dark text-sm">Diagnostic Confidence</h2>
              <span className="text-2xl font-bold text-primary">
                {session.confidence_score.toFixed(1)}%
              </span>
            </div>
            <div className="torq-card-body">
              <div className="confidence-bar">
                <div
                  className={`confidence-bar-fill ${confidenceColor(session.confidence_score)}`}
                  style={{ "--bar-width": `${Math.min(session.confidence_score, 100)}%` } as any}
                />
              </div>
              <div className="flex justify-between mt-2 text-xs text-surface-500">
                <span>0% — Uncertain</span>
                <span className="text-warning">40% Threshold</span>
                <span>100% — Confirmed</span>
              </div>
            </div>
          </div>

          {/* Candidate Causes */}
          <div className="torq-card">
            <div className="torq-card-header">
              <h2 className="font-semibold text-dark text-sm">Candidate Root Causes</h2>
              <span className="text-xs text-surface-500">
                {session.candidate_causes.length} candidates
              </span>
            </div>
            <div className="torq-card-body space-y-4">
              {session.candidate_causes.map((cause, i) => (
                <div
                  key={cause.id}
                  className={`p-4 rounded-lg border transition-all ${
                    i === 0
                      ? "border-primary/30 bg-primary-50/30 shadow-sm"
                      : "border-surface-200 bg-white"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                          i === 0
                            ? "bg-primary text-white"
                            : "bg-surface-200 text-surface-500"
                        }`}
                      >
                        {i + 1}
                      </span>
                      <span className="font-medium text-dark text-sm">{cause.name}</span>
                    </div>
                    <span
                      className={`text-sm font-bold ${
                        cause.probability >= 0.5
                          ? "text-primary"
                          : cause.probability >= 0.2
                          ? "text-warning"
                          : "text-surface-500"
                      }`}
                    >
                      {formatPercent(cause.probability)}
                    </span>
                  </div>
                  <div className="confidence-bar mb-2">
                    <div
                      className={`confidence-bar-fill ${
                        i === 0 ? "bg-primary" : "bg-surface-400"
                      }`}
                      style={{ "--bar-width": `${cause.probability * 100}%` } as any}
                    />
                  </div>
                  {cause.source_snippet && (
                    <p className="text-xs text-surface-500 mt-1 line-clamp-2">
                      {cause.source_snippet}
                    </p>
                  )}
                  {cause.evidence.length > 0 && (
                    <div className="mt-2 space-y-1">
                      {cause.evidence.map((ev, j) => (
                        <p key={j} className="text-xs text-surface-500 flex items-center gap-1">
                          <span className="text-success">✓</span> {ev}
                        </p>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Completed Tests Timeline */}
          {session.completed_tests.length > 0 && (
            <div className="torq-card">
              <div className="torq-card-header">
                <h2 className="font-semibold text-dark text-sm">Tests Performed</h2>
                <span className="text-xs text-surface-500">
                  {session.completed_tests.length} completed
                </span>
              </div>
              <div className="torq-card-body">
                <div className="space-y-3">
                  {session.completed_tests.map((test, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-3 p-3 rounded-lg bg-surface-100"
                    >
                      <div className="w-8 h-8 rounded-full bg-success/10 flex items-center justify-center shrink-0 mt-0.5">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-success">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-dark font-mono">
                          {test.test_id}
                        </p>
                        <p className="text-xs text-surface-500 mt-0.5">
                          Result: <span className={`font-semibold ${test.result === "pass" ? "text-success" : test.result === "fail" ? "text-accent" : "text-primary"}`}>{test.result}</span>
                          {test.notes && <> — {test.notes}</>}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Next Test Card */}
          {session.recommended_test && !isResolved && !isEscalated && (
            <div className="torq-card border-primary/30 shadow-glow">
              <div className="torq-card-header bg-primary-50/50">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="font-semibold text-primary">
                      Recommended Next Test
                    </h2>
                    <p className="text-xs text-primary-300">
                      Step {session.completed_tests.length + 1}
                    </p>
                  </div>
                </div>
              </div>
              <div className="torq-card-body space-y-4">
                <div>
                  <p className="text-sm text-dark leading-relaxed">
                    {session.recommended_test.description}
                  </p>
                  <p className="text-xs text-surface-500 mt-2 italic">
                    {session.recommended_test.reasoning}
                  </p>
                </div>

                {/* Test input */}
                <div className="space-y-3 pt-2 border-t border-surface-200">
                  <div>
                    <label className="text-xs font-medium text-dark block mb-1">
                      Test Result
                    </label>
                    {session.recommended_test.test_type === "pass_fail" ? (
                      <div className="flex gap-2">
                        <button
                          onClick={() => setTestResult("pass")}
                          className={`flex-1 py-3 rounded-lg text-sm font-semibold border-2 transition-all ${
                            testResult === "pass"
                              ? "border-success bg-success/10 text-success"
                              : "border-surface-300 text-surface-500 hover:border-success/50"
                          }`}
                        >
                          ✓ PASS
                        </button>
                        <button
                          onClick={() => setTestResult("fail")}
                          className={`flex-1 py-3 rounded-lg text-sm font-semibold border-2 transition-all ${
                            testResult === "fail"
                              ? "border-accent bg-accent/10 text-accent"
                              : "border-surface-300 text-surface-500 hover:border-accent/50"
                          }`}
                        >
                          ✗ FAIL
                        </button>
                      </div>
                    ) : (
                      <input
                        type="text"
                        value={testResult}
                        onChange={(e) => setTestResult(e.target.value)}
                        placeholder="Enter measurement value (e.g., 14.2V, 350kPa)"
                        className="w-full h-12 px-4 rounded-lg border border-surface-300 bg-white text-dark
                                   focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary
                                   transition-all text-sm font-mono"
                      />
                    )}
                  </div>
                  <div>
                    <label className="text-xs font-medium text-dark block mb-1">
                      Notes (optional)
                    </label>
                    <input
                      type="text"
                      value={testNotes}
                      onChange={(e) => setTestNotes(e.target.value)}
                      placeholder="Any additional observations..."
                      className="w-full h-10 px-4 rounded-lg border border-surface-300 bg-white text-dark
                                 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary
                                 transition-all text-sm"
                    />
                  </div>
                  <button
                    onClick={handleSubmitResult}
                    disabled={!testResult.trim() || submitting}
                    className="w-full h-12 rounded-lg bg-primary text-white font-semibold text-sm
                               hover:bg-primary-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed
                               flex items-center justify-center gap-2"
                  >
                    {submitting ? (
                      <>
                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        Updating...
                      </>
                    ) : (
                      "Submit Result & Update Diagnosis"
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="rounded-lg border border-accent/20 bg-accent-50 p-4 animate-slide-in">
              <p className="text-sm text-accent-800">{error}</p>
            </div>
          )}
        </div>

        {/* Right column: Cost + Citations */}
        <div className="space-y-6">
          {/* Cost Estimate */}
          {session.cost_estimate && (
            <div className="torq-card">
              <div className="torq-card-header">
                <h3 className="font-semibold text-dark text-sm">Cost Estimate</h3>
                <div className="demo-badge">Demo Prices</div>
              </div>
              <div className="torq-card-body space-y-3">
                {session.cost_estimate.parts.length > 0 && (
                  <div>
                    <p className="text-xs font-medium text-surface-500 mb-2 uppercase tracking-wide">
                      Parts
                    </p>
                    {session.cost_estimate.parts.map((part, i) => (
                      <div key={i} className="flex justify-between items-center py-1.5">
                        <div>
                          <p className="text-xs text-dark">{part.description || part.part_number}</p>
                          <p className="text-xs text-surface-500">
                            {part.quantity}× {formatCurrency(part.price)}
                          </p>
                        </div>
                        <span className="text-xs font-mono text-dark">
                          {formatCurrency(part.line_total || part.price * part.quantity)}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
                <div className="border-t border-surface-200 pt-3 space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-surface-500">
                      Labor ({session.cost_estimate.labor_hours}h × {formatCurrency(session.cost_estimate.labor_rate_per_hour)}/h)
                    </span>
                    <span className="font-mono text-dark">
                      {formatCurrency(session.cost_estimate.labor_hours * session.cost_estimate.labor_rate_per_hour)}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-surface-500">Consumables</span>
                    <span className="font-mono text-dark">
                      {formatCurrency(session.cost_estimate.consumables)}
                    </span>
                  </div>
                </div>
                <div className="border-t-2 border-primary/20 pt-3 flex justify-between items-center">
                  <span className="text-sm font-semibold text-dark">Total Estimate</span>
                  <span className="text-lg font-bold text-primary">
                    {formatCurrency(session.cost_estimate.total)}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Source Citations */}
          {session.citations.length > 0 && (
            <div className="torq-card">
              <div className="torq-card-header">
                <h3 className="font-semibold text-dark text-sm">Sources</h3>
              </div>
              <div className="torq-card-body space-y-3">
                {session.citations.slice(0, 4).map((citation, i) => (
                  <div key={i} className="p-3 rounded-lg bg-surface-100 border border-surface-200">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-semibold text-primary">
                        {citation.source}
                      </span>
                      <span className="text-xs text-surface-500">
                        {(citation.relevance_score * 100).toFixed(0)}% match
                      </span>
                    </div>
                    <p className="text-xs text-surface-500 line-clamp-3">
                      {citation.snippet}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* LLM Summary */}
          {store.llmSummary && (
            <div className="torq-card">
              <div className="torq-card-header">
                <h3 className="font-semibold text-dark text-sm">AI Analysis</h3>
                <div className="torq-lock-badge">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                  TORQ-Lock
                </div>
              </div>
              <div className="torq-card-body">
                <p className="text-xs text-surface-500 leading-relaxed whitespace-pre-wrap">
                  {store.llmSummary}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
