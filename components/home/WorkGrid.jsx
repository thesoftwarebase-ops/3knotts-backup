import Image from "next/image";
import Link from "next/link";
import { site, services as seedServices, serviceHref } from "@/data/site";
import { mediaImage } from "@/lib/media";
import Reveal from "../ui/Reveal";
import SectionHeading from "../ui/SectionHeading";

// Our Work shows gallery shots explicitly flagged featured:true —
// one (or more) per service, across every service. Flip any shot's
// featured flag in site.js (or the dashboard later) to curate this grid.
function workTiles(all) {
  const tiles = [];
  for (const s of all) {
    for (const g of s.gallery || []) {
      if (g.featured === true) tiles.push({ src: g.src, caption: g.caption || s.title, service: s });
    }
  }
  return tiles;
}

export default function WorkGrid({ services = seedServices }) {
  const t = site.sections.work;
  const tiles = workTiles(services);
  return (
    <section id="work" aria-labelledby="work-heading" className="bg-ivory pb-6 pt-16 sm:pb-8 sm:pt-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading id="work-heading" heading={t.heading} intro={t.intro} tone="dark" />

        <ul className="mt-10 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3">
          {tiles.map((w, i) => (
            <li key={`${w.service.slug}-${i}`} className="h-full">
              <Reveal delay={Math.min(i * 70, 280)} className="h-full">
                <Link
                  href={serviceHref(w.service.slug)}
                  className="group relative block h-full overflow-hidden rounded-2xl border border-gold/50 bg-sand/40 transition-all duration-300 hover:-translate-y-1 hover:border-gold hover:shadow-[0_24px_50px_-20px_rgba(11,59,60,0.5)]"
                  aria-label={`${w.caption} — ${w.service.title}`}
                >
                  <span className="relative block aspect-[4/5] overflow-hidden">
                    <Image
                      src={mediaImage(w.src)}
                      alt=""
                      aria-hidden="true"
                      fill
                      loading="lazy"
                      sizes="(max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <span
                      aria-hidden="true"
                      className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent opacity-90 transition-opacity duration-300 group-hover:opacity-100"
                    />
                  </span>
                  <span className="absolute inset-x-0 bottom-0 p-4 sm:p-5">
                    <span className="block font-tagline text-2xl font-bold leading-tight text-ivory sm:text-3xl">
                      {w.caption}
                    </span>
                    <span className="mt-1 block text-[13px] font-semibold uppercase tracking-[0.14em] text-gold-soft/90">
                      {w.service.title}
                    </span>
                    <span className="mt-1.5 inline-flex translate-y-1 items-center gap-1.5 text-sm font-semibold text-gold-soft opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                      {site.servicesPage.exploreLabel}
                      <span aria-hidden="true">→</span>
                    </span>
                  </span>
                  <span
                    aria-hidden="true"
                    className="absolute left-3 top-3 rounded-full bg-black/40 px-2.5 py-1 font-tagline text-base font-bold leading-none text-ivory backdrop-blur-sm"
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </Link>
              </Reveal>
            </li>
          ))}
        </ul>

        <Reveal className="mt-6 text-center">
          <a
            href={site.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-teal-deep px-7 py-3 text-base font-semibold text-ivory transition-transform hover:-translate-y-0.5"
          >
            {site.instagramLabel}
            <span aria-hidden="true">↗</span>
          </a>
        </Reveal>
      </div>
    </section>
  );
}
