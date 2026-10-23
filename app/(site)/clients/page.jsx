import { notFound } from "next/navigation";
import Link from "next/link";
import CtaBand from "@/components/ui/CtaBand";
import ServiceCard from "@/components/ui/ServiceCard";
import Reveal from "@/components/ui/Reveal";
import SectionDivider from "@/components/ui/SectionDivider";
import { site } from "@/data/site";
import { getServices, getContent } from "@/lib/content";

// The Clients page shows the exact /services cards (static cover
// photo included), each linked to its own /clients/[slug] page where
// the client gallery lives. Hero follows the /services page format,
// with the ornamental flower echoing the detail pages. The CMS
// toggle (Dashboard -> Clients) works server-side too: when off, this
// page renders the site's 404. `revalidate` matches the layout
// cadence so the menu link and the page flip together within a
// minute of saving.
export const revalidate = 60;

export const metadata = {
  title: site.clients.heading,
  description: site.clients.intro
};

export default async function ClientsPage() {
  const [services, content] = await Promise.all([getServices(), getContent("clients")]);
  if (content.visible === false) notFound();

  const t = site.clients;
  return (
    <div className="relative overflow-clip bg-ivory pt-24 sm:pt-32">
      {/* Ornamental flower — echoes the service detail pages */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-10 top-8 hidden w-[400px] select-none opacity-25 sm:block [mask-image:radial-gradient(closest-side,black_72%,transparent)]"
      >
        <img src={site.flower} alt="" draggable={false} loading="lazy" className="h-auto w-full" />
      </div>

      {/* Page hero — same centered format as /services */}
      <section aria-labelledby="clients-page-heading" className="relative mx-auto max-w-3xl px-4 text-center sm:px-6">
        <Reveal>
          <nav aria-label={site.a11y.breadcrumb}>
            <p className="text-sm font-medium text-ink/60">
              <Link href={site.homeHref} className="rounded transition-colors hover:text-teal-bright">
                {site.servicesPage.breadcrumbHome}
              </Link>
              <span aria-hidden="true" className="mx-2 text-gold">/</span>
              <span aria-current="page" className="text-ink">{t.label}</span>
            </p>
          </nav>
          <h1 id="clients-page-heading" className="mt-5 font-tagline text-5xl font-bold text-plum sm:text-6xl">
            {t.heading}
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-ink/80 sm:text-lg">
            {t.intro}
          </p>
          <SectionDivider align="center" className="mt-6" />
        </Reveal>
      </section>

      {/* Service cards — each opening its own client page */}
      <section aria-label={t.heading} className="relative mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
        <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s, i) => (
            <li key={s.slug} className="h-full">
              <Reveal delay={Math.min(i * 60, 240)} className="h-full">
                <ServiceCard service={s} index={i} href={`/clients/${s.slug}`} />
              </Reveal>
            </li>
          ))}
        </ul>
      </section>

      <CtaBand />
    </div>
  );
}
