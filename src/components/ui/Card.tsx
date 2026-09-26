import React from "react";
import { cn } from "@/lib/utils";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  elevated?: boolean;
}

export const Card: React.FC<CardProps> = ({ className, elevated, children, ...props }) => {
  return (
    <div
      className={cn(
        "bg-surface rounded-card border border-surface-border transition-all duration-200",
        elevated ? "shadow-elevated hover:shadow-modal" : "shadow-card hover:border-surface-borderDark",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
