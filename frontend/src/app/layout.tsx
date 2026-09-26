import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TORQ — AI Diagnostic Copilot",
  description:
    "AI-powered diagnostic copilot for truck service technicians. Systematic, evidence-based fault diagnosis.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-surface">
        {/* Header */}
        <header className="sticky top-0 z-50 bg-dark border-b border-dark-200 shadow-lg">
          <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
            {/* Logo */}
            <a href="/" className="flex items-center gap-3 group">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary to-primary-700 flex items-center justify-center shadow-glow">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
                </svg>
              </div>
              <div>
                <span className="text-white font-bold text-lg tracking-tight group-hover:text-primary-300 transition-colors">
                  TORQ
                </span>
                <span className="hidden sm:inline text-dark-300 text-sm ml-2">
                  AI Diagnostic Copilot
                </span>
              </div>
            </a>

            {/* Nav */}
            <nav className="flex items-center gap-4">
              <a
                href="/"
                className="text-sm text-surface-400 hover:text-white transition-colors px-3 py-2 rounded-md hover:bg-dark-100"
              >
                Dashboard
              </a>
              <div className="demo-badge">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 9v4M12 17h.01M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                </svg>
                Demo Data
              </div>
            </nav>
          </div>
        </header>

        {/* Main content */}
        <main className="max-w-7xl mx-auto px-6 py-8">{children}</main>

        {/* Footer */}
        <footer className="border-t border-surface-300 mt-auto">
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between text-xs text-surface-500">
            <span>TORQ v0.1.0 — Hackathon MVP</span>
            <span>Paccar Hackathon 2026</span>
          </div>
        </footer>
      </body>
    </html>
  );
}
