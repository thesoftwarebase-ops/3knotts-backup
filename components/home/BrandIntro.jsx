import Link from "next/link";
import { site } from "@/data/site";
import Reveal from "../ui/Reveal";
import SectionDivider from "../ui/SectionDivider";

export default function BrandIntro({ brand = site.brand }) {
  const b = brand;
  return (
    <section aria-labelledby="brand-heading" className="bg-white pb-20 pt-16 sm:pb-28 sm:pt-24">
      <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
        <Reveal>
          <SectionDivider align="center" />
          <p className="mt-5 text-sm font-semibold uppercase tracking-[0.22em] text-teal-bright">
            {site.name}
          </p>
          <h2 id="brand-heading" className="mx-auto mt-3 max-w-2xl font-tagline text-5xl font-bold leading-tight text-plum sm:text-6xl">
            {b.heading}
          </h2>
          <div className="mx-auto mt-5 flex max-w-md items-center gap-3" aria-hidden="true">
            <span className="h-px flex-1 bg-gradient-to-r from-transparent to-gold" />
            <span className="h-2 w-2 rotate-45 border border-gold bg-gold/30" />
            <span className="h-px flex-1 bg-gradient-to-l from-transparent to-gold" />
          </div>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-ink/80 sm:text-lg">
            {b.text}
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href={site.navCta.href}
              className="w-full rounded-full bg-gold px-8 py-3.5 text-center text-base font-bold text-ink shadow-[0_10px_30px_-10px_rgba(212,167,60,0.9)] transition-all hover:-translate-y-0.5 sm:w-auto"
            >
              {site.navCta.label}
            </Link>
            <Link
              href={b.cta.href}
              className="w-full rounded-full border border-teal-deep/30 px-8 py-3.5 text-center text-base font-semibold text-teal-deep transition-all hover:-translate-y-0.5 hover:border-gold sm:w-auto"
            >
              {b.cta.label}
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
