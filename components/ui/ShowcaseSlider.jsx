"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { site } from "@/data/site";
import { mediaImage } from "@/lib/media";

// Expanding-cards showcase. All motion is transform + opacity only
// (GPU-composited), so it stays smooth on phones: the deck never
// animates layout properties. Slides: { image, title, text, href?, cta? }.
export default function ShowcaseSlider({ items }) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const idleSince = useRef(Date.now());
  const n = items.length;
  if (!n) return null;

  const go = (dir) => {
    idleSince.current = Date.now();
    setActive((a) => (a + dir + n) % n);
  };

  // Autoplay: advance every 5s of idleness. Skipped for reduced motion,
  // hidden tabs, hover and touch holds. Any interaction restarts the clock.
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (paused) return;
    const id = setInterval(() => {
      if (document.hidden) return;
      if (Date.now() - idleSince.current < 5000) return;
      idleSince.current = Date.now();
      setActive((a) => (a + 1 + n) % n);
    }, 1000);
    return () => clearInterval(id);
  }, [paused, n]);
  const current = items[active];

  return (
    <div>
      <div
        className="relative h-[480px] overflow-hidden rounded-3xl border border-gold/50 bg-ink shadow-[0_30px_70px_-30px_rgba(11,59,60,0.6)] sm:h-[560px]"
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
        {items.map((s, i) => {
          const offset = (i - active + n) % n;
          const isActive = offset === 0;
          const parked = offset > 3;
          const tx = -4 + (offset - 1) * 32;
          return (
            <div
              key={`${s.image}-${i}`}
              onClick={() => {
                if (!isActive && !parked) {
                  idleSince.current = Date.now();
                  setActive(i);
                }
              }}
              aria-hidden={isActive ? undefined : true}
              style={
                isActive
                  ? { transform: "none", zIndex: 10 }
                  : parked
                    ? { opacity: 0 }
                    : { transform: `translateX(${tx}%) scale(0.35)`, zIndex: 30 - offset }
              }
              className={`absolute inset-0 origin-right transition-[transform,opacity] duration-500 ease-out ${
                isActive
                  ? "cursor-default opacity-100"
                  : parked
                    ? "pointer-events-none opacity-0"
                    : "cursor-pointer opacity-100"
              } ${!isActive ? "hidden sm:block" : ""}`}
            >
              <div
                className={`relative h-full w-full overflow-hidden ${
                  isActive
                    ? "rounded-3xl"
                    : "rounded-2xl border border-ivory/30 shadow-[0_18px_40px_rgba(0,0,0,0.5)]"
                }`}
              >
                <Image
                  src={mediaImage(s.image)}
                  alt=""
                  aria-hidden="true"
                  fill
                  loading={isActive ? "eager" : "lazy"}
                  sizes="(max-width: 640px) 100vw, 60vw"
                  className={`object-cover ${isActive ? "showcase-drift" : ""}`}
                />
                <span
                  aria-hidden="true"
                  className={`absolute inset-0 ${
                    isActive
                      ? "bg-gradient-to-t from-black/80 via-black/25 to-black/10"
                      : "bg-black/20"
                  }`}
                />
                {!isActive && !parked ? (
                  <span className="absolute inset-x-0 bottom-0 p-3">
                    <span className="block truncate font-tagline text-xl font-bold leading-tight text-ivory">
                      {s.title}
                    </span>
                  </span>
                ) : null}
              </div>
            </div>
          );
        })}

        {/* Active content */}
        <div key={`${current.image}-${active}`} className="absolute inset-x-0 bottom-0 z-30 p-6 sm:p-10">
          <p className="showcase-rise font-tagline text-4xl font-bold leading-tight text-ivory sm:text-6xl" style={{ animationDelay: "0ms" }}>
            {current.title}
          </p>
          <p className="showcase-rise mt-2 max-w-md text-[15px] leading-relaxed text-ivory/85 sm:text-base" style={{ animationDelay: "80ms" }}>
            {current.text}
          </p>
          {current.href ? (
            <Link
              href={current.href}
              className="showcase-rise mt-5 inline-block rounded-full bg-gold px-7 py-3 text-sm font-bold uppercase tracking-[0.12em] text-ink transition-transform hover:-translate-y-0.5"
              style={{ animationDelay: "160ms" }}
            >
              {current.cta || site.servicesPage.exploreLabel}
            </Link>
          ) : null}
        </div>

        {/* Controls */}
        <div className="absolute bottom-5 right-5 z-40 flex gap-2 sm:bottom-8 sm:right-8">
          <button
            type="button"
            onClick={() => go(-1)}
            aria-label={site.a11y.sliderPrev}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-gold/70 bg-black/40 text-xl text-gold-soft backdrop-blur-sm transition-all hover:scale-105 hover:bg-gold hover:text-ink active:scale-95"
          >
            <span aria-hidden="true">‹</span>
          </button>
          <button
            type="button"
            onClick={() => go(1)}
            aria-label={site.a11y.sliderNext}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-gold/70 bg-black/40 text-xl text-gold-soft backdrop-blur-sm transition-all hover:scale-105 hover:bg-gold hover:text-ink active:scale-95"
          >
            <span aria-hidden="true">›</span>
          </button>
        </div>
      </div>
    </div>
  );
}
