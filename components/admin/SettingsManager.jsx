"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { showBusy, hideBusy } from "@/lib/busy";
import { site } from "@/data/site";
import { authHeaders } from "./upload";

const inputCls =
  "w-full rounded-xl border border-frame/25 bg-charcoal/60 px-4 py-2.5 text-[15px] text-paper focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/40";
const saveBtn =
  "rounded-full bg-gold px-6 py-2.5 text-sm font-bold text-paper transition-transform hover:-translate-y-0.5 disabled:opacity-60";

export default function SettingsManager() {
  const t = site.dashboard.settingsMgr;
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [address, setAddress] = useState("");
  const [hoursDays, setHoursDays] = useState("");
  const [hoursTime, setHoursTime] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let live = true;
    fetch("/api/admin/settings", { headers: authHeaders() })
      .then(async (res) => {
        const data = await res.json().catch(() => ({}));
        if (!res.ok || !data.ok) throw new Error(data.error || "Could not load settings.");
        if (live) {
          setWhatsappNumber(data.settings?.whatsappNumber || "");
          setAddress(data.settings?.address || "");
          setHoursDays(data.settings?.hoursDays || "");
          setHoursTime(data.settings?.hoursTime || "");
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
    showBusy(t.save);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: authHeaders(),
        body: JSON.stringify({
          whatsappNumber: whatsappNumber.trim(),
          address: address.trim(),
          hoursDays: hoursDays.trim(),
          hoursTime: hoursTime.trim()
        })
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.ok) throw new Error(data.error || "Save failed.");
      if (data.settings) {
        setWhatsappNumber(data.settings.whatsappNumber || "");
        setAddress(data.settings.address || "");
        setHoursDays(data.settings.hoursDays || "");
        setHoursTime(data.settings.hoursTime || "");
      }
      toast.success(t.saved);
    } catch (err) {
      toast.error(err.message);
    } finally {
      hideBusy();
      setSaving(false);
    }
  }

  if (loading) return <p className="mt-6 text-paper/60">{site.dashboard.loading}</p>;

  return (
    <div className="mt-6 flex max-w-2xl flex-col gap-4 rounded-2xl border border-gold/50 bg-charcoal/60 p-5 sm:p-6">
      <div>
        <p className="font-tagline text-3xl font-bold text-plum">{t.title}</p>
        <p className="mt-1 text-sm leading-relaxed text-paper/70">{t.intro}</p>
      </div>

      <div>
        <p className="mb-1.5 text-sm font-bold text-paper">{t.whatsappLabel}</p>
        <p className="mb-2 text-[13px] text-paper/60">{t.whatsappNote}</p>
        <input
          value={whatsappNumber}
          onChange={(e) => setWhatsappNumber(e.target.value)}
          suppressHydrationWarning
          autoComplete="off"
          inputMode="tel"
          placeholder={t.whatsappPlaceholder}
          className={inputCls}
        />
      </div>

      <div>
        <p className="mb-1.5 text-sm font-bold text-paper">{t.addressLabel}</p>
        <textarea
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          suppressHydrationWarning
          rows={3}
          placeholder={t.addressPlaceholder}
          className={`${inputCls} resize-y max-h-32 overflow-y-auto`}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <p className="mb-1.5 text-sm font-bold text-paper">{t.hoursDaysLabel}</p>
          <input
            value={hoursDays}
            onChange={(e) => setHoursDays(e.target.value)}
            suppressHydrationWarning
            placeholder={t.hoursDaysPlaceholder}
            className={inputCls}
          />
        </div>
        <div>
          <p className="mb-1.5 text-sm font-bold text-paper">{t.hoursTimeLabel}</p>
          <input
            value={hoursTime}
            onChange={(e) => setHoursTime(e.target.value)}
            suppressHydrationWarning
            placeholder={t.hoursTimePlaceholder}
            className={inputCls}
          />
        </div>
      </div>

      <button type="button" onClick={save} disabled={saving} className={saveBtn}>
        {t.save}
      </button>
    </div>
  );
}
