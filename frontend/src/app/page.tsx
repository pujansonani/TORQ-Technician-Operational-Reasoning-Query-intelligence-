"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { fetchTrucks, startDiagnosis } from "@/lib/api";
import { diagnoseFormSchema, type DiagnoseFormValues } from "@/lib/validations";
import { useDiagnosisStore } from "@/store/useDiagnosisStore";
import type { TruckBrief } from "@/types";

export default function HomePage() {
  const router = useRouter();
  const [trucks, setTrucks] = useState<TruckBrief[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { setDiagnosis, setLoading: storeLoading, reset } = useDiagnosisStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DiagnoseFormValues>({
    resolver: zodResolver(diagnoseFormSchema),
    defaultValues: { truck_id: "", symptom_text: "", dtc_codes: "" },
  });

  useEffect(() => {
    reset();
    fetchTrucks()
      .then(setTrucks)
      .catch(() => setError("Unable to connect to TORQ backend. Is the server running?"));
  }, [reset]);

  const onSubmit = async (data: DiagnoseFormValues) => {
    setLoading(true);
    setError("");
    storeLoading();
    try {
      const dtcCodes = Array.isArray(data.dtc_codes)
        ? data.dtc_codes
        : typeof data.dtc_codes === "string"
        ? (data.dtc_codes as string).split(",").map((s) => s.trim()).filter(Boolean)
        : [];

      const response = await startDiagnosis({
        truck_id: data.truck_id,
        symptom_text: data.symptom_text,
        dtc_codes: dtcCodes,
      });
      setDiagnosis(response);
      router.push(`/workflow/${response.session_id}`);
    } catch (e: any) {
      setError(e.message || "Failed to start diagnosis");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-2 h-8 rounded-full bg-gradient-to-b from-primary to-accent" />
          <h1 className="text-3xl font-bold text-dark tracking-tight">
            Diagnostic Workbench
          </h1>
        </div>
        <p className="text-surface-500 text-sm ml-5">
          Enter vehicle info, symptom description, and DTC codes to begin a
          systematic, evidence-based diagnosis.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Vehicle Selection */}
            <div className="torq-card">
              <div className="torq-card-header">
                <div className="flex items-center gap-2">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-primary">
                    <rect x="1" y="3" width="15" height="13" rx="2" />
                    <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
                    <circle cx="5.5" cy="18.5" r="2.5" />
                    <circle cx="18.5" cy="18.5" r="2.5" />
                  </svg>
                  <h2 className="font-semibold text-dark">Vehicle Selection</h2>
                </div>
              </div>
              <div className="torq-card-body">
                <select
                  {...register("truck_id")}
                  className="w-full h-12 px-4 rounded-lg border border-surface-300 bg-white text-dark
                             focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary
                             transition-all text-sm"
                >
                  <option value="">Select a vehicle...</option>
                  {trucks.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.year} {t.brand} {t.model} — VIN: ...{t.vin.slice(-6)}
                    </option>
                  ))}
                </select>
                {errors.truck_id && (
                  <p className="mt-2 text-xs text-accent">{errors.truck_id.message}</p>
                )}
              </div>
            </div>

            {/* DTC Codes */}
            <div className="torq-card">
              <div className="torq-card-header">
                <div className="flex items-center gap-2">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-accent">
                    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                    <line x1="12" y1="9" x2="12" y2="13" />
                    <line x1="12" y1="17" x2="12.01" y2="17" />
                  </svg>
                  <h2 className="font-semibold text-dark">DTC Fault Codes</h2>
                </div>
              </div>
              <div className="torq-card-body">
                <input
                  {...register("dtc_codes")}
                  placeholder="e.g. SPN-100-FMI-4, SPN-110-FMI-0"
                  className="w-full h-12 px-4 rounded-lg border border-surface-300 bg-white text-dark
                             focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary
                             transition-all text-sm font-mono"
                />
                <p className="mt-2 text-xs text-surface-500">
                  Comma-separated SAE J1939 SPN-FMI codes from the diagnostic tool
                </p>
                {errors.dtc_codes && (
                  <p className="mt-1 text-xs text-accent">{errors.dtc_codes.message}</p>
                )}
              </div>
            </div>

            {/* Symptom Description */}
            <div className="torq-card">
              <div className="torq-card-header">
                <div className="flex items-center gap-2">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-primary">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                  </svg>
                  <h2 className="font-semibold text-dark">Symptom Description</h2>
                </div>
              </div>
              <div className="torq-card-body">
                <textarea
                  {...register("symptom_text")}
                  rows={4}
                  placeholder="Describe what the driver/operator reported and any observations from visual inspection. Be specific about when the issue occurs (cold start, under load, at idle, etc.)..."
                  className="w-full px-4 py-3 rounded-lg border border-surface-300 bg-white text-dark
                             focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary
                             transition-all text-sm resize-none"
                />
                {errors.symptom_text && (
                  <p className="mt-2 text-xs text-accent">
                    {errors.symptom_text.message}
                  </p>
                )}
              </div>
            </div>

            {/* Error display */}
            {error && (
              <div className="rounded-lg border border-accent/20 bg-accent-50 p-4 flex items-start gap-3 animate-slide-in">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-accent shrink-0 mt-0.5">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                <p className="text-sm text-accent-800">{error}</p>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full h-14 rounded-lg bg-gradient-to-r from-primary to-primary-700 text-white
                         font-semibold text-base shadow-glow hover:shadow-xl hover:scale-[1.01]
                         transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed
                         flex items-center justify-center gap-3"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Analyzing...
                </>
              ) : (
                <>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                  </svg>
                  Start Diagnosis
                </>
              )}
            </button>
          </form>
        </div>

        {/* Sidebar info */}
        <div className="space-y-6">
          {/* How it works */}
          <div className="torq-card">
            <div className="torq-card-header">
              <h3 className="font-semibold text-dark text-sm">How TORQ Works</h3>
            </div>
            <div className="torq-card-body">
              <ol className="space-y-3 text-xs text-surface-500">
                {[
                  { icon: "📋", label: "Input symptoms & DTC codes" },
                  { icon: "🔍", label: "Retrieve relevant knowledge (RAG)" },
                  { icon: "📊", label: "Score candidate root causes" },
                  { icon: "🧪", label: "Recommend most informative test" },
                  { icon: "🔄", label: "Update beliefs from test results" },
                  { icon: "✅", label: "Confirm cause → estimate cost" },
                ].map((step, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-base">{step.icon}</span>
                    <span>{step.label}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>

          {/* Supported DTCs */}
          <div className="torq-card">
            <div className="torq-card-header">
              <h3 className="font-semibold text-dark text-sm">
                Sample DTCs (Demo)
              </h3>
            </div>
            <div className="torq-card-body space-y-2">
              {[
                { code: "SPN-100-FMI-4", desc: "Oil Pressure Low" },
                { code: "SPN-110-FMI-0", desc: "Coolant Temp High" },
                { code: "SPN-190-FMI-0", desc: "Engine Overspeed" },
                { code: "SPN-520322-FMI-7", desc: "SCR Efficiency" },
                { code: "SPN-91-FMI-4", desc: "Pedal Voltage Low" },
                { code: "SPN-3226-FMI-5", desc: "DPF Pressure Low" },
              ].map((dtc) => (
                <div
                  key={dtc.code}
                  className="flex items-center justify-between px-3 py-2 rounded-md bg-surface-100 hover:bg-surface-200 transition-colors cursor-default"
                >
                  <code className="text-xs font-mono text-primary font-medium">
                    {dtc.code}
                  </code>
                  <span className="text-xs text-surface-500">{dtc.desc}</span>
                </div>
              ))}
            </div>
          </div>

          {/* TORQ-Lock info */}
          <div className="torq-card border-amber-200 bg-amber-50/30">
            <div className="torq-card-body">
              <div className="flex items-center gap-2 mb-2">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-amber-600">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
                <span className="text-sm font-semibold text-amber-800">
                  TORQ-Lock™ Active
                </span>
              </div>
              <p className="text-xs text-amber-700 leading-relaxed">
                All numeric specifications (torque, pressure, voltage) are
                cross-checked against verified manufacturer data. Unverified
                values are flagged automatically.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
