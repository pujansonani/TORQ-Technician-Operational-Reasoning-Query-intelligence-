"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle2, 
  Sparkles,
  Loader2,
  Mic,
  Camera,
  AlertCircle
} from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { fetchTrucks, startDiagnosis, type TruckBrief } from "@/lib/api";

export default function NewDiagnosisPage() {
  const router = useRouter();

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [trucks, setTrucks] = useState<TruckBrief[]>([]);
  const [loadingTrucks, setLoadingTrucks] = useState(true);
  const [selectedTruckId, setSelectedTruckId] = useState("");
  const [symptom, setSymptom] = useState("");
  const [spn, setSpn] = useState("100");
  const [fmi, setFmi] = useState("4");
  const [voiceRecording, setVoiceRecording] = useState(false);
  const [isScanningOCR, setIsScanningOCR] = useState(false);
  const [dtcType, setDtcType] = useState<"SPN" | "P-Code">("SPN");
  const [analyzingStage, setAnalyzingStage] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const stages = [
    "Reading symptom description & telemetry context...",
    "Querying DTC knowledge base via RAG...",
    "Running Bayesian candidate scoring...",
    "Selecting Next-Best-Test via information gain...",
    "Verifying specs via TORQ-LOCK...",
  ];

  useEffect(() => {
    fetchTrucks()
      .then((data) => {
        setTrucks(data);
        if (data.length > 0) setSelectedTruckId(data[0].id);
      })
      .catch(() => setError("Could not load trucks from backend"))
      .finally(() => setLoadingTrucks(false));
  }, []);

  const handleStartAnalysis = async () => {
    setError(null);
    if (!selectedTruckId || !symptom.trim()) {
      setError("Please select a truck and describe the symptom.");
      return;
    }

    setStep(4);
    // Animate stages while API call runs
    let stage = 0;
    const interval = setInterval(() => {
      stage++;
      if (stage < stages.length) setAnalyzingStage(stage);
    }, 600);

    try {
      const dtcCode = `SPN-${spn}-FMI-${fmi}`;
      const result = await startDiagnosis({
        truck_id: selectedTruckId,
        symptom_text: symptom,
        dtc_codes: [dtcCode],
      });
      clearInterval(interval);
      setAnalyzingStage(stages.length);
      setTimeout(() => {
        router.push(`/diagnostics/${result.session_id}`);
      }, 500);
    } catch (err) {
      clearInterval(interval);
      setError(err instanceof Error ? err.message : "Diagnosis failed");
      setStep(3);
    }
  };

  return (
    <AppShell>
      <div className="max-w-3xl mx-auto space-y-8 py-2">
        
        {/* Header with Apple HIG Typography */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-red-50 text-[#E5402C] border border-[#F6C9BE]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>TORQ Intake Wizard</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#111827]">
            New Diagnostic <span className="italic font-bold text-[#E5402C]">Intake</span>
          </h1>
          <p className="text-sm text-[#4B5563] max-w-xl font-normal leading-relaxed">
            Follow the 4-stage guided intake to initialize vehicle telemetry, technician observations, and OEM fault codes.
          </p>
        </div>

        {/* Step Progress Rail - Apple HIG Pills */}
        <div className="p-4 bg-white rounded-[20px] border border-black/[0.06] shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
          <div className="flex items-center justify-between text-xs font-mono uppercase tracking-wider text-[#6B7280] mb-3">
            <span className="font-bold text-[#111827]">DIAGNOSTIC INTAKE WIZARD</span>
            <span className="font-bold text-[#E5402C]">STAGE 0{step} OF 04</span>
          </div>

          <div className="grid grid-cols-4 gap-2.5">
            {[
              { num: "01", name: "Vehicle" },
              { num: "02", name: "Symptoms" },
              { num: "03", name: "Fault Codes" },
              { num: "04", name: "Synthesizing" },
            ].map((s, idx) => {
              const sNum = (idx + 1) as 1 | 2 | 3 | 4;
              const isDone = step > sNum;
              const isCurrent = step === sNum;

              return (
                <div key={s.num} className="space-y-1.5">
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${
                      isDone
                        ? "bg-emerald-500"
                        : isCurrent
                        ? "bg-[#E5402C]"
                        : "bg-gray-100"
                    }`}
                  />
                  <span className={`text-[11px] font-bold hidden sm:block ${isCurrent ? "text-[#E5402C]" : isDone ? "text-emerald-700" : "text-[#9CA3AF]"}`}>
                    {s.num} {s.name}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* STEP 1: VEHICLE INFORMATION */}
        {step === 1 && (
          <div className="p-8 sm:p-10 bg-white rounded-[24px] border border-black/[0.08] shadow-[0_4px_24px_rgba(0,0,0,0.04)] space-y-6">
            <div className="border-b border-black/[0.06] pb-4">
              <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-[#111827]">
                Vehicle Identification
              </h2>
              <p className="text-sm text-[#4B5563] mt-1 font-normal">
                Select a registered truck from the live fleet database to load VIN, engine, and tolerances.
              </p>
            </div>

            <div className="space-y-5">
              {loadingTrucks ? (
                <div className="flex items-center gap-3 text-sm text-[#6B7280]">
                  <Loader2 className="w-4 h-4 animate-spin text-[#E5402C]" />
                  Loading fleet from backend...
                </div>
              ) : (
                <div>
                  <label className="block text-xs font-bold text-[#374151] uppercase tracking-wider mb-2">
                    Select Truck Unit
                  </label>
                  <select
                    value={selectedTruckId}
                    onChange={(e) => setSelectedTruckId(e.target.value)}
                    className="w-full h-12 px-4 bg-[#FAFBFB] text-[#111827] text-sm font-medium rounded-xl border border-black/[0.12] focus:outline-none focus:ring-2 focus:ring-[#E5402C]/20 focus:border-[#E5402C] transition-all"
                  >
                    {trucks.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.brand} {t.model} ({t.year}) — VIN: {t.vin}
                      </option>
                    ))}
                  </select>
                  <p className="text-xs text-[#6B7280] mt-2">{trucks.length} trucks loaded from backend database</p>
                </div>
              )}

              {error && (
                <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 p-3 rounded-xl border border-red-200">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  {error}
                </div>
              )}
            </div>

            <div className="flex justify-end pt-6 border-t border-black/[0.06]">
              <button
                type="button"
                onClick={() => setStep(2)}
                disabled={!selectedTruckId || loadingTrucks}
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-[#E5402C] hover:bg-[#CF3722] disabled:opacity-50 text-white text-sm font-bold tracking-tight shadow-[0_4px_16px_rgba(229,64,44,0.25)] transition-all"
              >
                <span>Continue to Symptoms</span>
                <ArrowRight className="w-4 h-4" />

              </button>
            </div>
          </div>
        )}

        {/* STEP 2: SYMPTOM OBSERVATION */}
        {step === 2 && (
          <div className="p-8 sm:p-10 bg-white rounded-[24px] border border-black/[0.08] shadow-[0_4px_24px_rgba(0,0,0,0.04)] space-y-6">
            <div className="border-b border-black/[0.06] pb-4">
              <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-[#111827]">
                What is the technician observing?
              </h2>
              <p className="text-sm text-[#4B5563] mt-1 font-normal">
                Describe the operating condition, road load, ambient temperatures, and driver feedback.
              </p>
            </div>

            <div className="space-y-5">
              <div className="relative">
                <textarea
                  rows={4}
                  value={symptom}
                  onChange={(e) => setSymptom(e.target.value)}
                  className="w-full p-4 bg-[#FAFBFB] text-[#111827] text-sm font-medium rounded-xl border border-black/[0.12] focus:outline-none focus:ring-2 focus:ring-[#E5402C]/20 focus:border-[#E5402C] transition-all leading-relaxed"
                  placeholder="Engine loses power under load and hesitates during acceleration..."
                />
              </div>

              {/* Voice Input Integration */}
              <div className="flex items-center justify-between p-4 rounded-[16px] bg-[#FAFBFB] border border-black/[0.06]">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${voiceRecording ? "bg-[#E5402C] text-white animate-pulse" : "bg-red-50 text-[#E5402C]"}`}>
                    <Mic className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-[#111827] block">
                      {voiceRecording ? "Listening to technician dictation..." : "Voice Symptom Dictation (Hands-Free)"}
                    </span>
                    <span className="text-[11px] text-[#6B7280]">
                      {voiceRecording ? "Say 'stop' or click to conclude" : "Transcribes workshop audio directly into structured claims"}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setVoiceRecording(!voiceRecording)}
                  className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
                    voiceRecording
                      ? "bg-[#E5402C] text-white shadow"
                      : "bg-white hover:bg-gray-50 text-[#111827] border border-black/[0.1]"
                  }`}
                >
                  {voiceRecording ? "Stop Dictation" : "Record Audio"}
                </button>
              </div>

              {/* Quick Preset Badges */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-[#6B7280] uppercase tracking-wider block">
                  Quick Presets From Driver Telemetry:
                </span>
                <div className="flex flex-wrap gap-2 pt-1">
                  {[
                    "Hesitation above 1,400 RPM",
                    "Intermittent stall under highway grade",
                    "Check engine lamp flashing yellow",
                    "White exhaust vapor on startup",
                  ].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setSymptom((prev) => (prev ? `${prev} ${preset}` : preset))}
                      className="px-3 py-1.5 rounded-full text-xs font-semibold bg-gray-100 hover:bg-red-50 text-[#4B5563] hover:text-[#E5402C] border border-transparent hover:border-[#F6C9BE] transition-all"
                    >
                      + {preset}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-6 border-t border-black/[0.06]">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gray-100 hover:bg-gray-200 text-[#111827] text-xs font-bold transition-all"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
              <button
                type="button"
                onClick={() => setStep(3)}
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-[#E5402C] hover:bg-[#CF3722] text-white text-sm font-bold tracking-tight shadow-[0_4px_16px_rgba(229,64,44,0.25)] transition-all"
              >
                <span>Continue to Fault Codes</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: DTC & FAULT CODES */}
        {step === 3 && (
          <div className="p-8 sm:p-10 bg-white rounded-[24px] border border-black/[0.08] shadow-[0_4px_24px_rgba(0,0,0,0.04)] space-y-6">
            <div className="border-b border-black/[0.06] pb-4">
              <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-[#111827]">
                Diagnostic Trouble Codes (DTC)
              </h2>
              <p className="text-sm text-[#4B5563] mt-1 font-normal">
                Enter SPN (Suspect Parameter Number) and FMI (Failure Mode Identifier), or scan the display.
              </p>
            </div>

            <div className="space-y-5">
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setDtcType("SPN")}
                  className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
                    dtcType === "SPN"
                      ? "bg-[#111827] text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  SAE J1939 (SPN / FMI)
                </button>
                <button
                  type="button"
                  onClick={() => setDtcType("P-Code")}
                  className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
                    dtcType === "P-Code"
                      ? "bg-[#111827] text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Standard OBD (P-Code)
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#374151] uppercase tracking-wider mb-2">
                    SPN (Parameter Number)
                  </label>
                  <input
                    type="number"
                    value={spn}
                    onChange={(e) => setSpn(e.target.value)}
                    className="w-full h-12 px-4 font-mono font-semibold bg-[#FAFBFB] text-[#111827] text-sm rounded-xl border border-black/[0.12] focus:outline-none focus:ring-2 focus:ring-[#E5402C]/20 focus:border-[#E5402C] transition-all"
                    placeholder="94"
                  />
                  <span className="text-[11px] text-[#6B7280] mt-1.5 block">
                    SPN 94: Engine Fuel Delivery Pressure
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#374151] uppercase tracking-wider mb-2">
                    FMI (Failure Mode)
                  </label>
                  <input
                    type="number"
                    value={fmi}
                    onChange={(e) => setFmi(e.target.value)}
                    className="w-full h-12 px-4 font-mono font-semibold bg-[#FAFBFB] text-[#111827] text-sm rounded-xl border border-black/[0.12] focus:outline-none focus:ring-2 focus:ring-[#E5402C]/20 focus:border-[#E5402C] transition-all"
                    placeholder="1"
                  />
                  <span className="text-[11px] text-[#6B7280] mt-1.5 block">
                    FMI 1: Data Valid But Below Normal Operating Range
                  </span>
                </div>
              </div>

              {/* OCR Scanner Simulation Card */}
              <div className="p-5 rounded-[18px] bg-[#FAFBFB] border border-black/[0.06] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                    <Camera className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-[#111827] block">
                      Camera DTC OCR Scanner
                    </span>
                    <span className="text-[11px] text-[#6B7280]">
                      Snap photo of instrument cluster or DAVIE-4 diagnostic interface
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setIsScanningOCR(true);
                    setTimeout(() => {
                      setIsScanningOCR(false);
                      setSpn("94");
                      setFmi("1");
                    }, 1000);
                  }}
                  className="px-4 py-2 rounded-full text-xs font-bold bg-white hover:bg-gray-50 text-[#111827] border border-black/[0.1] transition-all"
                >
                  {isScanningOCR ? "Scanning..." : "Scan Code"}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-6 border-t border-black/[0.06]">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gray-100 hover:bg-gray-200 text-[#111827] text-xs font-bold transition-all"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
              <button
                type="button"
                onClick={handleStartAnalysis}
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-[#E5402C] hover:bg-[#CF3722] text-white text-sm font-bold tracking-tight shadow-[0_4px_16px_rgba(229,64,44,0.25)] transition-all"
              >
                <Sparkles className="w-4 h-4" />
                <span>Synthesize TORQ Assessment</span>
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: PROGRESSIVE SYNTHESIS LOADER */}
        {step === 4 && (
          <div className="p-10 sm:p-14 bg-white rounded-[24px] border border-black/[0.08] shadow-[0_4px_24px_rgba(0,0,0,0.04)] text-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center text-[#E5402C] mx-auto">
              <Loader2 className="w-8 h-8 animate-spin" />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-extrabold tracking-tight text-[#111827]">
                Synthesizing TORQ Diagnostic Evidence
              </h2>
              <p className="text-sm text-[#4B5563] max-w-md mx-auto">
                TORQ is evaluating OEM service bulletins, historical telemetry clusters, and wiring diagrams.
              </p>
            </div>

            {/* Step Checkoff List */}
            <div className="max-w-md mx-auto text-left space-y-3.5 pt-4">
              {stages.map((stg, i) => {
                const isComplete = analyzingStage > i;
                const isCurrent = analyzingStage === i;

                return (
                  <div key={stg} className="flex items-center gap-3 text-sm">
                    {isComplete ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    ) : isCurrent ? (
                      <div className="w-5 h-5 rounded-full border-2 border-[#E5402C] border-t-transparent animate-spin shrink-0" />
                    ) : (
                      <div className="w-5 h-5 rounded-full border border-gray-300 shrink-0" />
                    )}
                    <span className={isCurrent ? "font-bold text-[#E5402C]" : isComplete ? "font-medium text-[#111827]" : "text-[#9CA3AF]"}>
                      {stg}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

      </div>
    </AppShell>
  );
}
