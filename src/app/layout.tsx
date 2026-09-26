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
    <html lang="en">
      <body className="antialiased font-sans bg-surface-subtle text-industrial-dark">
        {children}
      </body>
    </html>
  );
}
