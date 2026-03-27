"use client";

import { useEffect, useState } from "react";
import { dataStatus } from "@/lib/api";

export function DemoBanner() {
  const [show, setShow] = useState(false);
  const [date, setDate] = useState("");

  useEffect(() => {
    // Check after a short delay to let the first fetch settle
    const t = setTimeout(() => {
      if (dataStatus.isDemo) {
        setShow(true);
        setDate(
          new Date("2026-03-26").toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })
        );
      }
    }, 1500);
    return () => clearTimeout(t);
  }, []);

  if (!show) return null;

  return (
    <div className="bg-slate-900 border-b border-slate-800 px-6 py-2">
      <p className="text-xs text-slate-500 text-center">
        Showing bundled snapshot data for demo purposes
        {date && <> · Last updated: {date}</>}
      </p>
    </div>
  );
}
