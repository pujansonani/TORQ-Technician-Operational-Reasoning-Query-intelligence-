import React from "react";
import Link from "next/link";
import { ArrowUpRight, GitBranch, Mail, Terminal } from "lucide-react";

export const TorqFooter: React.FC = () => {
  return (
    <footer className="w-full bg-[#1A1A1A] text-white pt-16 pb-12 border-t border-white/10">
      <div className="max-w-[1280px] mx-auto px-6 space-y-12">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#E5402C] rounded-xl flex items-center justify-center text-white font-bold text-lg">
                <span className="font-sans font-extrabold text-xl leading-none">T</span>
              </div>
              <span className="font-semibold text-2xl tracking-tight text-white">
                torq
              </span>
            </div>
            <p className="text-sm text-[#9A9A9A] max-w-sm leading-relaxed">
              An AI diagnostic copilot for truck service technicians — built for the Paccar India hackathon. Evidence-based reasoning over SAE J1939 fault codes and driver observations.
            </p>
            <div className="pt-1 flex items-center gap-3 text-xs text-[#9A9A9A]">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/10 text-white font-mono text-[11px]">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                PACCAR MX-13 Verified
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/10 text-white font-mono text-[11px]">
                TORQ-Lock™ Enabled
              </span>
            </div>
          </div>

          {/* Capabilities */}
          <div className="space-y-3">
            <h5 className="text-xs font-semibold uppercase tracking-wider text-[#9A9A9A]">
              CAPABILITIES
            </h5>
            <ul className="space-y-2 text-sm text-[#9A9A9A]">
              <li><Link href="/diagnostics/TRQ-2026-0941/workflow" className="hover:text-white transition-colors">Bayesian Diagnosis</Link></li>
              <li><Link href="/diagnostics/TRQ-2026-0941" className="hover:text-white transition-colors">RAG Knowledge Base</Link></li>
              <li><Link href="/diagnostics/TRQ-2026-0941/workflow" className="hover:text-white transition-colors">Guided Testing</Link></li>
              <li><Link href="/settings" className="hover:text-white transition-colors">TORQ-Lock Validation</Link></li>
              <li><Link href="/fleet" className="hover:text-white transition-colors">Fleet Intelligence</Link></li>
            </ul>
          </div>

          {/* Project */}
          <div className="space-y-3">
            <h5 className="text-xs font-semibold uppercase tracking-wider text-[#9A9A9A]">
              PROJECT
            </h5>
            <ul className="space-y-2 text-sm text-[#9A9A9A]">
              <li><Link href="/dashboard" className="hover:text-white transition-colors">About TORQ</Link></li>
              <li><a href="#capabilities" className="hover:text-white transition-colors">Architecture & Specs</a></li>
              <li><Link href="/reports/TRQ-2026-0941" className="hover:text-white transition-colors">Sample Audit Report</Link></li>
              <li><a href="https://github.com/pujansonani/TORQ-Technician-Operational-Reasoning-Query-intelligence-" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors flex items-center gap-1"><span>GitHub Repository</span> <ArrowUpRight className="w-3 h-3" /></a></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-3">
            <h5 className="text-xs font-semibold uppercase tracking-wider text-[#9A9A9A]">
              CONTACT & REPO
            </h5>
            <div className="space-y-2 text-sm text-[#9A9A9A]">
              <p className="flex items-center gap-2">
                <GitBranch className="w-4 h-4 text-[#E5402C] shrink-0" />
                <a href="https://github.com/pujansonani/TORQ-Technician-Operational-Reasoning-Query-intelligence-" target="_blank" rel="noopener noreferrer" className="hover:underline">
                  pujansonani/TORQ
                </a>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#E5402C] shrink-0" />
                <span>paccar-hackathon@torq.ai</span>
              </p>
              <p className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-[#E5402C] shrink-0" />
                <span className="font-mono text-xs">Branch: SIDDHI</span>
              </p>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#9A9A9A]">
          <div>
            © 2026 TORQ — Paccar India Hackathon Team. All rights reserved.
          </div>
          <div className="flex items-center gap-6">
            <Link href="/dashboard" className="hover:text-white transition-colors">Diagnostic Hub</Link>
            <Link href="/fleet" className="hover:text-white transition-colors">Fleet Telemetry</Link>
            <Link href="/settings" className="hover:text-white transition-colors">System Settings</Link>
          </div>
        </div>

      </div>
    </footer>
  );
};
