import React from "react";
import { formatCurrencyINR } from "@/lib/utils";
import { Card } from "@/components/ui/Card";
import { AlertCircle, Wrench, Package, Clock, Fuel } from "lucide-react";

interface RepairCostEstimatorProps {
  estimate: {
    parts: { name: string; partNumber: string; costINR: number }[];
    laborHours: number;
    laborRateINR: number;
    consumablesINR: number;
    fuelPenaltyImpactINR: number;
  };
}

export const RepairCostEstimator: React.FC<RepairCostEstimatorProps> = ({ estimate }) => {
  const partsSubtotal = estimate.parts.reduce((sum, item) => sum + item.costINR, 0);
  const laborSubtotal = estimate.laborHours * estimate.laborRateINR;
  const estimatedTotal = partsSubtotal + laborSubtotal + estimate.consumablesINR;

  return (
    <Card className="p-6 bg-white space-y-4">
      <div className="flex items-center justify-between border-b border-surface-border pb-3">
        <div>
          <h3 className="text-base font-semibold text-industrial-dark">
            Estimated Repair Cost
          </h3>
          <p className="text-xs text-industrial-muted">
            OEM standard labor times & replacement components
          </p>
        </div>
        <div className="text-right">
          <span className="text-xs font-semibold text-industrial-muted uppercase block">
            ESTIMATED TOTAL
          </span>
          <span className="text-2xl font-bold font-mono text-industrial-dark">
            {formatCurrencyINR(estimatedTotal)}
          </span>
        </div>
      </div>

      {/* Itemized Breakdown Table */}
      <div className="space-y-3 text-sm">
        
        {/* Parts */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-industrial-steel">
            <span className="flex items-center gap-1.5">
              <Package className="w-3.5 h-3.5 text-paccar-blue" />
              PARTS (PACCAR GENUINE)
            </span>
            <span>{formatCurrencyINR(partsSubtotal)}</span>
          </div>
          <div className="pl-5 space-y-1">
            {estimate.parts.map((part) => (
              <div key={part.partNumber} className="flex items-center justify-between text-xs text-industrial-steel">
                <span>
                  {part.name} <span className="font-mono text-industrial-caption text-[11px]">({part.partNumber})</span>
                </span>
                <span className="font-mono text-industrial-dark">{formatCurrencyINR(part.costINR)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Labor */}
        <div className="pt-2 border-t border-surface-border/60">
          <div className="flex items-center justify-between text-xs text-industrial-steel">
            <span className="flex items-center gap-1.5 font-semibold">
              <Clock className="w-3.5 h-3.5 text-paccar-blue" />
              LABOR ({estimate.laborHours} hrs @ {formatCurrencyINR(estimate.laborRateINR)}/hr)
            </span>
            <span className="font-mono text-industrial-dark">{formatCurrencyINR(laborSubtotal)}</span>
          </div>
        </div>

        {/* Consumables */}
        <div className="flex items-center justify-between text-xs text-industrial-steel">
          <span className="flex items-center gap-1.5 font-semibold">
            <Wrench className="w-3.5 h-3.5 text-paccar-blue" />
            WORKSHOP CONSUMABLES & DISPOSAL
          </span>
          <span className="font-mono text-industrial-dark">{formatCurrencyINR(estimate.consumablesINR)}</span>
        </div>

        {/* Fuel Inefficiency Penalty (Preventative ROI) */}
        <div className="pt-2 border-t border-surface-border/60 p-2.5 rounded-input bg-emerald-50/60 border border-emerald-200">
          <div className="flex items-center justify-between text-xs text-emerald-900">
            <span className="flex items-center gap-1.5 font-medium">
              <Fuel className="w-3.5 h-3.5 text-emerald-700" />
              Fleet Fuel Penalty Prevented (Monthly Est.)
            </span>
            <span className="font-mono font-bold text-emerald-700">-{formatCurrencyINR(estimate.fuelPenaltyImpactINR)}</span>
          </div>
        </div>

      </div>

      {/* Disclaimer */}
      <div className="pt-2 border-t border-surface-border/60 flex items-start gap-2 text-[11px] text-industrial-caption">
        <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
        <p>Demo estimate — replace with verified workshop dealer pricing before issuing customer quote.</p>
      </div>
    </Card>
  );
};
