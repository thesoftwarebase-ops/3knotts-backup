"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { showBusy, hideBusy } from "@/lib/busy";
import { site } from "@/data/site";
import { mediaImage } from "@/lib/media";
import { authHeaders } from "./upload";

const inputCls =
  "w-full rounded-xl border border-teal-mid/30 bg-white px-4 py-2.5 text-[15px] text-ink focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/40";
const miniBtn =
  "rounded-full border border-gold/60 px-4 py-2 text-sm font-bold text-ink transition-all hover:-translate-y-0.5 hover:border-gold disabled:opacity-60";
const dangerBtn =
  "rounded-full border border-plum/30 px-4 py-2 text-sm font-semibold text-plum transition-colors hover:border-plum";
const saveBtn =
  "rounded-full bg-gold px-6 py-2.5 text-sm font-bold text-ink transition-transform hover:-translate-y-0.5 disabled:opacity-60";

function useContent(key) {
  const [value, setValue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  useEffect(() => {
    let live = true;
    fetch(`/api/admin/content?key=${encodeURIComponent(key)}`, { headers: authHeaders() })
      .then(async (res) => {
        const data = await res.json().catch(() => ({}));
        if (!res.ok || !data.ok) throw new Error(data.error || "Could not load.");
        if (live) setValue(data.value);
      })
      .catch((err) => toast.error(err.message))
      .finally(() => {
        if (live) setLoading(false);
      });
    return () => {
      live = false;
    };
  }, [key]);
  async function save(next) {
    setSaving(true);
    showBusy(site.dashboard.homeMgr.save);
    try {
      const res = await fetch("/api/admin/content", {
        method: "PUT",
        headers: authHeaders(),
        body: JSON.stringify({ key, value: next ?? value })
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.ok) throw new Error(data.error || "Save failed.");
      setValue(data.value);
      toast.success(site.dashboard.homeMgr.saved);
    } catch (err) {
      toast.error(err.message);
    } finally {
      hideBusy();
      setSaving(false);
    }
  }
  return { value, setValue, loading, saving, save };
}

function Field({ label, children }) {
  return (
    <div>
      <p className="mb-1.5 text-sm font-bold text-ink">{label}</p>
      {children}
    </div>
  );
}

function RemoveX({ onClick, label }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-plum/30 text-lg text-plum transition-colors hover:border-plum"
    >
      <span aria-hidden="true">×</span>
    </button>
  );
}

export function BrandManager() {
  const m = site.dashboard.homeMgr;
  const { value, setValue, loading, saving, save } = useContent("brand");
  if (loading) return <p className="mt-6 text-ink/60">{site.dashboard.loading}</p>;
  if (!value) return null;
  return (
    <div className="mt-6 flex max-w-2xl flex-col gap-4 rounded-2xl border border-gold/50 bg-white p-5 sm:p-6">
      <Field label={m.brandHeading}>
        <input value={value.heading || ""} onChange={(e) => setValue({ ...value, heading: e.target.value })} suppressHydrationWarning className={inputCls} />
      </Field>
      <Field label={m.brandText}>
        <textarea value={value.text || ""} onChange={(e) => setValue({ ...value, text: e.target.value })} rows={4} suppressHydrationWarning className={`${inputCls} resize-y max-h-44 overflow-y-auto`} />
      </Field>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label={m.ctaLabel}>
          <input value={value.cta?.label || ""} onChange={(e) => setValue({ ...value, cta: { ...value.cta, label: e.target.value } })} suppressHydrationWarning className={inputCls} />
        </Field>
        <Field label={m.ctaHref}>
          <input value={value.cta?.href || ""} onChange={(e) => setValue({ ...value, cta: { ...value.cta, href: e.target.value } })} suppressHydrationWarning className={inputCls} />
        </Field>
      </div>
      <span>
        <button type="button" onClick={() => save()} disabled={saving} className="rounded-full bg-gold px-6 py-2.5 text-sm font-bold text-ink transition-transform hover:-translate-y-0.5 disabled:opacity-60">
          {m.save}
        </button>
      </span>
    </div>
  );
}

export function FeaturedManager() {
  const m = site.dashboard.homeMgr;
  const [services, setServices] = useState([]);
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let live = true;
    fetch("/api/admin/services", { headers: authHeaders() })
      .then(async (res) => {
        const data = await res.json().catch(() => ({}));
        if (!res.ok || !data.ok) throw new Error(data.error || "Could not load.");
        if (live) {
          setServices(data.services || []);
          setFeatured(data.featured || []);
        }
      })
      .catch((err) => toast.error(err.message))
      .finally(() => {
        if (live) setLoading(false);
      });
    return () => {
      live = false;
    };
  }, []);

  async function save() {
    setSaving(true);
    showBusy(m.save);
    try {
      const res = await fetch("/api/admin/services", {
        method: "PUT",
        headers: authHeaders(),
        body: JSON.stringify({ services, featured })
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.ok) throw new Error(data.error || "Save failed.");
      if (data.featured) setFeatured(data.featured);
      toast.success(m.saved);
    } catch (err) {
      toast.error(err.message);
    } finally {
      hideBusy();
      setSaving(false);
    }
  }

  if (loading) return <p className="mt-6 text-ink/60">{site.dashboard.loading}</p>;
  return (
    <div className="mt-6 rounded-2xl border border-gold/50 bg-white p-5 sm:p-6">
      <p className="text-sm text-ink/70">{m.featHint}</p>
      <ul className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
        {services.map((s) => {
          const on = featured.includes(s.slug);
          return (
            <li key={s.slug}>
              <label className={`flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 transition-all ${on ? "border-gold bg-gold/10" : "border-teal-deep/15 hover:border-gold/60"}`}>
                <input
                  type="checkbox"
                  checked={on}
                  suppressHydrationWarning
                  onChange={(e) =>
                    setFeatured((f) => (e.target.checked ? [...f, s.slug] : f.filter((x) => x !== s.slug)))
                  }
                  className="h-5 w-5 shrink-0 accent-[#D4A73C]"
                />
                <span className="truncate text-[15px] font-semibold text-ink">{s.title}</span>
              </label>
            </li>
          );
        })}
      </ul>
      <button type="button" onClick={save} disabled={saving} className="mt-4 rounded-full bg-gold px-6 py-2.5 text-sm font-bold text-ink transition-transform hover:-translate-y-0.5 disabled:opacity-60">
        {m.save}
      </button>
    </div>
  );
}

