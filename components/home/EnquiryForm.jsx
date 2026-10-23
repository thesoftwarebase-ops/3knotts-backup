"use client";

import { useState } from "react";
import { site, getWaNumber } from "@/data/site";
import { buildEnquiryMessage } from "@/lib/whatsapp";
import Reveal from "../ui/Reveal";
import SectionHeading from "../ui/SectionHeading";
import { InstagramIcon, WhatsAppIcon } from "../ui/SocialIcons";

const initial = {
  name: "",
  phone: "",
  date: "",
  location: "",
  functionType: "",
  requirement: "",
  budget: ""
};

function FieldIcon({ d }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true" className="h-4 w-4 shrink-0 text-teal-bright">
      <path d={d} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const ICONS = {
  name: "M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm-7 8a7 7 0 0 1 14 0",
  phone: "M5 4h4l2 5-2.5 1.5a12 12 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z",
  date: "M8 2v4M16 2v4M3 9h18M5 5h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z",
  location: "M12 21s7-5.5 7-11a7 7 0 1 0-14 0c0 5.5 7 11 7 11Z M12 12a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z",
  function: "M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M18.4 5.6l-2.1 2.1M7.7 16.3l-2.1 2.1",
  budget: "M3 8a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8Z M3 10h18 M16 15h2",
  requirement: "M4 6h16M4 12h16M4 18h10"
};

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true" className="h-5 w-5 shrink-0 text-teal-bright">
      <circle cx="12" cy="12" r="9" />
      <path d="m8.5 12.5 2.5 2.5 4.5-5.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function AlertIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true" className="h-5 w-5 shrink-0 text-plum">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7.5V13" strokeLinecap="round" />
      <circle cx="12" cy="16.2" r="0.6" fill="currentColor" />
    </svg>
  );
}

