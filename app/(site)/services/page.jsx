import Link from "next/link";
import { site } from "@/data/site";
import { getServices } from "@/lib/content";
import Reveal from "@/components/ui/Reveal";
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
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-[20rem] bg-[radial-gradient(ellipse_at_80%_120%,rgba(252,204,48,0.025),transparent_60%)]" />

      {/* Page hero */}
      <section aria-labelledby="services-page-heading" className="relative mx-auto max-w-4xl px-5 text-center sm:px-8">
        <Reveal>
          <nav aria-label={site.a11y.breadcrumb} className="flex justify-center">
            <p className="flex items-center gap-3 text-[9px] font-semibold uppercase tracking-[0.3em] text-frame/50">
              <Link href={site.homeHref} className="transition-colors duration-300 hover:text-brand">
                {cta.breadcrumbHome}
              </Link>
              <span aria-hidden="true" className="h-px w-6 bg-frame/25" />
              <span aria-current="page" className="text-frame/80">{t.heading}</span>
            </p>
          </nav>

          <h1
            id="services-page-heading"
            className="mx-auto mt-10 max-w-3xl font-heading text-[clamp(2.1rem,6vw,4rem)] leading-[1.06] text-paper"
          >
            {t.heading}
          </h1>

          <div className="mx-auto mt-8 flex w-56 items-center gap-3 sm:w-72" aria-hidden="true">
            <span className="h-px flex-1 bg-gradient-to-r from-transparent to-frame/45" />
            <span className="h-1.5 w-1.5 rotate-45 bg-golden shadow-[0_0_14px_rgba(252,204,48,0.65)]" />
            <span className="h-px flex-1 bg-gradient-to-l from-transparent to-frame/45" />
          </div>

          <p className="mx-auto mt-8 max-w-2xl text-[14px] leading-[2] text-paper/60 sm:text-[15px]">
            {cta.abstract}
          </p>
        </Reveal>
      </section>

      {/* All service cards */}
      <section aria-label={t.heading} className="relative mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-24">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:gap-10 xl:grid-cols-3">
          {services.map((s, i) => (
            <Reveal key={s.slug} delay={Math.min(i * 70, 350)}>
              <ServiceCard service={s} index={i} />
            </Reveal>
          ))}
        </div>
      </section>

      <CtaBand />
    </div>
  );
}
