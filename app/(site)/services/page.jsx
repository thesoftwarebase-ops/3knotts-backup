import Link from "next/link";
import { site } from "@/data/site";
import { getServices } from "@/lib/content";
import Reveal from "@/components/ui/Reveal";
import SectionDivider from "@/components/ui/SectionDivider";
import ServiceCard from "@/components/ui/ServiceCard";
import CtaBand from "@/components/ui/CtaBand";

export const revalidate = 60;

export const metadata = {
  title: site.sections.services.heading,
  description: site.sections.services.intro
};

export default async function ServicesPage() {
  const t = site.sections.services;
  const cta = site.servicesPage;
  const services = await getServices();

  return (
    <div className="relative overflow-hidden pt-32 sm:pt-40">
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-[30rem] bg-[radial-gradient(ellipse_at_20%_-20%,rgba(232,80,64,0.05),transparent_60%)]" />

      {/* Page hero */}
      <section aria-labelledby="services-page-heading" className="relative mx-auto max-w-6xl px-5 sm:px-8">
        <Reveal>
          <nav aria-label={site.a11y.breadcrumb}>
            <p className="flex items-center gap-3 text-[9px] font-semibold uppercase tracking-[0.3em] text-frame/50">
              <Link href={site.homeHref} className="transition-colors duration-300 hover:text-brand">
                {cta.breadcrumbHome}
              </Link>
              <span aria-hidden="true" className="h-px w-6 bg-frame/25" />
              <span aria-current="page" className="text-frame/80">{t.heading}</span>
            </p>
          </nav>

          <div className="mt-10 grid gap-8 lg:grid-cols-12 lg:items-end">
            <h1
              id="services-page-heading"
              className="font-heading text-[clamp(2.1rem,6vw,4rem)] leading-[1.06] text-paper lg:col-span-7"
            >
              {t.heading}
            </h1>
            <p className="max-w-xl text-[13.5px] leading-[1.95] text-paper/55 sm:text-[15px] lg:col-span-5">
              {cta.abstract}
            </p>
          </div>

          <div className="mt-10">
            <SectionDivider />
          </div>
        </Reveal>
      </section>

      {/* All service cards */}
      <section aria-label={t.heading} className="relative mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
        <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-7">
          {services.map((s, i) => (
            <li key={s.slug} className="h-full">
              <Reveal delay={Math.min(i * 70, 350)} className="h-full">
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
