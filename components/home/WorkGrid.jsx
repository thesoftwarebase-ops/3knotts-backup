import Image from "next/image";
import Link from "next/link";
import { site, services as seedServices, serviceHref } from "@/data/site";
import { mediaImage } from "@/lib/media";
import Reveal from "../ui/Reveal";
import SectionHeading from "../ui/SectionHeading";

// Our Work shows gallery shots explicitly flagged featured:true —
// one (or more) per service, across every service. Flip any shot's
// featured flag in site.js (or the dashboard) to curate this grid.
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
  // The mosaic (one large plate) only balances when there are enough
  // shots to fill the surrounding cells. With a short set, equal plates
  // read better than a lone hero tile over a hole.
  const mosaic = tiles.length >= 5;

  return (
    <section id="work" aria-labelledby="work-heading" className="relative border-b border-frame/10 py-14 sm:py-20">
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-[radial-gradient(ellipse_at_70%_-30%,rgba(166,124,0,0.05),transparent_65%)]" />
      <div aria-hidden="true" className="pointer-events-none absolute bottom-0 left-0 h-56 w-[45%] bg-[radial-gradient(ellipse_at_0%_100%,rgba(126,37,48,0.05),transparent_65%)]" />

      <div className="relative mx-auto max-w-6xl px-5 sm:px-8">
        <SectionHeading id="work-heading" heading={t.heading} intro={t.intro} />

        <ul
          className={`mt-10 grid grid-cols-2 gap-3 sm:gap-4 ${
            mosaic ? "lg:auto-rows-[11.5rem] lg:grid-cols-4" : "lg:grid-cols-3"
          }`}
        >
          {tiles.map((w, i) => (
            <li
              key={`${w.service.slug}-${i}`}
              className={`h-full ${mosaic && i === 0 ? "col-span-2 row-span-2" : ""}`}
            >
              <Reveal delay={Math.min(i * 80, 320)} className="h-full">
                <Link
                  href={serviceHref(w.service.slug)}
                  data-scheme="wine"
                  className={`group relative block h-full overflow-hidden rounded-sm border border-frame/20 bg-charcoal/10 transition-[border-color,transform] duration-500 hover:-translate-y-1 hover:border-brand/50 ${
                    mosaic ? "min-h-[13rem] lg:min-h-0" : "aspect-[4/5]"
                  }`}
                  aria-label={`${w.caption} — ${w.service.title}`}
                >
                  <Image
                    src={mediaImage(w.src)}
                    alt=""
                    aria-hidden="true"
                    fill
                    loading="lazy"
                    sizes={mosaic && i === 0 ? "(max-width: 1024px) 100vw, 50vw" : "(max-width: 1024px) 50vw, 25vw"}
                    className="object-cover opacity-80 saturate-[0.9] transition-all duration-[1100ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.07] group-hover:opacity-100"
                  />
                  <span aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-noir via-noir/25 to-noir/10 transition-opacity duration-500 group-hover:from-noir/95" />
                  <span aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_120%,rgba(166,124,0,0.25),transparent_62%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                  <span
                    aria-hidden="true"
                    className="absolute left-3 top-3 font-heading text-[9px] leading-none tracking-[0.22em] text-frame/70"
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>

                  <span className="absolute inset-x-0 bottom-0 p-4 sm:p-5">
                    <span className={`block font-heading leading-[1.25] text-paper ${mosaic && i === 0 ? "text-lg sm:text-2xl" : "text-[12px] sm:text-[13px]"}`}>
                      {w.caption}
                    </span>
                    <span className="mt-2 flex items-center justify-between gap-2 border-t border-frame/20 pt-2.5">
                      <span className="text-[8px] font-semibold uppercase tracking-[0.26em] text-frame/70">
                        {w.service.title}
                      </span>
                      <span aria-hidden="true" className="text-[12px] text-golden opacity-0 transition-all duration-500 group-hover:translate-x-0.5 group-hover:opacity-100">
                        →
                      </span>
                    </span>
                  </span>
                </Link>
              </Reveal>
            </li>
          ))}
        </ul>

        <Reveal className="mt-8 flex justify-center" delay={120}>
          <a
            href={site.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-ghost group"
          >
            {site.instagramLabel}
            <span aria-hidden="true" className="text-brand/70 transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-brand">
              ↗
            </span>
          </a>
        </Reveal>
      </div>
    </section>
  );
}
