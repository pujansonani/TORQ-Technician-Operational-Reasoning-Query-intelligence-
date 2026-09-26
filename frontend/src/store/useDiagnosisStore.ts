import { create } from "zustand";
import type {
  DiagnosisResponse,
  CandidateCause,
  RecommendedTest,
  CostEstimate,
  SourceCitation,
  CompletedTest,
} from "@/types";

interface DiagnosisState {
  // Session info
  sessionId: string | null;
  dtcCodes: string[];
  symptomText: string;
  status: "idle" | "loading" | "active" | "resolved" | "escalated" | "error";
  errorMessage: string;

  // Diagnosis data
  candidateCauses: CandidateCause[];
  recommendedTest: RecommendedTest | null;
  confidenceScore: number;
  shouldEscalate: boolean;
  escalationReason: string;
  costEstimate: CostEstimate | null;
  citations: SourceCitation[];
  completedTests: CompletedTest[];
  rootCause: string | null;
  llmSummary: string;

  // Actions
  setLoading: () => void;
  setError: (msg: string) => void;
  setDiagnosis: (response: DiagnosisResponse) => void;
  updateFromTestResult: (response: DiagnosisResponse) => void;
  addCompletedTest: (test: CompletedTest) => void;
  reset: () => void;
}

const initialState = {
  sessionId: null,
  dtcCodes: [],
  symptomText: "",
  status: "idle" as const,
  errorMessage: "",
  candidateCauses: [],
  recommendedTest: null,
  confidenceScore: 0,
  shouldEscalate: false,
  escalationReason: "",
  costEstimate: null,
  citations: [],
  completedTests: [],
  rootCause: null,
  llmSummary: "",
};

export const useDiagnosisStore = create<DiagnosisState>((set) => ({
  ...initialState,

  setLoading: () => set({ status: "loading", errorMessage: "" }),

  setError: (msg) => set({ status: "error", errorMessage: msg }),

  setDiagnosis: (response) =>
    set({
      sessionId: response.session_id,
      dtcCodes: response.dtc_codes,
      candidateCauses: response.candidate_causes,
      recommendedTest: response.recommended_test,
      confidenceScore: response.confidence_score,
      shouldEscalate: response.should_escalate,
      escalationReason: response.escalation_reason,
      costEstimate: response.cost_estimate,
      citations: response.citations,
      rootCause: response.root_cause,
      llmSummary: response.llm_summary || "",
      status: response.diagnosis_complete ? "resolved" : "active",
    }),

  updateFromTestResult: (response) =>
    set({
      candidateCauses: response.candidate_causes,
      recommendedTest: response.recommended_test,
      confidenceScore: response.confidence_score,
      shouldEscalate: response.should_escalate,
      escalationReason: response.escalation_reason,
      costEstimate: response.cost_estimate,
      citations: response.citations,
      rootCause: response.root_cause,
      status: response.diagnosis_complete
        ? "resolved"
        : response.should_escalate
        ? "escalated"
        : "active",
    }),

  addCompletedTest: (test) =>
    set((state) => ({
      completedTests: [...state.completedTests, test],
    })),

  reset: () => set(initialState),
}));
