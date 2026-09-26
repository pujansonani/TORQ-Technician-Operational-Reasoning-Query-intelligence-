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
  llm_summary?: string;
  truck_info?: Truck;
}

export interface DtcSubsystemOption {
  code: string;
  spn: string;
  fmi: string;
  subsystem: string;
  description: string;
  keywords: string[];
}

export const DTC_SUBSYSTEMS: DtcSubsystemOption[] = [
  {
    code: "SPN-110-FMI-0",
    spn: "110",
    fmi: "0",
    subsystem: "Engine Cooling System",
    description: "Coolant Temperature — Data Valid But Above Normal (Overheating)",
    keywords: ["coolant", "temp", "temperature", "overheat", "hot", "boiling", "radiator", "fan", "thermostat"],
  },
  {
    code: "SPN-100-FMI-4",
    spn: "100",
    fmi: "4",
    subsystem: "Engine Lubrication System",
    description: "Oil Pressure — Voltage Below Normal / Low Operating Pressure",
    keywords: ["oil", "pressure", "gauge", "lubrication", "dipstick", "pump", "psi", "kpa"],
  },
  {
    code: "SPN-520322-FMI-7",
    spn: "520322",
    fmi: "7",
    subsystem: "Aftertreatment SCR & DEF Dosing",
    description: "SCR Catalyst Conversion Efficiency — System Not Responding / DEF Quality",
    keywords: ["def", "urea", "scr", "injector", "catalyst", "exhaust fluid", "doser", "emissions", "derate"],
  },
  {
    code: "SPN-3226-FMI-5",
    spn: "3226",
    fmi: "5",
    subsystem: "Aftertreatment DPF System",
    description: "DPF Differential Pressure — Regeneration Circuit Fault",
    keywords: ["dpf", "soot", "regen", "particulate", "filter", "differential", "backpressure"],
  },
  {
    code: "SPN-91-FMI-4",
    spn: "91",
    fmi: "4",
    subsystem: "Electronic Throttle & Accelerator",
    description: "Accelerator Pedal Position — Voltage Below Normal / Dead Pedal Response",
    keywords: ["pedal", "throttle", "accelerator", "lag", "dead pedal", "limp", "potentiometer"],
  },
  {
    code: "SPN-190-FMI-0",
    spn: "190",
    fmi: "0",
    subsystem: "Engine Speed & VGT Actuator",
    description: "Engine Speed — Data Valid But Above Normal (Overspeed / Turbo Surge)",
    keywords: ["rpm", "speed", "overspeed", "turbo", "vgt", "actuator", "surge", "boost"],
  },
];

export async function fetchTrucks(): Promise<Truck[]> {
  return apiFetch<Truck[]>("/api/trucks");
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
