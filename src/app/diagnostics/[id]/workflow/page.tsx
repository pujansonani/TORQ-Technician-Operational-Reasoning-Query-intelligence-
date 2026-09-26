"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle2, 
  AlertTriangle, 
  RotateCcw, 
  Sparkles, 
  FileText, 
  Gauge, 
  Camera, 
  HelpCircle, 
  ShieldCheck, 
  Sliders, 
  Check, 
  X, 
  Upload, 
  Zap,
  Truck,
  Loader2
} from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { fetchSession, submitTestResult, type SessionState } from "@/lib/api";

export default function GuidedDiagnosticWorkflowPage() {
  const params = useParams();
  const router = useRouter();
  const sessionId = params.id as string;

  const [session, setSession] = useState<SessionState | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Step 1: Driver Interview State
  const [inclineOnly, setInclineOnly] = useState<string>("yes");
  const [gearBehavior, setGearBehavior] = useState<string>("high_gears");
  const [clusterLamp, setClusterLamp] = useState<string>("amber_mil");

  // Step 2: Quick Visual Inspection State
  const [airFilterClogged, setAirFilterClogged] = useState<boolean>(false);
  const [intakeHoseIntact, setIntakeHoseIntact] = useState<boolean>(true);
  const [turboLeaksFound, setTurboLeaksFound] = useState<boolean>(false);
  const [photoUploaded, setPhotoUploaded] = useState<boolean>(false);

  // Step 3: Live OBD-II Sensor Measurements
  const [mafVoltage, setMafVoltage] = useState<number>(0.72); // Out of spec (0.8 - 1.2V)
  const [boostPsi, setBoostPsi] = useState<number>(12.4);     // Low (15 - 20 PSI)
  const [fuelTrim, setFuelTrim] = useState<number>(4.2);      // In spec (-10% to +10%)
  const [isConnectedObd, setIsConnectedObd] = useState<boolean>(true);

  // Step 4: Branching Test Execution
  const [branchDecision, setBranchDecision] = useState<"4A" | "4B">("4A");
  const [testOutcome, setTestOutcome] = useState<"pass" | "fail">("fail");
  const [technicianNotes, setTechnicianNotes] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Step 5: Verification
  const [isSignedOff, setIsSignedOff] = useState<boolean>(false);

  useEffect(() => {
    if (!sessionId) return;
    fetchSession(sessionId)
      .then(setSession)
      .catch((err) => console.warn("Failed to load session:", err))
      .finally(() => setLoading(false));
  }, [sessionId]);

  // Dynamically branch based on Step 3 readings
  useEffect(() => {
    if (mafVoltage < 0.8 || boostPsi < 14) {
      setBranchDecision("4A"); // Sensor & intake manifold flow test
    } else {
      setBranchDecision("4B"); // Fuel rail & injection calibration test
    }
  }, [mafVoltage, boostPsi]);

  const handleStep4Submit = async () => {
    if (!session || isSubmitting) return;
    setIsSubmitting(true);
    try {
      const activeTestId = session.recommended_test?.test_id || "TEST-GUIDED-ELIMINATION";
      await submitTestResult(sessionId, {
        test_id: activeTestId,
        result: testOutcome,
        notes: technicianNotes || `Guided 5-Step Elimination: Branch ${branchDecision} tested ${testOutcome.toUpperCase()}`,
      });
      const fresh = await fetchSession(sessionId);
      setSession(fresh);
      setCurrentStep(5);
    } catch (e: any) {
      alert("Error submitting step test: " + e.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <AppShell>
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3 text-[#6B7280]">
          <Loader2 className="w-8 h-8 animate-spin text-[#E5402C]" />
          <p className="text-sm font-medium">Loading guided diagnostic session...</p>
        </div>
      </AppShell>
    );
  }

  const stepsList = [
    { num: 1, title: "Driver Symptom Interview", sub: "Qualify operating conditions" },
    { num: 2, title: "Visual & Physical Check", sub: "Hoses, filters & photo check" },
    { num: 3, title: "OBD-II Live Telemetry", sub: "Sensor voltage & pressure tolerance" },
    { num: 4, title: `Branching Procedure (${branchDecision})`, sub: "Targeted physical elimination" },
    { num: 5, title: "Verification & Sign-off", sub: "Work order confirmation" },
  ];

  return (
    <AppShell>
      <div className="space-y-8 max-w-5xl mx-auto">
        
        {/* Header Breadcrumb */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-black/[0.06]">
          <div className="flex items-center gap-3">
            <Link href={`/diagnostics/${sessionId}`}>
              <button
                type="button"
                className="w-10 h-10 rounded-full border border-black/[0.1] bg-white hover:bg-gray-50 flex items-center justify-center transition-all text-[#111827] shadow-sm"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#E5402C] bg-red-50 px-2.5 py-0.5 rounded-full border border-[#F6C9BE]">
                  GUIDED ELIMINATION WORKFLOW
                </span>
                <span className="text-xs text-[#6B7280]">
                  Session {sessionId.slice(0, 8).toUpperCase()}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#111827] mt-1">
                5-Step Systematic <span className="italic font-bold text-[#E5402C]">Diagnostic Elimination</span>
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link href={`/diagnostics/${sessionId}`}>
              <button
                type="button"
                className="px-4 py-2 rounded-full border border-black/[0.1] bg-white hover:bg-gray-50 text-xs font-bold text-[#111827] shadow-sm transition-all"
              >
                Return to Overview
              </button>
            </Link>
          </div>
        </div>

        {/* Step Progression Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
          {stepsList.map((s) => {
            const isCompleted = s.num < currentStep;
            const isCurrent = s.num === currentStep;
            return (
              <button
                key={s.num}
                type="button"
                onClick={() => setCurrentStep(s.num)}
                className={`p-3 rounded-2xl border text-left transition-all ${
                  isCurrent
                    ? "bg-[#111827] text-white border-[#111827] shadow-md"
                    : isCompleted
                    ? "bg-emerald-50 text-emerald-950 border-emerald-300"
                    : "bg-white text-[#6B7280] border-black/[0.08]"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-[10px] font-mono font-bold uppercase ${
                    isCurrent ? "text-emerald-400" : isCompleted ? "text-emerald-700" : "text-[#9CA3AF]"
                  }`}>
                    STEP 0{s.num}
                  </span>
                  {isCompleted && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                </div>
                <div className={`text-xs font-bold leading-tight ${isCurrent ? "text-white" : "text-[#111827]"}`}>
                  {s.title}
                </div>
              </button>
            );
          })}
        </div>

        {/* ACTIVE STEP CARD */}
        <div className="p-8 sm:p-10 bg-white rounded-[28px] border border-black/[0.08] shadow-[0_4px_24px_rgba(0,0,0,0.04)] space-y-8">

          {/* ─────────────────────────────────────────────────────────────
              STEP 1: DRIVER SYMPTOM INTERVIEW
             ───────────────────────────────────────────────────────────── */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="space-y-1">
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#E5402C]">
                  Step 1 of 5: Verify the Symptom
                </span>
                <h2 className="text-2xl font-extrabold text-[#111827]">
                  Driver Operational Questionnaire
                </h2>
                <p className="text-sm text-[#4B5563]">
                  Systematic elimination begins by confirming the exact environmental and duty-cycle conditions under which the fault presents.
                </p>
              </div>

              <div className="space-y-4 pt-2">
                <div className="p-4 rounded-2xl bg-gray-50 border border-black/[0.06] space-y-2">
                  <label className="block text-xs font-bold text-[#111827] uppercase tracking-wider">
                    Q1: Does the power loss or hesitation happen exclusively under incline / uphill load?
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {["yes", "no", "intermittent"].map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => setInclineOnly(opt)}
                        className={`py-2.5 px-4 rounded-xl text-xs font-bold capitalize transition-all border ${
                          inclineOnly === opt
                            ? "bg-[#111827] text-white border-black"
                            : "bg-white text-[#374151] border-black/[0.1] hover:bg-gray-100"
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-gray-50 border border-black/[0.06] space-y-2">
                  <label className="block text-xs font-bold text-[#111827] uppercase tracking-wider">
                    Q2: Does it occur in all transmission gears or only top overdrive cruising gears?
                  </label>
                  <select
                    value={gearBehavior}
                    onChange={(e) => setGearBehavior(e.target.value)}
                    className="w-full h-11 px-3.5 bg-white text-[#111827] text-xs font-semibold rounded-xl border border-black/[0.12] focus:outline-none"
                  >
                    <option value="high_gears">Only top 10th - 12th gears under peak boost</option>
                    <option value="all_gears">In all gears during hard throttle application</option>
                    <option value="idle_low">At low RPM take-off / clutch engagement</option>
                  </select>
                </div>

                <div className="p-4 rounded-2xl bg-gray-50 border border-black/[0.06] space-y-2">
                  <label className="block text-xs font-bold text-[#111827] uppercase tracking-wider">
                    Q3: Cluster Warning Lamps Observed by Driver
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { id: "amber_mil", label: "Amber Check Engine Lamp" },
                      { id: "red_stop", label: "Red Stop Engine Flashing" },
                      { id: "dpf_def", label: "Aftertreatment / DEF Lamp" },
                    ].map((lamp) => (
                      <button
                        key={lamp.id}
                        type="button"
                        onClick={() => setClusterLamp(lamp.id)}
                        className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all border ${
                          clusterLamp === lamp.id
                            ? "bg-[#E5402C] text-white border-[#CF3722]"
                            : "bg-white text-[#374151] border-black/[0.1] hover:bg-gray-100"
                        }`}
                      >
                        {lamp.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t border-black/[0.06]">
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="px-6 py-3 rounded-full bg-[#111827] hover:bg-black text-white text-xs font-bold flex items-center gap-2 shadow-sm transition-all"
                >
                  <span>Confirm Answers & Proceed to Visual Check</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* ─────────────────────────────────────────────────────────────
              STEP 2: QUICK VISUAL CHECK
             ───────────────────────────────────────────────────────────── */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="space-y-1">
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#E5402C]">
                  Step 2 of 5: Physical Inspection
                </span>
                <h2 className="text-2xl font-extrabold text-[#111827]">
                  Quick Under-Hood Visual Check
                </h2>
                <p className="text-sm text-[#4B5563]">
                  Rule out simple mechanical disconnections before connecting electronic diagnostic instrumentation.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                <div
                  onClick={() => setAirFilterClogged(!airFilterClogged)}
                  className={`p-5 rounded-2xl border cursor-pointer transition-all ${
                    airFilterClogged ? "bg-red-50/70 border-red-300" : "bg-gray-50 border-black/[0.06] hover:bg-gray-100"
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-[#111827] uppercase">Air Filter Element</span>
                    <div className={`w-5 h-5 rounded-md flex items-center justify-center ${
                      airFilterClogged ? "bg-[#E5402C] text-white" : "border border-gray-300 bg-white"
                    }`}>
                      {airFilterClogged && <Check className="w-3.5 h-3.5" />}
                    </div>
                  </div>
                  <p className="text-xs text-[#4B5563]">
                    {airFilterClogged ? "Restriction indicator in red zone / dirt caked on pleats" : "Clean pleats, restriction gauge nominal (<15 in H2O)"}
                  </p>
                </div>

                <div
                  onClick={() => setIntakeHoseIntact(!intakeHoseIntact)}
                  className={`p-5 rounded-2xl border cursor-pointer transition-all ${
                    !intakeHoseIntact ? "bg-red-50/70 border-red-300" : "bg-gray-50 border-black/[0.06] hover:bg-gray-100"
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-[#111827] uppercase">Intake Boot & Clamps</span>
                    <div className={`w-5 h-5 rounded-md flex items-center justify-center ${
                      !intakeHoseIntact ? "bg-[#E5402C] text-white" : "border border-gray-300 bg-white"
                    }`}>
                      {!intakeHoseIntact && <Check className="w-3.5 h-3.5" />}
                    </div>
                  </div>
                  <p className="text-xs text-[#4B5563]">
                    {!intakeHoseIntact ? "Split or tear in silicon charge-air boot detected" : "All CAC constant-tension T-bolt clamps secure"}
                  </p>
                </div>

                <div
                  onClick={() => setTurboLeaksFound(!turboLeaksFound)}
                  className={`p-5 rounded-2xl border cursor-pointer transition-all ${
                    turboLeaksFound ? "bg-red-50/70 border-red-300" : "bg-gray-50 border-black/[0.06] hover:bg-gray-100"
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-[#111827] uppercase">Turbo & Exhaust V-Band</span>
                    <div className={`w-5 h-5 rounded-md flex items-center justify-center ${
                      turboLeaksFound ? "bg-[#E5402C] text-white" : "border border-gray-300 bg-white"
                    }`}>
                      {turboLeaksFound && <Check className="w-3.5 h-3.5" />}
                    </div>
                  </div>
                  <p className="text-xs text-[#4B5563]">
                    {turboLeaksFound ? "Soot trails observed around compressor housing or V-band" : "No oil seepage or soot tracking visible"}
                  </p>
                </div>
              </div>

              {/* Photo Upload Check (Simulation) */}
              <div className="p-5 rounded-2xl bg-gradient-to-r from-gray-50 to-red-50/30 border border-black/[0.08] flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-white border border-black/[0.1] flex items-center justify-center text-[#E5402C] shadow-sm">
                    <Camera className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-[#111827] block">
                      AI Visual Defect OCR & Inspection
                    </span>
                    <span className="text-xs text-[#6B7280]">
                      {photoUploaded
                        ? "Photo analyzed: Optical scan confirms no structural intake fractures"
                        : "Upload component snapshot to verify harness chafing and clamp torques"}
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setPhotoUploaded(!photoUploaded)}
                  className={`px-4 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${
                    photoUploaded
                      ? "bg-emerald-600 text-white"
                      : "bg-white hover:bg-gray-50 text-[#111827] border border-black/[0.12] shadow-sm"
                  }`}
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>{photoUploaded ? "Photo Verified ✓" : "Upload Inspection Photo"}</span>
                </button>
              </div>

              <div className="flex justify-between pt-4 border-t border-black/[0.06]">
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="px-5 py-2.5 rounded-full border border-black/[0.1] text-xs font-bold text-[#374151]"
                >
                  ← Back to Step 1
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentStep(3)}
                  className="px-6 py-3 rounded-full bg-[#111827] hover:bg-black text-white text-xs font-bold flex items-center gap-2 shadow-sm transition-all"
                >
                  <span>Proceed to OBD-II Live Sensor Test</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* ─────────────────────────────────────────────────────────────
              STEP 3: LIVE OBD-II SENSOR MEASUREMENT & TOLERANCES
             ───────────────────────────────────────────────────────────── */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="space-y-1">
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#E5402C]">
                  Step 3 of 5: Telemetry Interrogation
                </span>
                <h2 className="text-2xl font-extrabold text-[#111827]">
                  Live OBD-II Sensor Data & OEM Tolerances
                </h2>
                <p className="text-sm text-[#4B5563]">
                  Connected via RP1210 / ELM327 J1939 telemetry. Values are checked automatically against PACCAR OEM factory nominals.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-300 flex items-center justify-between text-xs text-emerald-900">
                <div className="flex items-center gap-2 font-semibold">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span>OBD-II / J1939 Protocol Active: 250k baud telemetry stream</span>
                </div>
                <span className="font-mono text-emerald-800 font-bold">14 PIDs Live</span>
              </div>

              <div className="space-y-4 pt-2">
                {/* Channel 1: MAF / MAP Voltage */}
                <div className="p-5 rounded-2xl bg-gray-50 border border-black/[0.06] space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-[#111827] block">
                        Mass Airflow / Intake Pressure Sensor Signal
                      </span>
                      <span className="text-[11px] font-mono text-[#6B7280]">
                        Expected Tolerance: 0.80 V – 1.20 V at warm idle
                      </span>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-mono font-bold border ${
                      mafVoltage >= 0.8 && mafVoltage <= 1.2
                        ? "bg-emerald-100 text-emerald-800 border-emerald-300"
                        : "bg-red-100 text-red-800 border-red-300"
                    }`}>
                      {mafVoltage >= 0.8 && mafVoltage <= 1.2 ? "PASS (IN SPEC)" : "OUT OF SPEC (LOW)"}
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <input
                      type="range"
                      min="0.4"
                      max="1.8"
                      step="0.02"
                      value={mafVoltage}
                      onChange={(e) => setMafVoltage(parseFloat(e.target.value))}
                      className="flex-1 accent-[#E5402C]"
                    />
                    <span className="text-base font-extrabold font-mono text-[#111827] w-20 text-right">
                      {mafVoltage.toFixed(2)} V
                    </span>
                  </div>
                </div>

                {/* Channel 2: Boost Pressure */}
                <div className="p-5 rounded-2xl bg-gray-50 border border-black/[0.06] space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-[#111827] block">
                        Turbocharger Boost Pressure @ 1,800 RPM
                      </span>
                      <span className="text-[11px] font-mono text-[#6B7280]">
                        Expected Tolerance: 15.0 PSI – 22.0 PSI under dyno/stall
                      </span>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-mono font-bold border ${
                      boostPsi >= 15.0 && boostPsi <= 22.0
                        ? "bg-emerald-100 text-emerald-800 border-emerald-300"
                        : "bg-red-100 text-red-800 border-red-300"
                    }`}>
                      {boostPsi >= 15.0 && boostPsi <= 22.0 ? "PASS (IN SPEC)" : "OUT OF SPEC (LOW BOOST)"}
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <input
                      type="range"
                      min="8.0"
                      max="26.0"
                      step="0.2"
                      value={boostPsi}
                      onChange={(e) => setBoostPsi(parseFloat(e.target.value))}
                      className="flex-1 accent-[#E5402C]"
                    />
                    <span className="text-base font-extrabold font-mono text-[#111827] w-20 text-right">
                      {boostPsi.toFixed(1)} PSI
                    </span>
                  </div>
                </div>

                {/* Channel 3: Fuel Trim */}
                <div className="p-5 rounded-2xl bg-gray-50 border border-black/[0.06] space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-[#111827] block">
                        Short-Term Lambda Adaptation / Fuel Trim
                      </span>
                      <span className="text-[11px] font-mono text-[#6B7280]">
                        Expected Tolerance: -10.0% to +10.0%
                      </span>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-mono font-bold border ${
                      fuelTrim >= -10 && fuelTrim <= 10
                        ? "bg-emerald-100 text-emerald-800 border-emerald-300"
                        : "bg-red-100 text-red-800 border-red-300"
                    }`}>
                      {fuelTrim >= -10 && fuelTrim <= 10 ? "PASS (IN SPEC)" : "OUT OF SPEC"}
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <input
                      type="range"
                      min="-25.0"
                      max="25.0"
                      step="0.5"
                      value={fuelTrim}
                      onChange={(e) => setFuelTrim(parseFloat(e.target.value))}
                      className="flex-1 accent-[#E5402C]"
                    />
                    <span className="text-base font-extrabold font-mono text-[#111827] w-20 text-right">
                      {fuelTrim > 0 ? `+${fuelTrim.toFixed(1)}` : fuelTrim.toFixed(1)}%
                    </span>
                  </div>
                </div>
              </div>

              {/* Dynamic Branching Notification */}
              <div className="p-4 rounded-2xl bg-slate-900 text-white flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#E5402C] flex items-center justify-center font-bold font-mono">
                    {branchDecision}
                  </div>
                  <div>
                    <span className="font-bold text-white block">
                      Autonomous Decision Tree Branching: Step {branchDecision}
                    </span>
                    <span className="text-gray-300 text-[11px]">
                      {branchDecision === "4A"
                        ? "Low signal voltage detected → Directing to intake sensor circuit & airflow restriction pathway"
                        : "Nominal airflow readings → Directing to high-pressure fuel rail & injection pathway"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex justify-between pt-4 border-t border-black/[0.06]">
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="px-5 py-2.5 rounded-full border border-black/[0.1] text-xs font-bold text-[#374151]"
                >
                  ← Back to Step 2
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentStep(4)}
                  className="px-6 py-3 rounded-full bg-[#E5402C] hover:bg-[#CF3722] text-white text-xs font-bold flex items-center gap-2 shadow-sm transition-all"
                >
                  <span>Branch to Step {branchDecision} Execution</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* ─────────────────────────────────────────────────────────────
              STEP 4: BRANCHING PHYSICAL TEST EXECUTION
             ───────────────────────────────────────────────────────────── */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#E5402C]">
                    Step 4 of 5: Physical Confirmation
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#111827] text-white">
                    PATHWAY {branchDecision}
                  </span>
                </div>
                <h2 className="text-2xl font-extrabold text-[#111827]">
                  {branchDecision === "4A"
                    ? "Procedure 4A: Sensor Pin Voltage & Intake Flow Resistance Test"
                    : "Procedure 4B: Fuel Rail Actuator Pressure Drop & Leakback Test"}
                </h2>
                <p className="text-sm text-[#4B5563]">
                  Execute this physical workshop test on the engine bay to discriminate between the top remaining root causes.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-gray-50 border border-black/[0.08] space-y-4">
                <div className="text-xs font-bold text-[#111827] uppercase tracking-wider">
                  Technician Action Steps:
                </div>
                <ol className="text-xs text-[#374151] space-y-2 list-decimal pl-4 leading-relaxed font-medium">
                  <li>Disconnect harness connector at sensor body and inspect for back-pinned terminals or corrosion.</li>
                  <li>Connect digital multimeter with back-probe pins to 5V reference supply and sensor ground.</li>
                  <li>Verify ignition key ON, engine OFF supply voltage is 5.0 ± 0.1 V.</li>
                  <li>Reconnect sensor and tap lightly on housing while monitoring live waveform for signal dropout.</li>
                </ol>

                <div className="pt-2">
                  <label className="block text-xs font-bold text-[#111827] uppercase tracking-wider mb-2">
                    Record Workshop Physical Test Finding:
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setTestOutcome("pass")}
                      className={`py-3 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                        testOutcome === "pass"
                          ? "bg-emerald-600 text-white border-emerald-700 shadow-sm"
                          : "bg-white text-[#374151] border-black/[0.1] hover:bg-gray-100"
                      }`}
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>PASS (No Physical Fault Found)</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setTestOutcome("fail")}
                      className={`py-3 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                        testOutcome === "fail"
                          ? "bg-[#E5402C] text-white border-[#CF3722] shadow-sm"
                          : "bg-white text-[#374151] border-black/[0.1] hover:bg-gray-100"
                      }`}
                    >
                      <AlertTriangle className="w-4 h-4" />
                      <span>FAIL (Root Cause Confirmed Defective)</span>
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#4B5563] mb-1">
                    Technician Bench Observations & Notes:
                  </label>
                  <input
                    type="text"
                    value={technicianNotes}
                    onChange={(e) => setTechnicianNotes(e.target.value)}
                    placeholder="e.g. Measured 0.72V signal flatline under throttle blip; internal potentiometer worn."
                    className="w-full h-11 px-3.5 bg-white text-xs text-[#111827] font-medium rounded-xl border border-black/[0.12] focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-between pt-4 border-t border-black/[0.06]">
                <button
                  type="button"
                  onClick={() => setCurrentStep(3)}
                  className="px-5 py-2.5 rounded-full border border-black/[0.1] text-xs font-bold text-[#374151]"
                >
                  ← Back to Step 3
                </button>
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={handleStep4Submit}
                  className="px-6 py-3 rounded-full bg-[#111827] hover:bg-black text-white text-xs font-bold flex items-center gap-2 shadow-sm transition-all disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-white" />
                      <span>Updating Bayesian Reasoner...</span>
                    </>
                  ) : (
                    <>
                      <span>Lock In Test Result & Finalize Diagnosis</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* ─────────────────────────────────────────────────────────────
              STEP 5: VERIFICATION & REPAIR SIGN-OFF
             ───────────────────────────────────────────────────────────── */}
          {currentStep === 5 && (
            <div className="space-y-6">
              <div className="space-y-1">
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-emerald-700">
                  Step 5 of 5: Completion
                </span>
                <h2 className="text-2xl font-extrabold text-[#111827]">
                  Diagnostic Resolution & Work Order Sign-Off
                </h2>
                <p className="text-sm text-[#4B5563]">
                  All 5 steps of the systematic elimination workflow have completed. The root cause has been verified.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-300 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold">
                    ✓
                  </div>
                  <div>
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-800">
                      DIAGNOSTIC PROCESS VERIFIED
                    </span>
                    <h3 className="text-lg font-extrabold text-[#111827]">
                      {session?.root_cause || session?.candidate_causes[0]?.name || "Root Cause Identified"}
                    </h3>
                  </div>
                </div>
                <p className="text-xs text-emerald-800 leading-relaxed">
                  Full 5-step evidence chain logged in immutable session history. Ready for parts requisition and technician repair execution.
                </p>
              </div>

              {/* Digital Sign-off Checkbox */}
              <div className="p-4 rounded-xl border border-black/[0.08] bg-gray-50 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="signoff"
                    checked={isSignedOff}
                    onChange={(e) => setIsSignedOff(e.target.checked)}
                    className="w-4 h-4 accent-[#E5402C] rounded cursor-pointer"
                  />
                  <label htmlFor="signoff" className="text-xs font-semibold text-[#111827] cursor-pointer">
                    I certify that physical measurements conform to PACCAR Workshop Service Guidelines.
                  </label>
                </div>
                <span className="text-[11px] font-mono text-[#6B7280]">
                  Level 2 Certified Master Tech
                </span>
              </div>

              <div className="flex justify-between pt-4 border-t border-black/[0.06]">
                <button
                  type="button"
                  onClick={() => setCurrentStep(4)}
                  className="px-5 py-2.5 rounded-full border border-black/[0.1] text-xs font-bold text-[#374151]"
                >
                  ← Review Step 4
                </button>
                <div className="flex items-center gap-3">
                  <Link href={`/reports/${sessionId}`}>
                    <button
                      type="button"
                      className="px-5 py-2.5 rounded-full border border-black/[0.12] bg-white hover:bg-gray-50 text-xs font-bold text-[#111827] shadow-sm flex items-center gap-1.5"
                    >
                      <FileText className="w-3.5 h-3.5 text-[#E5402C]" />
                      <span>View Service Report</span>
                    </button>
                  </Link>
                  <Link href={`/diagnostics/${sessionId}`}>
                    <button
                      type="button"
                      disabled={!isSignedOff}
                      className="px-6 py-3 rounded-full bg-[#E5402C] hover:bg-[#CF3722] text-white text-xs font-bold flex items-center gap-2 shadow-sm transition-all disabled:opacity-50"
                    >
                      <span>Complete & Return to Diagnostic Hub</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          )}

        </div>

      </div>
    </AppShell>
  );
}
