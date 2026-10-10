import Link from "next/link";
import { site, services as seedServices } from "@/data/site";
import Reveal from "../ui/Reveal";
import SectionHeading from "../ui/SectionHeading";
import ServiceCard from "../ui/ServiceCard";

// featuredOnly: home shows the featured few + a view-all button.
// Full list lives on the /services page.
export default function Services({ featuredOnly = false, services = seedServices, featured = null }) {
  const t = featuredOnly ? site.sections.featured : site.sections.services;
  const feat = featured || site.featuredServices;
  const list = featuredOnly ? services.filter((s) => feat.includes(s.slug)) : services;
  return (
    <section id="services" aria-labelledby="services-heading" className="bg-ivory py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading id="services-heading" heading={t.heading} intro={t.intro} tone="dark" />

        <ul className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((s, i) => (
            <li key={s.slug} className="h-full">
              <Reveal delay={Math.min(i * 60, 240)} className="h-full">
                <ServiceCard service={s} index={i} />
              </Reveal>
            </li>
          ))}
        </ul>

        {featuredOnly ? (
          <Reveal className="mt-10 text-center">
            <Link
              href={site.servicesPage.href}
              className="inline-block rounded-full bg-teal-deep px-8 py-3.5 text-base font-semibold text-ivory transition-transform hover:-translate-y-0.5"
            >
              {site.servicesPage.viewAll}
            </Link>
          </Reveal>
        ) : null}
      </div>
    </section>
  );
}
