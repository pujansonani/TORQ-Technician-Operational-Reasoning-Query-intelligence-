// ── Shared TypeScript interfaces for TORQ frontend ──

export interface Truck {
  id: string;
  vin: string;
  brand: string;
  model: string;
  year: number;
  engine: string;
  mileage_km: number;
}

export interface TruckBrief {
  id: string;
  vin: string;
  brand: string;
  model: string;
  year: number;
}

export interface CandidateCause {
  id: string;
  name: string;
  probability: number;
  evidence: string[];
  source_snippet: string;
  estimated_cost?: CostEstimate;
}

export interface RecommendedTest {
  test_id: string;
  description: string;
  test_type: "pass_fail" | "measurement";
  discriminates_causes: string[];
  reasoning: string;
}

export interface CostEstimate {
  cause_id?: string;
  cause_name?: string;
  parts: PartLine[];
  labor_hours: number;
  labor_rate_per_hour: number;
  consumables: number;
  total: number;
}

export interface PartLine {
  part_number: string;
  description: string;
  price: number;
  quantity: number;
  line_total: number;
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

export interface CompletedTest {
  test_id: string;
  result: string;
  notes: string;
  timestamp: string | null;
}

export interface SessionState {
  session_id: string;
  truck_id: string;
  symptom_text: string;
  dtc_codes: string[];
  status: "active" | "resolved" | "escalated";
  candidate_causes: CandidateCause[];
  completed_tests: CompletedTest[];
  recommended_test: RecommendedTest | null;
  confidence_score: number;
  should_escalate: boolean;
  cost_estimate: CostEstimate | null;
  citations: SourceCitation[];
  root_cause: string | null;
}

export interface DiagnoseRequest {
  truck_id: string;
  symptom_text: string;
  dtc_codes: string[];
}

export interface FleetInsight {
  total_cases: number;
  resolution_breakdown: { root_cause: string; count: number; percentage: number }[];
  avg_cost: number;
  avg_labor_hours: number;
  period_days: number;
}
