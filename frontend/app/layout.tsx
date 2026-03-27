import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { Nav } from "@/components/Nav";

const geist = Geist({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SignalMiner — Garmin Discovery Workspace",
  description: "Discovery prioritization tool for recurring Garmin user pain themes and opportunity areas",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className={`${geist.className} bg-slate-950 text-slate-100 min-h-screen antialiased`}>
        <Nav />
        <main className="max-w-6xl mx-auto px-6 py-8">{children}</main>
      </body>
    </html>
  );
}
