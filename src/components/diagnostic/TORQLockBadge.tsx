"use client";

import React from "react";
import { ShieldCheck, Info } from "lucide-react";
import { cn } from "@/lib/utils";

interface TORQLockBadgeProps {
  verified?: boolean;
  specCode?: string;
  className?: string;
}

export const TORQLockBadge: React.FC<TORQLockBadgeProps> = ({
  verified = true,
  specCode,
  className,
}) => {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold tracking-tight border",
        verified
          ? "bg-emerald-50 text-emerald-800 border-emerald-300"
          : "bg-amber-50 text-amber-800 border-amber-300",
        className
      )}
      title={
        verified
          ? "TORQ-LOCK VERIFIED: Numeric specifications cross-checked against OEM workshop manual"
          : "Manufacturer specification required: Manual confirmation needed"
      }
    >
      <ShieldCheck className={cn("w-3.5 h-3.5", verified ? "text-emerald-600" : "text-amber-600")} />
      <span>{verified ? "TORQ-LOCK VERIFIED" : "MANUFACTURER SPEC REQUIRED"}</span>
      {specCode && (
        <span className="font-mono text-[10px] opacity-75 hidden sm:inline">[{specCode}]</span>
      )}
    </div>
  );
};