export function StepsManager() {
  const m = site.dashboard.homeMgr;
  const { value, setValue, loading, saving, save } = useContent("steps");
  if (loading) return <p className="mt-6 text-ink/60">{site.dashboard.loading}</p>;
  if (!value) return null;
  const set = (i, patch) => setValue(value.map((s, k) => (k === i ? { ...s, ...patch } : s)));
  return (
    <div className="mt-6 flex flex-col gap-5">
      {(value || []).map((s, i) => (
        <div key={s.n + i} className="relative overflow-hidden rounded-3xl border border-gold/50 bg-white shadow-[0_18px_44px_-24px_rgba(11,59,60,0.4)]">
          <button
            type="button"
            onClick={() => setValue(value.filter((_, k) => k !== i))}
            aria-label={m.remove}
            className="absolute right-4 top-4 inline-flex h-9 w-9 items-center justify-center rounded-full border border-plum/30 text-lg text-plum transition-all hover:scale-105 hover:border-plum hover:bg-plum hover:text-white"
          >
            <span aria-hidden="true">×</span>
          </button>
          <div className="flex items-center gap-4 border-b border-gold/30 bg-ivory/60 px-5 py-4 sm:px-6">
            <span aria-hidden="true" className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-teal-deep font-tagline text-xl font-bold text-gold-soft ring-2 ring-gold">
              {String(i + 1).padStart(2, "0")}
            </span>
            <p className="min-w-0 flex-1 truncate pr-10 font-tagline text-2xl font-bold text-ink">
              {s.title || m.stepTitle}
            </p>
          </div>

          <div className="flex flex-col gap-4 p-5 sm:p-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label={m.stepTitle}>
                <input value={s.title || ""} onChange={(e) => set(i, { title: e.target.value })} suppressHydrationWarning className={inputCls} />
              </Field>
              <Field label={m.stepArt}>
                <input value={s.art || ""} onChange={(e) => set(i, { art: e.target.value })} suppressHydrationWarning className={inputCls} />
              </Field>
            </div>
            <Field label={m.stepText}>
              <textarea value={s.text || ""} onChange={(e) => set(i, { text: e.target.value })} rows={2} suppressHydrationWarning className={`${inputCls} resize-y max-h-44 overflow-y-auto`} />
            </Field>
          <div>
            <Field label={m.stepPoints}>
              <span className="flex flex-col gap-2">
                {(s.points || []).map((pt, j) => (
                  <span key={j} className="flex items-center gap-2 rounded-xl bg-ivory/70 p-1.5 pl-3">
                    <span aria-hidden="true" className="h-1.5 w-1.5 shrink-0 rotate-45 bg-gold" />
                    <input
                      value={pt}
                      onChange={(e) =>
                        set(i, { points: (s.points || []).map((x, k) => (k === j ? e.target.value : x)) })
                      }
                      suppressHydrationWarning
                      className="w-full rounded-lg bg-transparent px-2 py-1.5 text-[15px] text-ink focus:outline-none focus:ring-2 focus:ring-gold/40"
                    />
                    <button
                      type="button"
                      onClick={() => set(i, { points: (s.points || []).filter((_, k) => k !== j) })}
                      aria-label={m.remove}
                      className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-lg text-plum/60 transition-colors hover:bg-plum hover:text-white"
                    >
                      <span aria-hidden="true">×</span>
                    </button>
                  </span>
                ))}
                <span>
                  <button
                    type="button"
                    onClick={() => set(i, { points: [...(s.points || []), ""] })}
                    className="mt-1 inline-flex items-center gap-2 rounded-full border border-dashed border-gold/70 px-4 py-2 text-sm font-bold text-plum transition-all hover:-translate-y-0.5 hover:border-gold hover:bg-gold/10"
                  >
                    <span aria-hidden="true" className="text-lg font-bold leading-none text-gold">+</span>
                    {m.addLine}
                  </button>
                </span>
              </span>
            </Field>
          </div>
          <div>
            <Field label={m.richLabel}>
              <span className="flex flex-col gap-2">
                {(s.rich || []).map((seg, j) => {
                  const styleKey = seg.b ? "bold" : seg.c || "plain";
                  return (
                    <span key={j} className="flex items-center gap-2 rounded-xl bg-ivory/70 p-1.5 pl-3">
                      <input
                        value={seg.t || ""}
                        onChange={(e) => {
                          const rich = (s.rich || []).map((x, k) => (k === j ? { ...x, t: e.target.value } : x));
                          set(i, { rich });
                        }}
                        suppressHydrationWarning
                        className="w-full rounded-lg bg-transparent px-2 py-1.5 text-[15px] text-ink focus:outline-none focus:ring-2 focus:ring-gold/40"
                      />
                      <select
                        value={styleKey}
                        suppressHydrationWarning
                        onChange={(e) => {
                          const v = e.target.value;
                          const styled = v === "plain" ? {} : v === "bold" ? { b: true } : { c: v };
                          const rich = (s.rich || []).map((x, k) =>
                            k === j ? { t: x.t || "", ...styled } : x
                          );
                          set(i, { rich });
                        }}
                        aria-label={m.richStyle}
                        className="w-24 shrink-0 rounded-lg border border-teal-mid/30 bg-white px-2 py-2 text-sm font-bold text-ink focus:border-gold focus:outline-none"
                      >
                        {Object.entries(m.richStyles).map(([v, label]) => (
                          <option key={v} value={v}>
                            {label}
                          </option>
                        ))}
                      </select>
                      <button
                        type="button"
                        onClick={() => set(i, { rich: (s.rich || []).filter((_, k) => k !== j) })}
                        aria-label={m.remove}
                        className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-lg text-plum/60 transition-colors hover:bg-plum hover:text-white"
                      >
                        <span aria-hidden="true">×</span>
                      </button>
                    </span>
                  );
                })}
                <span>
                  <button
                    type="button"
                    onClick={() => set(i, { rich: [...(s.rich || []), { t: "" }] })}
                    className="mt-1 inline-flex items-center gap-2 rounded-full border border-dashed border-gold/70 px-4 py-2 text-sm font-bold text-plum transition-all hover:-translate-y-0.5 hover:border-gold hover:bg-gold/10"
                  >
                    <span aria-hidden="true" className="text-lg font-bold leading-none text-gold">+</span>
                    {m.addSegment}
                  </button>
                </span>
              </span>
            </Field>
          </div>
        </div>
      </div>
      ))}
      <button
        type="button"
        onClick={() => setValue([...(value || []), { n: "", title: "", text: "", art: "", rich: null, points: [] }])}
        className="flex items-center justify-center gap-3 rounded-3xl border-2 border-dashed border-gold/60 bg-gold/5 px-6 py-8 transition-all hover:-translate-y-0.5 hover:border-gold hover:bg-gold/10"
      >
        <span aria-hidden="true" className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-gold font-tagline text-3xl font-bold leading-none text-ink shadow-[0_10px_24px_-8px_rgba(212,167,60,0.9)]">
          +
        </span>
        <span className="font-tagline text-3xl font-bold text-plum">{m.addStep}</span>
      </button>
      <div className="flex flex-wrap gap-2">
        <button type="button" onClick={() => save()} disabled={saving} className="rounded-full bg-gold px-6 py-2.5 text-sm font-bold text-ink transition-transform hover:-translate-y-0.5 disabled:opacity-60">
          {m.save}
        </button>
      </div>
    </div>
  );
}

