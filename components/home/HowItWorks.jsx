"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef } from "react";
import SectionHeading from "../ui/SectionHeading";
import { site } from "@/data/site";

// How it works: a clean stepped process with a connecting wire, hovered
// cards that lift with brand shadows, and exact geometry for the
// animated dot. UI layer only — copy comes from site.js untouched.
const ROW_H = 500;
const GAP = 140;
const COLS = { left: 25, mid: 50, right: 75 };
const EDGE_Y = ROW_H / 2;
const BASE_Y = ROW_H;
const DROP = 60;
const ENTER_RUN = 110;

const RICH_COLORS = { plum: "text-paper", teal: "text-brand", gold: "text-brand-dark" };

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

  const wire = useMemo(() => {
    const listH = count * ROW_H + (count - 1) * GAP;
    const X = (pct) => (pct / 100) * 1000;
    let d = "";
    const nodes = [];
    const samples = [];
    let total = 0;
    for (let i = 0; i < count - 1; i++) {
      const rowTop = i * (ROW_H + GAP);
      const nextTop = (i + 1) * (ROW_H + GAP);
      const even = i % 2 === 0;
      const sxPct = even ? COLS.left : COLS.right;
      const p0 = { x: X(sxPct), y: rowTop + BASE_Y };
      const p3 = { x: X(COLS.mid), y: nextTop + EDGE_Y };
      const c1 = { x: p0.x, y: p0.y + DROP };
      const c2 = { x: p3.x + (even ? -ENTER_RUN : ENTER_RUN), y: p3.y };
      d += `${d ? " " : ""}M ${p0.x} ${p0.y} C ${c1.x} ${c1.y}, ${c2.x} ${c2.y}, ${p3.x} ${p3.y}`;
      nodes.push({ left: `${sxPct}%`, top: p0.y }, { left: `${COLS.mid}%`, top: p3.y });
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

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    let cur = -1;
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
      if (rect.bottom < -vh || rect.top > vh * 2) return;
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
          if (wire.samples[i].at >= cur) { s = wire.samples[i]; break; }
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
    <section aria-labelledby="how-heading" className="relative overflow-clip border-y border-frame/20 bg-charcoal/10 py-14 sm:py-20">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[36rem] bg-[radial-gradient(ellipse_at_50%_-10%,rgba(126,37,48,0.04),transparent_65%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-noir to-transparent"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-32 top-1/4 h-[30rem] w-[30rem] bg-[radial-gradient(circle,rgba(166,124,0,0.06),transparent_70%)] blur-[90px]"
      />

      {/* Corner frames */}
      <span aria-hidden="true" className="pointer-events-none absolute top-10 left-10 z-20 h-[1px] w-20 bg-gradient-to-r from-frame/50 to-transparent" />
      <span aria-hidden="true" className="pointer-events-none absolute top-10 left-10 z-20 h-20 w-[1px] bg-gradient-to-b from-frame/50 to-transparent" />
      <span aria-hidden="true" className="pointer-events-none absolute top-10 right-10 z-20 h-[1px] w-20 bg-gradient-to-l from-frame/50 to-transparent" />
      <span aria-hidden="true" className="pointer-events-none absolute top-10 right-10 z-20 h-20 w-[1px] bg-gradient-to-b from-frame/50 to-transparent" />
      <span aria-hidden="true" className="pointer-events-none absolute bottom-10 left-10 z-20 h-[1px] w-20 bg-gradient-to-r from-frame/50 to-transparent" />
      <span aria-hidden="true" className="pointer-events-none absolute bottom-10 left-10 z-20 h-20 w-[1px] bg-gradient-to-t from-frame/50 to-transparent" />
      <span aria-hidden="true" className="pointer-events-none absolute bottom-10 right-10 z-20 h-[1px] w-20 bg-gradient-to-l from-frame/50 to-transparent" />
      <span aria-hidden="true" className="pointer-events-none absolute bottom-10 right-10 z-20 h-20 w-[1px] bg-gradient-to-t from-frame/50 to-transparent" />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading id="how-heading" heading={t.heading} intro={t.intro} tone="dark" divider={false} />

        <div className="mt-10">
          <ol ref={listRef} className="relative flex flex-col gap-16 md:gap-[140px]">
            <svg
              aria-hidden="true"
              viewBox={`0 0 1000 ${wire.listH}`}
              preserveAspectRatio="none"
              className="pointer-events-none absolute inset-0 hidden h-full w-full md:block"
            >
              {wire.d ? (
                <path d={wire.d} fill="none" stroke="#7E2530" strokeWidth="3" strokeLinecap="round" opacity="0.45" vectorEffect="non-scaling-stroke" />
              ) : null}
            </svg>
            {wire.nodes.map((n, i) => (
              <span key={i} aria-hidden="true" style={{ left: n.left, top: n.top }} className="absolute z-10 hidden h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-[3px] border-frame bg-charcoal/20 md:block" />
            ))}
            <span ref={desktopDotRef} aria-hidden="true" className="absolute left-0 top-0 z-10 hidden h-4 w-4 rounded-full bg-brand shadow-[0_0_20px_rgba(126,37,48,0.55)] will-change-transform md:block" />
            <div aria-hidden="true" className="absolute inset-y-0 left-5 w-0.5 -translate-x-1/2 rounded bg-brand/25 md:hidden" />
            <span ref={mobileDotRef} aria-hidden="true" className="absolute left-0 top-0 z-10 h-4 w-4 rounded-full bg-brand shadow-[0_0_20px_rgba(126,37,48,0.55)] will-change-transform md:hidden" />

            {list.map((s, i) => {
              const flip = i % 2 === 1;
              return (
                <li key={s.title} className="relative pl-12 md:grid md:h-[500px] md:grid-cols-2 md:pl-0">
                  <span aria-hidden="true" className="absolute left-5 top-10 z-10 h-3.5 w-3.5 -translate-x-1/2 rounded-full border-[3px] border-frame bg-charcoal/20 md:hidden" />
                  <div className={flip ? "md:order-2" : ""}>
                    <article className="group relative flex h-full flex-col overflow-hidden rounded-xl border border-frame/30 bg-noir p-8 transition-all duration-300 hover:border-brand hover:bg-charcoal/20 hover:-translate-y-1 sm:p-10">
                      <span aria-hidden="true" className="absolute inset-x-10 top-0 h-px origin-center scale-x-0 bg-brand transition-transform duration-500 group-hover:scale-x-100" />
                      <span aria-hidden="true" className="pointer-events-none absolute right-6 top-3 select-none font-heading text-7xl leading-none text-paper/5 transition-colors duration-500 group-hover:text-brand/10 sm:text-8xl">{s.n}</span>
                      <p className="relative text-[11px] font-semibold tracking-[0.3em] text-brand">{s.n}</p>
                      <h3 className="relative mt-3 font-heading text-2xl leading-snug text-paper transition-colors duration-300 group-hover:text-brand-dark sm:text-3xl">{s.title}</h3>
                      <p className="relative mt-4 max-w-md text-[15px] leading-relaxed text-paper/65 sm:text-base">
                        {(s.rich || [{ t: s.text }]).map((seg, k) => (
                          <span key={k} className={seg.b ? "font-bold text-paper" : seg.c ? `font-semibold ${RICH_COLORS[seg.c] || ""}` : ""}>{seg.t}</span>
                        ))}
                      </p>
                      {s.points?.length ? (
                        <ul className="relative mt-4 flex flex-col gap-2">
                          {s.points.map((pt) => (
                            <li key={pt} className="flex items-start gap-2.5 text-[15px] font-medium text-paper/80">
                              <span aria-hidden="true" className="mt-[7px] h-1.5 w-1.5 shrink-0 rotate-45 bg-brand transition-colors duration-300 group-hover:bg-brand" />
                              {pt}
                            </li>
                          ))}
                        </ul>
                      ) : null}
                      <div className="relative mt-auto pt-6">
                        <div aria-hidden="true" className="h-px bg-gradient-to-r from-frame/50 via-frame/20 to-transparent" />
                        <div className="flex items-center justify-between gap-3 pt-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-paper/40">
                          <span>{t.stepWord} {s.n} / {String(list.length).padStart(2, "0")}</span>
                          {list[i + 1] ? (
                            <span className="truncate">{t.nextWord} · <span className="text-brand">{list[i + 1].title}</span></span>
                          ) : (
                            <Link href={site.navCta.href} className="rounded text-brand underline decoration-brand underline-offset-4">{site.navCta.label} →</Link>
                          )}
                        </div>
                      </div>
                      <span aria-hidden="true" className="pointer-events-none absolute -bottom-12 -right-12 h-32 w-32 rounded-full border border-frame/15 transition-all duration-500 group-hover:rotate-45 group-hover:border-brand/40" />
                    </article>
                  </div>
                  <div aria-hidden="true" className="hidden md:block" />
                </li>
              );
            })}
          </ol>
        </div>

        <div className="mt-10 flex items-center justify-center gap-3 w-[170px] opacity-50">
          <span className="h-[1px] flex-1 bg-gradient-to-r from-frame/35 to-transparent" />
          <span className="h-2 w-2 rotate-45 bg-brand/50" />
          <span className="h-[1px] flex-1 bg-gradient-to-l from-frame/35 to-transparent" />
        </div>
      </div>
    </section>
  );
}
