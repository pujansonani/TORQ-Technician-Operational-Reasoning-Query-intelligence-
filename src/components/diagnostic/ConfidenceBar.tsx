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
}) => {
  return (
    <div className="w-full space-y-2 py-1.5">
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-2 max-w-[80%]">
          <span className={cn("truncate font-semibold", isLeading ? "text-[#111827] font-bold" : "text-[#4B5563]")}>
            {label}
          </span>
          {subsystem && (
            <span className="text-[10px] text-[#9CA3AF] uppercase font-bold tracking-wider hidden sm:inline">
              ({subsystem})
            </span>
          )}
        </div>
        <div className="flex items-center gap-1.5 font-mono">
          <span className={cn("text-xs font-bold", isLeading ? "text-[#E5402C]" : "text-[#6B7280]")}>
            {confidence}%
          </span>
        </div>
      </div>

      {/* Progress Track - Apple HIG Smooth Pill */}
      <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden p-0.5">
        <motion.div
          className={cn("h-full rounded-full transition-colors", isLeading ? "bg-[#E5402C]" : "bg-gray-400")}
          initial={{ width: 0 }}
          animate={{ width: `${Math.max(4, confidence)}%` }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>
    </div>
  );
};
