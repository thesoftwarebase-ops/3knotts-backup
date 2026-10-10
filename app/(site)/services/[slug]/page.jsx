import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { site, services as seedServices, serviceHref } from "@/data/site";
import { getServices } from "@/lib/content";
import { mediaImage } from "@/lib/media";
import Reveal from "@/components/ui/Reveal";
import SectionDivider from "@/components/ui/SectionDivider";
import CtaBand from "@/components/ui/CtaBand";
import ShowcaseSlider from "@/components/ui/ShowcaseSlider";
import { InstagramIcon } from "@/components/ui/SocialIcons";

export function generateStaticParams() {
  return seedServices.map((s) => ({ slug: s.slug }));
}

export const dynamicParams = true;

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const services = await getServices();
  const s = services.find((x) => x.slug === slug);
  if (!s) return {};
  return { title: s.title, description: s.blurb };
}

export default async function ServiceDetailPage({ params }) {
  const { slug } = await params;
  const services = await getServices();
  const s = services.find((x) => x.slug === slug);
  if (!s) notFound();

  return (
    <>
      <div className="relative overflow-clip bg-ivory pb-16 pt-28 sm:pb-24 sm:pt-40">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute right-4 top-16 hidden w-[400px] opacity-30 sm:block [mask-image:radial-gradient(closest-side,black_72%,transparent)]"
        >
          <img src={site.flower} alt="" draggable={false} loading="lazy" className="h-auto w-full select-none" />
        </div>
        <article className="relative mx-auto max-w-6xl px-4 sm:px-6">
          <Reveal>
            <h1 className="max-w-3xl font-tagline text-5xl font-bold leading-tight text-plum sm:text-6xl">
              {s.title}
            </h1>
          </Reveal>

          <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-12">
            <Reveal delay={80}>
              <figure className="overflow-hidden rounded-3xl border border-gold/50 bg-sand/50 shadow-[0_24px_60px_-28px_rgba(11,59,60,0.45)]">
                <Image
                  src={mediaImage(s.image)}
                  alt={s.title}
                  width={800}
                  height={1000}
                  priority
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="aspect-[4/5] w-full object-cover"
                />
              </figure>
            </Reveal>

            <Reveal delay={160} className="flex">
              <div className="flex flex-1 flex-col justify-between gap-6">
                <div>
                  <p className="text-lg leading-relaxed text-ink/85 sm:text-xl">
                    {s.blurb}
                  </p>
                  {s.details?.length ? (
                    <ul className="mt-6 flex flex-col gap-4">
                      {s.details.map((d) => (
                        <li key={d} className="flex items-start gap-3 rounded-2xl border border-gold/40 bg-white/70 p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-gold hover:shadow-[0_16px_36px_-20px_rgba(11,59,60,0.45)]">
                          <span aria-hidden="true" className="mt-1.5 h-2 w-2 shrink-0 rotate-45 bg-gold" />
                          <span className="text-[15px] leading-relaxed text-ink/85 sm:text-base">{d}</span>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </div>
                <div>
                  <h2 className="font-tagline text-3xl font-bold text-plum">
                    {site.servicesPage.whyHeading}
                  </h2>
                  <ul className="mt-4 flex flex-col gap-3">
                    {(s.whyUs || []).map((pt) => (
                      <li key={pt} className="flex items-start gap-3 rounded-2xl border border-gold/40 bg-white/70 p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-gold hover:shadow-[0_16px_36px_-20px_rgba(11,59,60,0.45)]">
                        <span aria-hidden="true" className="mt-1.5 h-2 w-2 shrink-0 rotate-45 bg-gold" />
                        <span className="text-[15px] font-medium leading-relaxed text-ink/85 sm:text-base">{pt}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="pt-6">
                    <div aria-hidden="true" className="h-px bg-gradient-to-r from-gold/70 via-gold/30 to-transparent" />
                    <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
                      <Link
                        href={site.navCta.href}
                        className="rounded-full bg-gold px-8 py-3.5 text-center text-base font-bold text-ink shadow-[0_10px_30px_-10px_rgba(212,167,60,0.9)] transition-all hover:-translate-y-0.5"
                      >
                        {site.navCta.label}
                      </Link>
                      <a
                        href={site.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group inline-flex items-center justify-center gap-2.5 rounded-full border border-gold/60 bg-white/70 px-7 py-3 text-center text-base font-semibold text-ink transition-all duration-300 hover:-translate-y-0.5 hover:border-gold hover:shadow-[0_14px_30px_-12px_rgba(238,42,123,0.55)]"
                      >
                        <InstagramIcon className="h-6 w-6 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6" />
                        {site.instagramHandle}
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </article>

        <SectionDivider align="center" className="mx-auto my-16 max-w-6xl px-4 sm:my-24 sm:px-6" />

        <section aria-label={site.servicesPage.showcaseHeading} className="mx-auto max-w-6xl px-4 sm:px-6">
          <Reveal className="mb-8 text-center">
            <h2 className="font-tagline text-4xl font-bold text-plum sm:text-5xl">
              {site.servicesPage.showcaseHeading}
            </h2>
            <p className="mx-auto mt-2 max-w-xl text-base text-ink/75">
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
