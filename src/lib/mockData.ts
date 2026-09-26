export interface DiagnosticCandidate {
  id: string;
  name: string;
  initialConfidence: number; // percentage (e.g. 62)
  currentConfidence: number;
  description: string;
  subsystem: string;
  severity: "high" | "medium" | "low";
}

export interface DiagnosticEvidence {
  id: string;
  claim: string;
  source: string;
  sourceType: "DTC Knowledge Base" | "OEM Workshop Manual" | "Fleet History" | "Telemetry Stream";
  relevanceScore: number;
  isSynthetic: boolean; // clearly labelled synthetic demo knowledge
}

export interface NextBestTest {
  testNumber: string;
  title: string;
  procedure: string;
  rationale: string;
  targetMetric: string;
  nominalRange: string;
  measuredUnit: string;
  isTorqLockVerified: boolean;
  specSource: string;
  safetyAdvisory?: string;
}

export interface DiagnosticSession {
  id: string;
  truckId: string;
  truckModel: string;
  engine: string;
  mileage: number;
  vin: string;
  dtc: string;
  spn: number;
  fmi: number;
  dtcDescription: string;
  subsystem: string;
  symptomText: string;
  status: "Assessing" | "In-Progress" | "Root-Cause-Confirmed" | "Resolved";
  createdAt: string;
  updatedAt: string;
  candidates: DiagnosticCandidate[];
  evidence: DiagnosticEvidence[];
  nextBestTest: NextBestTest;
  testHistory: {
    testName: string;
    measuredValue: string;
    result: "PASS" | "FAIL" | "INCONCLUSIVE";
    timestamp: string;
    notes?: string;
  }[];
  repairEstimate: {
    parts: { name: string; partNumber: string; costINR: number }[];
    laborHours: number;
    laborRateINR: number;
    consumablesINR: number;
    fuelPenaltyImpactINR: number;
  };
  confirmedRootCause?: string;
}

export const INITIAL_DEMO_DIAGNOSIS: DiagnosticSession = {
  id: "TRQ-2026-0941",
  truckId: "KW-704",
  truckModel: "Kenworth T680 Next Gen",
  engine: "PACCAR MX-13 455 HP",
  mileage: 142300,
  vin: "1NKDX4EX7PR981240",
  dtc: "SPN 94 / FMI 1",
  spn: 94,
  fmi: 1,
  dtcDescription: "Fuel Delivery Pressure — Data Valid But Below Normal Operating Range",
  subsystem: "Common Rail High-Pressure Fuel System",
  symptomText: "Engine loses power under load and hesitates during acceleration above 1,400 RPM.",
  status: "Assessing",
  createdAt: "2026-09-26T08:15:00Z",
  updatedAt: "2026-09-26T08:22:00Z",
  candidates: [
    {
      id: "cand-1",
      name: "Fuel Delivery Restriction (Primary / Secondary Filter Clog)",
      initialConfidence: 62,
      currentConfidence: 62,
      description: "Excessive pressure drop across the low-pressure fuel circuit or water separator restricting volume flow to the high-pressure pump.",
      subsystem: "Low-Pressure Fuel Circuit",
      severity: "high",
    },
    {
      id: "cand-2",
      name: "Fuel Rail Pressure Sensor Drift / Electrical Bias",
      initialConfidence: 24,
      currentConfidence: 24,
      description: "Sensor signal variance reporting low rail pressure despite normal hydraulic delivery pressure.",
      subsystem: "Sensor & Engine Harness",
      severity: "medium",
    },
    {
      id: "cand-3",
      name: "High-Pressure Fuel Pump (HPFP) Internal Leakage",
      initialConfidence: 14,
      currentConfidence: 14,
      description: "Plunger bypass or pressure control valve seal degradation failing to sustain rated injection rail pressure.",
      subsystem: "High-Pressure Injection Unit",
      severity: "low",
    },
  ],
  evidence: [
    {
      id: "ev-1",
      claim: "Hesitation specifically under torque demand correlates with high-flow starvation rather than timing error.",
      source: "OEM Service Bulletin Bulletin MX-13-FL-08",
      sourceType: "OEM Workshop Manual",
      relevanceScore: 94,
      isSynthetic: true,
    },
    {
      id: "ev-2",
      claim: "SPN 94 / FMI 1 triggers when rail feed pressure drops below 5.2 bar for > 3.0 seconds under rated load.",
      source: "DTC Diagnostic Reference SPN 94 (PACCAR Engine Management)",
      sourceType: "DTC Knowledge Base",
      relevanceScore: 98,
      isSynthetic: true,
    },
    {
      id: "ev-3",
      claim: "Fleet history reveals 18 of 23 identical DTC cases on MX-13 engines were resolved by filter module replacement.",
      source: "TORQ Fleet Intelligence Cluster (1,450 Truck Telemetry Dataset)",
      sourceType: "Fleet History",
      relevanceScore: 88,
      isSynthetic: true,
    },
  ],
  nextBestTest: {
    testNumber: "01",
    title: "Measure Fuel Rail Pressure at Idle and 1800 RPM Under Load",
    procedure: "Connect calibrated digital pressure gauge to service test port on secondary filter head. Run engine at idle (650 RPM), then apply stationary load run to 1,800 RPM. Observe pressure drop.",
    rationale: "This mechanical check decisively separates low-pressure hydraulic restriction (< 4.8 bar) from electronic sensor calibration error.",
    targetMetric: "Low-Pressure Supply Delivery",
    nominalRange: "5.5 – 6.5 bar (80 – 94 PSI)",
    measuredUnit: "bar",
    isTorqLockVerified: true,
    specSource: "PACCAR Technical Specification Spec-MX-FL-22 (Verified)",
    safetyAdvisory: "High pressure fuel system: Relieve circuit residual pressure prior to unseating test couplings. Wear safety glasses and nitrile gloves.",
  },
  testHistory: [],
  repairEstimate: {
    parts: [
      { name: "PACCAR Genuine Primary Fuel Filter / Water Separator", partNumber: "1852006PE", costINR: 1850 },
      { name: "Secondary Spin-On Micron Filter Element", partNumber: "1948921PE", costINR: 1250 },
    ],
    laborHours: 2.5,
    laborRateINR: 1000,
    consumablesINR: 350,
    fuelPenaltyImpactINR: 1200,
  },
};

