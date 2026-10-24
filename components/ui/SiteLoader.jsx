"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { site } from "@/data/site";

const PARTICLES = [
  { size: 3, left: "30%", delay: 0, duration: 3.2 },
  { size: 2, left: "55%", delay: 0.8, duration: 2.8 },
  { size: 4, left: "70%", delay: 1.6, duration: 3.6 },
  { size: 2, left: "40%", delay: 2.2, duration: 3.0 },
  { size: 3, left: "62%", delay: 0.4, duration: 3.4 },
];

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
      {/* Logo showcase */}
      <div className="relative flex items-center justify-center" aria-hidden="true">
        {/* Large warm glow */}
        <div className="loader-glow absolute h-56 w-56 rounded-full bg-brand/10 blur-3xl" />

        {/* Floating ember particles */}
        {PARTICLES.map((p, i) => (
          <span
            key={i}
            className="loader-ember absolute bottom-0 rounded-full bg-golden"
            style={{
              width: p.size,
              height: p.size,
              left: p.left,
              opacity: 0,
              animation: `ember-rise ${p.duration}s ease-out ${p.delay}s infinite`,
            }}
          />
        ))}

        {/* Outer ring — largest, thinnest */}
        <svg className="loader-ring-reverse absolute h-56 w-56" viewBox="0 0 224 224" fill="none">
          <circle
            cx="112"
            cy="112"
            r="108"
            stroke="#D2AE90"
            strokeWidth="0.5"
            strokeLinecap="round"
            strokeDasharray="679"
            strokeDashoffset="679"
            opacity="0.2"
            className="loader-ring-draw-slow"
          />
        </svg>

        {/* Middle ring — golden gradient, main feature */}
        <svg className="loader-ring absolute h-48 w-48" viewBox="0 0 192 192" fill="none">
          <circle
            cx="96"
            cy="96"
            r="92"
            stroke="url(#loader-grad)"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeDasharray="578"
            strokeDashoffset="578"
            className="loader-ring-draw"
          />
          <defs>
            <linearGradient id="loader-grad" x1="0" y1="0" x2="192" y2="192">
              <stop offset="0%" stopColor="#E85040" stopOpacity="1" />
              <stop offset="35%" stopColor="#FCCC30" stopOpacity="0.9" />
              <stop offset="65%" stopColor="#D2AE90" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#E85040" stopOpacity="1" />
            </linearGradient>
          </defs>
        </svg>

        {/* Inner ring — brand red, tight around logo */}
        <svg className="loader-ring absolute h-40 w-40" viewBox="0 0 160 160" fill="none" style={{ animationDuration: "8s" }}>
          <circle
            cx="80"
            cy="80"
            r="76"
            stroke="#E85040"
            strokeWidth="0.8"
            strokeLinecap="round"
            strokeDasharray="478"
            strokeDashoffset="478"
            opacity="0.5"
            className="loader-ring-draw-inner"
          />
        </svg>

        {/* Orbiting shimmer dot — travels along the middle ring */}
        <div className="loader-orbit absolute h-48 w-48">
          <span className="loader-shimmer absolute -top-[3px] left-1/2 -ml-[3px] h-[6px] w-[6px] rounded-full bg-golden shadow-[0_0_8px_rgba(252,204,48,0.8)]" />
        </div>

        {/* The logo — big and prominent */}
        <div className="loader-logo relative z-10 flex h-32 w-32 items-center justify-center overflow-hidden rounded-full border border-gold/20 shadow-[0_0_60px_rgba(232,80,64,0.18)] sm:h-36 sm:w-36">
          <img
            src={site.logoSm}
            alt={site.logoAlt}
            className="h-full w-full object-cover"
          />
          {/* Shimmer sweep across the logo */}
          <div className="loader-shimmer-sweep absolute inset-0 rounded-full" />
        </div>
      </div>

      {/* Brand name */}
      <p className="loader-text-up mt-10 px-6 text-center font-heading text-[2rem] leading-none text-transparent sm:text-[2.6rem]">
        <span className="wordmark">{site.name}</span>
      </p>

      {/* Tagline */}
      <p className="loader-text-up mt-4 px-6 text-center text-[9px] font-semibold uppercase leading-none tracking-[0.4em] text-frame/70" style={{ animationDelay: "120ms" }}>
        {site.tagline}
      </p>

      {/* Progress bar */}
      <div aria-hidden="true" className="loader-text-up relative mt-9 h-px w-44 overflow-hidden bg-charcoal/40" style={{ animationDelay: "200ms" }}>
        <div className="loader-bar h-px w-full bg-gradient-to-r from-transparent via-brand to-transparent" />
      </div>
    </div>
  );
}
