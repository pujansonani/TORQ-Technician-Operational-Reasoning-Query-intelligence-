/**
 * Typed API client for the TORQ backend.
 */

import type {
  TruckBrief,
  Truck,
  DiagnoseRequest,
  DiagnosisResponse,
  TestResultPayload,
  SessionState,
  FleetInsight,
} from "@/types";

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

// ── Trucks ───────────────────────────────────────────────────────────

export async function fetchTrucks(): Promise<TruckBrief[]> {
  return apiFetch<TruckBrief[]>("/api/trucks");
}

export async function fetchTruck(id: string): Promise<Truck> {
  return apiFetch<Truck>(`/api/trucks/${id}`);
}

// ── Diagnosis ────────────────────────────────────────────────────────

export async function startDiagnosis(
  data: DiagnoseRequest
): Promise<DiagnosisResponse> {
  return apiFetch<DiagnosisResponse>("/api/diagnose", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function submitTestResult(
  sessionId: string,
  data: TestResultPayload
): Promise<DiagnosisResponse> {
  return apiFetch<DiagnosisResponse>(
    `/api/sessions/${sessionId}/test-result`,
    {
      method: "POST",
      body: JSON.stringify(data),
    }
  );
}

export async function fetchSession(sessionId: string): Promise<SessionState> {
  return apiFetch<SessionState>(`/api/sessions/${sessionId}`);
}

// ── Reports ──────────────────────────────────────────────────────────

export async function fetchReport(sessionId: string): Promise<string> {
  const res = await fetch(`${API_BASE}/api/sessions/${sessionId}/report`);
  if (!res.ok) throw new Error("Failed to fetch report");
  return res.text();
}

// ── Fleet ────────────────────────────────────────────────────────────

export async function fetchFleetInsight(
  dtcCode: string,
  truckModel?: string,
  days?: number
): Promise<FleetInsight> {
  const params = new URLSearchParams({ dtc_code: dtcCode });
  if (truckModel) params.set("truck_model", truckModel);
  if (days) params.set("days", String(days));
  return apiFetch<FleetInsight>(`/api/fleet/similar-cases?${params}`);
}
