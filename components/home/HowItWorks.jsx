"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef } from "react";
import SectionHeading from "../ui/SectionHeading";
import { site } from "@/data/site";

// STRICT WIRE GEOMETRY — no DOM measuring, no guessed offsets.
// Desktop rows are fixed: 400px tall, 80px gaps, two equal columns.
// Card cells fill their column exactly with symmetric 24px margins,
// so every anchor point is an exact constant.
const ROW_H = 500;
const GAP = 140;
const COLS = { left: 25, mid: 50, right: 75 }; // x in % of list width
const EDGE_Y = ROW_H / 2; // 200 — vertical center of a row
const BASE_Y = ROW_H; // 400 — card fills its cell exactly, bottom edge = row bottom
const DROP = 60; // vertical drop out of a card bottom before curving across
const ENTER_RUN = 110; // horizontal approach run into the next card's edge

// Segment styles for the rich step copy. Words themselves live in site.js.
const RICH_COLORS = { plum: "text-plum", teal: "text-teal-bright", gold: "text-amber-700" };

function cubicAt(p0, c1, c2, p3, t) {
  const u = 1 - t;
  return {
    x: u * u * u * p0.x + 3 * u * u * t * c1.x + 3 * u * t * t * c2.x + t * t * t * p3.x,
    y: u * u * u * p0.y + 3 * u * u * t * c1.y + 3 * u * t * t * c2.y + t * t * t * p3.y
  };
}

