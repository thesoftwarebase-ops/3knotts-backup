import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { site, services as seedServices } from "@/data/site";
import { getServices } from "@/lib/content";
import { mediaImage } from "@/lib/media";
import Reveal from "@/components/ui/Reveal";
import SectionDivider from "@/components/ui/SectionDivider";
import CtaBand from "@/components/ui/CtaBand";
import ShowcaseSlider from "@/components/ui/ShowcaseSlider";
import Corners from "@/components/ui/Corners";
import { InstagramIcon } from "@/components/ui/SocialIcons";

export function generateStaticParams() {
  return seedServices.map((s) => ({ slug: s.slug }));
}

export const dynamicParams = true;
export const revalidate = 60;

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const services = await getServices();
  const s = services.find((x) => x.slug === slug);
  if (!s) return {};
  return { title: s.title, description: s.blurb };
}

const rowCls =
  "group flex items-start gap-3 border-b border-frame/15 py-4 transition-colors duration-300 hover:border-brand/40";

export default async function ServiceDetailPage({ params }) {
  const { slug } = await params;
  const services = await getServices();
  const s = services.find((x) => x.slug === slug);
  if (!s) notFound();

  return (
    <>
      <div className="relative overflow-hidden pb-20 pt-32 sm:pb-24 sm:pt-40">
        <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-[32rem] bg-[radial-gradient(ellipse_at_75%_-20%,rgba(126,37,48,0.05),transparent_60%)]" />
        <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-noir to-transparent" />

        <article className="relative mx-auto max-w-6xl px-5 sm:px-8">
          <Reveal>
            <nav aria-label={site.a11y.breadcrumb}>
              <p className="flex flex-wrap items-center gap-3 text-[9px] font-semibold uppercase tracking-[0.28em] text-paper/45">
                <Link href={site.homeHref} className="transition-colors duration-300 hover:text-brand">
                  {site.servicesPage.breadcrumbHome}
                </Link>
                <span aria-hidden="true" className="h-px w-5 bg-frame/25" />
                <Link href={site.servicesPage.href} className="transition-colors duration-300 hover:text-brand">
                  {site.sections.services.heading}
                </Link>
                <span aria-hidden="true" className="h-px w-5 bg-frame/25" />
                <span aria-current="page" className="text-brand/85">{s.title}</span>
              </p>
            </nav>

            <h1 className="mt-8 max-w-3xl font-heading text-[clamp(2rem,5.4vw,3.5rem)] leading-[1.08] text-paper">
              {s.title}
            </h1>
          </Reveal>

          <div className="mt-12 grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-14">
            {/* Photograph */}
            <Reveal delay={80} className="lg:col-span-5">
              <figure className="relative">
                <div data-scheme="wine" className="relative overflow-hidden rounded-sm border border-frame/25 bg-noir">
                  <Image
                    src={mediaImage(s.image)}
                    alt={s.title}
                    width={800}
                    height={1000}
                    priority
                    sizes="(max-width: 1024px) 100vw, 40vw"
                    className="aspect-[4/5] w-full object-cover opacity-90"
                  />
                  <span aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-noir via-transparent to-noir/20" />
                  <Corners tone="border-frame/30" />
                  <figcaption className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-5">
                    <span className="font-heading text-[9px] tracking-[0.3em] text-frame/80">
                      {String(services.findIndex((x) => x.slug === s.slug) + 1).padStart(2, "0")}
                    </span>
                    <span className="h-1 w-1 rotate-45 bg-golden" />
                  </figcaption>
                </div>
              </figure>
            </Reveal>

            {/* Copy */}
            <Reveal delay={160} className="lg:col-span-7">
              <div className="flex h-full flex-col gap-9">
                <p className="max-w-xl text-[14px] leading-[1.95] text-paper/60 sm:text-[15px]">
                  {s.blurb}
                </p>

                {s.details?.length ? (
                  <ul className="border-t border-frame/15">
                    {s.details.map((d) => (
                      <li key={d} className={rowCls}>
                        <span aria-hidden="true" className="mt-[9px] h-1.5 w-1.5 shrink-0 rotate-45 bg-brand" />
                        <span className="text-[13px] leading-[1.9] text-paper/65 sm:text-[14px]">{d}</span>
                      </li>
                    ))}
                  </ul>
                ) : null}

                <div>
                  <h2 className="font-heading text-[15px] tracking-[0.12em] text-paper">
                    {site.servicesPage.whyHeading}
                  </h2>
                  <ul className="mt-4 border-t border-frame/15">
                    {(s.whyUs || []).map((pt) => (
                      <li key={pt} className={rowCls}>
                        <span aria-hidden="true" className="mt-[9px] h-1.5 w-1.5 shrink-0 rotate-45 bg-golden/80" />
                        <span className="text-[13px] font-medium leading-[1.9] text-paper/70 sm:text-[14px]">{pt}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-auto flex flex-col gap-3 pt-2 sm:flex-row sm:items-center">
                  <Link href={site.navCta.href} className="btn btn-brand group">
                    {site.navCta.label}
                    <span aria-hidden="true" className="transition-transform duration-500 group-hover:translate-x-1.5">→</span>
                  </Link>
                  <a
                    href={site.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-ghost group"
                  >
                    <InstagramIcon className="h-4 w-4 transition-transform duration-500 group-hover:scale-110" />
                    {site.instagramHandle}
                  </a>
                </div>
              </div>
            </Reveal>
          </div>
        </article>

        <div className="relative mx-auto my-16 max-w-6xl px-5 sm:my-24 sm:px-8">
          <SectionDivider align="center" />
        </div>

        <section aria-label={site.servicesPage.showcaseHeading} className="mx-auto max-w-6xl px-5 sm:px-8">
          <Reveal className="mb-9 text-center">
            <h2 className="font-heading text-[clamp(1.5rem,3.4vw,2.1rem)] leading-tight text-paper">
              {site.servicesPage.showcaseHeading}
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-[13px] leading-[1.9] text-paper/50">
              {site.servicesPage.showcaseIntro}
            </p>
          </Reveal>
          <ShowcaseSlider
            items={(s.gallery?.length ? s.gallery : [{ src: s.image }]).map((g) => ({
              image: g.src || g,
              title: g.caption || s.title,
              text: s.blurb,
              href: site.navCta.href,
              cta: site.navCta.label
            }))}
          />
        </section>
      </div>
      <CtaBand />
    </>
  );
}
