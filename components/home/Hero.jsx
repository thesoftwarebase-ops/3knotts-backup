"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { site } from "@/data/site";
import { mediaImage } from "@/lib/media";

const SLIDE_DURATION = 8000; // 8 seconds per video

// Full-bleed video carousel. Each video plays for max 8 seconds, then advances.
// Subtle left overlay for text readability, videos are bright and vibrant.
export default function Hero({ slides, tagline: heroTagline, brand }) {
  // Filter out empty slides (no src) - only use slides with actual videos
  const filteredSlides = slides?.filter(s => s.src) || [];
  const list = filteredSlides.length ? filteredSlides : site.hero.slides.filter(s => s.src);
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [cycle, setCycle] = useState(0);
  const [reduced, setReduced] = useState(false);
  const touchStart = useRef(null);
  const videoRefs = useRef([]);
  const n = list.length;

  // Read tagline from hero CMS data, fall back to site defaults
  const taglinePrefix = heroTagline?.prefix || site.taglinePrefix;
  const taglineSuffix = heroTagline?.suffix || site.taglineSuffix;
  const taglineRotations = (heroTagline?.rotations?.length ? heroTagline.rotations : null) || site.taglineRotations;

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

  // Reset video to start when it becomes active
  useEffect(() => {
    const video = videoRefs.current[active];
    if (video) {
      video.currentTime = 0;
      video.play().catch(() => {});
    }
  }, [active, cycle]);

  // Advance to next video after 8 seconds OR when video ends (whichever comes first)
  useEffect(() => {
    if (reduced || paused || n < 2) return;
    const video = videoRefs.current[active];
    
    // Timer-based advance (8 seconds)
    const timerId = setTimeout(() => {
      setActive((a) => (a + 1) % n);
      setCycle((c) => c + 1);
    }, SLIDE_DURATION);
    
    // Event-based advance (when video ends)
    const handleEnded = () => {
      clearTimeout(timerId);
      setActive((a) => (a + 1) % n);
      setCycle((c) => c + 1);
    };
    
    if (video) {
      video.addEventListener("ended", handleEnded);
    }
    
    return () => {
      clearTimeout(timerId);
      if (video) {
        video.removeEventListener("ended", handleEnded);
      }
    };
  }, [reduced, paused, n, active, cycle]);

  const restart = useCallback(() => {
    setCycle((c) => c + 1);
    const video = videoRefs.current[active];
    if (video) {
      video.currentTime = 0;
      video.play().catch(() => {});
    }
  }, [active]);

  const go = (dir) => {
    setActive((a) => (a + dir + n) % n);
    restart();
  };

  const goTo = (i) => {
    setActive(i);
    restart();
  };

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
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {/* Full-bleed video background - bright and vibrant */}
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
            <video
              ref={(el) => (videoRefs.current[i] = el)}
              src={mediaImage(s.src)}
              autoPlay
              muted
              loop={!isActive}
              playsInline
              className={`h-full w-full object-cover brightness-[1.3] saturate-[1.15] contrast-[1.05] ${
                isActive && !reduced ? "image-drift" : ""
              }`}
            />
          </div>
        );
      })}

      {/* Left side background overlay for text - stronger but still shows video */}
      <div aria-hidden="true" className="absolute inset-y-0 left-0 w-full lg:w-3/5 bg-gradient-to-r from-noir/80 via-noir/60 to-transparent" />
      <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-noir/50 via-transparent to-noir/30" />
      <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_50%,rgba(0,0,0,0.2),transparent_70%)]" />

      {/* Hairline frame */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-4 z-20 hidden border border-frame/15 sm:block sm:inset-6" />
      <span aria-hidden="true" className="pointer-events-none absolute left-4 top-4 z-20 hidden h-8 w-px bg-gradient-to-b from-frame/60 to-transparent sm:block sm:left-6 sm:top-6" />
      <span aria-hidden="true" className="pointer-events-none absolute left-4 top-4 z-20 hidden h-px w-8 bg-gradient-to-r from-frame/60 to-transparent sm:block sm:left-6 sm:top-6" />

      {/* Content */}
      <div className="relative z-30 mx-auto w-full max-w-6xl px-6 pb-36 pt-40 sm:px-10 sm:pb-40 sm:pt-44 lg:px-12">
        <div className="max-w-3xl">
          <p className="hero-rise flex items-center gap-3.5 text-[9px] font-semibold uppercase leading-none tracking-[0.42em] text-paper drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
            <span aria-hidden="true" className="h-px w-9 bg-brand" />
            {site.addressParts.locality}
            <span aria-hidden="true" className="h-1 w-1 rotate-45 bg-golden/80" />
          </p>

          <h1 className="hero-rise-2 mt-9 font-heading text-[clamp(2.1rem,6.4vw,4.4rem)] leading-[1.06] text-paper drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)]">
            <span className="line-mask">
              <span className="line-inner" style={{ animationDelay: "120ms" }}>
                <span className="block">{taglinePrefix}</span>
                <span className="relative inline-block my-2 mx-3">
                  <span className="flip-word">
                    {taglineRotations.map((word, i) => (
                      <span key={word} className="flip-word-inner" style={{ animationDelay: `${i * 2.4}s` }}>
                        {word}
                      </span>
                    ))}
                  </span>
                </span>
                <span className="block">{taglineSuffix}</span>
              </span>
            </span>
          </h1>

          <div className="hero-rise-3 mt-9 flex items-center gap-3" aria-hidden="true">
            <span className="h-px w-14 bg-gradient-to-r from-frame/70 to-transparent" />
            <span className="h-1.5 w-1.5 rotate-45 bg-brand shadow-[0_0_14px_rgba(232,80,64,0.9)]" />
            <span className="h-px w-24 bg-gradient-to-l from-frame/40 to-transparent" />
          </div>

          <p className="hero-rise-3 mt-8 max-w-xl text-[13.5px] font-normal leading-[1.95] text-paper/90 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] sm:text-[15px]">
            {site.hero.subtitle}
          </p>

          <div className="hero-rise-4 mt-11 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:gap-4">
            <Link href={primaryHref} className="btn btn-brand group shadow-[0_8px_24px_rgba(232,80,64,0.4)]">
              {site.hero.primaryCta.label}
              <span aria-hidden="true" className="transition-transform duration-500 group-hover:translate-x-1.5">
                →
              </span>
            </Link>
            <Link href={site.hero.secondaryCta.href} className="btn btn-ghost group backdrop-blur-sm">
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
                <p className="font-heading text-[12px] leading-none tracking-[0.2em] text-paper drop-shadow-[0_2px_6px_rgba(0,0,0,0.8)]">
                  {String(active + 1).padStart(2, "0")}
                  <span className="mx-2 text-frame/40">/</span>
                  <span className="text-frame/50">{String(n).padStart(2, "0")}</span>
                </p>
                <div aria-hidden="true" className="h-px w-28 overflow-hidden bg-frame/20 sm:w-40">
                  <span
                    key={`${active}-${cycle}`}
                    className="hero-progress block h-px w-full bg-gradient-to-r from-brand to-golden"
                    style={{
                      "--slide-ms": `6000ms`,
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
                  className="inline-flex h-10 w-10 items-center justify-center border border-frame/30 text-lg text-paper backdrop-blur-sm transition-colors duration-300 hover:border-brand hover:bg-brand hover:text-noir active:scale-95"
                >
                  <span aria-hidden="true">‹</span>
                </button>
                <button
                  type="button"
                  onClick={() => go(1)}
                  aria-label={site.a11y.sliderNext}
                  className="inline-flex h-10 w-10 items-center justify-center border border-frame/30 text-lg text-paper backdrop-blur-sm transition-colors duration-300 hover:border-brand hover:bg-brand hover:text-noir active:scale-95"
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
