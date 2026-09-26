import React from "react";
import { BookOpen, Database, Truck, Radio } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { DiagnosticEvidence } from "@/lib/mockData";

interface EvidenceCardProps {
  evidence: DiagnosticEvidence;
}

export const EvidenceCard: React.FC<EvidenceCardProps> = ({ evidence }) => {
  const getSourceIcon = (type: DiagnosticEvidence["sourceType"]) => {
    switch (type) {
      case "OEM Workshop Manual":
        return <BookOpen className="w-3.5 h-3.5 text-paccar-blue" />;
      case "DTC Knowledge Base":
        return <Database className="w-3.5 h-3.5 text-emerald-600" />;
      case "Fleet History":
        return <Truck className="w-3.5 h-3.5 text-amber-600" />;
      case "Telemetry Stream":
        return <Radio className="w-3.5 h-3.5 text-purple-600" />;
    }
  };

  return (
    <Card className="p-4 bg-surface space-y-3">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="p-1 rounded bg-surface-muted border border-surface-border">
            {getSourceIcon(evidence.sourceType)}
          </span>
          <span className="text-xs font-semibold text-industrial-steel">
            {evidence.sourceType}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {evidence.isSynthetic && (
            <Badge variant="outline" size="sm" className="text-[10px] text-amber-700 bg-amber-50/50 border-amber-200">
              SYNTHETIC / DEMO
            </Badge>
          )}
          <span className="text-xs font-mono font-medium text-industrial-steel">
            {evidence.relevanceScore}% match
          </span>
        </div>
      </div>

      <p className="text-sm text-industrial-dark leading-relaxed">
        &ldquo;{evidence.claim}&rdquo;
      </p>

      <div className="pt-2 border-t border-surface-border/60 flex items-center justify-between text-[11px] text-industrial-muted">
        <span className="font-mono truncate">{evidence.source}</span>
        <span className="text-paccar-blue font-medium hover:underline cursor-pointer">
          View Citation
        </span>
      </div>
    </Card>
  );
};
