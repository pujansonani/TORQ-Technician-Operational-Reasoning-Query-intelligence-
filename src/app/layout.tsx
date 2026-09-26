import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "TORQ — PACCAR AI Diagnostic Copilot",
  description: "AI Diagnostic Copilot for Truck Service Technicians. Diagnose with evidence. Repair with confidence.",
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
