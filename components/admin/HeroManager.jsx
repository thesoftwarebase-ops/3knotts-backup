"use client";

import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { showBusy, hideBusy } from "@/lib/busy";
import { site } from "@/data/site";
import { mediaImage } from "@/lib/media";
import { uploadImage, adminToken, authHeaders, deleteAssetRef } from "./upload";

export default function HeroManager() {
  const m = site.dashboard.heroMgr;
  const [slides, setSlides] = useState([]);
  const [tagline, setTagline] = useState({
    prefix: site.taglinePrefix,
    suffix: site.taglineSuffix,
    rotations: site.taglineRotations
  });
  const [rotationsText, setRotationsText] = useState(site.taglineRotations.join(", "));
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
        if (live) {
          setSlides(data.slides || []);
          if (data.tagline) {
            const rotations = data.tagline.rotations || site.taglineRotations;
            setTagline({
              prefix: data.tagline.prefix || site.taglinePrefix,
              suffix: data.tagline.suffix || site.taglineSuffix,
              rotations
            });
            setRotationsText(Array.isArray(rotations) ? rotations.join(", ") : rotations);
          }
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

  function setAlt(i, alt) {
    setSlides((ss) => ss.map((s, k) => (k === i ? { ...s, alt } : s)));
  }

  async function replace(i, file) {
    if (!file) return;
    const prev = slides[i] || {};
    setBusyIdx(i);
    showBusy(m.uploading);
    try {
      const uploaded = await uploadImage(file, "3knotts/hero", adminToken());
      setSlides((ss) => ss.map((s, k) => (k === i ? { ...s, src: uploaded.path, fileId: uploaded.fileId } : s)));
      if (prev.src && !prev.src.startsWith("/")) {
        await deleteAssetRef(prev.src, prev.fileId);
      }
      toast.success(m.uploaded || m.saved);
    } catch (err) {
      toast.error(err.message);
    } finally {
      hideBusy();
      setBusyIdx(-1);
    }
  }

  async function removeSlide(i) {
    const s = slides[i];
    if (s?.src && !s.src.startsWith("/")) {
      await deleteAssetRef(s.src, s.fileId);
    }
    setSlides((ss) => ss.filter((_, k) => k !== i));
  }

  async function save() {
    setSaving(true);
    showBusy(m.save);
    try {
      const parsedRotations = rotationsText
        .split(",")
        .map((w) => w.trim())
        .filter(Boolean);
      const taglineToSave = {
        ...tagline,
        rotations: parsedRotations.length ? parsedRotations : [...site.taglineRotations]
      };
      const res = await fetch("/api/admin/hero", {
        method: "PUT",
        headers: authHeaders(),
        body: JSON.stringify({ slides, tagline: taglineToSave })
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.ok) throw new Error(data.error || "Save failed.");
      setSlides(data.slides || slides);
      if (data.tagline) {
        setTagline(data.tagline);
        setRotationsText(Array.isArray(data.tagline.rotations) ? data.tagline.rotations.join(", ") : data.tagline.rotations);
      }
      toast.success(m.saved);
    } catch (err) {
      toast.error(err.message);
    } finally {
      hideBusy();
      setSaving(false);
    }
  }

  if (loading) return <p className="mt-6 text-paper/60">{site.dashboard.loading}</p>;

  return (
    <div className="mt-6">
      <p className="max-w-2xl text-sm leading-relaxed text-paper/70">{site.dashboard.heroHint}</p>
      <p className="mt-1 text-[13px] text-paper/60">Upload up to 4 videos (max 10MB each). MP4 recommended.</p>
      <ul className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2">
        {slides.map((s, i) => (
          <li
            key={`${s.src}-${i}`}
            className="group overflow-hidden rounded-2xl border border-gold/50 bg-charcoal/60 transition-all duration-300 hover:-translate-y-1 hover:border-gold hover:shadow-[0_20px_44px_-18px_rgba(0,0,0,0.45)]"
          >
            <span className="relative block aspect-[16/10] overflow-hidden bg-charcoal/40">
              {s.src ? (
                s.src.match(/\.(mp4|webm|mov)$/i) ? (
                  <video src={mediaImage(s.src)} muted loop playsInline className="absolute inset-0 h-full w-full object-cover" />
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={mediaImage(s.src)} alt="" aria-hidden="true" className="absolute inset-0 h-full w-full object-cover" />
                )
              ) : null}
              <span aria-hidden="true" className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-black/50 to-transparent" />
              <span aria-hidden="true" className="absolute left-3 top-3 rounded-full bg-wine/60 px-2.5 py-1 font-tagline text-lg font-bold leading-none text-ivory backdrop-blur-sm">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="absolute inset-x-0 bottom-0 p-3">
                <input
                  value={s.alt || ""}
                  onChange={(e) => setAlt(i, e.target.value)}
                  suppressHydrationWarning
                  aria-label={m.alt}
                  placeholder={m.alt}
                  className="w-full rounded-xl border border-ivory/40 bg-wine/55 px-3 py-2 text-sm font-medium text-ivory backdrop-blur-sm placeholder:text-ivory/60 focus:border-gold focus:outline-none"
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
                accept="video/mp4,video/webm,video/quicktime"
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
                onClick={() => removeSlide(i)}
                aria-label={m.remove}
                className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-plum/30 text-xl text-plum transition-all hover:scale-105 hover:border-plum hover:bg-plum hover:text-wine"
              >
                <span aria-hidden="true">×</span>
              </button>
            </span>
          </li>
        ))}
        {slides.length < 4 && (
          <li>
            <button
              type="button"
              onClick={() => setSlides((ss) => [...ss, { src: "", alt: "" }])}
              className="flex h-full min-h-[260px] w-full flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-gold/60 text-plum transition-all hover:-translate-y-1 hover:border-gold hover:bg-gold/5"
            >
              <span aria-hidden="true" className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-gold font-tagline text-3xl font-bold leading-none text-paper">
                +
              </span>
              <span className="text-base font-bold">{m.add}</span>
            </button>
          </li>
        )}
      </ul>

      <div className="mt-8 max-w-2xl rounded-2xl border border-gold/30 bg-charcoal/40 p-5 sm:p-6">
        <h3 className="text-base font-bold text-paper">{m.taglineTitle}</h3>
        <p className="mt-1 text-[13px] leading-relaxed text-paper/60">{m.taglineHint}</p>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <label className="flex flex-col gap-1.5">
            <span className="text-[13px] font-medium text-paper/80">{m.taglinePrefix}</span>
            <input
              value={tagline.prefix}
              onChange={(e) => setTagline((t) => ({ ...t, prefix: e.target.value }))}
              suppressHydrationWarning
              className="w-full rounded-xl border border-frame/25 bg-charcoal/60 px-4 py-2.5 text-[15px] text-paper focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/40"
            />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="text-[13px] font-medium text-paper/80">{m.taglineSuffix}</span>
            <input
              value={tagline.suffix}
              onChange={(e) => setTagline((t) => ({ ...t, suffix: e.target.value }))}
              suppressHydrationWarning
              className="w-full rounded-xl border border-frame/25 bg-charcoal/60 px-4 py-2.5 text-[15px] text-paper focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/40"
            />
          </label>
        </div>
        <label className="mt-4 flex flex-col gap-1.5">
          <span className="text-[13px] font-medium text-paper/80">{m.taglineRotations}</span>
          <input
            value={rotationsText}
            onChange={(e) => setRotationsText(e.target.value)}
            suppressHydrationWarning
            placeholder="dreams, ideas, visions"
            className="w-full rounded-xl border border-frame/25 bg-charcoal/60 px-4 py-2.5 text-[15px] text-paper focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/40"
          />
        </label>
      </div>

      <button
        type="button"
        onClick={save}
        disabled={saving}
        className="mt-4 rounded-full bg-gold px-8 py-3 text-base font-bold text-paper shadow-[0_10px_30px_-10px_rgba(166,124,0,0.5)] transition-all hover:-translate-y-0.5 disabled:opacity-60"
      >
        {m.save}
      </button>
    </div>
  );
}
