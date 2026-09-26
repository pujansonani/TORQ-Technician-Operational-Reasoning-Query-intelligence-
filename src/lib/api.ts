/**
 * TORQ API Client â€” connects frontend to FastAPI backend at localhost:8000
 */

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { "Content-Type": "application/json", ...options?.headers },
    ...options,
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(error.detail || `API error: ${res.status}`);
  }
  return res.json();
}

export interface TruckBrief {
  id: string;
  vin: string;
  brand: string;
  model: string;
  year: number;
}

export interface Truck extends TruckBrief {
  engine: string;
  mileage_km: number;
}

export interface CandidateCause {
  id: string;
  name: string;
  probability: number;
  evidence: string[];
  source_snippet: string;
}

export interface RecommendedTest {
  test_id: string;
  description: string;
  test_type: "pass_fail" | "measurement";
  discriminates_causes: string[];
  reasoning: string;
}

export interface CostEstimate {
  parts: { part_number: string; description: string; price: number; quantity: number; line_total: number }[];
  labor_hours: number;
  labor_rate_per_hour: number;
  consumables: number;
  total: number;
}

export interface SourceCitation {
  source: string;
  snippet: string;
  relevance_score: number;
}

export interface DiagnosisResponse {
  session_id: string;
  dtc_codes: string[];
  candidate_causes: CandidateCause[];
  recommended_test: RecommendedTest | null;
  confidence_score: number;
  should_escalate: boolean;
  escalation_reason: string;
  cost_estimate: CostEstimate | null;
  citations: SourceCitation[];
  diagnosis_complete: boolean;
  root_cause: string | null;
  llm_summary: string;
}

export interface TestResultPayload {
  test_id: string;
  result: string;
  notes: string;
}

export interface SessionState {
  session_id: string;
  truck_id: string;
  symptom_text: string;
  dtc_codes: string[];
  status: "active" | "resolved" | "escalated";
  candidate_causes: CandidateCause[];
  completed_tests: { test_id: string; result: string; notes: string; timestamp: string | null }[];
  recommended_test: RecommendedTest | null;
  confidence_score: number;
  should_escalate: boolean;
  escalation_reason?: string;
  cost_estimate: CostEstimate | null;
  citations: SourceCitation[];
  root_cause: string | null;
}

export async function fetchTrucks(): Promise<TruckBrief[]> {
  return apiFetch<TruckBrief[]>("/api/trucks");
}

export async function fetchTruck(id: string): Promise<Truck> {
  return apiFetch<Truck>(`/api/trucks/${id}`);
}

export async function startDiagnosis(data: {
  truck_id: string;
  symptom_text: string;
  dtc_codes: string[];
}): Promise<DiagnosisResponse> {
  return apiFetch<DiagnosisResponse>("/api/diagnose", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function submitTestResult(
  sessionId: string,
  data: { test_id: string; result: string; notes: string }
): Promise<DiagnosisResponse> {
  return apiFetch<DiagnosisResponse>(`/api/sessions/${sessionId}/test-result`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function fetchSession(sessionId: string): Promise<SessionState> {
  return apiFetch<SessionState>(`/api/sessions/${sessionId}`);
}

export async function fetchReport(sessionId: string): Promise<string> {
  const res = await fetch(`${API_BASE}/api/sessions/${sessionId}/report`);
  if (!res.ok) throw new Error("Failed to fetch report");
  return res.text();
}
