"use client";

import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { showBusy, hideBusy } from "@/lib/busy";
import { site } from "@/data/site";
import { mediaImage } from "@/lib/media";
import { uploadImage, adminToken, authHeaders, deleteAssetRef } from "./upload";

const inputCls =
  "w-full rounded-xl border border-frame/25 bg-charcoal/60 px-4 py-2.5 text-[15px] text-paper focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/40";
const miniBtn =
  "rounded-full border border-gold/60 px-4 py-2 text-sm font-bold text-paper transition-all hover:-translate-y-0.5 hover:border-gold disabled:opacity-60";

export default function AboutManager() {
  const m = site.dashboard.aboutMgr;
  const [value, setValue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [busy, setBusy] = useState(false);
  const fileRef = useRef(null);

  useEffect(() => {
    let live = true;
    fetch("/api/admin/content?key=about", { headers: authHeaders() })
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
  }, []);

  async function replace(file) {
    if (!file) return;
    const prevSrc = value?.ownerImage || "";
    const prevFileId = value?.ownerImageFileId || "";
    setBusy(true);
    showBusy(m.uploading);
    try {
      const uploaded = await uploadImage(file, "3knotts/about", adminToken());
      setValue((v) => ({ ...v, ownerImage: uploaded.path, ownerImageFileId: uploaded.fileId }));
      if (prevSrc && !prevSrc.startsWith("/")) {
        await deleteAssetRef(prevSrc, prevFileId);
      }
      toast.success(m.uploaded);
    } catch (err) {
      toast.error(err.message);
    } finally {
      hideBusy();
      setBusy(false);
    }
  }

  async function save() {
    setSaving(true);
    showBusy(m.save);
    try {
      const res = await fetch("/api/admin/content", {
        method: "PUT",
        headers: authHeaders(),
        body: JSON.stringify({ key: "about", value })
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.ok) throw new Error(data.error || "Save failed.");
      setValue(data.value);
      toast.success(m.saved);
    } catch (err) {
      toast.error(err.message);
    } finally {
      hideBusy();
      setSaving(false);
    }
  }

  if (loading) return <p className="mt-6 text-paper/60">{site.dashboard.loading}</p>;
  if (!value) return null;

  const set = (patch) => setValue({ ...value, ...patch });

  return (
    <div className="mt-6 flex max-w-2xl flex-col gap-4 rounded-2xl border border-gold/50 bg-charcoal/60 p-5 sm:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        {value.ownerImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={mediaImage(value.ownerImage)}
            alt=""
            aria-hidden="true"
            className="h-28 w-24 shrink-0 rounded-2xl border border-gold/50 object-cover object-top"
          />
        ) : null}
        <div>
          <p className="mb-1.5 text-sm font-bold text-paper">{m.ownerImageLabel}</p>
          <p className="mb-2 text-[13px] text-paper/60">{m.webpNote}</p>
          <button type="button" disabled={busy} onClick={() => fileRef.current?.click()} className={miniBtn}>
            {busy ? m.uploading : m.replaceImage}
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            tabIndex={-1}
            aria-hidden="true"
            suppressHydrationWarning
            className="hidden"
            onChange={(e) => {
              replace(e.target.files?.[0]);
              e.target.value = "";
            }}
          />
        </div>
        <div className="flex-1">
          <p className="mb-1.5 text-sm font-bold text-paper">{m.ownerRoleLabel}</p>
          <input
            value={value.ownerRole || ""}
            onChange={(e) => set({ ownerRole: e.target.value })}
            suppressHydrationWarning
            className={inputCls}
          />
        </div>
      </div>

      <div>
        <p className="mb-1.5 text-sm font-bold text-paper">{m.headingLabel}</p>
        <input
          value={value.heading || ""}
          onChange={(e) => set({ heading: e.target.value })}
          suppressHydrationWarning
          className={inputCls}
        />
      </div>

      <div>
        <p className="mb-1.5 text-sm font-bold text-paper">{m.introLabel}</p>
        <input
          value={value.intro || ""}
          onChange={(e) => set({ intro: e.target.value })}
          suppressHydrationWarning
          className={inputCls}
        />
      </div>

      <div>
        <p className="mb-1.5 text-sm font-bold text-paper">{m.ledeLabel}</p>
          <textarea
            value={value.lede || ""}
            onChange={(e) => set({ lede: e.target.value })}
            rows={3}
            suppressHydrationWarning
            className={`${inputCls} resize-y max-h-64 overflow-y-auto`}
          />
      </div>

      <div>
        <p className="mb-1.5 text-sm font-bold text-paper">{m.textLabel}</p>
        <span className="flex flex-col gap-2">
          {(value.paragraphs || []).map((p, i) => (
            <span key={i} className="flex items-start gap-2">
              <textarea
                value={p}
                onChange={(e) =>
                  set({ paragraphs: (value.paragraphs || []).map((x, k) => (k === i ? e.target.value : x)) })
                }
                rows={5}
                suppressHydrationWarning
                className={`${inputCls} resize-y max-h-64 overflow-y-auto`}
              />
              <button
                type="button"
                onClick={() => set({ paragraphs: (value.paragraphs || []).filter((_, k) => k !== i) })}
                aria-label={m.remove}
                className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-plum/30 text-lg text-plum transition-colors hover:border-plum"
              >
                <span aria-hidden="true">×</span>
              </button>
            </span>
          ))}
          <span>
            <button
              type="button"
              onClick={() => set({ paragraphs: [...(value.paragraphs || []), ""] })}
              className={miniBtn}
            >
              {m.addPara}
            </button>
          </span>
        </span>
      </div>

      <span>
        <button
          type="button"
          onClick={save}
          disabled={saving}
          className="rounded-full bg-gold px-6 py-2.5 text-sm font-bold text-paper transition-transform hover:-translate-y-0.5 disabled:opacity-60"
        >
          {m.save}
        </button>
      </span>
    </div>
  );
}
