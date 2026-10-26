"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { site } from "@/data/site";
import { mediaImage } from "@/lib/media";

// Expanding-cards showcase. All motion is transform + opacity only
// (GPU-composited), so it stays smooth on phones. Slides:
// { image, title, text, href?, cta? }.
// variant="card" shrinks the frame for inside ServiceCard cells.
// isolate={true} stops click events from bubbling further up.
export default function ShowcaseSlider({ items, variant = "page", isolate = false }) {
  const isCard = variant === "card";
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const idleSince = useRef(Date.now());
  const n = items.length;
  if (!n) return null;

  const go = (dir) => {
    idleSince.current = Date.now();
    setActive((a) => (a + dir + n) % n);
  };

  // Autoplay: advance after 6s of idleness. Skipped for reduced motion,
  // hidden tabs, hover and touch holds. Any interaction restarts the clock.
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (paused) return;
    const id = setInterval(() => {
      if (document.hidden) return;
      if (Date.now() - idleSince.current < 6000) return;
      idleSince.current = Date.now();
      setActive((a) => (a + 1 + n) % n);
    }, 1000);
    return () => clearInterval(id);
  }, [paused, n]);

  const current = items[active];

  return (
    <div data-scheme="wine" onClick={isolate ? (e) => e.stopPropagation() : undefined}>
      <div
        className={
          isCard
            ? "relative h-[400px] overflow-hidden bg-noir sm:h-[460px]"
            : "relative h-[460px] overflow-hidden rounded-sm border border-frame/25 bg-noir sm:h-[580px]"
        }
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
              className={`absolute inset-0 origin-right transition-[transform,opacity] duration-[650ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
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
                    ? "rounded-sm"
                    : "rounded-sm border border-frame/30 shadow-[0_24px_60px_rgba(0,0,0,0.7)]"
                }`}
              >
                <Image
                  src={mediaImage(s.image)}
                  alt=""
                  aria-hidden="true"
                  fill
                  loading={isActive ? "eager" : "lazy"}
                  sizes="(max-width: 640px) 100vw, 60vw"
                  className={`object-cover opacity-90 ${isActive ? "image-drift" : ""}`}
                />
                <span
                  aria-hidden="true"
                  className={`absolute inset-0 ${
                    isActive
                      ? "bg-gradient-to-t from-noir via-noir/35 to-noir/25"
                      : "bg-wine/45"
                  }`}
                />
                {!isActive && !parked ? (
                  <span className="absolute inset-x-0 bottom-0 p-4">
                    <span className="block truncate font-heading text-[13px] leading-tight text-paper/90">
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
          <div aria-hidden="true" className="mb-5 h-px w-14 bg-brand" />
          <p
            className={`showcase-rise font-heading font-semibold leading-[1.2] text-paper ${
              isCard ? "text-xl sm:text-2xl" : "text-[clamp(1.6rem,4vw,2.9rem)]"
            }`}
          >
            {current.title}
          </p>
          {!isCard && current.text ? (
            <p
              className="showcase-rise mt-4 max-w-lg text-[13px] leading-[1.85] text-paper/60 sm:text-[14px]"
              style={{ animationDelay: "80ms" }}
            >
              {current.text}
            </p>
          ) : null}
          {current.href ? (
            <Link
              href={current.href}
              className="showcase-rise btn btn-brand mt-7 px-6 py-3 text-[10px]"
              style={{ animationDelay: "160ms" }}
            >
              {current.cta || site.servicesPage.exploreLabel}
              <span aria-hidden="true">→</span>
            </Link>
          ) : null}
        </div>

        {/* Counter */}
        {n > 1 ? (
          <p
            aria-hidden="true"
            className="absolute left-6 top-6 z-40 text-[10px] font-semibold uppercase tracking-[0.3em] text-frame/80 sm:left-10 sm:top-10"
          >
            {String(active + 1).padStart(2, "0")} / {String(n).padStart(2, "0")}
          </p>
        ) : null}

        {/* Controls — pointless on a one-slide deck */}
        {n > 1 ? (
          <div className="absolute bottom-5 right-5 z-40 flex gap-2 sm:bottom-8 sm:right-8">
            <button
              type="button"
              onClick={() => go(-1)}
              aria-label={site.a11y.sliderPrev}
              className="inline-flex h-11 w-11 items-center justify-center rounded-sm border border-frame/35 bg-noir/60 text-xl text-paper backdrop-blur-sm transition-all duration-300 hover:border-golden hover:bg-golden hover:text-wine active:scale-95"
            >
              <span aria-hidden="true">‹</span>
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              aria-label={site.a11y.sliderNext}
              className="inline-flex h-11 w-11 items-center justify-center rounded-sm border border-frame/35 bg-noir/60 text-xl text-paper backdrop-blur-sm transition-all duration-300 hover:border-golden hover:bg-golden hover:text-wine active:scale-95"
            >
              <span aria-hidden="true">›</span>
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}
