"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { site } from "@/data/site";
import { mediaImage } from "@/lib/media";

const SLIDE_MS = 6000;

// Full-bleed crossfading carousel. Motion is opacity + a slow drift only
// (GPU-composited). The progress bar and the autoplay share one clock
// (SLIDE_MS), and both restart whenever the visitor interacts.
export default function Hero({ slides }) {
  const list = slides?.length ? slides : site.hero.slides;
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [cycle, setCycle] = useState(0);
  const [reduced, setReduced] = useState(false);
  const touchStart = useRef(null);
  const n = list.length;

  // The home page has no #enquire section (the form lives at /enquire).
  // Resolve that legacy hash to the real enquiry route.
  const primaryHref =
    site.hero.primaryCta.href.startsWith("#") && site.hero.primaryCta.href !== `#${site.anchors.top}`
      ? site.navCta.href
      : site.hero.primaryCta.href;

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
    const id = setTimeout(() => setActive((a) => (a + 1) % n), SLIDE_MS);
    return () => clearTimeout(id);
  }, [reduced, paused, n, active, cycle]);

  const restart = useCallback(() => {
    setCycle((c) => c + 1);
  }, []);

  const go = (dir) => {
    setActive((a) => (a + dir + n) % n);
    restart();
  };

  const goTo = (i) => {
    setActive(i);
    restart();
  };

  // Deliberate horizontal swipes only: a vertical scroll (or a tiny
  // movement) never changes the slide.
  const onTouchStart = (e) => {
    setPaused(true);
    const t = e.touches[0];
    touchStart.current = { x: t.clientX, y: t.clientY };
  };

  const onTouchEnd = (e) => {
    setPaused(false);
    restart();
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
      className="relative flex min-h-[100svh] items-center overflow-hidden bg-noir"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => {
        setPaused(false);
        restart();
      }}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {/* Slides */}
      {show.map((s, i) => {
        const isActive = reduced || i === active;
        return (
          <div
            key={`${s.src}-${i}`}
            aria-hidden="true"
            className={`absolute inset-0 transition-opacity duration-[1400ms] ease-out ${
              isActive ? "opacity-100" : "opacity-0"
            }`}
          >
            <Image
              src={mediaImage(s.src)}
              alt=""
              fill
              priority={i === 0}
              loading={i === 0 ? undefined : "lazy"}
              sizes="100vw"
              className={`object-cover opacity-[0.55] saturate-[0.85] ${isActive && !reduced ? "image-drift" : ""}`}
            />
          </div>
        );
      })}

      {/* Cinematic grade: black floor, ember bloom, vignette */}
      <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-r from-noir via-noir/85 to-noir/35" />
      <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-noir via-noir/40 to-noir/75" />
      <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(ellipse_at_72%_12%,rgba(248,248,248,0.05),transparent_55%)]" />
      <div aria-hidden="true" className="absolute inset-0 shadow-[inset_0_0_220px_rgba(0,0,0,0.9)]" />

      {/* Hairline frame */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-4 z-20 hidden border border-frame/15 sm:block sm:inset-6" />
      <span aria-hidden="true" className="pointer-events-none absolute left-4 top-4 z-20 hidden h-8 w-px bg-gradient-to-b from-frame/60 to-transparent sm:block sm:left-6 sm:top-6" />
      <span aria-hidden="true" className="pointer-events-none absolute left-4 top-4 z-20 hidden h-px w-8 bg-gradient-to-r from-frame/60 to-transparent sm:block sm:left-6 sm:top-6" />

      {/* Content */}
      <div className="relative z-30 mx-auto w-full max-w-6xl px-6 pb-36 pt-40 sm:px-10 sm:pb-40 sm:pt-44 lg:px-12">
        <div className="max-w-3xl">
          <p className="hero-rise flex items-center gap-3.5 text-[9px] font-semibold uppercase leading-none tracking-[0.42em] text-frame">
            <span aria-hidden="true" className="h-px w-9 bg-brand" />
            {site.addressParts.locality}
            <span aria-hidden="true" className="h-1 w-1 rotate-45 bg-golden/80" />
          </p>

          <h1 className="hero-rise-2 mt-9 font-heading text-[clamp(2.1rem,6.4vw,4.4rem)] leading-[1.06] text-paper">
            <span className="line-mask">
              <span className="line-inner" style={{ animationDelay: "120ms" }}>
                {site.tagline}
              </span>
            </span>
          </h1>

          <div className="hero-rise-3 mt-9 flex items-center gap-3" aria-hidden="true">
            <span className="h-px w-14 bg-gradient-to-r from-frame/70 to-transparent" />
            <span className="h-1.5 w-1.5 rotate-45 bg-brand shadow-[0_0_14px_rgba(232,80,64,0.9)]" />
            <span className="h-px w-24 bg-gradient-to-l from-frame/40 to-transparent" />
          </div>

          <p className="hero-rise-3 mt-8 max-w-xl text-[13.5px] font-normal leading-[1.95] text-paper/65 sm:text-[15px]">
            {site.hero.subtitle}
          </p>

          <div className="hero-rise-4 mt-11 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:gap-4">
            <Link href={primaryHref} className="btn btn-brand group">
              {site.hero.primaryCta.label}
              <span aria-hidden="true" className="transition-transform duration-500 group-hover:translate-x-1.5">
                →
              </span>
            </Link>
            <Link href={site.hero.secondaryCta.href} className="btn btn-ghost group">
              {site.hero.secondaryCta.label}
              <span aria-hidden="true" className="text-frame transition-transform duration-500 group-hover:translate-x-1.5">
                ↗
              </span>
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom rail: counter, progress, controls */}
      <div className="absolute inset-x-0 bottom-0 z-30">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 px-6 pb-8 sm:flex-row sm:items-end sm:justify-between sm:px-10 sm:pb-10 lg:px-12">
          <div className="flex items-center gap-5">
            {!reduced && n > 1 ? (
              <>
                <p className="font-heading text-[12px] leading-none tracking-[0.2em] text-paper">
                  {String(active + 1).padStart(2, "0")}
                  <span className="mx-2 text-frame/40">/</span>
                  <span className="text-frame/50">{String(n).padStart(2, "0")}</span>
                </p>
                <div aria-hidden="true" className="h-px w-28 overflow-hidden bg-frame/20 sm:w-40">
                  <span
                    key={`${active}-${cycle}`}
                    className="hero-progress block h-px w-full bg-gradient-to-r from-brand to-golden"
                    style={{
                      "--slide-ms": `${SLIDE_MS}ms`,
                      animationPlayState: paused ? "paused" : "running"
                    }}
                  />
                </div>
              </>
            ) : null}
          </div>

          <div className="flex items-center justify-between gap-6 sm:justify-end">
            {!reduced && n > 1 ? (
              <div className="flex items-center gap-2">
                {list.map((s, i) => (
                  <button
                    key={`${s.src}-dot-${i}`}
                    type="button"
                    onClick={() => goTo(i)}
                    aria-label={`${i + 1} / ${n}`}
                    aria-current={i === active ? "true" : undefined}
                    className={`h-px transition-all duration-500 ${
                      i === active ? "w-8 bg-brand" : "w-4 bg-frame/30 hover:bg-frame/60"
                    }`}
                  />
                ))}
              </div>
            ) : null}

            {!reduced && n > 1 ? (
              <div className="hidden items-center gap-2 sm:flex">
                <button
                  type="button"
                  onClick={() => go(-1)}
                  aria-label={site.a11y.sliderPrev}
                  className="inline-flex h-10 w-10 items-center justify-center border border-frame/30 text-lg text-paper transition-colors duration-300 hover:border-brand hover:bg-brand hover:text-noir active:scale-95"
                >
                  <span aria-hidden="true">‹</span>
                </button>
                <button
                  type="button"
                  onClick={() => go(1)}
                  aria-label={site.a11y.sliderNext}
                  className="inline-flex h-10 w-10 items-center justify-center border border-frame/30 text-lg text-paper transition-colors duration-300 hover:border-brand hover:bg-brand hover:text-noir active:scale-95"
                >
                  <span aria-hidden="true">›</span>
                </button>
              </div>
            ) : null}

          </div>
        </div>
      </div>
    </section>
  );
}
