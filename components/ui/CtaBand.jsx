import Link from "next/link";
import { site, getWaNumber } from "@/data/site";
import Reveal from "./Reveal";
import SectionDivider from "./SectionDivider";
import Corners from "./Corners";
import { WhatsAppIcon } from "./SocialIcons";

// Shared closing band. Rendered at the end of every page.
export default function CtaBand() {
  const c = site.cta;
  const waHref = `https://wa.me/${getWaNumber()}?text=${encodeURIComponent(site.whatsappGreeting)}`;
  return (
    <section
      aria-label={c.heading}
      className="relative overflow-hidden border-y border-frame/20 bg-noir py-24 sm:py-32"
    >
      {/* Ember wash + oversized outlined word behind the message */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_115%,rgba(232,80,64,0.06),transparent_62%)]" />
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_15%_-10%,rgba(252,204,48,0.03),transparent_55%)]" />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 select-none whitespace-nowrap text-center font-heading text-[19vw] leading-none text-transparent [-webkit-text-stroke:1px_rgba(210,174,144,0.10)]"
      >
        {site.navCta.label}
      </span>

      <Corners className="hidden sm:block" tone="border-frame/25" />

      <div className="relative mx-auto max-w-3xl px-5 text-center sm:px-8">
        <Reveal>
          <div className="flex justify-center">
            <SectionDivider align="center" />
          </div>

          <h2 className="mt-8 font-heading text-[clamp(1.9rem,5vw,3.1rem)] leading-[1.12] text-paper">
            {c.heading}
          </h2>
          <p className="mx-auto mt-5 max-w-lg text-[14px] leading-[1.9] text-paper/60 sm:text-[15px]">
            {c.text}
          </p>

          <div className="mt-11 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
            <Link href={site.navCta.href} className="btn btn-brand w-full sm:w-auto">
              {site.navCta.label}
              <span aria-hidden="true" className="transition-transform duration-500 group-hover:translate-x-1">→</span>
            </Link>
            <a
              href={waHref}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-ghost w-full sm:w-auto"
            >
              <WhatsAppIcon className="h-4 w-4" />
              {site.footer.whatsappLabel}
            </a>
          </div>

          <p className="mx-auto mt-9 max-w-sm text-[9px] font-medium uppercase leading-none tracking-[0.34em] text-frame/45">
            {site.tagline}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
