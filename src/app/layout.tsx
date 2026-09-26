import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TORQ — AI Diagnostic Copilot for Truck Service Technicians",
  description: "AI Diagnostic Copilot for Truck Service Technicians, built for the Paccar India Hackathon. Evidence-based reasoning over SAE J1939 fault codes.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="bg-white">
      <body className="antialiased font-sans bg-[#F8FAFC] text-[#111827] selection:bg-[#E5402C]/15 selection:text-[#E5402C]">
        {children}
      </body>
    </html>
  );
}