export const RECENT_DIAGNOSTICS_DATA = [
  {
    id: "TRQ-2026-0941",
    truck: "KW-704 (Kenworth T680)",
    dtc: "SPN 94 / FMI 1",
    issue: "Fuel Delivery Starvation Under Load",
    confidence: 62,
    status: "Assessing",
    updated: "8 min ago",
  },
  {
    id: "TRQ-2026-0938",
    truck: "PB-512 (Peterbilt 579)",
    dtc: "SPN 3251 / FMI 0",
    issue: "DPF Differential Pressure Excessive",
    confidence: 91,
    status: "Resolved",
    updated: "1 hr ago",
  },
  {
    id: "TRQ-2026-0935",
    truck: "KW-609 (Kenworth W990)",
    dtc: "SPN 111 / FMI 1",
    issue: "Coolant Level Circuit Low Resistance",
    confidence: 85,
    status: "Root-Cause-Confirmed",
    updated: "3 hrs ago",
  },
  {
    id: "TRQ-2026-0929",
    truck: "PB-418 (Peterbilt 389)",
    dtc: "SPN 641 / FMI 7",
    issue: "VGT Turbo Actuator Mechanical Jam",
    confidence: 78,
    status: "Resolved",
    updated: "Yesterday",
  },
];

export const FLEET_STATISTICS = {
  similarCasesCount: 23,
  resolvedByFuelInspection: 18,
  resolutionRatePercent: 78,
  averageRepairCostINR: 8420,
  averageDiagnosticHours: 2.4,
  dtcDistribution: [
    { code: "SPN 94", description: "Fuel Delivery Pressure", count: 34, percentage: 38 },
    { code: "SPN 3251", description: "DPF Differential Pressure", count: 22, percentage: 24 },
    { code: "SPN 102", description: "Boost Pressure Starvation", count: 18, percentage: 20 },
    { code: "SPN 641", description: "VGT Actuator Response", count: 16, percentage: 18 },
  ],
  trendData: [
    { month: "May", fuelIssues: 12, resolvedHours: 3.2, cost: 9200 },
    { month: "Jun", fuelIssues: 19, resolvedHours: 2.9, cost: 8900 },
    { month: "Jul", fuelIssues: 15, resolvedHours: 2.6, cost: 8600 },
    { month: "Aug", fuelIssues: 26, resolvedHours: 2.5, cost: 8500 },
    { month: "Sep", fuelIssues: 23, resolvedHours: 2.4, cost: 8420 },
  ],
};
