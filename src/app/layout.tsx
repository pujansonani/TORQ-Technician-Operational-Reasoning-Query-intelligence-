import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Emons — Your cargo. Our mission. Welcome to Emons.",
  description: "Modern European freight forwarding, transport logistics and digital supply chain solutions since 1928.",
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
