import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { Nav } from "@/components/Nav";
import { DemoBanner } from "@/components/DemoBanner";

const geist = Geist({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SignalMiner — Garmin Discovery Workspace",
  description: "Discovery prioritization tool for recurring Garmin user pain themes and opportunity areas",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${geist.className} bg-white text-slate-900 min-h-screen antialiased`}>
        <Nav />
        <DemoBanner />
        <main className="max-w-6xl mx-auto px-6 py-12">{children}</main>
      </body>
    </html>
  );
}
