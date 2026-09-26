import React from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "ghost" | "outline";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", isLoading, children, disabled, ...props }, ref) => {
    const baseStyles = "inline-flex items-center justify-center font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-paccar-blue/50 disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98]";

    const variants = {
      primary: "bg-paccar-blue text-white hover:bg-paccar-deep shadow-sm hover:shadow",
      secondary: "bg-white text-paccar-deep border border-surface-border hover:bg-surface-subtle hover:border-surface-borderDark",
      danger: "bg-paccar-red text-white hover:bg-paccar-darkred shadow-sm",
      ghost: "text-industrial-steel hover:text-industrial-dark hover:bg-surface-muted",
      outline: "border border-surface-border text-industrial-dark hover:bg-surface-subtle",
    };

    const sizes = {
      sm: "h-8 px-3 text-xs rounded-sm gap-1.5",
      md: "h-10 px-4 text-sm rounded-input gap-2 min-h-[40px]",
      lg: "h-12 px-6 text-base rounded-input gap-2.5 min-h-[44px]",
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {isLoading ? (
          <span className="flex items-center gap-2">
            <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
            <span>Processing...</span>
          </span>
        ) : (
          children
        )}
      </button>
    );
  }
);

Button.displayName = "Button";
