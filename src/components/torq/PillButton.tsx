import React from "react";
import { ArrowUpRight } from "lucide-react";

interface PillButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "outline" | "solid" | "light";
  size?: "sm" | "md";
  showIcon?: boolean;
  children: React.ReactNode;
}

export const PillButton: React.FC<PillButtonProps> = ({
  variant = "outline",
  size = "md",
  showIcon = true,
  children,
  className = "",
  ...props
}) => {
  const baseStyles =
    "inline-flex items-center justify-center font-medium rounded-full transition-all duration-150 ease-out select-none active:scale-[0.98]";

  const sizes = {
    sm: "px-3.5 py-1.5 text-xs gap-1.5",
    md: "px-5 py-2.5 text-[13px] gap-2",
  };

  const variants = {
    outline:
      "border border-[#F6C9BE] text-[#E5402C] bg-transparent hover:bg-[#FDF2F0] hover:border-[#F2A28E]",
    solid:
      "bg-[#E5402C] text-white border border-[#E5402C] hover:bg-[#CF3722] hover:border-[#CF3722] shadow-sm",
    light:
      "bg-[#FAF4F2] text-[#E5402C] border border-[#F6C9BE]/60 hover:bg-[#F6E8E4]",
  };

  return (
    <button
      className={`${baseStyles} ${sizes[size]} ${variants[variant]} ${className}`}
      {...props}
    >
      <span>{children}</span>
      {showIcon && (
        <span
          className={`w-4 h-4 rounded-full flex items-center justify-center transition-transform ${
            variant === "solid"
              ? "bg-white/20 text-white"
              : "bg-[#E5402C]/10 text-[#E5402C]"
          }`}
        >
          <ArrowUpRight className="w-2.5 h-2.5 stroke-[2.5]" />
        </span>
      )}
    </button>
  );
};
