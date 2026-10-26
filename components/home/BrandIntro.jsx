import Link from "next/link";
import { site } from "@/data/site";
import Reveal from "../ui/Reveal";
import SectionDivider from "../ui/SectionDivider";

// The opening statement: a quiet, framed plate on black. Photograph-free
// so it reads as the calm beat between the hero and the work.
export default function BrandIntro({ brand = site.brand }) {
  const b = brand;
  return (
    <section
      id="intro"
      aria-labelledby="brand-heading"
      className="relative overflow-hidden border-b border-frame/10 py-16 sm:py-22"
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-frame/25 to-transparent" />
      <div aria-hidden="true" className="pointer-events-none absolute left-1/2 top-0 h-[28rem] w-[46rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(126,37,48,0.05),transparent_62%)] blur-[100px]" />
      <div aria-hidden="true" className="pointer-events-none absolute left-1/2 top-1/2 h-[34rem] w-[34rem] -translate-x-1/2 -translate-y-1/2 opacity-[0.05] bg-[url('data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22200%22%20height%3D%22200%22%20viewBox%3D%220%200%20200%20200%22%3E%3Cpath%20d%3D%22M100%2020c0%2044-36%2080-80%2080%2044%200%2080%2036%2080%2080%200-44%2036-80%2080-80-44%200-80-36-80-80z%22%20fill%3D%22none%22%20stroke%3D%22%238C6D2A%22%20stroke-width%3D%221%22%2F%3E%3Ccircle%20cx%3D%22100%22%20cy%3D%22100%22%20r%3D%2220%22%20fill%3D%22none%22%20stroke%3D%22%238C6D2A%22%20stroke-width%3D%220.8%22%2F%3E%3Ccircle%20cx%3D%22100%22%20cy%3D%22100%22%20r%3D%2240%22%20fill%3D%22none%22%20stroke%3D%22%238C6D2A%22%20stroke-width%3D%220.5%22%2F%3E%3C%2Fsvg%3E')] bg-contain bg-center" />

      <div className="relative mx-auto max-w-4xl px-5 sm:px-8">
        <Reveal className="text-center">
          <div className="flex justify-center">
            <SectionDivider align="center" />
          </div>

          <p className="eyebrow mt-6">{site.name}</p>

          <h2
            id="brand-heading"
            className="mx-auto mt-5 max-w-3xl font-heading text-[clamp(1.9rem,5vw,3.4rem)] leading-[1.14] text-paper"
          >
            {b.heading}
          </h2>

          {/* Ornamental rule */}
          <div className="mx-auto mt-7 flex w-56 items-center gap-3 sm:w-72" aria-hidden="true">
            <span className="h-px flex-1 bg-gradient-to-r from-transparent to-frame/45" />
            <span className="h-1.5 w-1.5 rotate-45 bg-golden shadow-[0_0_14px_rgba(166,124,0,0.45)]" />
            <span className="h-px flex-1 bg-gradient-to-l from-transparent to-frame/45" />
          </div>

          <p className="mx-auto mt-7 max-w-2xl text-[14px] leading-[2] text-paper/60 sm:text-[15px]">
            {b.text}
          </p>

          <div className="mt-8 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center sm:gap-4">
            <Link href={site.navCta.href} className="btn btn-brand group">
              {site.navCta.label}
              <span aria-hidden="true" className="transition-transform duration-500 group-hover:translate-x-1.5">→</span>
            </Link>
            <Link href={b.cta.href} className="btn btn-ghost group">
              {b.cta.label}
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
