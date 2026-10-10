"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { site } from "@/data/site";

const PETALS = [
  "#D4A73C",
  "#14706A",
  "#5B2A4B",
  "#F1D78A",
  "#D4A73C",
  "#14706A",
  "#e8a2b8",
  "#F1D78A"
];

// Full-screen brand loader. Pure CSS animation (transform/opacity only),
// unmounts after fade. Text comes from site.js.
export default function SiteLoader() {
  const [leaving, setLeaving] = useState(false);
  const [gone, setGone] = useState(false);
  const pathname = usePathname();
  const firstMount = useRef(true);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const started = Date.now();
    const MIN = reduced ? 0 : 1200;
    const MAX = 3500;
    let finishTimer;
    let removeTimer;

    const finish = () => {
      const wait = Math.max(0, MIN - (Date.now() - started));
      finishTimer = setTimeout(() => {
        setLeaving(true);
        removeTimer = setTimeout(() => setGone(true), 500);
      }, wait);
    };

    if (document.readyState === "complete") {
      finish();
    } else {
      window.addEventListener("load", finish, { once: true });
      const maxTimer = setTimeout(finish, MAX);
      return () => {
        window.removeEventListener("load", finish);
        clearTimeout(maxTimer);
        clearTimeout(finishTimer);
        clearTimeout(removeTimer);
      };
    }
    return () => {
      clearTimeout(finishTimer);
      clearTimeout(removeTimer);
    };
  }, []);

  // Replay briefly on every page traversal (layout stays mounted).
  useEffect(() => {
    if (firstMount.current) {
      firstMount.current = false;
      return;
    }
    setGone(false);
    setLeaving(false);
    const hold = setTimeout(() => setLeaving(true), 900);
    const remove = setTimeout(() => setGone(true), 1400);
    return () => {
      clearTimeout(hold);
      clearTimeout(remove);
    };
  }, [pathname]);

  if (gone) return null;

  return (
    <div
      role="status"
      aria-label={site.loader.note}
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-ivory transition-opacity duration-500 ${
        leaving ? "pointer-events-none opacity-0" : "opacity-100"
      }`}
    >
      <div className="loader-flower relative h-32 w-32" aria-hidden="true">
        {PETALS.map((c, i) => (
          <span
            key={i}
            className="loader-petal absolute left-1/2 top-1/2 h-11 w-11"
            style={{
              backgroundColor: c,
              ["--r"]: `${i * 45}deg`,
              animationDelay: `${i * 90}ms`
            }}
          />
        ))}
        <span className="loader-core absolute left-1/2 top-1/2 h-7 w-7 rounded-full bg-gold shadow-[0_0_20px_rgba(212,167,60,0.8)]" />
      </div>

      <p className="mt-6 px-6 text-center font-tagline text-4xl font-bold text-plum">
        {site.name}
      </p>
      <p className="mt-1 px-6 text-center font-tagline text-2xl text-ink/70">
        {site.tagline}
      </p>
      <p className="mt-4 text-sm font-medium tracking-wide text-ink/50">
        {site.loader.note}
        <span className="loader-dot" style={{ animationDelay: "0ms" }}>.</span>
        <span className="loader-dot" style={{ animationDelay: "200ms" }}>.</span>
        <span className="loader-dot" style={{ animationDelay: "400ms" }}>.</span>
      </p>
    </div>
  );
}
