import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatPercent(value: number): string {
  return `${(value * 100).toFixed(1)}%`;
}

export function confidenceColor(score: number): string {
  if (score >= 60) return "bg-success";
  if (score >= 40) return "bg-warning";
  return "bg-accent";
}

export function severityLabel(level: number): string {
  const labels: Record<number, string> = {
    1: "Info",
    2: "Moderate",
    3: "Warning",
    4: "Critical",
    5: "Stop Vehicle",
  };
  return labels[level] || "Unknown";
}
