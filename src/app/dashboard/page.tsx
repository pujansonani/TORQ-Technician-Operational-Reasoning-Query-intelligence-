"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  Activity, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Wrench, 
  Mic, 
  Camera, 
  ArrowRight, 
  ChevronRight,
  Sparkles,
  BarChart2,
  ShieldCheck,
  Zap
} from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { Badge } from "@/components/ui/Badge";
import { RECENT_DIAGNOSTICS_DATA, FLEET_STATISTICS } from "@/lib/mockData";
import { useTorqStore } from "@/lib/store";
import { formatCurrencyINR } from "@/lib/utils";
import { fetchTrucks, startDiagnosis, DTC_SUBSYSTEMS, type Truck } from "@/lib/api";

export default function DashboardPage() {
  const router = useRouter();
  const { activeSession, createNewSession } = useTorqStore();

  const [trucksList, setTrucksList] = useState<Truck[]>([]);
  const [selectedTruckId, setSelectedTruckId] = useState<string>("");
  const [symptom, setSymptom] = useState("Engine coolant temperature rising excessively above 105°C under uphill haul load with fan cycling continuously.");
  const [dtc, setDtc] = useState("SPN 110 / FMI 0");
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    fetchTrucks()
      .then((data) => {
        setTrucksList(data);
        if (data.length > 0) {
          setSelectedTruckId(data[0].id);
        }
      })
      .catch((err) => console.warn("Could not fetch trucks list:", err));
  }, []);

  const selectedTruck = trucksList.find(t => t.id === selectedTruckId) || trucksList[0];

  // Auto-detect subsystem if symptom text changes
  const handleSymptomChange = (text: string) => {
    setSymptom(text);
    const lower = text.toLowerCase();
    const matched = DTC_SUBSYSTEMS.find(sub => 
      sub.keywords.some(kw => lower.includes(kw))
    );
    if (matched) {
      setDtc(`SPN ${matched.spn} / FMI ${matched.fmi}`);
    }
  };

  const handleApplyPreset = (presetSymptom: string, presetCode: string) => {
    setSymptom(presetSymptom);
    setDtc(presetCode);
  };

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAnalyzing(true);
    try {
      const activeTruckId = selectedTruck?.id || (await fetchTrucks())[0]?.id;
      if (activeTruckId) {
        const resp = await startDiagnosis({
          truck_id: activeTruckId,
          symptom_text: symptom,
          dtc_codes: [dtc.trim()],
        });
        router.push(`/diagnostics/${resp.session_id}`);
        return;
      }
    } catch (err) {
      console.warn("Backend startDiagnosis error:", err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <AppShell>
      <div className="space-y-10">
        
        {/* Title & Cockpit Header - Apple HIG Typography */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-black/[0.06]">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-red-50 text-[#E5402C] border border-[#F6C9BE]">
              <Sparkles className="w-3.5 h-3.5 text-[#E5402C]" />
              <span>TORQ Workshop Operations</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#111827]">
              Good morning, <span className="italic font-bold text-[#E5402C]">Technician.</span>
            </h1>
            <p className="text-sm sm:text-base text-[#4B5563] max-w-2xl font-normal leading-relaxed">
              Active diagnostic sessions, Bayesian reasoning pipelines, and real-time PACCAR fleet telemetry across service bays.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/diagnostics/new">
              <button
                type="button"
                className="inline-flex items-center gap-2.5 px-6 py-3 rounded-full bg-[#E5402C] hover:bg-[#CF3722] text-white text-sm font-bold tracking-tight shadow-[0_4px_16px_rgba(229,64,44,0.25)] hover:shadow-[0_6px_20px_rgba(229,64,44,0.35)] transition-all transform active:scale-[0.98]"
              >
                <Wrench className="w-4 h-4" />
                <span>Start New Diagnosis</span>
                <ArrowRight className="w-4 h-4 ml-0.5" />
              </button>
            </Link>
          </div>
        </div>

        {/* TOP ROW: 4 APPLE HIG METRIC CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          
          {/* Card 1 */}
          <div className="p-6 bg-white rounded-[20px] border border-black/[0.07] shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)] transition-all duration-300 relative group overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#E5402C] to-[#E5402C]/30 opacity-80" />
            <div className="flex items-center justify-between text-xs font-bold text-[#6B7280] uppercase tracking-wider mb-3">
              <span>Active Diagnostics</span>
              <div className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center text-[#E5402C]">
                <Activity className="w-4 h-4" />
              </div>
            </div>
            <div className="text-4xl font-extrabold font-mono tracking-tight text-[#111827]">
              04
            </div>
            <div className="mt-2 text-xs text-[#6B7280] font-medium flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
              <span>2 awaiting physical test confirmation</span>
            </div>
          </div>

          {/* Card 2 */}
          <div className="p-6 bg-white rounded-[20px] border border-black/[0.07] shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)] transition-all duration-300 relative group overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-emerald-200 opacity-80" />
            <div className="flex items-center justify-between text-xs font-bold text-[#6B7280] uppercase tracking-wider mb-3">
              <span>Resolved Today</span>
              <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>
            <div className="text-4xl font-extrabold font-mono tracking-tight text-[#111827]">
              08
            </div>
            <div className="mt-2 text-xs text-emerald-700 font-semibold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>100% first-time fix confirmation</span>
            </div>
          </div>

          {/* Card 3 */}
          <div className="p-6 bg-white rounded-[20px] border border-black/[0.07] shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)] transition-all duration-300 relative group overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-blue-200 opacity-80" />
            <div className="flex items-center justify-between text-xs font-bold text-[#6B7280] uppercase tracking-wider mb-3">
              <span>Avg Diagnostic Time</span>
              <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                <Clock className="w-4 h-4" />
              </div>
            </div>
            <div className="text-4xl font-extrabold font-mono tracking-tight text-[#111827]">
              2.4 <span className="text-xl font-normal text-[#6B7280]">hrs</span>
            </div>
            <div className="mt-2 text-xs text-[#4B5563] font-medium flex items-center gap-1">
              <span className="text-emerald-600 font-bold">-35%</span> vs conventional manual triage
            </div>
          </div>

          {/* Card 4 */}
          <div className="p-6 bg-white rounded-[20px] border border-black/[0.07] shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)] transition-all duration-300 relative group overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 to-amber-200 opacity-80" />
            <div className="flex items-center justify-between text-xs font-bold text-[#6B7280] uppercase tracking-wider mb-3">
              <span>Fleet Telemetry Alerts</span>
              <div className="w-8 h-8 rounded-full bg-amber-50 flex items-center justify-center text-amber-600">
                <AlertTriangle className="w-4 h-4" />
              </div>
            </div>
            <div className="text-4xl font-extrabold font-mono tracking-tight text-amber-600">
              03
            </div>
            <div className="mt-2 text-xs text-amber-700 font-medium">
              SPN 94 fuel rail pressure spike observed
            </div>
          </div>
        </div>

        {/* PRIMARY INTAKE CARD: "START A DIAGNOSIS" - APPLE HIG STYLING */}
        <div className="p-8 sm:p-10 bg-gradient-to-br from-white via-[#FCFDFD] to-red-50/20 rounded-[24px] border border-black/[0.08] shadow-[0_4px_24px_rgba(0,0,0,0.05)] relative overflow-hidden">
          <div className="max-w-4xl space-y-6">
            
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider bg-red-50 text-[#E5402C] border border-[#F6C9BE]">
                <Zap className="w-3.5 h-3.5" />
                <span>TORQ Rapid Intake</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#111827]">
                Quick Diagnostic Intake
              </h2>
              <p className="text-sm sm:text-base text-[#4B5563] font-normal leading-relaxed">
                Enter truck telemetry, fault codes, or technician field notes to trigger Bayesian RAG evidence synthesis.
              </p>
            </div>

            <form onSubmit={handleAnalyze} className="space-y-5 pt-2">
              
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <label className="block text-xs font-bold text-[#374151] uppercase tracking-wider mb-2">
                      Select Service Bay Truck (PACCAR Fleet)
                    </label>
                    <select
                      value={selectedTruckId}
                      onChange={(e) => setSelectedTruckId(e.target.value)}
                      className="w-full h-12 px-4 bg-white text-[#111827] text-sm font-semibold rounded-xl border border-black/[0.12] shadow-sm focus:outline-none focus:ring-2 focus:ring-[#E5402C]/20 focus:border-[#E5402C] transition-all"
                    >
                      {trucksList.map((t) => (
                        <option key={t.id} value={t.id}>
                          {t.brand} {t.model} ({t.year}) — {t.mileage_km.toLocaleString()} km — {t.engine}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {selectedTruck && (
                  <div className="px-4 py-2.5 rounded-xl bg-gray-50 border border-black/[0.06] flex flex-wrap items-center justify-between text-xs text-[#4B5563]">
                    <div className="flex items-center gap-3">
                      <span>VIN: <span className="font-mono font-bold text-[#111827]">{selectedTruck.vin}</span></span>
                      <span>•</span>
                      <span>Odometer: <span className="font-mono font-bold text-[#111827]">{selectedTruck.mileage_km.toLocaleString()} km</span></span>
                    </div>
                    <span className="font-semibold text-emerald-700">
                      Telemetry Stream Active
                    </span>
                  </div>
                )}
              </div>

              {/* Symptom Input with Voice Icon */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-bold text-[#374151] uppercase tracking-wider">
                    Observed Field Symptom
                  </label>
                  <button
                    type="button"
                    onClick={() => alert("TORQ Voice Input: Microphone active and ready for technician dictation...")}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 hover:bg-red-100 text-[#E5402C] text-xs font-semibold border border-[#F6C9BE] transition-colors"
                  >
                    <Mic className="w-3.5 h-3.5" />
                    <span>Voice Dictation Ready</span>
                  </button>
                </div>
                <div className="relative">
                  <textarea
                    rows={2}
                    value={symptom}
                    onChange={(e) => handleSymptomChange(e.target.value)}
                    className="w-full p-4 bg-white text-[#111827] text-sm font-medium rounded-xl border border-black/[0.12] shadow-sm focus:outline-none focus:ring-2 focus:ring-[#E5402C]/20 focus:border-[#E5402C] transition-all pr-12 leading-relaxed"
                    placeholder="Describe what the technician or driver is experiencing..."
                    required
                  />
                  <button
                    type="button"
                    title="Simulate Voice Input"
                    onClick={() => alert("TORQ Voice Input: Listening to technician notes...")}
                    className="absolute right-3.5 top-3.5 p-2 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-[#E5402C] transition-colors"
                  >
                    <Mic className="w-4 h-4" />
                  </button>
                </div>

                {/* Technician Quick Preset Chips */}
                <div className="pt-2">
                  <span className="text-[11px] font-bold text-[#6B7280] uppercase tracking-wider block mb-1.5">
                    Technician Diagnostic Presets:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => handleApplyPreset("Engine coolant temperature rising excessively above 105°C under uphill haul load with fan cycling continuously.", "SPN 110 / FMI 0")}
                      className="px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 hover:bg-red-50 hover:text-[#E5402C] border border-gray-200 transition-all text-[#374151]"
                    >
                      🌡️ Coolant Overheating (SPN 110)
                    </button>
                    <button
                      type="button"
                      onClick={() => handleApplyPreset("Low oil pressure warning lamp illuminated at warm idle. Pressure gauge drops below 1.2 bar.", "SPN 100 / FMI 4")}
                      className="px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 hover:bg-red-50 hover:text-[#E5402C] border border-gray-200 transition-all text-[#374151]"
                    >
                      🛢️ Oil Pressure Drop (SPN 100)
                    </button>
                    <button
                      type="button"
                      onClick={() => handleApplyPreset("DEF dosing pressure low warning on dash with engine torque derate active and DEF fluid quality warning.", "SPN 520322 / FMI 1")}
                      className="px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 hover:bg-red-50 hover:text-[#E5402C] border border-gray-200 transition-all text-[#374151]"
                    >
                      💧 DEF Dosing Malfunction (SPN 520322)
                    </button>
                    <button
                      type="button"
                      onClick={() => handleApplyPreset("DPF soot loading alert illuminated. Frequent automatic active regeneration aborted with high differential pressure.", "SPN 3226 / FMI 15")}
                      className="px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 hover:bg-red-50 hover:text-[#E5402C] border border-gray-200 transition-all text-[#374151]"
                    >
                      💨 DPF Differential Pressure (SPN 3226)
                    </button>
                    <button
                      type="button"
                      onClick={() => handleApplyPreset("Intermittent throttle response and dead pedal feeling when accelerating out of gear shifts.", "SPN 91 / FMI 8")}
                      className="px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 hover:bg-red-50 hover:text-[#E5402C] border border-gray-200 transition-all text-[#374151]"
                    >
                      ⚡ Throttle Sensor Erratic (SPN 91)
                    </button>
                    <button
                      type="button"
                      onClick={() => handleApplyPreset("Intermittent engine stumble and tachometer needle twitching under sustained 1,500 RPM highway cruise.", "SPN 190 / FMI 2")}
                      className="px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 hover:bg-red-50 hover:text-[#E5402C] border border-gray-200 transition-all text-[#374151]"
                    >
                      ⚙️ Crank Sensor Jitter (SPN 190)
                    </button>
                  </div>
                </div>
              </div>

              {/* Fault Code with OCR Icon and Submit Button */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end pt-1">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-xs font-bold text-[#374151] uppercase tracking-wider">
                      DTC / Fault Code (SPN / FMI)
                    </label>
                    <button
                      type="button"
                      onClick={() => alert("TORQ OCR: Optical fault code cluster scan active...")}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold border border-gray-200 transition-colors"
                    >
                      <Camera className="w-3.5 h-3.5 text-gray-600" />
                      <span>OCR Scanner Ready</span>
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      type="text"
                      value={dtc}
                      onChange={(e) => setDtc(e.target.value)}
                      className="w-full h-12 px-4 font-mono font-semibold bg-white text-[#111827] text-sm rounded-xl border border-black/[0.12] shadow-sm focus:outline-none focus:ring-2 focus:ring-[#E5402C]/20 focus:border-[#E5402C] transition-all pr-12"
                      placeholder="e.g. SPN 110 / FMI 0"
                      required
                    />
                    <button
                      type="button"
                      title="Simulate Camera OCR Scan"
                      onClick={() => alert("TORQ Camera OCR: Scanning cluster diagnostic display...")}
                      className="absolute right-3.5 top-3 p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-[#E5402C] transition-colors"
                    >
                      <Camera className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-end">
                  <button
                    type="submit"
                    disabled={isAnalyzing}
                    className="w-full sm:w-auto px-8 h-12 rounded-full bg-[#E5402C] hover:bg-[#CF3722] text-white text-sm font-bold tracking-tight shadow-[0_4px_16px_rgba(229,64,44,0.25)] hover:shadow-[0_6px_20px_rgba(229,64,44,0.35)] transition-all flex items-center justify-center gap-2 disabled:opacity-75"
                  >
                    {isAnalyzing ? (
                      <>
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Synthesizing Hypotheses...</span>
                      </>
                    ) : (
                      <>
                        <span>Execute TORQ Diagnosis</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </div>

            </form>
          </div>
        </div>

        {/* RECENT DIAGNOSTICS TABLE - APPLE HIG TABLE */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-[#111827]">
                Recent Diagnostics
              </h2>
              <p className="text-sm text-[#4B5563] font-normal">
                Active and logged service sessions in this workshop
              </p>
            </div>
            <Link href="/diagnostics/TRQ-2026-0941" className="text-xs font-bold text-[#E5402C] hover:underline flex items-center gap-1">
              <span>View all active sessions</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="bg-white rounded-[20px] border border-black/[0.08] shadow-[0_2px_12px_rgba(0,0,0,0.03)] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-[#FAFBFB] border-b border-black/[0.06] text-xs uppercase font-bold text-[#6B7280] tracking-wider">
                  <tr>
                    <th className="py-4 px-5">Truck Unit</th>
                    <th className="py-4 px-5">Fault Code</th>
                    <th className="py-4 px-5">Observed Issue</th>
                    <th className="py-4 px-5">TORQ Confidence</th>
                    <th className="py-4 px-5">Diagnostic Status</th>
                    <th className="py-4 px-5">Updated</th>
                    <th className="py-4 px-5 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/[0.05]">
                  {RECENT_DIAGNOSTICS_DATA.map((row) => (
                    <tr key={row.id} className="hover:bg-red-50/30 transition-colors">
                      <td className="py-4 px-5 font-bold text-[#111827]">
                        {row.truck}
                      </td>
                      <td className="py-4 px-5 font-mono text-xs">
                        <span className="inline-flex px-2.5 py-1 rounded-md bg-gray-100 border border-gray-200 text-gray-800 font-mono font-semibold">
                          {row.dtc}
                        </span>
                      </td>
                      <td className="py-4 px-5 text-[#374151] font-medium max-w-xs truncate">
                        {row.issue}
                      </td>
                      <td className="py-4 px-5">
                        <span className="font-mono font-bold text-[#E5402C] text-sm">
                          {row.confidence}%
                        </span>
                      </td>
                      <td className="py-4 px-5">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold tracking-tight border ${
                            row.status === "Resolved"
                              ? "bg-emerald-50 text-emerald-800 border-emerald-300"
                              : row.status === "Root-Cause-Confirmed"
                              ? "bg-blue-50 text-blue-800 border-blue-300"
                              : "bg-amber-50 text-amber-800 border-amber-300"
                          }`}
                        >
                          {row.status}
                        </span>
                      </td>
                      <td className="py-4 px-5 text-xs text-[#6B7280]">
                        {row.updated}
                      </td>
                      <td className="py-4 px-5 text-right">
                        <Link href={`/diagnostics/${row.id}`}>
                          <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-red-50 text-[#E5402C] hover:bg-[#E5402C] hover:text-white font-bold text-xs transition-all">
                            <span>Open</span>
                            <ArrowRight className="w-3 h-3" />
                          </span>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* FLEET INTELLIGENCE PREVIEW (CLEARLY LABELED DEMO DATA) */}
        <section className="p-8 rounded-[24px] bg-gradient-to-br from-white to-[#F9FAFB] border border-black/[0.08] shadow-[0_2px_12px_rgba(0,0,0,0.03)] space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center text-[#E5402C]">
                <BarChart2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-extrabold tracking-tight text-[#111827]">
                  TORQ Fleet Intelligence Live Correlation
                </h3>
                <p className="text-xs text-[#6B7280]">
                  Real-time pattern analysis across 1,450 connected commercial transport units
                </p>
              </div>
            </div>
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-300 font-mono text-[11px] font-bold">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
              DEMO DATA (PACCAR 1,450 TRUCK TELEMETRY CLUSTER)
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div className="p-5 rounded-[18px] bg-white border border-black/[0.06] shadow-sm">
              <span className="text-xs uppercase font-bold text-[#6B7280] tracking-wider block">
                Similar Cases Identified
              </span>
              <span className="text-3xl font-extrabold font-mono text-[#111827] mt-2 block">
                {FLEET_STATISTICS.similarCasesCount} cases
              </span>
              <span className="text-xs text-[#6B7280] mt-1 block">
                18 resolved by fuel-system inspection
              </span>
            </div>

            <div className="p-5 rounded-[18px] bg-white border border-black/[0.06] shadow-sm">
              <span className="text-xs uppercase font-bold text-[#6B7280] tracking-wider block">
                First-Time Fix Success Rate
              </span>
              <span className="text-3xl font-extrabold font-mono text-emerald-700 mt-2 block">
                {FLEET_STATISTICS.resolutionRatePercent}%
              </span>
              <span className="text-xs text-emerald-600 font-bold mt-1 block">
                Correlated with Next-Best-Test 01
              </span>
            </div>

            <div className="p-5 rounded-[18px] bg-white border border-black/[0.06] shadow-sm">
              <span className="text-xs uppercase font-bold text-[#6B7280] tracking-wider block">
                Average Repair Cost
              </span>
              <span className="text-3xl font-extrabold font-mono text-[#111827] mt-2 block">
                {formatCurrencyINR(FLEET_STATISTICS.averageRepairCostINR)}
              </span>
              <span className="text-xs text-[#6B7280] mt-1 block">
                Avg diagnostic time: {FLEET_STATISTICS.averageDiagnosticHours} hrs
              </span>
            </div>
          </div>
        </section>

      </div>
    </AppShell>
  );
}
