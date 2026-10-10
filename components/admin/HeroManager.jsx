"use client";

import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { showBusy, hideBusy } from "@/lib/busy";
import { site } from "@/data/site";
import { mediaImage } from "@/lib/media";
import { uploadImage, adminToken, authHeaders } from "./upload";

export default function HeroManager() {
  const m = site.dashboard.heroMgr;
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [busyIdx, setBusyIdx] = useState(-1);
  const fileRefs = useRef({});

  useEffect(() => {
    let live = true;
    fetch("/api/admin/hero", { headers: authHeaders() })
      .then(async (res) => {
        const data = await res.json().catch(() => ({}));
        if (!res.ok || !data.ok) throw new Error(data.error || "Could not load slides.");
        if (live) setSlides(data.slides || []);
      })
      .catch((err) => toast.error(err.message))
      .finally(() => {
        if (live) setLoading(false);
      });
    return () => {
      live = false;
    };
  }, []);

  function setAlt(i, alt) {
    setSlides((ss) => ss.map((s, k) => (k === i ? { ...s, alt } : s)));
  }

  async function replace(i, file) {
    if (!file) return;
    setBusyIdx(i);
    showBusy(m.uploading);
    try {
      const path = await uploadImage(file, "all-in-one-dream-place/hero", adminToken());
      setSlides((ss) => ss.map((s, k) => (k === i ? { ...s, src: path } : s)));
      toast.success(m.uploaded || t.saved);
    } catch (err) {
      toast.error(err.message);
    } finally {
      hideBusy();
      setBusyIdx(-1);
    }
  }

  async function save() {
    setSaving(true);
    showBusy(m.save);
    try {
      const res = await fetch("/api/admin/hero", {
        method: "PUT",
        headers: authHeaders(),
        body: JSON.stringify({ slides })
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.ok) throw new Error(data.error || "Save failed.");
      setSlides(data.slides || slides);
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
    <div className="mt-6">
      <p className="max-w-2xl text-sm leading-relaxed text-ink/70">{site.dashboard.heroHint}</p>
      <ul className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2">
        {slides.map((s, i) => (
          <li
            key={`${s.src}-${i}`}
            className="group overflow-hidden rounded-2xl border border-gold/50 bg-white transition-all duration-300 hover:-translate-y-1 hover:border-gold hover:shadow-[0_20px_44px_-18px_rgba(11,59,60,0.45)]"
          >
            <span className="relative block aspect-[16/10] overflow-hidden bg-sand/50">
              {s.src ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={mediaImage(s.src)} alt="" aria-hidden="true" className="absolute inset-0 h-full w-full object-cover" />
              ) : null}
              <span aria-hidden="true" className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-black/50 to-transparent" />
              <span aria-hidden="true" className="absolute left-3 top-3 rounded-full bg-black/50 px-2.5 py-1 font-tagline text-lg font-bold leading-none text-ivory backdrop-blur-sm">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="absolute inset-x-0 bottom-0 p-3">
                <input
                  value={s.alt || ""}
                  onChange={(e) => setAlt(i, e.target.value)}
                  suppressHydrationWarning
                  aria-label={m.alt}
                  placeholder={m.alt}
                  className="w-full rounded-xl border border-ivory/40 bg-black/45 px-3 py-2 text-sm font-medium text-ivory backdrop-blur-sm placeholder:text-ivory/60 focus:border-gold focus:outline-none"
                />
              </span>
            </span>
            <span className="flex items-center gap-2 p-3">
              <button
                type="button"
                disabled={busyIdx === i}
                onClick={() => fileRefs.current[i]?.click()}
                className="flex-1 rounded-full bg-teal-deep px-4 py-2.5 text-sm font-bold text-ivory transition-all hover:-translate-y-0.5 disabled:opacity-60"
              >
                {busyIdx === i ? m.uploading : m.replace}
              </button>
              <input
                ref={(el) => {
                  fileRefs.current[i] = el;
                }}
                type="file"
                accept="image/*"
                tabIndex={-1}
                aria-hidden="true"
                suppressHydrationWarning
                className="hidden"
                onChange={(e) => {
                  replace(i, e.target.files?.[0]);
                  e.target.value = "";
                }}
              />
              <button
                type="button"
                onClick={() => setSlides((ss) => ss.filter((_, k) => k !== i))}
                aria-label={m.remove}
                className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-plum/30 text-xl text-plum transition-all hover:scale-105 hover:border-plum hover:bg-plum hover:text-white"
              >
                <span aria-hidden="true">×</span>
              </button>
            </span>
          </li>
        ))}
        <li>
          <button
            type="button"
            onClick={() => setSlides((ss) => [...ss, { src: "/random.jpg", alt: "" }])}
            className="flex h-full min-h-[260px] w-full flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-gold/60 text-plum transition-all hover:-translate-y-1 hover:border-gold hover:bg-gold/5"
          >
            <span aria-hidden="true" className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-gold font-tagline text-3xl font-bold leading-none text-ink">
              +
            </span>
            <span className="text-base font-bold">{m.add}</span>
          </button>
        </li>
      </ul>
      <button
        type="button"
        onClick={save}
        disabled={saving}
        className="mt-4 rounded-full bg-gold px-8 py-3 text-base font-bold text-ink shadow-[0_10px_30px_-10px_rgba(212,167,60,0.9)] transition-all hover:-translate-y-0.5 disabled:opacity-60"
      >
        {m.save}
      </button>
    </div>
  );
}