export function WorkNote({ onGoServices }) {
  const m = site.dashboard.homeMgr;
  const [shots, setShots] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let live = true;
    fetch("/api/admin/services", { headers: authHeaders() })
      .then(async (res) => {
        const data = await res.json().catch(() => ({}));
        if (!res.ok || !data.ok) throw new Error(data.error || "Could not load.");
        if (live) {
          const out = [];
          for (const s of data.services || []) {
            for (const g of s.gallery || []) {
              if (g.featured === true) out.push({ src: g.src, caption: g.caption, service: s.title, slug: s.slug });
            }
          }
          setShots(out);
        }
      })
      .catch((err) => toast.error(err.message))
      .finally(() => {
        if (live) setLoading(false);
      });
    return () => {
      live = false;
    };
  }, []);

  async function unstar(idx) {
    const target = shots[idx];
    if (!target) return;
    try {
      const res = await fetch("/api/admin/services", { headers: authHeaders() });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.ok) throw new Error(data.error || "Could not load.");
      const services = (data.services || []).map((s) =>
        s.slug === target.slug
          ? {
              ...s,
              gallery: (s.gallery || []).map((g) =>
                g.src === target.src ? { ...g, featured: false } : g
              )
            }
          : s
      );
      const put = await fetch("/api/admin/services", {
        method: "PUT",
        headers: authHeaders(),
        body: JSON.stringify({ services, featured: data.featured || [] })
      });
      const saved = await put.json().catch(() => ({}));
      if (!put.ok || !saved.ok) throw new Error(saved.error || "Save failed.");
      setShots((ss) => ss.filter((_, k) => k !== idx));
      toast.success(m.saved);
    } catch (err) {
      toast.error(err.message);
    }
  }

  return (
    <div className="mt-6 max-w-3xl rounded-2xl border border-gold/50 bg-white p-5 sm:p-6">
      <p className="text-[15px] leading-relaxed text-ink/80">{m.workNote}</p>
      {loading ? (
        <p className="mt-4 text-ink/60">{site.dashboard.loading}</p>
      ) : shots.length === 0 ? (
        <p className="mt-4 rounded-xl bg-ivory px-4 py-3 text-center text-[15px] font-medium text-ink/70">
          {m.workEmpty}
        </p>
      ) : (
        <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {shots.map((w, i) => (
            <li key={`${w.slug}-${i}`} className="group relative overflow-hidden rounded-xl border border-gold/40 bg-sand/40">
              {w.src ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={mediaImage(w.src)} alt="" aria-hidden="true" loading="lazy" className="aspect-square h-auto w-full object-cover" />
              ) : null}
              <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-2 pt-6">
                <span className="block truncate text-[13px] font-bold text-ivory">{w.caption || w.service}</span>
                <span className="block truncate text-xs text-gold-soft">{w.service}</span>
              </span>
              <button
                type="button"
                onClick={() => unstar(i)}
                aria-label={m.remove}
                className="absolute right-2 top-2 inline-flex h-8 w-8 items-center justify-center rounded-full bg-gold text-base font-bold leading-none text-ink shadow transition-transform hover:scale-110"
              >
                <span aria-hidden="true">★</span>
              </button>
            </li>
          ))}
        </ul>
      )}
      <button type="button" onClick={onGoServices} className="mt-5 rounded-full bg-teal-deep px-6 py-2.5 text-sm font-bold text-ivory transition-transform hover:-translate-y-0.5">
        {m.workCta}
      </button>
    </div>
  );
}

