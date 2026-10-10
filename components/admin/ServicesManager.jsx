"use client";

import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { showBusy, hideBusy } from "@/lib/busy";
import { site } from "@/data/site";
import { mediaImage } from "@/lib/media";
import { uploadImage, adminToken, authHeaders } from "./upload";

const inputCls =
  "w-full rounded-xl border border-teal-mid/30 bg-white px-4 py-2.5 text-[15px] text-ink focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/40";
const miniBtn =
  "rounded-full border border-gold/60 px-4 py-2 text-sm font-bold text-ink transition-all hover:-translate-y-0.5 hover:border-gold disabled:opacity-60";
const dangerBtn =
  "rounded-full border border-plum/30 px-4 py-2 text-sm font-semibold text-plum transition-colors hover:border-plum";
const solidDanger =
  "rounded-full bg-plum px-6 py-2.5 text-sm font-bold text-white transition-transform hover:-translate-y-0.5 disabled:opacity-60";

function Row({ label, children }) {
  return (
    <div>
      <p className="mb-1.5 text-sm font-bold text-ink">{label}</p>
      {children}
    </div>
  );
}

function XButton({ onClick, label }) {
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

// Cloudinary public_id from a stored path ("folder/name.jpg" → "folder/name").
// Local /public paths return null (nothing to delete remotely).
function cloudId(src) {
  const s = String(src || "");
  if (!s || s.startsWith("/")) return null;
  return s.replace(/\.[a-z0-9]+$/i, "");
}

export default function ServicesManager() {
  const t = site.dashboard.servicesMgr;
  const [services, setServices] = useState([]);
  const [featured, setFeatured] = useState([]);
  const [selected, setSelected] = useState(null);
  const [confirmIdx, setConfirmIdx] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [busy, setBusy] = useState("");
  const [wiping, setWiping] = useState(false);
  const fileRefs = useRef({});

  useEffect(() => {
    let live = true;
    fetch("/api/admin/services", { headers: authHeaders() })
      .then(async (res) => {
        const data = await res.json().catch(() => ({}));
        if (!res.ok || !data.ok) throw new Error(data.error || "Could not load services.");
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

  const patch = (i, key, value) =>
    setServices((ss) => ss.map((s, k) => (k === i ? { ...s, [key]: value } : s)));

  const patchList = (i, key, idx, value) =>
    setServices((ss) =>
      ss.map((s, k) => (k === i ? { ...s, [key]: (s[key] || []).map((x, j) => (j === idx ? value : x)) } : s))
    );

  const addToList = (i, key, value) =>
    setServices((ss) => ss.map((s, k) => (k === i ? { ...s, [key]: [...(s[key] || []), value] } : s)));

  const removeFromList = (i, key, idx) =>
    setServices((ss) => ss.map((s, k) => (k === i ? { ...s, [key]: (s[key] || []).filter((_, j) => j !== idx) } : s)));

  const patchShot = (i, j, value) =>
    setServices((ss) =>
      ss.map((s, k) =>
        k === i ? { ...s, gallery: (s.gallery || []).map((g, jj) => (jj === j ? { ...g, ...value } : g)) } : s
      )
    );

  async function uploadFor(i, slot, file, shotIdx = -1) {
    if (!file) return;
    const key = `${i}-${slot}-${shotIdx}`;
    setBusy(key);
    showBusy(t.uploading);
    try {
      const path = await uploadImage(file, "all-in-one-dream-place/services", adminToken());
      if (slot === "image") patch(i, "image", path);
      else patchShot(i, shotIdx, { src: path });
      toast.success(t.uploaded);
    } catch (err) {
      toast.error(err.message);
    } finally {
      hideBusy();
      setBusy("");
    }
  }

  function pick(i, slot, shotIdx = -1) {
    fileRefs.current[`${i}-${slot}-${shotIdx}`]?.click();
  }

  function addService() {
    const i = services.length;
    setServices((ss) => [
      ...ss,
      {
        slug: `new-service-${ss.length + 1}`,
        title: "New Service",
        blurb: "",
        icon: "gift",
        image: "/random.jpg",
        details: [],
        whyUs: [],
        gallery: []
      }
    ]);
    setSelected(i);
  }

  // Captions stay tiny: trim to 4 words on every save.
  function trimmed(list) {
    return (list || []).map((s) => ({
      ...s,
      gallery: (s.gallery || []).map((g) => ({
        ...g,
        caption: String(g.caption || "")
          .trim()
          .split(/\s+/)
          .filter(Boolean)
          .slice(0, 4)
          .join(" ")
      }))
    }));
  }

  async function save(next = null) {
    setSaving(true);
    showBusy(t.save);
    try {
      const payload = trimmed(next || services);
      const res = await fetch("/api/admin/services", {
        method: "PUT",
        headers: authHeaders(),
        body: JSON.stringify({ services: payload, featured })
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.ok) throw new Error(data.error || "Save failed.");
      setServices(data.services || payload);
      if (data.featured) setFeatured(data.featured);
      toast.success(t.saved);
      return data;
    } catch (err) {
      toast.error(err.message);
      return null;
    } finally {
      hideBusy();
      setSaving(false);
    }
  }

  async function wipeService(i) {
    const s = services[i];
    if (!s) return;
    setWiping(true);
    showBusy(t.deleting);
    try {
      // 1. Delete every Cloudinary asset of this service first.
      const assets = [s.image, ...(s.gallery || []).map((g) => g.src)]
        .map(cloudId)
        .filter(Boolean);
      for (const publicId of assets) {
        try {
          await fetch("/api/admin/media", {
            method: "DELETE",
            headers: authHeaders(),
            body: JSON.stringify({ publicId })
          });
        } catch (err) {
          toast.error(err.message);
        }
      }
      // 2. Drop the service (and its home flag), then persist.
      const next = services.filter((_, k) => k !== i);
      setFeatured((f) => f.filter((x) => x !== s.slug));
      const data = await (async () => {
        setSaving(true);
        try {
          const res = await fetch("/api/admin/services", {
            method: "PUT",
            headers: authHeaders(),
            body: JSON.stringify({ services: next, featured: featured.filter((x) => x !== s.slug) })
          });
          const d = await res.json().catch(() => ({}));
          if (!res.ok || !d.ok) throw new Error(d.error || "Save failed.");
          return d;
        } finally {
          setSaving(false);
        }
      })();
      if (data) {
        setServices(data.services || next);
        if (data.featured) setFeatured(data.featured);
      }
      setConfirmIdx(null);
      setSelected(null);
      toast.success(t.serviceDeleted);
    } finally {
      hideBusy();
      setWiping(false);
    }
  }

  if (loading) return <p className="mt-6 text-ink/60">{site.dashboard.loading}</p>;

  // ---------- Detail view ----------
  if (selected !== null && services[selected]) {
    const i = selected;
    const s = services[selected];
    const isFeatured = featured.includes(s.slug);
    const shots = s.gallery || [];
    const remoteShots = shots.filter((g) => cloudId(g.src)).length + (cloudId(s.image) ? 1 : 0);
    return (
      <div className="mt-6">
        <button type="button" onClick={() => setSelected(null)} className="group inline-flex items-center gap-2 rounded-full border border-gold/60 px-5 py-2.5 text-sm font-bold text-ink transition-all hover:-translate-y-0.5 hover:border-gold">
          <span aria-hidden="true" className="transition-transform group-hover:-translate-x-0.5">←</span>
          {t.back}
        </button>
        <p className="mt-4 rounded-2xl border border-gold/40 bg-gold/10 px-5 py-3 text-sm font-medium leading-relaxed text-ink/80">
          {t.galleryRule}
        </p>

        <div className="mt-4 overflow-hidden rounded-3xl border border-gold/50 bg-white">
          <div className="relative aspect-[21/9] overflow-hidden border-b border-gold/40 bg-sand/50">
            {s.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={mediaImage(s.image)} alt="" aria-hidden="true" className="absolute inset-0 h-full w-full object-cover" />
            ) : null}
            <span aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
            <span className="absolute inset-x-0 bottom-0 p-5">
              <input
                value={s.title || ""}
                onChange={(e) => patch(i, "title", e.target.value)}
                suppressHydrationWarning
                aria-label={t.titleLabel}
                className="w-full bg-transparent font-tagline text-4xl font-bold leading-tight text-ivory placeholder:text-ivory/60 focus:outline-none focus:ring-2 focus:ring-gold/60 rounded-lg"
                placeholder={t.titleLabel}
              />
            </span>
          </div>

          <div className="flex flex-col gap-4 p-5 sm:p-7">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Row label={t.slugLabel}>
                <input value={s.slug || ""} onChange={(e) => patch(i, "slug", e.target.value)} suppressHydrationWarning className={inputCls} />
              </Row>
              <Row label={t.iconLabel}>
                <select value={s.icon || "gift"} onChange={(e) => patch(i, "icon", e.target.value)} suppressHydrationWarning className={inputCls}>
                  {site.serviceIcons.map((ic) => (
                    <option key={ic} value={ic}>
                      {ic}
                    </option>
                  ))}
                </select>
              </Row>
            </div>
            <Row label={t.blurbLabel}>
              <input value={s.blurb || ""} onChange={(e) => patch(i, "blurb", e.target.value)} suppressHydrationWarning className={inputCls} />
            </Row>
            <Row label={t.imageLabel}>
              <span className="flex flex-wrap items-center gap-3">
                <button type="button" disabled={busy === `${i}-image--1`} onClick={() => pick(i, "image")} className={miniBtn}>
                  {busy === `${i}-image--1` ? t.uploading : t.replaceImage}
                </button>
                <input
                  ref={(el) => {
                    fileRefs.current[`${i}-image--1`] = el;
                  }}
                  type="file"
                  accept="image/*"
                  tabIndex={-1}
                  aria-hidden="true"
                  suppressHydrationWarning
                  className="hidden"
                  onChange={(e) => {
                    uploadFor(i, "image", e.target.files?.[0]);
                    e.target.value = "";
                  }}
                />
                <label className="inline-flex cursor-pointer items-center gap-2 text-sm font-bold text-ink">
                  <input
                    type="checkbox"
                    checked={isFeatured}
                    suppressHydrationWarning
                    onChange={(e) =>
                      setFeatured((f) => (e.target.checked ? [...f, s.slug] : f.filter((x) => x !== s.slug)))
                    }
                    className="h-5 w-5 accent-[#D4A73C]"
                  />
                  {t.featuredService}
                </label>
              </span>
            </Row>

            <Row label={t.detailsLabel}>
              <span className="flex flex-col gap-2">
                {(s.details || []).map((d, j) => (
                  <span key={j} className="flex items-center gap-2">
                    <input value={d} onChange={(e) => patchList(i, "details", j, e.target.value)} suppressHydrationWarning className={inputCls} />
                    <XButton onClick={() => removeFromList(i, "details", j)} label={t.remove} />
                  </span>
                ))}
                <span>
                  <button type="button" onClick={() => addToList(i, "details", "")} className={miniBtn}>
                    {t.addLine}
                  </button>
                </span>
              </span>
            </Row>

            <Row label={t.whyUsLabel}>
              <span className="flex flex-col gap-2">
                {(s.whyUs || []).map((d, j) => (
                  <span key={j} className="flex items-center gap-2">
                    <input value={d} onChange={(e) => patchList(i, "whyUs", j, e.target.value)} suppressHydrationWarning className={inputCls} />
                    <XButton onClick={() => removeFromList(i, "whyUs", j)} label={t.remove} />
                  </span>
                ))}
                <span>
                  <button type="button" onClick={() => addToList(i, "whyUs", "")} className={miniBtn}>
                    {t.addLine}
                  </button>
                </span>
              </span>
            </Row>

            <Row label={t.galleryLabel}>
              <span className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {(s.gallery || []).map((g, j) => (
                  <span key={j} className="relative overflow-hidden rounded-xl border border-gold/40 bg-sand/40">
                    {g.src ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={mediaImage(g.src)} alt="" aria-hidden="true" className="aspect-square h-auto w-full object-cover" />
                    ) : (
                      <span aria-hidden="true" className="block aspect-square w-full bg-sand/40" />
                    )}
                    <span className="flex items-center justify-between gap-1 p-2">
                      <input
                        value={g.caption || ""}
                        placeholder={t.captionLabel}
                        onChange={(e) => patchShot(i, j, { caption: e.target.value })}
                        suppressHydrationWarning
                        aria-label={t.captionLabel}
                        className="min-w-0 flex-1 rounded-lg border border-teal-deep/15 bg-white px-2 py-1.5 text-[13px] text-ink focus:border-gold focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => patchShot(i, j, { featured: !(g.featured === true) })}
                        aria-pressed={g.featured === true}
                        aria-label={t.featuredShot}
                        title={t.featuredShot}
                        className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-base transition-all ${
                          g.featured === true
                            ? "border-gold bg-gold text-ink"
                            : "border-gold/50 text-gold/50 hover:border-gold hover:text-gold"
                        }`}
                      >
                        <span aria-hidden="true">★</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => pick(i, "shot", j)}
                        disabled={busy === `${i}-shot-${j}`}
                        aria-label={t.replaceImage}
                        title={t.replaceImage}
                        className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-teal-deep/20 text-base text-teal-bright transition-colors hover:border-gold disabled:opacity-60"
                      >
                        <span aria-hidden="true">⤒</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => removeFromList(i, "gallery", j)}
                        aria-label={t.remove}
                        className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-plum/30 text-lg text-plum transition-colors hover:border-plum"
                      >
                        <span aria-hidden="true">×</span>
                      </button>
                    </span>
                    <input
                      ref={(el) => {
                        fileRefs.current[`${i}-shot-${j}`] = el;
                      }}
                      type="file"
                      accept="image/*"
                      tabIndex={-1}
                      aria-hidden="true"
                      suppressHydrationWarning
                      className="hidden"
                      onChange={(e) => {
                        uploadFor(i, "shot", e.target.files?.[0], j);
                        e.target.value = "";
                      }}
                    />
                    <span className={`px-2 pb-1 text-xs font-semibold ${(g.caption || "").trim().split(/\s+/).filter(Boolean).length > 4 ? "text-plum" : "text-ink/50"}`}>
                      {(g.caption || "").trim().split(/\s+/).filter(Boolean).length}/4 {t.captionWords}
                    </span>
                  </span>
                ))}
                {(s.gallery || []).length >= 4 ? (
                  <p className="text-sm font-semibold text-plum">{t.shotsMax}</p>
                ) : (
                <button
                  type="button"
                  onClick={() => addToList(i, "gallery", { src: "/random.jpg", caption: "", featured: false })}
                  className="flex min-h-[120px] items-center justify-center rounded-xl border border-dashed border-gold/60 text-3xl text-gold transition-colors hover:border-gold hover:bg-gold/5"
                  aria-label={t.addShot}
                >
                  <span aria-hidden="true">+</span>
                </button>
                )}
              </span>
            </Row>

            <div className="flex flex-wrap gap-2 pt-2">
              <button
                type="button"
                onClick={() => save()}
                disabled={saving}
                className="rounded-full bg-gold px-6 py-2.5 text-sm font-bold text-ink transition-transform hover:-translate-y-0.5 disabled:opacity-60"
              >
                {t.save}
              </button>
              <button
                type="button"
                onClick={() => setConfirmIdx(i)}
                className="rounded-full border border-plum/40 px-6 py-2.5 text-sm font-bold text-plum transition-colors hover:border-plum"
              >
                {t.remove}
              </button>
            </div>
          </div>
        </div>

        {confirmIdx === i ? (
          <div role="alertdialog" aria-modal="true" aria-label={t.delTitle} className="fixed inset-0 z-[80] flex items-center justify-center bg-ink/70 p-4">
            <div
              aria-hidden="true"
              className="absolute inset-0"
              onClick={() => !wiping && setConfirmIdx(null)}
            />
            <div className="relative w-full max-w-md rounded-3xl border-2 border-gold bg-ivory p-6 text-center shadow-[0_40px_90px_-20px_rgba(0,0,0,0.6)] sm:p-8">
              <span aria-hidden="true" className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-plum text-3xl text-white">
                !
              </span>
              <p className="mt-4 font-tagline text-4xl font-bold leading-tight text-plum">{t.delTitle || "Delete this service?"}</p>
              <p className="mx-auto mt-3 max-w-sm text-[15px] leading-relaxed text-ink">
                <strong className="font-bold">{s.title || t.untitled}</strong>
                {" — "}
                {t.delBody || "This cannot be undone."}
              </p>
              <p className="mx-auto mt-4 inline-block rounded-full bg-plum/10 px-4 py-1.5 text-sm font-bold text-plum">
                {remoteShots} {remoteShots === 1 ? t.photoOne : t.photoMany}
              </p>
              <div className="mt-6 flex flex-col gap-2">
                <button
                  type="button"
                  onClick={() => wipeService(i)}
                  disabled={wiping}
                  style={{ backgroundColor: "#5B2A4B", color: "#ffffff" }}
                  className="w-full rounded-full px-6 py-3.5 text-base font-bold transition-all hover:-translate-y-0.5 hover:shadow-[0_14px_30px_-10px_rgba(91,42,75,0.7)] disabled:opacity-60"
                >
                  {wiping ? t.deleting || "Deleting…" : t.delConfirm || "Yes, delete everything"}
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmIdx(null)}
                  disabled={wiping}
                  style={{ backgroundColor: "#ffffff", color: "#16302F" }}
                  className="w-full rounded-full border-2 border-teal-deep/30 px-6 py-3 text-base font-bold transition-all hover:-translate-y-0.5 hover:border-teal-deep disabled:opacity-60"
                >
                  {t.delCancel || "Keep it"}
                </button>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    );
  }

  // ---------- Grid view ----------
  return (
    <div className="mt-6">
      <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {services.map((s, i) => {
          const shots = (s.gallery || []).length;
          const work = (s.gallery || []).filter((g) => g.featured === true).length;
          const home = featured.includes(s.slug);
          return (
            <li key={`${s.slug}-${i}`} className="h-full">
              <button
                type="button"
                onClick={() => setSelected(i)}
                aria-label={`${s.title}`}
                className="group flex h-full w-full flex-col overflow-hidden rounded-2xl border border-gold/50 bg-white text-left transition-all duration-300 hover:-translate-y-1 hover:border-gold hover:shadow-[0_20px_44px_-18px_rgba(11,59,60,0.45)]"
              >
                <span className="relative block aspect-[16/10] overflow-hidden bg-sand/50">
                  {s.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={mediaImage(s.image)} alt="" aria-hidden="true" className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  ) : null}
                  <span aria-hidden="true" className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-black/40 to-transparent" />
                  {home ? (
                    <span
                      aria-hidden="true"
                      className="absolute left-3 top-3 inline-flex h-9 w-9 items-center justify-center rounded-full bg-gold text-lg leading-none text-ink shadow-[0_6px_16px_-4px_rgba(212,167,60,0.9)]"
                    >
                      ★
                    </span>
                  ) : null}
                  {work ? (
                    <span className="absolute right-3 top-3 rounded-full bg-black/50 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-gold-soft backdrop-blur-sm">
                      {t.workBadge} · {work}
                    </span>
                  ) : null}
                </span>
                <span className="flex flex-1 flex-col px-5 pb-5 pt-4">
                  <span className="block font-tagline text-2xl font-bold leading-snug text-ink">{s.title}</span>
                  <span className="mt-1 block text-sm text-ink/60">
                    {shots} {shots === 1 ? t.shotOne : t.shotMany} · {s.slug}
                  </span>
                </span>
              </button>
            </li>
          );
        })}
        <li className="h-full min-h-[220px]">
          <button
            type="button"
            onClick={addService}
            className="flex h-full min-h-[220px] w-full flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-gold/70 text-plum transition-all hover:-translate-y-1 hover:border-gold hover:bg-gold/5"
          >
            <span aria-hidden="true" className="font-tagline text-5xl font-bold leading-none text-gold">+</span>
            <span className="text-base font-bold">{t.add}</span>
          </button>
        </li>
      </ul>
      <div className="mt-4">
        <button
          type="button"
          onClick={() => save()}
          disabled={saving}
          className="rounded-full bg-gold px-6 py-2.5 text-sm font-bold text-ink transition-transform hover:-translate-y-0.5 disabled:opacity-60"
        >
          {t.save}
        </button>
      </div>
    </div>
  );

  function addService() {
    setServices((ss) => [
      ...ss,
      {
        slug: `new-service-${ss.length + 1}`,
        title: "New Service",
        blurb: "",
        icon: "gift",
        image: "/random.jpg",
        details: [],
        whyUs: [],
        gallery: []
      }
    ]);
    setSelected(services.length);
  }
}
