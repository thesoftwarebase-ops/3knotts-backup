"use client";

import { useEffect, useState } from "react";
import { subscribeBusy } from "@/lib/busy";

export default function BusyOverlay() {
  const [busy, setBusy] = useState({ on: false, message: "" });

  useEffect(() => subscribeBusy(setBusy), []);

  if (!busy.on) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed inset-0 z-[90] flex items-center justify-center bg-ink/60 p-4"
    >
      <div className="flex items-center gap-4 rounded-3xl border border-gold/60 bg-ivory px-6 py-5 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.6)]">
        <span aria-hidden="true" className="relative flex h-10 w-10 shrink-0">
          <span className="absolute inset-0 animate-spin rounded-full border-[3px] border-gold/25" />
          <span className="absolute inset-0 animate-spin rounded-full border-[3px] border-transparent border-t-gold [animation-duration:0.9s]" />
        </span>
        <p className="font-tagline text-2xl font-bold text-ink">{busy.message}</p>
      </div>
    </div>
  );
}
