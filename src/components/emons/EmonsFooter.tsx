import React from "react";
import Link from "next/link";
import { ArrowUpRight, ShieldCheck, MapPin, Mail, Phone } from "lucide-react";

export const EmonsFooter: React.FC = () => {
  return (
    <footer className="w-full bg-[#1A1A1A] text-white pt-16 pb-12 border-t border-white/10">
      <div className="max-w-[1280px] mx-auto px-6 space-y-12">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-[#E5402C] rounded-xl flex items-center justify-center text-white font-bold text-lg">
                <span className="italic font-serif font-black">E</span>
              </div>
              <span className="font-semibold text-2xl tracking-tight text-white">
                emons
              </span>
            </div>
            <p className="text-sm text-[#9A9A9A] max-w-sm leading-relaxed">
              Emons Spedition GmbH & Co. KG — Independent family-owned European freight forwarding, transport logistics and digital supply chain solutions since 1928.
            </p>
            <div className="pt-2 flex items-center gap-4 text-xs text-[#9A9A9A]">
              <span>ISO 9001 / 14001</span>
              <span>•</span>
              <span>HACCP Certified</span>
              <span>•</span>
              <span>Green Logistics</span>
            </div>
          </div>

          {/* Quick Links 1 */}
          <div className="space-y-3">
            <h5 className="text-xs font-semibold uppercase tracking-wider text-[#9A9A9A]">
              SERVICES
            </h5>
            <ul className="space-y-2 text-sm text-[#9A9A9A]">
              <li><a href="#services" className="hover:text-white transition-colors">Road Freight (FTL/LTL)</a></li>
              <li><a href="#services" className="hover:text-white transition-colors">Rail Cargo & Intermodal</a></li>
              <li><a href="#services" className="hover:text-white transition-colors">Air & Sea Logistics</a></li>
              <li><a href="#services" className="hover:text-white transition-colors">Customs Clearance</a></li>
              <li><a href="#services" className="hover:text-white transition-colors">Contract Warehousing</a></li>
            </ul>
          </div>

          {/* Quick Links 2 */}
          <div className="space-y-3">
            <h5 className="text-xs font-semibold uppercase tracking-wider text-[#9A9A9A]">
              COMPANY
            </h5>
            <ul className="space-y-2 text-sm text-[#9A9A9A]">
              <li><a href="#" className="hover:text-white transition-colors">About Emons</a></li>
              <li><a href="#" className="hover:text-white transition-colors">European Network</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Sustainability 2030</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Press & News</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Careers & Apprenticeship</a></li>
            </ul>
          </div>

          {/* Contact / Service Hub */}
          <div className="space-y-3">
            <h5 className="text-xs font-semibold uppercase tracking-wider text-[#9A9A9A]">
              HEADQUARTERS
            </h5>
            <div className="space-y-2 text-sm text-[#9A9A9A]">
              <p className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#E5402C] shrink-0 mt-0.5" />
                <span>Poll-Vingster Str. 107<br />51105 Köln, Germany</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#E5402C] shrink-0" />
                <span>+49 (0) 221 8283-0</span>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#E5402C] shrink-0" />
                <span>info@emons.de</span>
              </p>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#9A9A9A]">
          <div>
            © {new Date().getFullYear()} Emons Spedition GmbH & Co. KG. All rights reserved.
          </div>
          <div className="flex items-center gap-6">
            <Link href="/dashboard" className="text-[#E5402C] hover:underline flex items-center gap-1 font-medium">
              <span>Switch to TORQ Diagnostic Copilot</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Imprint</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Carriage (ADSp)</a>
          </div>
        </div>

      </div>
    </footer>
  );
};
