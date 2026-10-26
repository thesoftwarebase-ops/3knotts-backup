"use client";

import { useCallback, useEffect, useState } from "react";
import { site } from "@/data/site";
import Reveal from "../ui/Reveal";
import SectionHeading from "../ui/SectionHeading";
import Corners from "../ui/Corners";
import { InstagramIcon } from "../ui/SocialIcons";

const SLIDE_MS = 7000;

export default function Testimonials({ items }) {
  const t = site.testimonials;
  const list = items ?? t.items;
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const n = list.length;

  const go = useCallback(
    (dir) => {
      setActive((a) => (a + dir + n) % n);
    },
    [n]
  );

  useEffect(() => {
    if (!n || paused) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setTimeout(() => setActive((a) => (a + 1) % n), SLIDE_MS);
    return () => clearTimeout(id);
  }, [paused, n, active]);

  return (
    <section aria-labelledby="testimonials-heading" className="relative overflow-hidden border-b border-frame/10 py-14 sm:py-20">
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-80 bg-[radial-gradient(ellipse_at_30%_-20%,rgba(126,37,48,0.045),transparent_65%)]" />
      <div aria-hidden="true" className="pointer-events-none absolute -right-[10%] top-1/2 h-[28rem] w-[28rem] -translate-y-1/2 opacity-[0.05] bg-[url('data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22200%22%20height%3D%22200%22%20viewBox%3D%220%200%20200%20200%22%3E%3Cpath%20d%3D%22M100%2020c0%2044-36%2080-80%2080%2044%200%2080%2036%2080%2080%200-44%2036-80%2080-80-44%200-80-36-80-80z%22%20fill%3D%22none%22%20stroke%3D%22%238C6D2A%22%20stroke-width%3D%221%22%2F%3E%3Ccircle%20cx%3D%22100%22%20cy%3D%22100%22%20r%3D%2220%22%20fill%3D%22none%22%20stroke%3D%22%238C6D2A%22%20stroke-width%3D%220.8%22%2F%3E%3C%2Fsvg%3E')] bg-contain bg-center" />

      <div className="relative mx-auto max-w-4xl px-5 sm:px-8">
        <SectionHeading id="testimonials-heading" heading={t.heading} intro={t.intro} />

        {n ? (
          <Reveal className="mt-10">
            <div
              className="relative overflow-hidden rounded-sm border border-frame/20 bg-charcoal/[0.06]"
              onMouseEnter={() => setPaused(true)}
              onMouseLeave={() => setPaused(false)}
              onTouchStart={() => setPaused(true)}
              onTouchEnd={() => setPaused(false)}
            >
              <Corners className="hidden sm:block" tone="border-frame/20" />
              <span
                aria-hidden="true"
                className="pointer-events-none absolute left-5 top-4 select-none font-heading text-[5rem] leading-none text-frame/[0.08] sm:left-8 sm:text-[6rem]"
              >
                &ldquo;
              </span>

              {/* Fixed-height stage — every slide crossfades in place, so
                  the card never jumps between quotes. */}
              <div className="relative min-h-[23rem] sm:min-h-[21rem]">
                {list.map((item, i) => {
                  const isActive = active === i;
                  const initials = item.name
                    .split(/[^A-Za-z]+/)
                    .filter(Boolean)
                    .slice(0, 2)
                    .map((w) => w[0].toUpperCase())
                    .join("");
                  return (
                    <figure
                      key={`${item.name}-${i}`}
                      aria-hidden={isActive ? undefined : true}
                      className={`absolute inset-0 flex flex-col items-center justify-center px-6 py-14 text-center transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] sm:px-16 ${
                        isActive
                          ? "translate-y-0 opacity-100"
                          : "pointer-events-none translate-y-3 opacity-0"
                      }`}
                    >
                      <span
                        aria-hidden="true"
                        data-scheme="wine"
                        className="inline-flex h-12 w-12 items-center justify-center border border-frame/35 bg-noir font-heading text-[12px] tracking-[0.14em] text-transparent"
                      >
                        <span className="wordmark">{initials}</span>
                      </span>

                      <blockquote className="mt-7 max-w-2xl text-[15px] font-normal leading-[2] text-paper/80 sm:text-[17px]">
                        {item.quote}
                      </blockquote>

                      <figcaption className="mt-8 flex flex-col items-center">
                        <span aria-hidden="true" className="h-px w-10 bg-brand" />
                        <p className="mt-4 font-heading text-[11px] tracking-[0.26em] text-paper">{item.name}</p>
                        {item.detail ? (
                          <p className="mt-2 text-[8.5px] font-medium uppercase tracking-[0.3em] text-paper/45">
                            {item.detail}
                          </p>
                        ) : null}
                        {item.insta ? (
                          <a
                            href={`${site.instaUrl}${item.insta}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={`@${item.insta} — ${site.a11y.instaProfile}`}
                            className="group/ig mt-4 inline-flex items-center gap-1.5 text-[10px] font-medium text-paper/50 transition-colors duration-300 hover:text-brand"
                          >
                            <InstagramIcon className="h-3.5 w-3.5 transition-transform duration-300 group-hover/ig:scale-110" />
                            <span>@{item.insta}</span>
                          </a>
                        ) : null}
                      </figcaption>
                    </figure>
                  );
                })}
              </div>

              {/* Controls */}
              <div className="relative flex items-center justify-center gap-5 border-t border-frame/15 px-5 py-5">
                <button
                  type="button"
                  onClick={() => go(-1)}
                  aria-label={site.a11y.sliderPrev}
                  className="inline-flex h-9 w-9 items-center justify-center border border-frame/25 text-base text-paper/70 transition-colors duration-300 hover:border-brand hover:text-brand active:scale-95"
                >
                  <span aria-hidden="true">‹</span>
                </button>

                <div className="flex items-center gap-2" role="tablist" aria-label={t.heading}>
                  {list.map((item, i) => (
                    <button
                      key={`${item.name}-dot-${i}`}
                      type="button"
                      role="tab"
                      aria-selected={active === i}
                      aria-label={`${i + 1} / ${n}`}
                      onClick={() => setActive(i)}
                      className={`h-px transition-all duration-500 ${
                        active === i ? "w-8 bg-brand" : "w-3 bg-frame/30 hover:bg-frame/60"
                      }`}
                    />
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => go(1)}
                  aria-label={site.a11y.sliderNext}
                  className="inline-flex h-9 w-9 items-center justify-center border border-frame/25 text-base text-paper/70 transition-colors duration-300 hover:border-brand hover:text-brand active:scale-95"
                >
                  <span aria-hidden="true">›</span>
                </button>

                <p aria-hidden="true" className="ml-1 font-heading text-[10px] tracking-[0.24em] text-paper/40">
                  {String(active + 1).padStart(2, "0")} / {String(n).padStart(2, "0")}
                </p>
              </div>
            </div>
          </Reveal>
        ) : (
          <Reveal className="mt-10">
            <div className="mx-auto max-w-2xl rounded-sm border border-dashed border-frame/30 px-6 py-14 text-center">
              <span aria-hidden="true" className="font-heading text-4xl leading-none text-frame/30">&ldquo;</span>
              <p className="mt-4 font-heading text-xl text-paper">{t.emptyHeading}</p>
              <p className="mx-auto mt-4 max-w-md text-[13px] leading-[1.9] text-paper/55">{t.emptyText}</p>
            </div>
          </Reveal>
        )}
      </div>
    </section>
  );
}
