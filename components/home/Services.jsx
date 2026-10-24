import Link from "next/link";
import { site, services as seedServices } from "@/data/site";
import Reveal from "../ui/Reveal";
import SectionHeading from "../ui/SectionHeading";
import ServiceCard from "../ui/ServiceCard";

// featuredOnly: home shows the featured few + a view-all link.
// Full list lives on the /services page.
export default function Services({ featuredOnly = false, services = seedServices, featured = null }) {
  const t = featuredOnly ? site.sections.featured : site.sections.services;
  const feat = featured || site.featuredServices;
  const list = featuredOnly ? services.filter((s) => feat.includes(s.slug)) : services;

  return (
    <section id="services" aria-labelledby="services-heading" className="relative border-b border-frame/10 py-14 sm:py-20">
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-64 bg-[radial-gradient(ellipse_at_20%_-20%,rgba(232,80,64,0.03),transparent_60%)]" />
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-48 bg-[radial-gradient(ellipse_at_80%_120%,rgba(252,204,48,0.02),transparent_60%)]" />
      <div className="relative mx-auto max-w-6xl px-5 sm:px-8">
        <SectionHeading id="services-heading" heading={t.heading} intro={t.intro} />

        <ul className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-7">
          {list.map((s, i) => (
            <li key={s.slug} className="h-full">
              <Reveal delay={Math.min(i * 90, 360)} className="h-full">
                <ServiceCard service={s} index={i} />
              </Reveal>
            </li>
          ))}
        </ul>

        {featuredOnly ? (
          <Reveal className="mt-10 text-center" delay={120}>
            <Link href={site.servicesPage.href} className="btn btn-ghost group">
              {site.servicesPage.viewAll}
              <span aria-hidden="true" className="transition-transform duration-500 group-hover:translate-x-1.5">→</span>
            </Link>
          </Reveal>
        ) : null}
      </div>
    </section>
  );
}
