import Link from "next/link";
import { site, getWaNumber } from "@/data/site";
import Reveal from "./Reveal";
import SectionDivider from "./SectionDivider";
import { WhatsAppIcon } from "./SocialIcons";

// Shared closing band. Rendered at the end of every page.
export default function CtaBand() {
  const c = site.cta;
  const waHref = `https://wa.me/${getWaNumber()}?text=${encodeURIComponent(site.whatsappGreeting)}`;
  return (
    <section aria-label={c.heading} className="border-y border-gold/50 bg-sand/50">
      <div className="mx-auto max-w-3xl px-4 py-14 text-center sm:px-6 sm:py-20">
        <Reveal>
          <SectionDivider align="center" />
          <h2 className="mt-4 font-tagline text-4xl font-bold text-plum sm:text-5xl">
            {c.heading}
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-base leading-relaxed text-ink/80">
            {c.text}
          </p>
          <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href={site.navCta.href}
              className="w-full rounded-full bg-gold px-8 py-3.5 text-center text-base font-bold text-ink transition-transform hover:-translate-y-0.5 sm:w-auto"
            >
              {site.navCta.label}
            </Link>
            <a
              href={waHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-teal-deep px-8 py-3.5 text-center text-base font-semibold text-ivory transition-transform hover:-translate-y-0.5 sm:w-auto"
            >
              <WhatsAppIcon className="h-5 w-5" />
              {site.footer.whatsappLabel}
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
