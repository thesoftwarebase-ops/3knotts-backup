"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { site } from "@/data/site";

const PETALS = ["#E85040", "#CC6C42", "#FCCC30", "#D2AE90", "#B82820", "#E85040", "#CC6C42", "#FCCC30"];

// Full-screen brand curtain. Pure CSS animation (transform/opacity only).
// The first load waits for the document; later navigations get a quick
// 620ms curtain instead of a wall of black.
export default function SiteLoader() {
  const [leaving, setLeaving] = useState(false);
  const [gone, setGone] = useState(false);
  const pathname = usePathname();
  const firstMount = useRef(true);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const started = Date.now();
    const MIN = reduced ? 0 : 1000;
    const MAX = 3200;
    let finishTimer;
    let removeTimer;

    const finish = () => {
      const wait = Math.max(0, MIN - (Date.now() - started));
      finishTimer = setTimeout(() => {
        setLeaving(true);
        removeTimer = setTimeout(() => setGone(true), 480);
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

  // A short curtain on every page traversal (the layout stays mounted).
  useEffect(() => {
    if (firstMount.current) {
      firstMount.current = false;
      return;
    }
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    setGone(false);
    setLeaving(false);
    const hold = setTimeout(() => setLeaving(true), 240);
    const remove = setTimeout(() => setGone(true), 620);
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
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-noir transition-opacity duration-[480ms] ease-out ${
        leaving ? "pointer-events-none opacity-0" : "opacity-100"
      }`}
    >
      <div className="relative h-28 w-28" aria-hidden="true">
        {PETALS.map((c, i) => (
          <span
            key={i}
            className="loader-petal absolute left-1/2 top-1/2 h-10 w-10"
            style={{
              backgroundColor: c,
              ["--r"]: `${i * 45}deg`,
              animationDelay: `${i * 80}ms`
            }}
          />
        ))}
        <span className="loader-core absolute left-1/2 top-1/2 h-6 w-6 rounded-full bg-brand shadow-[0_0_26px_rgba(232,80,64,0.9)]" />
      </div>

      <p className="mt-8 px-6 text-center font-heading text-3xl leading-none text-transparent sm:text-4xl">
        <span className="wordmark">{site.name}</span>
      </p>
      <p className="mt-4 px-6 text-center text-[9px] font-semibold uppercase leading-none tracking-[0.4em] text-frame/80">
        {site.tagline}
      </p>
      <div aria-hidden="true" className="mt-7 h-px w-40 overflow-hidden bg-charcoal/50">
        <div className="loader-bar h-px w-full bg-gradient-to-r from-brand via-ember to-golden" />
      </div>
      <p className="mt-6 text-[9px] font-medium uppercase tracking-[0.28em] text-paper/30">
        {site.loader.note}
        <span className="loader-dot" style={{ animationDelay: "0ms" }}>.</span>
        <span className="loader-dot" style={{ animationDelay: "200ms" }}>.</span>
        <span className="loader-dot" style={{ animationDelay: "400ms" }}>.</span>
      </p>
    </div>
  );
}
