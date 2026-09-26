"use client";

import React from "react";
import { BookOpen, Database, Truck, Radio } from "lucide-react";
import { DiagnosticEvidence } from "@/lib/mockData";

interface EvidenceCardProps {
  evidence: DiagnosticEvidence;
}

export const EvidenceCard: React.FC<EvidenceCardProps> = ({ evidence }) => {
  const getSourceIcon = (type: DiagnosticEvidence["sourceType"]) => {
    switch (type) {
      case "OEM Workshop Manual":
        return <BookOpen className="w-3.5 h-3.5 text-[#E5402C]" />;
      case "DTC Knowledge Base":
        return <Database className="w-3.5 h-3.5 text-emerald-600" />;
      case "Fleet History":
        return <Truck className="w-3.5 h-3.5 text-amber-600" />;
      case "Telemetry Stream":
        return <Radio className="w-3.5 h-3.5 text-purple-600" />;
    }
  };

  return (
    <div className="p-5 bg-white hover:bg-[#FAFBFB] rounded-[18px] border border-black/[0.07] shadow-[0_2px_8px_rgba(0,0,0,0.02)] space-y-3 transition-all duration-200">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center">
            {getSourceIcon(evidence.sourceType)}
          </span>
          <span className="text-xs font-bold text-[#374151]">
            {evidence.sourceType}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {evidence.isSynthetic && (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full text-amber-800 bg-amber-50 border border-amber-200">
              SYNTHETIC / DEMO
            </span>
          )}
          <span className="text-xs font-mono font-bold text-[#E5402C]">
            {evidence.relevanceScore}% match
          </span>
        </div>
      </div>

      <p className="text-sm font-medium text-[#111827] leading-relaxed italic">
        &ldquo;{evidence.claim}&rdquo;
      </p>

      <div className="pt-2 border-t border-black/[0.05] flex items-center justify-between text-xs text-[#6B7280]">
        <span className="font-mono text-[11px] truncate max-w-[280px]">{evidence.source}</span>
        <button type="button" className="text-[#E5402C] font-bold hover:underline">
          View Citation
        </button>
      </div>
    </div>
  );
};