export function TestimonialsManager() {
  const m = site.dashboard.homeMgr;
  const { value, setValue, loading, saving, save } = useContent("testimonials");
  if (loading) return <p className="mt-6 text-ink/60">{site.dashboard.loading}</p>;
  if (!value) return null;
  return (
    <div className="mt-6 flex flex-col gap-4">
      {(value || []).map((t, i) => (
        <div key={i} className="rounded-2xl border border-gold/50 bg-white p-5">
          <Field label={m.quoteLabel}>
            <textarea value={t.quote || ""} onChange={(e) => setValue(value.map((x, k) => (k === i ? { ...x, quote: e.target.value } : x)))} rows={3} suppressHydrationWarning className={`${inputCls} resize-y max-h-44 overflow-y-auto`} />
          </Field>
          <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label={m.nameLabel}>
              <input value={t.name || ""} onChange={(e) => setValue(value.map((x, k) => (k === i ? { ...x, name: e.target.value } : x)))} suppressHydrationWarning className={inputCls} />
            </Field>
            <Field label={m.detailLabel}>
              <input value={t.detail || ""} onChange={(e) => setValue(value.map((x, k) => (k === i ? { ...x, detail: e.target.value } : x)))} suppressHydrationWarning className={inputCls} />
            </Field>
          </div>
          <button type="button" onClick={() => setValue(value.filter((_, k) => k !== i))} className={`${dangerBtn} mt-3`}>
            {m.remove}
          </button>
        </div>
      ))}
      <div className="flex flex-wrap gap-2">
        <button type="button" onClick={() => setValue([...(value || []), { quote: "", name: "", detail: "" }])} className={miniBtn}>
          {m.addQuote}
        </button>
        <button type="button" onClick={() => save()} disabled={saving} className="rounded-full bg-gold px-6 py-2.5 text-sm font-bold text-ink transition-transform hover:-translate-y-0.5 disabled:opacity-60">
          {m.save}
        </button>
      </div>
    </div>
  );
}

