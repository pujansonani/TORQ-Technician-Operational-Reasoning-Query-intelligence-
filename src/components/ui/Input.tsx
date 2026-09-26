import React from "react";
import { cn } from "@/lib/utils";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  rightElement?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, hint, rightElement, id, ...props }, ref) => {
    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label htmlFor={id} className="block text-xs font-medium text-industrial-steel uppercase tracking-wider">
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          <input
            id={id}
            ref={ref}
            className={cn(
              "w-full h-11 px-3.5 bg-surface text-industrial-dark placeholder:text-industrial-caption text-sm rounded-input border border-surface-border transition-colors focus:outline-none focus:ring-2 focus:ring-paccar-blue/20 focus:border-paccar-blue",
              rightElement && "pr-11",
              error && "border-paccar-red focus:ring-paccar-red/20 focus:border-paccar-red",
              className
            )}
            {...props}
          />
          {rightElement && (
            <div className="absolute right-3 flex items-center text-industrial-muted">
              {rightElement}
            </div>
          )}
        </div>
        {error && <p className="text-xs text-paccar-red">{error}</p>}
        {hint && !error && <p className="text-xs text-industrial-muted">{hint}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";