export default function EnquiryForm({ contactEmail = "" } = {}) {
  const [values, setValues] = useState(initial);
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("");
  const [fallbackUrl, setFallbackUrl] = useState("");

  const t = site.sections.enquire;
  const f = site.form;
  const waHref = `https://wa.me/${getWaNumber()}?text=${encodeURIComponent(site.whatsappGreeting)}`;

  function onChange(e) {
    const { name, value } = e.target;
    setValues((v) => ({ ...v, [name]: value }));
  }

  async function onSubmit(e) {
    e.preventDefault();
    setStatus("sending");
    setMessage("");
    setFallbackUrl("");

    const honeypot = e.target.elements.namedItem("company_website")?.value || "";

    try {
      const res = await fetch("/api/enquire", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, company_website: honeypot })
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.ok) {
        if (data.whatsappUrl) setFallbackUrl(data.whatsappUrl);
        throw new Error(data.error || f.errorFallback);
      }
      setStatus("success");
      setMessage(f.success);
      // Best-effort email: the submission to Web3Forms goes from this
      // browser (their edge only accepts browser traffic). Failures are
      // swallowed — the enquiry is already saved on the server.
      const notifyKeys = Array.isArray(data.notifyKeys) ? data.notifyKeys : [];
      if (notifyKeys.length) {
        const received = new Date().toLocaleString("en-IN", { dateStyle: "long", timeStyle: "short" });
        const body = {
          subject: `New enquiry — ${values.name || "Website form"}`,
          from_name: site.name,
          message: [buildEnquiryMessage(values), `Received: ${received}`, "Source: website enquiry form"].join("\n")
        };
        notifyKeys.forEach((accessKey) => {
          fetch("https://api.web3forms.com/submit", {
            method: "POST",
            headers: { "Content-Type": "application/json", Accept: "application/json" },
            body: JSON.stringify({ ...body, access_key: accessKey })
          }).catch(() => {});
        });
      }
      setValues(initial);
    } catch (err) {
      setStatus("error");
      setMessage(err.message || f.errorGeneric);
    }
  }

  const inputCls =
    "w-full rounded-xl border border-teal-mid/30 bg-ivory/60 px-4 py-3 text-base text-ink shadow-[inset_0_2px_6px_rgba(11,59,60,0.06)] placeholder:text-ink/40 transition-all focus:border-gold focus:bg-white focus:outline-none focus:ring-2 focus:ring-gold/40";

  const labelCls = "mb-1.5 flex items-center gap-2 text-sm font-bold text-ink";

  const field = (id, icon, label, control, optional) => (
    <div>
      <label htmlFor={id} className={labelCls}>
        <FieldIcon d={ICONS[icon]} />
        {label}
        {optional ? <span className="font-medium text-ink/50">{optional}</span> : null}
      </label>
      {control}
    </div>
  );

  return (
    <section id="enquire" aria-labelledby="enquire-heading" className="relative overflow-clip bg-sand/40 py-16 sm:py-24">
      <div aria-hidden="true" className="pointer-events-none absolute -left-24 top-10 hidden w-[340px] opacity-20 lg:block [mask-image:radial-gradient(closest-side,black_70%,transparent)]">
        <img src={site.flower} alt="" draggable={false} loading="lazy" className="h-auto w-full -scale-x-100 select-none" />
      </div>
      <div aria-hidden="true" className="pointer-events-none absolute -right-24 bottom-10 hidden w-[340px] opacity-20 lg:block [mask-image:radial-gradient(closest-side,black_70%,transparent)]">
        <img src={site.flower} alt="" draggable={false} loading="lazy" className="h-auto w-full select-none" />
      </div>

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading id="enquire-heading" heading={t.heading} intro={t.intro} tone="dark" />

        <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-5 lg:gap-8">
          {/* Direct-contact panel */}
          <Reveal className="lg:col-span-2">
            <aside className="flex h-full flex-col gap-4 rounded-3xl border border-gold/50 bg-teal-deep p-6 text-ivory sm:p-7">
              <p className="font-tagline text-3xl font-bold text-gold-soft">{f.sideHeading}</p>
              <a
                href={waHref}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-4 rounded-2xl border border-ivory/15 bg-ivory/5 p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-gold/60"
              >
                <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-whatsapp text-white transition-transform duration-300 group-hover:scale-110">
                  <WhatsAppIcon className="h-6 w-6" />
                </span>
                <span>
                  <span className="block text-sm font-medium text-ivory/70">{f.chatInstead}</span>
                  <span className="block text-lg font-bold text-ivory">{site.footer.whatsappLabel}</span>
                </span>
              </a>
              {contactEmail ? (
                <a
                  href={`mailto:${contactEmail}`}
                  className="group flex items-center gap-4 rounded-2xl border border-ivory/15 bg-ivory/5 p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-gold/60"
                  aria-label={`${f.emailInstead} — ${contactEmail}`}
                >
                  <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white transition-transform duration-300 group-hover:scale-110">
                    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="h-6 w-6">
                      <path d="M4 6.5A2.5 2.5 0 0 1 6.5 4h11A2.5 2.5 0 0 1 20 6.5v11a2.5 2.5 0 0 1-2.5 2.5h-11A2.5 2.5 0 0 1 4 17.5v-11Z" fill="#ffffff" stroke="#EA4335" strokeWidth="1.6" />
                      <path d="m5.5 8.5 6.5 5.5 6.5-5.5" stroke="#EA4335" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                  <span className="min-w-0">
                    <span className="block text-sm font-medium text-ivory/70">{f.emailInstead}</span>
                    <span className="block break-all text-lg font-bold text-ivory">{contactEmail}</span>
                  </span>
                </a>
              ) : null}
              <a
                href={site.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-4 rounded-2xl border border-ivory/15 bg-ivory/5 p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-gold/60"
              >
                <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white transition-transform duration-300 group-hover:scale-110">
                  <InstagramIcon className="h-6 w-6" />
                </span>
                <span>
                  <span className="block text-sm font-medium text-ivory/70">{site.instagramLabel}</span>
                  <span className="block text-lg font-bold text-ivory">{site.instagramHandle}</span>
                </span>
              </a>
              <div className="rounded-2xl border border-dashed border-gold/50 p-4">
                <p className="text-sm font-bold text-gold-soft">{site.footer.hoursTitle}</p>
                <p className="mt-1 text-sm text-ivory/80">{site.footer.hoursDays}</p>
                <p className="font-tagline text-2xl font-bold text-ivory">{site.footer.hoursTime}</p>
              </div>
            </aside>
          </Reveal>

          {/* Form card */}
          <Reveal delay={120} className="lg:col-span-3">
            <form onSubmit={onSubmit} className="relative h-full overflow-hidden rounded-3xl border border-gold/50 bg-white p-5 shadow-[0_28px_70px_-28px_rgba(11,59,60,0.45)] sm:p-8">
              <span aria-hidden="true" className="pointer-events-none absolute inset-2 rounded-2xl border border-gold/30" />
              <div className="relative grid grid-cols-1 gap-4 sm:grid-cols-2">
                {field("enq-name", "name", f.nameLabel,
                  <input id="enq-name" name="name" autoComplete="name" required value={values.name} onChange={onChange} suppressHydrationWarning className={inputCls} placeholder={f.namePlaceholder} />)}
                {field("enq-phone", "phone", f.phoneLabel,
                  <input id="enq-phone" name="phone" autoComplete="tel" inputMode="tel" required value={values.phone} onChange={onChange} suppressHydrationWarning className={inputCls} placeholder={f.phonePlaceholder} />)}
                {field("enq-date", "date", f.dateLabel,
                  <input id="enq-date" name="date" type="date" required value={values.date} onChange={onChange} suppressHydrationWarning className={inputCls} />)}
                {field("enq-location", "location", f.locationLabel,
                  <input id="enq-location" name="location" required value={values.location} onChange={onChange} suppressHydrationWarning className={inputCls} placeholder={f.locationPlaceholder} />)}
                {field("enq-function", "function", f.functionLabel,
                  <select id="enq-function" name="functionType" required value={values.functionType} onChange={onChange} suppressHydrationWarning className={inputCls}>
                    <option value="">{f.functionPlaceholder}</option>
                    {site.functions.map((fn) => (
                      <option key={fn} value={fn}>
                        {fn}
                      </option>
                    ))}
                  </select>)}
                {field("enq-budget", "budget", f.budgetLabel,
                  <input id="enq-budget" name="budget" value={values.budget} onChange={onChange} suppressHydrationWarning className={inputCls} placeholder={f.budgetPlaceholder} />, f.budgetOptional)}
              </div>

              <div className="relative mt-4">
                {field("enq-requirement", "requirement", f.requirementLabel,
                  <textarea
                    id="enq-requirement"
                    name="requirement"
                    required
                    rows={4}
                    value={values.requirement}
                onChange={onChange}
                suppressHydrationWarning
                className={`${inputCls} resize-y max-h-44 overflow-y-auto`}
                    placeholder={f.requirementPlaceholder}
                  />)}
              </div>

            <div className="honeypot" aria-hidden="true">
              <label>
                Company website
                <input
                  type="text"
                  name="company_website"
                  tabIndex={-1}
                  autoComplete="off"
                  readOnly
                  onFocus={(e) => e.currentTarget.removeAttribute("readOnly")}
                  suppressHydrationWarning
                />
              </label>
            </div>

              <div className="relative mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
              <button
              type="submit"
              disabled={status === "sending"}
              suppressHydrationWarning
                  className="group inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-gold px-8 py-4 text-center text-base font-bold text-ink shadow-[0_12px_32px_-10px_rgba(212,167,60,0.9)] transition-all hover:-translate-y-0.5 hover:shadow-[0_18px_40px_-10px_rgba(212,167,60,1)] disabled:opacity-60"
                >
                  {status === "sending" ? f.sending : f.submit}
                  <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">→</span>
                </button>
              </div>

              {status === "success" && (
                <p role="status" className="relative mt-4 flex items-start gap-2.5 rounded-2xl border border-teal-bright/50 bg-ivory/70 px-4 py-3 text-[15px] text-ink">
                  <CheckIcon />
                  {message}
                </p>
              )}
            {status === "error" && (
              <p role="alert" className="relative mt-4 flex items-start gap-2.5 rounded-2xl border border-plum/40 bg-ivory/70 px-4 py-3 text-[15px] text-plum">
                <AlertIcon />
                <span>
                  {message}
                  {fallbackUrl ? (
                    <>
                      {" "}
                      <a
                        href={fallbackUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-semibold text-teal-bright underline decoration-gold decoration-2 underline-offset-4"
                      >
                        {f.sendViaWhatsApp}
                      </a>
                    </>
                  ) : null}
                </span>
              </p>
            )}
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
