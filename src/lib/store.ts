import { create } from "zustand";
import { DiagnosticSession, INITIAL_DEMO_DIAGNOSIS } from "./mockData";

interface TorqStore {
  demoMode: boolean;
  setDemoMode: (enabled: boolean) => void;
  activeSession: DiagnosticSession;
  updateTestOutcome: (result: "PASS" | "FAIL" | "INCONCLUSIVE", measuredValue: string) => void;
  resetDemoSession: () => void;
  createNewSession: (newSession: Partial<DiagnosticSession>) => void;
}

export const useTorqStore = create<TorqStore>((set) => ({
  demoMode: true,
  setDemoMode: (enabled) => set({ demoMode: enabled }),
  activeSession: INITIAL_DEMO_DIAGNOSIS,
  
  updateTestOutcome: (result, measuredValue) =>
    set((state) => {
      let updatedCandidates = [...state.activeSession.candidates];
      let newStatus = state.activeSession.status;
      let confirmedCause = state.activeSession.confirmedRootCause;

      if (result === "FAIL") {
        // As defined in the PACCAR Hackathon specification:
        // Fuel Delivery Restriction jumps from 62% to 84%
        // Sensor issue drops to 10%
        // High pressure pump drops to 6%
        updatedCandidates = [
          {
            ...updatedCandidates[0],
            currentConfidence: 84,
          },
          {
            ...updatedCandidates[1],
            currentConfidence: 10,
          },
          {
            ...updatedCandidates[2],
            currentConfidence: 6,
          },
        ];
        newStatus = "Root-Cause-Confirmed";
        confirmedCause = "Low-Pressure Fuel Delivery Starvation (Restricted Primary Fuel Filter)";
      } else if (result === "PASS") {
        // If fuel pressure test passes, fuel filter restriction is ruled out!
        // Sensor drift or electrical bias jumps to primary candidate
        updatedCandidates = [
          {
            ...updatedCandidates[0],
            currentConfidence: 8,
          },
          {
            ...updatedCandidates[1],
            currentConfidence: 78,
          },
          {
            ...updatedCandidates[2],
            currentConfidence: 14,
          },
        ];
        newStatus = "In-Progress";
        confirmedCause = undefined;
      } else {
        // Inconclusive keeps distribution roughly steady with minor uncertainty adjustment
        updatedCandidates = [
          { ...updatedCandidates[0], currentConfidence: 58 },
          { ...updatedCandidates[1], currentConfidence: 26 },
          { ...updatedCandidates[2], currentConfidence: 16 },
        ];
      }

      const updatedHistory = [
        ...state.activeSession.testHistory,
        {
          testName: state.activeSession.nextBestTest.title,
          measuredValue: measuredValue || (result === "FAIL" ? "4.1 bar (Below spec)" : "5.8 bar (Normal)"),
          result,
          timestamp: new Date().toISOString(),
        },
      ];

      return {
        activeSession: {
          ...state.activeSession,
          candidates: updatedCandidates,
          status: newStatus,
          confirmedRootCause: confirmedCause,
          testHistory: updatedHistory,
          updatedAt: new Date().toISOString(),
        },
      };
    }),

  resetDemoSession: () =>
    set({
      activeSession: JSON.parse(JSON.stringify(INITIAL_DEMO_DIAGNOSIS)),
    }),

  createNewSession: (sessionData) =>
    set((state) => ({
      activeSession: {
        ...INITIAL_DEMO_DIAGNOSIS,
        id: `TRQ-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
        status: "Assessing",
        testHistory: [],
        confirmedRootCause: undefined,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        ...sessionData,
      },
    })),
}));
