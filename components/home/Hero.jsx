"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { site } from "@/data/site";
import { mediaImage } from "@/lib/media";

// Full-bleed crossfading carousel. Motion is opacity + slow drift only
// (GPU-composited). Autoplay pauses on hover, touch and hidden tabs.
export default function Hero({ slides }) {
  const list = slides?.length ? slides : site.hero.slides;
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reduced, setReduced] = useState(false);
  const idleSince = useRef(Date.now());
  const touchStart = useRef(null);
  const n = list.length;

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const handler = (e) => setReduced(e.matches);
    if (typeof mq.addEventListener === "function") mq.addEventListener("change", handler);
    return () => {
      if (typeof mq.removeEventListener === "function") mq.removeEventListener("change", handler);
    };
  }, []);

  useEffect(() => {
    if (reduced || paused || n < 2) return;
    const id = setInterval(() => {
      if (document.hidden) return;
      if (Date.now() - idleSince.current < 3000) return;
      idleSince.current = Date.now();
      setActive((a) => (a + 1) % n);
    }, 1000);
    return () => clearInterval(id);
  }, [reduced, paused, n]);

  const go = (dir) => {
    idleSince.current = Date.now();
    setActive((a) => (a + dir + n) % n);
  };

  // Deliberate horizontal swipes only: a vertical scroll (or a tiny
  // movement) never changes the slide.
  const onTouchStart = (e) => {
    setPaused(true);
    const t = e.touches[0];
    touchStart.current = { x: t.clientX, y: t.clientY };
  };
  const onTouchEnd = (e) => {
    idleSince.current = Date.now();
    setPaused(false);
    if (!touchStart.current || n < 2) return;
    const t = e.changedTouches[0];
    const dx = t.clientX - touchStart.current.x;
    const dy = t.clientY - touchStart.current.y;
    touchStart.current = null;
    if (Math.abs(dx) < 60 || Math.abs(dx) < Math.abs(dy) * 1.5) return;
    go(dx < 0 ? 1 : -1);
  };

  const show = reduced ? [list[0]] : list;

  return (
    <section
      id={site.anchors.top}
      aria-label={site.a11y.hero}
      className="relative flex min-h-svh items-center justify-center overflow-hidden bg-ink"
        onTouchStart={() => setPaused(true)}
        onTouchEnd={() => {
          idleSince.current = Date.now();
          setPaused(false);
        }}
      >
      {show.map((s, i) => {
        const isActive = reduced || i === active;
        return (
          <div
            key={`${s.src}-${i}`}
            aria-hidden="true"
            className={`absolute inset-0 transition-opacity duration-1000 ease-out ${
              isActive ? "z-0 opacity-100" : "pointer-events-none z-0 opacity-0"
            }`}
          >
            <Image
              src={mediaImage(s.src)}
              alt=""
              fill
              priority={i === 0}
              loading={i === 0 ? undefined : "lazy"}
              sizes="100vw"
              className={`object-cover ${isActive && !reduced ? "showcase-drift" : ""}`}
            />
          </div>
        );
      })}

      {/* Readability grade + cinematic vignette */}
      <div aria-hidden="true" className="absolute inset-0 z-10 bg-gradient-to-b from-black/75 via-black/40 to-black/70" />
      <div aria-hidden="true" className="absolute inset-0 z-10 shadow-[inset_0_0_180px_rgba(0,0,0,0.6)]" />

      <div
        className="relative z-20 mx-auto max-w-3xl px-5 pb-24 pt-44 text-center sm:px-8 sm:pt-48"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => {
          idleSince.current = Date.now();
          setPaused(false);
        }}
        onTouchStart={() => setPaused(true)}
        onTouchEnd={() => {
          idleSince.current = Date.now();
          setPaused(false);
        }}
      >
        <h1 className="hero-entrance font-tagline text-5xl font-bold leading-[1.1] text-ivory sm:text-7xl">
          {site.tagline}
        </h1>

        <div className="hero-entrance-2 mt-6 flex items-center justify-center gap-3" aria-hidden="true">
          <span className="h-px w-16 bg-gradient-to-r from-transparent to-gold" />
          <span className="h-2 w-2 rotate-45 border border-gold bg-gold/30" />
          <span className="h-px w-16 bg-gradient-to-l from-transparent to-gold" />
        </div>

        <p className="hero-entrance-2 mx-auto mt-6 max-w-xl text-base leading-relaxed text-ivory/90 sm:text-lg">
          {site.hero.subtitle}
        </p>

        <div className="hero-entrance-2 mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href={site.hero.primaryCta.href}
            className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-gold px-8 py-4 text-center text-base font-bold text-ink shadow-[0_10px_36px_-8px_rgba(212,167,60,0.8)] transition-all hover:-translate-y-0.5 hover:shadow-[0_16px_44px_-8px_rgba(212,167,60,0.9)] sm:w-auto"
          >
            {site.hero.primaryCta.label}
            <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">→</span>
          </Link>
          <Link
            href={site.hero.secondaryCta.href}
            className="w-full rounded-full border border-ivory/50 bg-white/10 px-8 py-4 text-center text-base font-semibold text-ivory backdrop-blur-sm transition-all hover:-translate-y-0.5 hover:bg-white/20 sm:w-auto"
          >
            {site.hero.secondaryCta.label}
          </Link>
        </div>

        {!reduced && n > 1 ? (
          <div className="hero-entrance-2 mt-4 flex items-center justify-center gap-4">
            <div aria-hidden="true" className="h-0.5 w-24 overflow-hidden rounded-full bg-ivory/20 sm:w-40">
              <span key={active} className="hero-progress block h-full w-full bg-gold" />
            </div>
          </div>
        ) : null}
      </div>

      {!reduced && n > 1 ? (
        <div className="absolute right-4 top-1/2 z-30 flex -translate-y-1/2 flex-col gap-3 sm:right-8">
          <button
            type="button"
            onClick={() => go(-1)}
            aria-label={site.a11y.sliderPrev}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-ivory/40 text-xl text-ivory backdrop-blur-sm transition-all hover:scale-105 hover:border-gold hover:text-gold-soft active:scale-95"
          >
            <span aria-hidden="true">‹</span>
          </button>
          <button
            type="button"
            onClick={() => go(1)}
            aria-label={site.a11y.sliderNext}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-ivory/40 text-xl text-ivory backdrop-blur-sm transition-all hover:scale-105 hover:border-gold hover:text-gold-soft active:scale-95"
          >
            <span aria-hidden="true">›</span>
          </button>
        </div>
      ) : null}
    </section>
  );
}
