"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Wrench, 
  Activity, 
  BarChart3, 
  FileText, 
  Settings, 
  PlusCircle, 
  Truck, 
  Bell, 
  ShieldCheck,
  CheckCircle2,
  SlidersHorizontal
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { useTorqStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export const TopNav: React.FC = () => {
  const pathname = usePathname();
  const { demoMode, setDemoMode, activeSession } = useTorqStore();

  const navLinks = [
    { label: "Dashboard", href: "/dashboard", icon: Activity },
    { label: "Diagnostics", href: `/diagnostics/${activeSession.id}`, icon: Wrench },
    { label: "Fleet Intelligence", href: "/fleet", icon: BarChart3 },
    { label: "Reports", href: `/reports/${activeSession.id}`, icon: FileText },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-surface-border">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Left: TORQ Brand Logo */}
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 bg-paccar-blue rounded-input flex items-center justify-center text-white font-bold text-lg tracking-wider shadow-sm group-hover:bg-paccar-deep transition-colors">
              T
            </div>
            <div className="flex flex-col">
              <span className="font-semibold text-lg leading-tight tracking-tight text-industrial-dark flex items-center gap-1.5">
                TORQ
                <span className="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded bg-paccar-softblue text-paccar-blue border border-blue-150">
                  COPILOT
                </span>
              </span>
              <span className="text-[11px] text-industrial-muted font-medium tracking-tight">
                PACCAR Diagnostic Intelligence
              </span>
            </div>
          </Link>

          {/* Nav Items */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname.startsWith(link.href);
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  className={cn(
                    "flex items-center gap-2 px-3.5 py-2 text-sm font-medium rounded-input transition-colors",
                    isActive
                      ? "text-paccar-blue bg-paccar-softblue/70 font-semibold"
                      : "text-industrial-steel hover:text-industrial-dark hover:bg-surface-subtle"
                  )}
                >
                  <Icon className="w-4 h-4" />
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          
          {/* Demo Mode Toggle */}
          <button
            onClick={() => setDemoMode(!demoMode)}
            className={cn(
              "hidden sm:flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full border transition-all cursor-pointer",
              demoMode
                ? "bg-amber-50 text-amber-800 border-amber-300"
                : "bg-surface-subtle text-industrial-steel border-surface-border hover:bg-surface-muted"
            )}
            title="Toggle Demo Mode with deterministic mock responses"
          >
            <span className={cn("w-2 h-2 rounded-full", demoMode ? "bg-amber-500 animate-pulse" : "bg-industrial-caption")} />
            Demo Mode: {demoMode ? "ON" : "OFF"}
          </button>

          {/* Active Truck Context Indicator */}
          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 bg-surface-subtle rounded-input border border-surface-border text-xs text-industrial-steel">
            <Truck className="w-3.5 h-3.5 text-paccar-blue" />
            <span className="font-semibold text-industrial-dark">{activeSession.truckId}</span>
            <span className="text-industrial-caption">|</span>
            <span className="text-industrial-steel truncate max-w-[120px]">{activeSession.engine.split(" ")[0]} {activeSession.engine.split(" ")[1]}</span>
          </div>

          {/* New Diagnosis Primary CTA */}
          <Link href="/diagnostics/new">
            <Button size="md" className="gap-2 font-semibold">
              <PlusCircle className="w-4 h-4" />
              <span>New Diagnosis</span>
            </Button>
          </Link>

          {/* Technician Profile Quick Link */}
          <Link
            href="/settings"
            className="w-9 h-9 rounded-input border border-surface-border flex items-center justify-center text-industrial-steel hover:text-paccar-blue hover:border-paccar-blue transition-colors"
            title="Settings & Workshop Profile"
          >
            <Settings className="w-4 h-4" />
          </Link>
        </div>

      </div>
    </header>
  );
};
