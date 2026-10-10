import Image from "next/image";
import Link from "next/link";
import { site, serviceHref } from "@/data/site";
import { mediaImage } from "@/lib/media";
import ServiceIcon from "./ServiceIcon";

// Shared service card. The whole card is one link to the detail page.
// Used by the home featured grid and the /services page.
export default function ServiceCard({ service: s, index = 0 }) {
  return (
    <Link
      href={serviceHref(s.slug)}
      aria-label={`${s.title} — ${site.servicesPage.exploreLabel}`}
      className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-gold/50 bg-white/70 transition-all duration-300 hover:-translate-y-1 hover:border-gold hover:shadow-[0_20px_44px_-18px_rgba(11,59,60,0.45)]"
    >
      <span className="relative block aspect-[4/5] overflow-hidden border-b border-gold/40 bg-sand/50">
        <Image
          src={mediaImage(s.image)}
          alt=""
          aria-hidden="true"
          fill
          loading="lazy"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <span aria-hidden="true" className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-black/35 to-transparent" />
        <span
          aria-hidden="true"
          className="absolute right-3 top-3 rounded-full bg-black/40 px-2.5 py-1 font-tagline text-lg font-bold leading-none text-ivory backdrop-blur-sm"
        >
          {String(index + 1).padStart(2, "0")}
        </span>
      </span>
      <span className="flex flex-1 flex-col px-5 pb-5">
        <span className="relative z-10 -mt-8 mb-1 inline-flex h-14 w-14 items-center justify-center rounded-full bg-teal-deep text-gold-soft ring-2 ring-gold">
          <ServiceIcon name={s.icon} />
        </span>
        <span className="mt-2 block font-tagline text-2xl font-bold leading-snug text-ink">{s.title}</span>
        <span className="mt-1.5 block flex-1 text-[15px] leading-relaxed text-ink/75">{s.blurb}</span>
        <span className="mt-4 inline-flex items-center gap-1.5 self-start text-[15px] font-semibold text-teal-bright underline decoration-gold decoration-2 underline-offset-4 transition-colors group-hover:text-teal-deep">
          {site.servicesPage.exploreLabel}
          <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">→</span>
        </span>
      </span>
    </Link>
  );
}
