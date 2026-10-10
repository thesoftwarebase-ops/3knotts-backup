import Link from "next/link";
import { site } from "@/data/site";
import { getServices } from "@/lib/content";
import Reveal from "@/components/ui/Reveal";
import SectionDivider from "@/components/ui/SectionDivider";
import ServiceCard from "@/components/ui/ServiceCard";
import CtaBand from "@/components/ui/CtaBand";

export const metadata = {
  title: site.sections.services.heading,
  description: site.sections.services.intro
};

export default async function ServicesPage() {
  const t = site.sections.services;
  const cta = site.servicesPage;
  const services = await getServices();
  return (
    <div className="bg-ivory pt-24 sm:pt-32">
      {/* Page hero — centered */}
      <section aria-labelledby="services-page-heading" className="mx-auto max-w-3xl px-4 text-center sm:px-6">
        <Reveal>
          <nav aria-label={site.a11y.breadcrumb}>
            <p className="text-sm font-medium text-ink/60">
              <Link href={site.homeHref} className="rounded transition-colors hover:text-teal-bright">
                {cta.breadcrumbHome}
              </Link>
              <span aria-hidden="true" className="mx-2 text-gold">/</span>
              <span aria-current="page" className="text-ink">{t.heading}</span>
            </p>
          </nav>
          <h1 id="services-page-heading" className="mt-5 font-tagline text-5xl font-bold text-plum sm:text-6xl">
            {t.heading}
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-ink/80 sm:text-lg">
            {cta.abstract}
          </p>
          <SectionDivider align="center" className="mt-6" />
        </Reveal>
      </section>

      {/* All service cards */}
      <section aria-label={t.heading} className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
        <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s, i) => (
            <li key={s.slug} className="h-full">
              <Reveal delay={Math.min(i * 60, 240)} className="h-full">
                <ServiceCard service={s} index={i} />
              </Reveal>
            </li>
          ))}
        </ul>
      </section>

      <CtaBand />
    </div>
  );
}