export function FaqManager() {
  const m = site.dashboard.homeMgr;
  const { value, setValue, loading, saving, save } = useContent("faq");
  if (loading) return <p className="mt-6 text-ink/60">{site.dashboard.loading}</p>;
  if (!value) return null;
  return (
    <div className="mt-6 flex flex-col gap-4">
      {(value || []).map((f, i) => (
        <div key={i} className="rounded-2xl border border-gold/50 bg-white p-5">
          <Field label={m.qLabel}>
            <input value={f.q || ""} onChange={(e) => setValue(value.map((x, k) => (k === i ? { ...x, q: e.target.value } : x)))} suppressHydrationWarning className={inputCls} />
          </Field>
          <div className="mt-3">
            <Field label={m.aLabel}>
              <textarea value={f.a || ""} onChange={(e) => setValue(value.map((x, k) => (k === i ? { ...x, a: e.target.value } : x)))} rows={3} suppressHydrationWarning className={`${inputCls} resize-y max-h-44 overflow-y-auto`} />
            </Field>
          </div>
          <button type="button" onClick={() => setValue(value.filter((_, k) => k !== i))} className={`${dangerBtn} mt-3`}>
            {m.remove}
          </button>
        </div>
      ))}
      <div className="flex flex-wrap gap-2">
        <button type="button" onClick={() => setValue([...(value || []), { q: "", a: "" }])} className={miniBtn}>
          {m.addQa}
        </button>
        <button type="button" onClick={() => save()} disabled={saving} className="rounded-full bg-gold px-6 py-2.5 text-sm font-bold text-ink transition-transform hover:-translate-y-0.5 disabled:opacity-60">
          {m.save}
        </button>
      </div>
    </div>
  );
}
