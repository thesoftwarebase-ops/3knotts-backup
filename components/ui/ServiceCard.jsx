import Image from "next/image";
import Link from "next/link";
import { site, serviceHref } from "@/data/site";
import { mediaImage } from "@/lib/media";
import ServiceIcon from "./ServiceIcon";

// Shared service card — one link to the detail page. Used by the home
// featured grid, /services and /clients (whose `href` points at the
// client page). Photograph first, then a framed title plate.
export default function ServiceCard({ service: s, index = 0, href }) {
  const cardHref = href || serviceHref(s.slug);
  return (
    <Link
      href={cardHref}
      aria-label={`${s.title} — ${site.servicesPage.exploreLabel}`}
      className="group relative flex h-full flex-col overflow-hidden rounded-sm border border-frame/20 bg-charcoal/[0.06] transition-[border-color,transform,box-shadow,background-color] duration-500 hover:-translate-y-1.5 hover:border-brand/55 hover:bg-charcoal/[0.12] hover:shadow-[0_40px_80px_-40px_rgba(232,80,64,0.55)]"
    >
      <span className="relative block aspect-[4/5] overflow-hidden bg-noir">
        <Image
          src={mediaImage(s.image)}
          alt=""
          aria-hidden="true"
          fill
          loading="lazy"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover opacity-85 saturate-[0.92] transition-all duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.06] group-hover:opacity-100"
        />
        {/* Cinematic grade so any photograph sits in the black field. */}
        <span aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-noir via-noir/25 to-noir/20" />
        <span aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_120%,rgba(232,80,64,0.18),transparent_60%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

        {/* Hairline ticks */}
        <span aria-hidden="true" className="absolute left-3 top-3 h-3.5 w-3.5 border-l border-t border-frame/45 transition-colors duration-500 group-hover:border-golden/70" />
        <span aria-hidden="true" className="absolute bottom-3 right-3 h-3.5 w-3.5 border-b border-r border-frame/45 transition-colors duration-500 group-hover:border-golden/70" />

        <span
          aria-hidden="true"
          className="absolute right-3 top-3 rounded-sm border border-frame/35 bg-noir/60 px-2 py-1 font-heading text-[10px] leading-none tracking-[0.16em] text-frame backdrop-blur-sm transition-colors duration-500 group-hover:border-brand/60 group-hover:text-brand"
        >
          {String(index + 1).padStart(2, "0")}
        </span>
      </span>

      <span className="flex flex-1 flex-col px-5 pb-6 pt-0 sm:px-6">
        <span className="relative z-10 -mt-6 mb-4 inline-flex h-12 w-12 items-center justify-center rounded-sm border border-frame/40 bg-noir text-brand shadow-[0_10px_30px_-12px_rgba(0,0,0,0.9)] transition-colors duration-500 group-hover:border-brand/60 group-hover:text-golden">
          <ServiceIcon name={s.icon} />
        </span>

        <span className="block font-heading text-[15px] leading-[1.45] text-paper transition-colors duration-300 group-hover:text-brand sm:text-base">
          {s.title}
        </span>
        <span className="mt-3 block flex-1 text-[13px] leading-[1.85] text-paper/55">{s.blurb}</span>

        <span className="mt-6 flex items-center justify-between gap-3 border-t border-frame/15 pt-4">
          <span className="link-arrow">
            {site.servicesPage.exploreLabel}
            <span aria-hidden="true" className="transition-transform duration-500 group-hover:translate-x-1.5">
              →
            </span>
          </span>
          <span aria-hidden="true" className="h-1 w-1 rotate-45 bg-frame/40 transition-colors duration-500 group-hover:bg-brand" />
        </span>
      </span>

      <span
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 bg-gradient-to-r from-brand via-brand/70 to-transparent transition-transform duration-700 group-hover:scale-x-100"
      />
    </Link>
  );
}