export default function HowItWorks({ steps }) {
  const t = site.sections.how;
  const list = steps ?? site.steps;
  const count = list.length;
  const listRef = useRef(null);
  const desktopDotRef = useRef(null);
  const mobileDotRef = useRef(null);

  // Pure geometry from constants above. Adding cards extends it by construction.
  const wire = useMemo(() => {
    const listH = count * ROW_H + (count - 1) * GAP;
    const X = (pct) => (pct / 100) * 1000;
    let d = "";
    const nodes = [];
    const samples = [];
    let total = 0;
    for (let i = 0; i < count - 1; i++) {
      // Segment i: bottom-center of card i → facing edge-center of card i+1.
      // Card i sits left on even rows, right on odd rows; card i+1 is
      // always on the opposite side, one row lower.
      const rowTop = i * (ROW_H + GAP);
      const nextTop = (i + 1) * (ROW_H + GAP);
      const even = i % 2 === 0;
      const sxPct = even ? COLS.left : COLS.right;
      const p0 = { x: X(sxPct), y: rowTop + BASE_Y };
      const p3 = { x: X(COLS.mid), y: nextTop + EDGE_Y };
      const c1 = { x: p0.x, y: p0.y + DROP };
      const c2 = { x: p3.x + (even ? -ENTER_RUN : ENTER_RUN), y: p3.y };
      d += `${d ? " " : ""}M ${p0.x} ${p0.y} C ${c1.x} ${c1.y}, ${c2.x} ${c2.y}, ${p3.x} ${p3.y}`;
      nodes.push(
        { left: `${sxPct}%`, top: p0.y },
        { left: `${COLS.mid}%`, top: p3.y }
      );
      let prev = p0;
      for (let k = 1; k <= 40; k++) {
        const p = cubicAt(p0, c1, c2, p3, k / 40);
        total += Math.hypot(p.x - prev.x, p.y - prev.y);
        samples.push({ x: p.x, y: p.y, at: total });
        prev = p;
      }
    }
    return { d, nodes, samples, total, listH };
  }, [count]);

  // Eased dot: every frame the dot glides toward the live scroll target,
  // so motion stays buttery without losing sync with the viewport.
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    let cur = -1;
    // GPU path: dots ride on transform only — never touch left/top per frame.
    const setDot = (ref, x, y) => {
      const el = ref.current;
      if (!el) return;
      el.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0) translate(-50%, -50%)`;
    };
    const frame = () => {
      raf = requestAnimationFrame(frame);
      const list = listRef.current;
      if (!list || !wire.total || !wire.samples.length) return;
      const rect = list.getBoundingClientRect();
      const vh = window.innerHeight;
      if (rect.bottom < -vh || rect.top > vh * 2) return; // off-screen: rest
      // Anchor progress to the wire itself on desktop (p=0 when the wire's
      // first joint sits at the viewport focus line, p=1 at its last joint);
      // simple list mapping on mobile where the rail runs straight.
      const desktopView = window.innerWidth >= 768;
      let p;
      if (desktopView) {
        const first = wire.samples[0];
        const last = wire.samples[wire.samples.length - 1];
        const scaleY = rect.height / wire.listH;
        const topEdge = rect.top + first.y * scaleY;
        const botEdge = rect.top + last.y * scaleY;
        const focus = vh * 0.55;
        p = Math.min(1, Math.max(0, (focus - topEdge) / Math.max(1, botEdge - topEdge)));
      } else {
        p = Math.min(1, Math.max(0, (vh * 0.55 - rect.top) / Math.max(1, rect.height)));
      }
      if (desktopView) {
        const target = p * wire.total;
        if (cur < 0) cur = target;
        cur += (target - cur) * 0.25;
        if (Math.abs(target - cur) < 0.25) cur = target;
        let s = wire.samples[wire.samples.length - 1];
        for (let i = 0; i < wire.samples.length; i++) {
          if (wire.samples[i].at >= cur) {
            s = wire.samples[i];
            break;
          }
        }
        setDot(desktopDotRef, (s.x / 1000) * rect.width, (s.y / wire.listH) * rect.height);
      } else {
        setDot(mobileDotRef, 20, p * rect.height);
      }
    };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [wire]);

  return (
    <section aria-labelledby="how-heading" className="bg-white py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading id="how-heading" heading={t.heading} intro={t.intro} tone="dark" divider={false} />

        <div className="mt-12">
            <ol ref={listRef} className="relative flex flex-col gap-16 md:gap-[140px]">
            {/* Desktop snake wire — strict viewBox geometry */}
            <svg
              aria-hidden="true"
              viewBox={`0 0 1000 ${wire.listH}`}
              preserveAspectRatio="none"
              className="pointer-events-none absolute inset-0 hidden h-full w-full md:block"
            >
              {wire.d ? (
                <path
                  d={wire.d}
                  fill="none"
                  stroke="#D4A73C"
                  strokeWidth="3"
                  strokeLinecap="round"
                  opacity="0.55"
                  vectorEffect="non-scaling-stroke"
                />
              ) : null}
            </svg>
            {wire.nodes.map((n, i) => (
              <span
                key={i}
                aria-hidden="true"
                style={{ left: n.left, top: n.top }}
                className="absolute z-10 hidden h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-[3px] border-gold bg-white md:block"
              />
            ))}
            <span
              ref={desktopDotRef}
              aria-hidden="true"
              className="wire-dot absolute left-0 top-0 z-10 hidden h-4 w-4 rounded-full bg-gold shadow-[0_0_18px_rgba(212,167,60,0.9)] will-change-transform md:block"
            />

            {/* Mobile straight rail */}
            <div aria-hidden="true" className="absolute inset-y-0 left-5 w-0.5 -translate-x-1/2 rounded bg-gold/25 md:hidden" />
            <span
              ref={mobileDotRef}
              aria-hidden="true"
              className="wire-dot absolute left-0 top-0 z-10 h-4 w-4 rounded-full bg-gold shadow-[0_0_18px_rgba(212,167,60,0.9)] will-change-transform md:hidden"
            />

            {list.map((s, i) => {
              const flip = i % 2 === 1;
              return (
                <li
                  key={s.title}
                  className="relative pl-12 md:grid md:h-[500px] md:grid-cols-2 md:pl-0"
                >
                  <span
                    aria-hidden="true"
                    className="absolute left-5 top-10 z-10 h-3.5 w-3.5 -translate-x-1/2 rounded-full border-[3px] border-gold bg-white md:hidden"
                  />
                  <div className={flip ? "md:order-2" : ""}>
                    <article className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-gold/40 bg-ivory p-8 shadow-[0_20px_50px_-24px_rgba(11,59,60,0.4)] transition-all duration-300 hover:-translate-y-2 hover:border-gold hover:bg-white hover:shadow-[0_30px_64px_-20px_rgba(11,59,60,0.5)] sm:p-10">
                      <span
                        aria-hidden="true"
                        className="absolute inset-x-10 top-0 h-[3px] origin-center scale-x-0 rounded-full bg-gold transition-transform duration-500 group-hover:scale-x-100"
                      />
                      <p className="relative font-tagline text-2xl font-bold text-plum">{s.n}</p>
                      <h3 className="relative mt-2 font-tagline text-4xl font-bold leading-snug text-ink transition-colors duration-300 group-hover:text-teal-bright">
                        {s.title}
                      </h3>
                      <p className="relative mt-3 max-w-md text-base leading-relaxed text-ink/75 sm:text-lg">
                        {(s.rich || [{ t: s.text }]).map((seg, k) => (
                          <span
                            key={k}
                            className={
                              seg.b
                                ? "font-bold text-ink"
                                : seg.c
                                  ? `font-semibold ${RICH_COLORS[seg.c] || ""}`
                                  : ""
                            }
                          >
                            {seg.t}
                          </span>
                        ))}
                      </p>
                      {s.points?.length ? (
                        <ul className="relative mt-4 flex flex-col gap-2">
                          {s.points.map((pt) => (
                            <li key={pt} className="flex items-start gap-2.5 text-[15px] font-medium text-ink/80">
                              <span aria-hidden="true" className="mt-[7px] h-1.5 w-1.5 shrink-0 rotate-45 bg-gold transition-colors duration-300 group-hover:bg-teal-bright" />
                              {pt}
                            </li>
                          ))}
                        </ul>
                      ) : null}
                      <div className="relative mt-auto pt-6">
                        <div aria-hidden="true" className="h-px bg-gradient-to-r from-gold/70 via-gold/30 to-transparent" />
                        <div className="flex items-center justify-between gap-3 pt-3 text-[13px] font-semibold uppercase tracking-[0.16em] text-ink/50">
                          <span>
                              {t.stepWord} {s.n} / {String(list.length).padStart(2, "0")}
                            </span>
                            {list[i + 1] ? (
                              <span className="truncate">
                                {t.nextWord} · <span className="text-teal-bright">{list[i + 1].title}</span>
                              </span>
                          ) : (
                            <Link
                              href={site.navCta.href}
                              className="rounded text-teal-bright underline decoration-gold decoration-2 underline-offset-4"
                            >
                              {site.navCta.label} →
                            </Link>
                          )}
                        </div>
                      </div>
                      <span
                        aria-hidden="true"
                        className="pointer-events-none absolute -bottom-10 -right-10 h-32 w-32 rounded-full border-[12px] border-gold/15 transition-all duration-500 group-hover:rotate-45 group-hover:border-gold/30"
                      />
                    </article>
                  </div>
                  <div aria-hidden="true" className="hidden md:block" />
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
