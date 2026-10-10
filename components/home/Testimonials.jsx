"use client";

import { useEffect, useRef, useState } from "react";
import { site } from "@/data/site";
import Reveal from "../ui/Reveal";
import SectionHeading from "../ui/SectionHeading";

export default function Testimonials({ items }) {
  const t = site.testimonials;
  const list = items ?? t.items;
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const idleSince = useRef(Date.now());
  const n = list.length;

  const go = (dir) => {
    idleSince.current = Date.now();
    setActive((a) => (a + dir + n) % n);
  };

  useEffect(() => {
    if (!n || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (paused) return;
    const id = setInterval(() => {
      if (document.hidden) return;
      if (Date.now() - idleSince.current < 6000) return;
      idleSince.current = Date.now();
      setActive((a) => (a + 1 + n) % n);
    }, 1000);
    return () => clearInterval(id);
  }, [paused, n]);

  return (
    <section aria-labelledby="testimonials-heading" className="bg-ivory pb-16 pt-3 sm:pb-24 sm:pt-8">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <SectionHeading id="testimonials-heading" heading={t.heading} intro={t.intro} tone="dark" />

        {n ? (
          <Reveal className="mt-10">
            <div
              className="relative overflow-hidden rounded-3xl border border-gold/50 bg-white/70 shadow-[0_24px_60px_-28px_rgba(11,59,60,0.4)]"
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
              <div
                className="flex transition-transform duration-500 ease-out"
                style={{ transform: `translateX(-${active * 100}%)` }}
              >
                {list.map((item, i) => {
                  const initials = item.name
                    .split(/[^A-Za-z]+/)
                    .filter(Boolean)
                    .slice(0, 2)
                    .map((w) => w[0].toUpperCase())
                    .join("");
                  return (
                    <figure
                      key={`${item.name}-${i}`}
                      aria-hidden={active === i ? undefined : true}
                      className="relative w-full shrink-0 overflow-hidden px-7 pb-10 pt-12 text-center sm:px-14"
                    >
                      <span
                        aria-hidden="true"
                        className="pointer-events-none absolute -top-6 left-1/2 -translate-x-1/2 select-none font-tagline text-[10rem] font-bold leading-none text-gold/15"
                      >
                        &ldquo;
                      </span>
                      <span
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-3 rounded-2xl border border-gold/30"
                      />
                      <span aria-hidden="true" className="absolute left-6 top-6 h-2 w-2 rotate-45 bg-gold/70" />
                      <span aria-hidden="true" className="absolute bottom-6 right-6 h-2 w-2 rotate-45 bg-gold/70" />
                      <span
                        aria-hidden="true"
                        className="relative mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-teal-deep font-tagline text-2xl font-bold text-gold-soft ring-2 ring-gold"
                      >
                        {initials}
                      </span>
                      <blockquote className="relative mx-auto mt-5 max-w-2xl font-tagline text-3xl font-bold leading-snug text-ink sm:text-4xl">
                        {item.quote}
                      </blockquote>
                      <figcaption className="relative mt-6">
                        <span aria-hidden="true" className="mx-auto block h-px w-16 bg-gold/70" />
                        <p className="mt-3 text-base font-bold text-plum">{item.name}</p>
                        {item.detail ? <p className="mt-0.5 text-sm text-ink/60">{item.detail}</p> : null}
                      </figcaption>
                    </figure>
                  );
                })}
              </div>

              <div className="flex items-center justify-center gap-4 px-6 pb-7">
                <button
                  type="button"
                  onClick={() => go(-1)}
                  aria-label={site.a11y.sliderPrev}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-gold/60 text-xl text-plum transition-all hover:scale-105 hover:bg-gold hover:text-ink active:scale-95"
                >
                  <span aria-hidden="true">‹</span>
                </button>
                <div className="flex items-center gap-2" role="tablist" aria-label={t.heading}>
                  {list.map((item, i) => (
                    <button
                      key={item.name}
                      type="button"
                      role="tab"
                      aria-selected={active === i}
                      aria-label={`${item.name} — ${i + 1}`}
                      onClick={() => {
                        idleSince.current = Date.now();
                        setActive(i);
                      }}
                      className={`h-2 rounded-full transition-all duration-300 ${
                        active === i ? "w-8 bg-gold" : "w-2 bg-gold/40 hover:bg-gold/70"
                      }`}
                    />
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => go(1)}
                  aria-label={site.a11y.sliderNext}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-gold/60 text-xl text-plum transition-all hover:scale-105 hover:bg-gold hover:text-ink active:scale-95"
                >
                  <span aria-hidden="true">›</span>
                </button>
                <p aria-hidden="true" className="ml-1 font-tagline text-xl font-bold text-plum/70">
                  {String(active + 1).padStart(2, "0")} / {String(n).padStart(2, "0")}
                </p>
              </div>
            </div>
          </Reveal>
        ) : (
          <Reveal className="mt-10">
            <div className="mx-auto max-w-2xl rounded-3xl border border-dashed border-gold bg-white/60 p-8 text-center sm:p-12">
              <span aria-hidden="true" className="font-tagline text-6xl font-bold leading-none text-gold/60">
                &ldquo;
              </span>
              <p className="mt-2 font-tagline text-3xl font-bold text-plum sm:text-4xl">
                {t.emptyHeading}
              </p>
              <p className="mx-auto mt-3 max-w-md text-base leading-relaxed text-ink/75">
                {t.emptyText}
              </p>
            </div>
          </Reveal>
        )}
      </div>
    </section>
  );
}
