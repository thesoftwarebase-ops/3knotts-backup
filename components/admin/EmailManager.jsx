"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { showBusy, hideBusy } from "@/lib/busy";
import { site } from "@/data/site";
import { authHeaders } from "./upload";

const inputCls =
  "w-full rounded-xl border border-teal-mid/30 bg-white px-4 py-2.5 text-[15px] text-ink focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/40";
const miniBtn =
  "rounded-full border border-gold/60 px-4 py-2 text-sm font-bold text-ink transition-all hover:-translate-y-0.5 hover:border-gold disabled:opacity-60";
const dangerBtn =
  "rounded-full border border-plum/30 px-4 py-2 text-sm font-semibold text-plum transition-colors hover:border-plum";
const saveBtn =
  "rounded-full bg-gold px-6 py-2.5 text-sm font-bold text-ink transition-transform hover:-translate-y-0.5 disabled:opacity-60";

// Dashboard → Email. Stores the client's free Web3Forms access key
// (created at web3forms.com with their inbox) plus the business Gmail
// address shown on the Enquiry page. The key lives server-side in
// MongoDB; this panel only ever sees a masked preview of it. A key on
// file means every enquiry is emailed automatically — no toggle.
export default function EmailManager() {
  const t = site.dashboard.emailMgr;
  const [hasKey, setHasKey] = useState(false);
  const [keyPreview, setKeyPreview] = useState("");
  const [key, setKey] = useState("");
  const [gmail, setGmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);

  useEffect(() => {
    let live = true;
    fetch("/api/admin/email", { headers: authHeaders() })
      .then(async (res) => {
        const data = await res.json().catch(() => ({}));
        if (!res.ok || !data.ok) throw new Error(data.error || "Could not load.");
        if (live) {
          setHasKey(Boolean(data.hasKey));
          setKeyPreview(data.keyPreview || "");
          setGmail(typeof data.gmail === "string" ? data.gmail : "");
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

  // An empty key field means "no change". A non-empty field replaces
  // the stored key.
  async function save() {
    if (!hasKey && !key.trim() && !gmail.trim()) {
      toast.error(t.noKey);
      return;
    }
    setSaving(true);
    showBusy(t.save);
    try {
      const res = await fetch("/api/admin/email", {
        method: "PUT",
        headers: authHeaders(),
        body: JSON.stringify({ key: key.trim(), gmail: gmail.trim() })
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.ok) throw new Error(data.error || "Save failed.");
      setHasKey(Boolean(data.hasKey));
      setKeyPreview(data.keyPreview || "");
      setGmail(typeof data.gmail === "string" ? data.gmail : "");
      setKey("");
      toast.success(t.saved);
    } catch (err) {
      toast.error(err.message);
    } finally {
      hideBusy();
      setSaving(false);
    }
  }

  async function test() {
    setTesting(true);
    showBusy(t.testing);
    try {
      const res = await fetch("/api/admin/email", { method: "POST", headers: authHeaders() });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.ok || !Array.isArray(data.payloads) || !data.payloads.length) {
        throw new Error(data.error || "Test email failed.");
      }
      // Web3Forms' edge accepts browser traffic only — each composed
      // payload is relayed from this tab and its real reply surfaced.
      const results = await Promise.all(
        data.payloads.map((p) =>
          fetch("https://api.web3forms.com/submit", {
            method: "POST",
            headers: { "Content-Type": "application/json", Accept: "application/json" },
            body: JSON.stringify(p)
          })
            .then(async (wf) => {
              let out = {};
              try {
                out = await wf.json();
              } catch {}
              return {
                sent: wf.ok && out.success === true,
                error: (out && (out.message || out.detail)) || `HTTP ${wf.status}`
              };
            })
            .catch((e) => ({ sent: false, error: e.message || "Request failed." }))
        )
      );
      const sent = results.filter((r) => r.sent).length;
      if (sent < data.payloads.length) {
        const errs = results.filter((r) => !r.sent).map((r) => r.error).join(" | ");
        throw new Error(`${t.errors.testFailed} ${errs}`);
      }
      setHasKey(Boolean(data.hasKey));
      setKeyPreview(data.keyPreview || keyPreview);
      toast.success(t.testSent);
    } catch (err) {
      toast.error(err.message);
    } finally {
      hideBusy();
      setTesting(false);
    }
  }

  async function remove() {
    if (!window.confirm(t.removeConfirm)) return;
    setSaving(true);
    showBusy(site.dashboard.working);
    try {
      const res = await fetch("/api/admin/email", { method: "DELETE", headers: authHeaders() });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.ok) throw new Error(data.error || "Remove failed.");
      setHasKey(false);
      setKeyPreview("");
      setKey("");
      setGmail("");
      toast.success(t.removed);
    } catch (err) {
      toast.error(err.message);
    } finally {
      hideBusy();
      setSaving(false);
    }
  }

  if (loading) return <p className="mt-6 text-ink/60">{site.dashboard.loading}</p>;

  return (
    <div className="mt-6 flex max-w-2xl flex-col gap-4 rounded-2xl border border-gold/50 bg-white p-5 sm:p-6">
      <div>
        <p className="font-tagline text-3xl font-bold text-plum">{t.title}</p>
        <p className="mt-1 text-sm leading-relaxed text-ink/70">{t.intro}</p>
      </div>

      {hasKey ? (
        <p className="inline-flex w-fit items-center gap-2 rounded-full bg-gold/15 px-4 py-1.5 text-sm font-bold text-[#8a6a1f]">
          {t.onFile}
          <span aria-hidden="true">·</span>
          {keyPreview}
        </p>
      ) : null}

      <div>
        <p className="mb-1.5 text-sm font-bold text-ink">{t.keyLabel}</p>
        <input
          value={key}
          onChange={(e) => setKey(e.target.value)}
          suppressHydrationWarning
          autoComplete="off"
          spellCheck="false"
          inputMode="text"
          placeholder={hasKey ? t.keyKeep : t.keyPlaceholder}
          className={inputCls}
        />
      </div>

      <div>
        <p className="mb-1.5 text-sm font-bold text-ink">{t.gmailLabel}</p>
        <p className="mb-2 text-[13px] text-ink/60">{t.gmailNote}</p>
        <input
          value={gmail}
          onChange={(e) => setGmail(e.target.value)}
          suppressHydrationWarning
          autoComplete="off"
          type="email"
          inputMode="email"
          placeholder={t.gmailPlaceholder}
          className={inputCls}
        />
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <button type="button" onClick={save} disabled={saving} className={saveBtn}>
          {t.save}
        </button>
        <button
          type="button"
          onClick={test}
          disabled={testing || !hasKey}
          title={hasKey ? undefined : t.noKey}
          className={miniBtn}
        >
          {testing ? t.testing : t.test}
        </button>
        {hasKey ? (
          <button type="button" onClick={remove} disabled={saving} className={`${dangerBtn} ml-auto`}>
            {t.remove}
          </button>
        ) : null}
      </div>
    </div>
  );
}
