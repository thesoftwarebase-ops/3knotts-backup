"use client";

import { useState } from "react";
import { site, getWaNumber } from "@/data/site";
import { buildEnquiryMessage } from "@/lib/whatsapp";
import Reveal from "../ui/Reveal";
import SectionHeading from "../ui/SectionHeading";
import Corners from "../ui/Corners";
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
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true" className="h-3.5 w-3.5 shrink-0 text-brand">
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
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true" className="h-4 w-4 shrink-0 text-brand">
      <circle cx="12" cy="12" r="9" />
      <path d="m8.5 12.5 2.5 2.5 4.5-5.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function AlertIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true" className="h-4 w-4 shrink-0 text-golden">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7.5V13" strokeLinecap="round" />
      <circle cx="12" cy="16.2" r="0.6" fill="currentColor" />
    </svg>
  );
}

export default function EnquiryForm({ contactEmail = "", services = [], waNumber = "", settings = {} } = {}) {
  const [values, setValues] = useState(initial);
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("");
  const [fallbackUrl, setFallbackUrl] = useState("");

  const t = site.sections.enquire;
  const f = site.form;
  const waHref = `https://wa.me/${waNumber}?text=${encodeURIComponent(site.whatsappGreeting)}`;
  const hoursDays = settings.hoursDays || site.footer.hoursDays;
  const hoursTime = settings.hoursTime || site.footer.hoursTime;

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
    "w-full rounded-sm border border-frame/25 bg-noir px-4 py-3 text-[13px] text-paper placeholder:text-paper/25 transition-[border-color,box-shadow,background-color] duration-300 hover:border-frame/40 focus:border-brand focus:bg-charcoal/[0.08] focus:outline-none focus:ring-1 focus:ring-brand/30";

  const labelCls = "mb-2 flex items-center gap-2 text-[9px] font-semibold uppercase leading-none tracking-[0.24em] text-frame/75";

  const field = (id, icon, label, control, optional) => (
    <div>
      <label htmlFor={id} className={labelCls}>
        <FieldIcon d={ICONS[icon]} />
        {label}
        {optional ? <span className="font-medium tracking-[0.14em] text-paper/30">{optional}</span> : null}
      </label>
      {control}
    </div>
  );

  return (
    <section id="enquire" aria-labelledby="enquire-heading" className="relative overflow-hidden pb-24 pt-32 sm:pb-32 sm:pt-40">
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-[30rem] bg-[radial-gradient(ellipse_at_30%_-20%,rgba(232,80,64,0.05),transparent_60%)]" />
      <div aria-hidden="true" className="pointer-events-none absolute -right-20 bottom-10 h-[26rem] w-[26rem] rounded-full bg-[radial-gradient(circle,rgba(252,204,48,0.03),transparent_65%)] blur-[80px]" />

      <div className="relative mx-auto max-w-6xl px-5 sm:px-8">
        <SectionHeading as="h1" id="enquire-heading" heading={t.heading} intro={t.intro} divider={false} />

        <div className="mt-14 grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-8">
          {/* Direct-contact panel */}
          <Reveal className="lg:col-span-5">
            <aside className="relative flex h-full flex-col gap-3 overflow-hidden rounded-sm border border-frame/20 bg-charcoal/[0.08] p-6 sm:p-7">
              <Corners className="hidden sm:block" tone="border-frame/20" />
              <p className="mb-2 font-heading text-[15px] tracking-[0.12em] text-paper">{f.sideHeading}</p>

              <a
                href={waHref}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-4 border-b border-frame/15 py-4 transition-colors duration-300 hover:border-brand/40"
              >
                <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center border border-whatsapp/40 text-whatsapp transition-colors duration-300 group-hover:bg-whatsapp group-hover:text-noir">
                  <WhatsAppIcon className="h-5 w-5" />
                </span>
                <span className="min-w-0">
                  <span className="block text-[8px] font-semibold uppercase tracking-[0.28em] text-frame/55">{f.chatInstead}</span>
                  <span className="mt-1.5 block text-[13px] font-medium text-paper">{site.footer.whatsappLabel}</span>
                </span>
                <span aria-hidden="true" className="ml-auto text-frame/40 transition-transform duration-500 group-hover:translate-x-1 group-hover:text-brand">→</span>
              </a>

              {contactEmail ? (
                <a
                  href={`mailto:${contactEmail}`}
                  className="group flex items-center gap-4 border-b border-frame/15 py-4 transition-colors duration-300 hover:border-brand/40"
                  aria-label={`${f.emailInstead} — ${contactEmail}`}
                >
                  <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center border border-frame/30 bg-noir">
                    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="h-5 w-5">
                      <rect x="3" y="5.5" width="18" height="13" rx="2" stroke="currentColor" strokeWidth="1.5" className="text-frame" />
                      <path d="m4.5 8 7.5 6 7.5-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-brand" />
                    </svg>
                  </span>
                  <span className="min-w-0">
                    <span className="block text-[8px] font-semibold uppercase tracking-[0.28em] text-frame/55">{f.emailInstead}</span>
                    <span className="mt-1.5 block break-all text-[13px] font-medium text-paper">{contactEmail}</span>
                  </span>
                </a>
              ) : null}

              <a
                href={site.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-4 border-b border-frame/15 py-4 transition-colors duration-300 hover:border-brand/40"
              >
                <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center border border-frame/30 bg-noir">
                  <InstagramIcon className="h-5 w-5" />
                </span>
                <span className="min-w-0">
                  <span className="block text-[8px] font-semibold uppercase tracking-[0.28em] text-frame/55">{site.instagramLabel}</span>
                  <span className="mt-1.5 block text-[13px] font-medium text-paper">{site.instagramHandle}</span>
                </span>
                <span aria-hidden="true" className="ml-auto text-frame/40 transition-transform duration-500 group-hover:translate-x-1 group-hover:text-brand">→</span>
              </a>

              <div className="mt-3 border border-frame/20 p-4">
                <p className="text-[8px] font-semibold uppercase tracking-[0.28em] text-frame/60">{site.footer.hoursTitle}</p>
                <p className="mt-2 text-[11px] text-paper/50">{hoursDays}</p>
                <p className="mt-1 font-heading text-[14px] tracking-[0.06em] text-paper">{hoursTime}</p>
              </div>

              <p className="mt-auto pt-4 text-[9px] font-semibold uppercase leading-[2] tracking-[0.26em] text-frame/35">
                {settings.address || site.address}
              </p>
            </aside>
          </Reveal>

          {/* Form card */}
          <Reveal delay={120} className="lg:col-span-7">
            <form
              onSubmit={onSubmit}
              className="relative h-full overflow-hidden rounded-sm border border-frame/20 bg-charcoal/[0.05] p-5 sm:p-8"
            >
              <Corners className="hidden sm:block" tone="border-frame/20" />

              <div className="relative grid grid-cols-1 gap-5 sm:grid-cols-2">
                {field("enq-name", "name", f.nameLabel,
                  <input id="enq-name" name="name" autoComplete="name" required value={values.name} onChange={onChange} suppressHydrationWarning className={inputCls} placeholder={f.namePlaceholder} />)}
                {field("enq-phone", "phone", f.phoneLabel,
                  <input id="enq-phone" name="phone" autoComplete="tel" inputMode="tel" required value={values.phone} onChange={onChange} suppressHydrationWarning className={inputCls} placeholder={f.phonePlaceholder} />)}
                {field("enq-date", "date", f.dateLabel,
                  <input id="enq-date" name="date" type="date" required value={values.date} onChange={onChange} suppressHydrationWarning className={inputCls} />)}
                {field("enq-location", "location", f.locationLabel,
                  <input id="enq-location" name="location" required value={values.location} onChange={onChange} suppressHydrationWarning className={inputCls} placeholder={f.locationPlaceholder} />)}
                {field("enq-function", "function", f.functionLabel,
                  <select id="enq-function" name="functionType" required value={values.functionType} onChange={onChange} suppressHydrationWarning className={`${inputCls} bg-noir text-paper`}>
                    <option value="" className="bg-noir text-paper">{f.functionPlaceholder}</option>
                    {services.map((s) => (
                      <option key={s.slug} value={s.title} className="bg-noir text-paper">
                        {s.title}
                      </option>
                    ))}
                  </select>)}
                {field("enq-budget", "budget", f.budgetLabel,
                  <input id="enq-budget" name="budget" value={values.budget} onChange={onChange} suppressHydrationWarning className={inputCls} placeholder={f.budgetPlaceholder} />, f.budgetOptional)}
              </div>

              <div className="relative mt-5">
                {field("enq-requirement", "requirement", f.requirementLabel,
                  <textarea
                    id="enq-requirement"
                    name="requirement"
                    required
                    rows={4}
                    value={values.requirement}
                    onChange={onChange}
                    suppressHydrationWarning
                    className={`${inputCls} max-h-44 resize-y overflow-y-auto`}
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

              <div className="relative mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
                <button
                  type="submit"
                  disabled={status === "sending"}
                  suppressHydrationWarning
                  className="btn btn-brand group w-full disabled:opacity-60"
                >
                  {status === "sending" ? f.sending : f.submit}
                  <span aria-hidden="true" className="transition-transform duration-500 group-hover:translate-x-1.5">→</span>
                </button>
              </div>

              {status === "success" && (
                <p role="status" className="relative mt-5 flex items-start gap-2.5 border border-brand/40 bg-brand/[0.06] px-4 py-3 text-[12px] leading-relaxed text-paper">
                  <CheckIcon />
                  {message}
                </p>
              )}
              {status === "error" && (
                <p role="alert" className="relative mt-5 flex items-start gap-2.5 border border-golden/40 bg-golden/[0.05] px-4 py-3 text-[12px] leading-relaxed text-paper">
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
                          className="font-semibold text-brand underline decoration-brand/50 decoration-1 underline-offset-4"
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
