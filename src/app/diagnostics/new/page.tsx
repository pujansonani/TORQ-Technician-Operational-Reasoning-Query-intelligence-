"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  Truck, 
  AlertCircle, 
  Mic, 
  Camera, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle2, 
  Sparkles,
  ShieldAlert,
  Loader2
} from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { useTorqStore } from "@/lib/store";

export default function NewDiagnosisPage() {
  const router = useRouter();
  const { createNewSession, activeSession } = useTorqStore();

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Form State
  const [truckModel, setTruckModel] = useState("Kenworth T680 Next Gen");
  const [engine, setEngine] = useState("PACCAR MX-13 455 HP");
  const [year, setYear] = useState("2023");
  const [mileage, setMileage] = useState("142300");
  const [vin, setVin] = useState("1NKDX4EX7PR981240");

  const [symptom, setSymptom] = useState("Engine loses power under load and hesitates during acceleration above 1,400 RPM.");
  const [voiceRecording, setVoiceRecording] = useState(false);

  const [dtcType, setDtcType] = useState<"SPN" | "FMI" | "P-Code">("SPN");
  const [spn, setSpn] = useState("94");
  const [fmi, setFmi] = useState("1");
  const [isScanningOCR, setIsScanningOCR] = useState(false);

  // Loading Sequence State for Step 4
  const [analyzingStage, setAnalyzingStage] = useState(0);

  const stages = [
    "Reading symptom description & telemetry context...",
    "Retrieving PACCAR MX-13 DTC Knowledge Base...",
    "Comparing candidate causes against 1,450 fleet cases...",
    "Selecting evidence-backed Next-Best-Test...",
    "Verifying pressure limits via TORQ-Lock...",
  ];

  const handleStartAnalysis = () => {
    setStep(4);
    let currentStage = 0;
    const interval = setInterval(() => {
      currentStage++;
      if (currentStage < stages.length) {
        setAnalyzingStage(currentStage);
      } else {
        clearInterval(interval);
        // Commit new session
        createNewSession({
          truckModel,
          engine,
          mileage: parseInt(mileage) || 140000,
          vin,
          symptomText: symptom,
          dtc: `SPN ${spn} / FMI ${fmi}`,
          spn: parseInt(spn) || 94,
          fmi: parseInt(fmi) || 1,
        });
        setTimeout(() => {
          router.push(`/diagnostics/${activeSession.id}`);
        }, 600);
      }
    }, 700);
  };

  return (
    <AppShell>
      <div className="max-w-3xl mx-auto space-y-8 py-4">
        
        {/* Step Progress Rail */}
        <div>
          <div className="flex items-center justify-between text-xs font-mono uppercase tracking-wider text-industrial-steel mb-2">
            <span>DIAGNOSTIC INTAKE WIZARD</span>
            <span>STEP {step} OF 04</span>
          </div>

          <div className="grid grid-cols-4 gap-2">
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
                <div key={s.num} className="space-y-1">
                  <div
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      isDone
                        ? "bg-status-success"
                        : isCurrent
                        ? "bg-paccar-blue"
                        : "bg-surface-borderDark/40"
                    }`}
                  />
                  <span className={`text-[11px] font-medium hidden sm:block ${isCurrent ? "text-paccar-blue font-semibold" : "text-industrial-muted"}`}>
                    {s.num} {s.name}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* STEP 1: VEHICLE INFORMATION */}
        {step === 1 && (
          <Card className="p-6 sm:p-8 bg-white space-y-6" elevated>
            <div className="border-b border-surface-border pb-4">
              <h2 className="text-xl sm:text-2xl font-semibold text-industrial-dark">
                Vehicle Identification
              </h2>
              <p className="text-sm text-industrial-steel mt-1">
                Select the truck configuration to load engine-specific wiring schematics and nominal tolerances.
              </p>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-industrial-steel uppercase tracking-wider mb-1.5">
                    TRUCK MODEL
                  </label>
                  <select
                    value={truckModel}
                    onChange={(e) => setTruckModel(e.target.value)}
                    className="w-full h-11 px-3.5 bg-surface text-industrial-dark text-sm rounded-input border border-surface-border focus:outline-none focus:ring-2 focus:ring-paccar-blue/20 focus:border-paccar-blue"
                  >
                    <option value="Kenworth T680 Next Gen">Kenworth T680 Next Gen</option>
                    <option value="Kenworth W990">Kenworth W990</option>
                    <option value="Peterbilt 579 UltraLoft">Peterbilt 579 UltraLoft</option>
                    <option value="Peterbilt 389 Extended Hood">Peterbilt 389 Extended Hood</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-industrial-steel uppercase tracking-wider mb-1.5">
                    POWERTRAIN / ENGINE
                  </label>
                  <select
                    value={engine}
                    onChange={(e) => setEngine(e.target.value)}
                    className="w-full h-11 px-3.5 bg-surface text-industrial-dark text-sm rounded-input border border-surface-border focus:outline-none focus:ring-2 focus:ring-paccar-blue/20 focus:border-paccar-blue"
                  >
                    <option value="PACCAR MX-13 455 HP">PACCAR MX-13 455 HP</option>
                    <option value="PACCAR MX-13 510 HP">PACCAR MX-13 510 HP</option>
                    <option value="PACCAR MX-11 430 HP">PACCAR MX-11 430 HP</option>
                    <option value="Cummins X15 Efficiency">Cummins X15 Efficiency Series</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-industrial-steel uppercase tracking-wider mb-1.5">
                    MODEL YEAR
                  </label>
                  <input
                    type="text"
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    className="w-full h-11 px-3.5 bg-surface text-industrial-dark text-sm rounded-input border border-surface-border focus:outline-none focus:ring-2 focus:ring-paccar-blue/20 focus:border-paccar-blue"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-industrial-steel uppercase tracking-wider mb-1.5">
                    ODOMETER (MILES)
                  </label>
                  <input
                    type="text"
                    value={mileage}
                    onChange={(e) => setMileage(e.target.value)}
                    className="w-full h-11 px-3.5 bg-surface text-industrial-dark text-sm rounded-input border border-surface-border focus:outline-none focus:ring-2 focus:ring-paccar-blue/20 focus:border-paccar-blue"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-industrial-steel uppercase tracking-wider mb-1.5">
                    VIN #
                  </label>
                  <input
                    type="text"
                    value={vin}
                    onChange={(e) => setVin(e.target.value)}
                    className="w-full h-11 px-3.5 font-mono bg-surface text-industrial-dark text-sm rounded-input border border-surface-border focus:outline-none focus:ring-2 focus:ring-paccar-blue/20 focus:border-paccar-blue"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-surface-border">
              <Button size="lg" onClick={() => setStep(2)} className="gap-2 font-semibold">
                <span>Continue to Symptoms</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </Card>
        )}

        {/* STEP 2: SYMPTOM OBSERVATION */}
        {step === 2 && (
          <Card className="p-6 sm:p-8 bg-white space-y-6" elevated>
            <div className="border-b border-surface-border pb-4">
              <h2 className="text-xl sm:text-2xl font-semibold text-industrial-dark">
                What is the technician observing?
              </h2>
              <p className="text-sm text-industrial-steel mt-1">
                Describe the operating condition, road load, ambient temperatures, and driver feedback.
              </p>
            </div>

            <div className="space-y-4">
              <div className="relative">
                <textarea
                  rows={5}
                  value={symptom}
                  onChange={(e) => setSymptom(e.target.value)}
                  className="w-full p-4 bg-surface text-industrial-dark text-sm rounded-input border border-surface-border focus:outline-none focus:ring-2 focus:ring-paccar-blue/20 focus:border-paccar-blue"
                  placeholder="Engine loses power under load and hesitates during acceleration..."
                />
              </div>

              {/* Voice Input Integration */}
              <div className="flex items-center justify-between p-3.5 rounded-input bg-surface-subtle border border-surface-border">
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center ${voiceRecording ? "bg-paccar-red text-white animate-pulse" : "bg-paccar-softblue text-paccar-blue"}`}>
                    <Mic className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-industrial-dark block">
                      {voiceRecording ? "Listening to technician dictation..." : "Voice Symptom Dictation (Hands-Free)"}
                    </span>
                    <span className="text-[11px] text-industrial-muted">
                      {voiceRecording ? "Say 'stop' or click to conclude" : "Transcribes workshop audio directly into structured claims"}
                    </span>
                  </div>
                </div>

                <Button
                  variant={voiceRecording ? "danger" : "secondary"}
                  size="sm"
                  onClick={() => setVoiceRecording(!voiceRecording)}
                >
                  {voiceRecording ? "Stop Dictation" : "Record Audio"}
                </Button>
              </div>

              {/* Quick Preset Badges */}
              <div className="space-y-1.5">
                <span className="text-xs font-semibold text-industrial-steel uppercase tracking-wider">
                  QUICK PRESETS FROM DRIVER REPORT:
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
                      className="px-2.5 py-1 rounded-full text-xs bg-surface-subtle border border-surface-border text-industrial-steel hover:border-paccar-blue hover:text-paccar-blue transition-colors"
                    >
                      + {preset}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-surface-border">
              <Button variant="secondary" size="lg" onClick={() => setStep(1)} className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </Button>
              <Button size="lg" onClick={() => setStep(3)} className="gap-2 font-semibold">
                <span>Continue to Fault Codes</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </Card>
        )}

        {/* STEP 3: DTC & FAULT CODES */}
        {step === 3 && (
          <Card className="p-6 sm:p-8 bg-white space-y-6" elevated>
            <div className="border-b border-surface-border pb-4">
              <h2 className="text-xl sm:text-2xl font-semibold text-industrial-dark">
                Diagnostic Trouble Codes (DTC)
              </h2>
              <p className="text-sm text-industrial-steel mt-1">
                Enter SPN (Suspect Parameter Number) and FMI (Failure Mode Identifier), or scan the display.
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex gap-2">
                <Button
                  variant={dtcType === "SPN" ? "primary" : "secondary"}
                  size="sm"
                  onClick={() => setDtcType("SPN")}
                >
                  SAE J1939 (SPN / FMI)
                </Button>
                <Button
                  variant={dtcType === "P-Code" ? "primary" : "secondary"}
                  size="sm"
                  onClick={() => setDtcType("P-Code")}
                >
                  Standard OBD (P-Code)
                </Button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-industrial-steel uppercase tracking-wider mb-1.5">
                    SPN (PARAMETER NUMBER)
                  </label>
                  <input
                    type="number"
                    value={spn}
                    onChange={(e) => setSpn(e.target.value)}
                    className="w-full h-11 px-3.5 font-mono bg-surface text-industrial-dark text-sm rounded-input border border-surface-border focus:outline-none focus:ring-2 focus:ring-paccar-blue/20 focus:border-paccar-blue"
                    placeholder="94"
                  />
                  <span className="text-[11px] text-industrial-muted mt-1 block">
                    SPN 94: Engine Fuel Delivery Pressure
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-industrial-steel uppercase tracking-wider mb-1.5">
                    FMI (FAILURE MODE)
                  </label>
                  <input
                    type="number"
                    value={fmi}
                    onChange={(e) => setFmi(e.target.value)}
                    className="w-full h-11 px-3.5 font-mono bg-surface text-industrial-dark text-sm rounded-input border border-surface-border focus:outline-none focus:ring-2 focus:ring-paccar-blue/20 focus:border-paccar-blue"
                    placeholder="1"
                  />
                  <span className="text-[11px] text-industrial-muted mt-1 block">
                    FMI 1: Data Valid But Below Normal Operating Range
                  </span>
                </div>
              </div>

              {/* OCR Scanner Simulation Card */}
              <div className="p-4 rounded-input bg-surface-subtle border border-surface-border flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-paccar-softblue flex items-center justify-center text-paccar-blue">
                    <Camera className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-industrial-dark block">
                      Camera DTC OCR Scanner
                    </span>
                    <span className="text-[11px] text-industrial-muted">
                      Snap photo of instrument cluster or DAVIE-4 diagnostic interface
                    </span>
                  </div>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setIsScanningOCR(true);
                    setTimeout(() => {
                      setIsScanningOCR(false);
                      setSpn("94");
                      setFmi("1");
                    }, 1000);
                  }}
                  isLoading={isScanningOCR}
                >
                  Scan Code
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-surface-border">
              <Button variant="secondary" size="lg" onClick={() => setStep(2)} className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </Button>
              <Button size="lg" onClick={handleStartAnalysis} className="gap-2 font-semibold shadow-md">
                <Sparkles className="w-4 h-4" />
                <span>Synthesize Diagnostic Assessment</span>
              </Button>
            </div>
          </Card>
        )}

        {/* STEP 4: PROGRESSIVE SYNTHESIS LOADER */}
        {step === 4 && (
          <Card className="p-8 sm:p-12 bg-white text-center space-y-6" elevated>
            <div className="w-16 h-16 rounded-full bg-paccar-softblue flex items-center justify-center text-paccar-blue mx-auto">
              <Loader2 className="w-8 h-8 animate-spin" />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-semibold text-industrial-dark">
                Synthesizing Diagnostic Evidence
              </h2>
              <p className="text-sm text-industrial-steel max-w-md mx-auto">
                TORQ is evaluating OEM service bulletins, historical telemetry clusters, and wiring diagrams.
              </p>
            </div>

            {/* Step Checkoff List */}
            <div className="max-w-md mx-auto text-left space-y-3 pt-4">
              {stages.map((stg, i) => {
                const isComplete = analyzingStage > i;
                const isCurrent = analyzingStage === i;

                return (
                  <div key={stg} className="flex items-center gap-3 text-sm">
                    {isComplete ? (
                      <CheckCircle2 className="w-4 h-4 text-status-success shrink-0" />
                    ) : isCurrent ? (
                      <div className="w-4 h-4 rounded-full border-2 border-paccar-blue border-t-transparent animate-spin shrink-0" />
                    ) : (
                      <div className="w-4 h-4 rounded-full border border-surface-border shrink-0" />
                    )}
                    <span className={isCurrent ? "font-semibold text-paccar-blue" : isComplete ? "text-industrial-dark" : "text-industrial-caption"}>
                      {stg}
                    </span>
                  </div>
                );
              })}
            </div>
          </Card>
        )}

      </div>
    </AppShell>
  );
}
