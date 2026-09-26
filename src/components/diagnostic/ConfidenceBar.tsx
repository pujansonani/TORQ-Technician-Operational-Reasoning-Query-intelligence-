"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ConfidenceBarProps {
  label: string;
  confidence: number;
  subsystem?: string;
  isLeading?: boolean;
  statusColor?: "blue" | "emerald" | "amber" | "rose";
}

export const ConfidenceBar: React.FC<ConfidenceBarProps> = ({
  label,
  confidence,
  subsystem,
  isLeading,
  statusColor = "blue",
}) => {
  const barColors = {
    blue: "bg-paccar-blue",
    emerald: "bg-status-success",
    amber: "bg-status-warning",
    rose: "bg-paccar-red",
  };

  const activeColor = isLeading ? "bg-paccar-blue" : "bg-industrial-metal";

  return (
    <div className="w-full space-y-1.5 py-1">
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-2 max-w-[80%]">
          <span className={cn("font-medium truncate", isLeading ? "text-industrial-dark font-semibold" : "text-industrial-steel")}>
            {label}
          </span>
          {subsystem && (
            <span className="text-[10px] text-industrial-caption uppercase tracking-wider hidden sm:inline">
              ({subsystem})
            </span>
          )}
        </div>
        <div className="flex items-center gap-1.5 font-mono">
          <span className={cn("text-sm font-semibold", isLeading ? "text-paccar-blue" : "text-industrial-steel")}>
            {confidence}%
          </span>
        </div>
      </div>

      {/* Progress Track */}
      <div className="w-full h-2.5 bg-surface-muted rounded-full overflow-hidden p-0.5 border border-surface-border">
        <motion.div
          className={cn("h-full rounded-full transition-colors", isLeading ? "bg-paccar-blue" : "bg-slate-400")}
          initial={{ width: 0 }}
          animate={{ width: `${Math.max(4, confidence)}%` }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>
    </div>
  );
};
