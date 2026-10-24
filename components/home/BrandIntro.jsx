import Link from "next/link";
import { site } from "@/data/site";
import Reveal from "../ui/Reveal";
import SectionDivider from "../ui/SectionDivider";
import Corners from "../ui/Corners";

// The opening statement: a quiet, framed plate on black. Photograph-free
// so it reads as the calm beat between the hero and the work.
export default function BrandIntro({ brand = site.brand }) {
  const b = brand;
  return (
    <section
      id="intro"
      aria-labelledby="brand-heading"
      className="relative overflow-hidden border-b border-frame/10 py-28 sm:py-36"
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-frame/25 to-transparent" />
      <div aria-hidden="true" className="pointer-events-none absolute left-1/2 top-0 h-[28rem] w-[46rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(232,80,64,0.035),transparent_62%)] blur-[100px]" />

      <div className="relative mx-auto max-w-4xl px-5 sm:px-8">
        <Reveal className="text-center">
          <div className="flex justify-center">
            <SectionDivider align="center" />
          </div>

          <p className="eyebrow mt-8">{site.name}</p>

          <h2
            id="brand-heading"
            className="mx-auto mt-6 max-w-3xl font-heading text-[clamp(1.9rem,5vw,3.4rem)] leading-[1.14] text-paper"
          >
            {b.heading}
          </h2>

          {/* Ornamental rule */}
          <div className="mx-auto mt-10 flex w-56 items-center gap-3 sm:w-72" aria-hidden="true">
            <span className="h-px flex-1 bg-gradient-to-r from-transparent to-frame/45" />
            <span className="h-1.5 w-1.5 rotate-45 bg-golden shadow-[0_0_14px_rgba(252,204,48,0.65)]" />
            <span className="h-px flex-1 bg-gradient-to-l from-transparent to-frame/45" />
          </div>

          <p className="mx-auto mt-10 max-w-2xl text-[14px] leading-[2] text-paper/60 sm:text-[15px]">
            {b.text}
          </p>

          <div className="mt-12 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center sm:gap-4">
            <Link href={site.navCta.href} className="btn btn-brand group">
              {site.navCta.label}
              <span aria-hidden="true" className="transition-transform duration-500 group-hover:translate-x-1.5">→</span>
            </Link>
            <Link href={b.cta.href} className="btn btn-ghost group">
              {b.cta.label}
            </Link>
          </div>
        </Reveal>

        {/* Quiet house details, set like a colophon */}
        <Reveal delay={140}>
          <div className="relative mt-20 grid grid-cols-1 gap-px border-y border-frame/10 bg-frame/10 sm:grid-cols-3">
            <Corners className="hidden sm:block" tone="border-frame/20" />
            {[
              { k: site.addressParts.locality, v: site.addressParts.street },
              { k: site.footer.hoursTitle, v: `${site.footer.hoursDays} · ${site.footer.hoursTime}` },
              { k: site.instagramLabel, v: site.instagramHandle }
            ].map((row) => (
              <div key={row.k} className="bg-noir px-5 py-6 text-center sm:px-6">
                <p className="text-[8px] font-semibold uppercase leading-none tracking-[0.34em] text-frame/55">
                  {row.k}
                </p>
                <p className="mt-3 text-[11px] font-medium leading-[1.7] text-paper/65">{row.v}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
