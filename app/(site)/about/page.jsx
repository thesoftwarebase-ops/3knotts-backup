import Image from "next/image";
import Link from "next/link";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";
import CtaBand from "@/components/ui/CtaBand";
import { InstagramIcon } from "@/components/ui/SocialIcons";
import { mediaImage } from "@/lib/media";
import { getContent } from "@/lib/content";
import { site, getWaNumber } from "@/data/site";

export const metadata = {
  title: site.about.heading,
  description: site.about.intro
};

export default async function AboutPage() {
  const a = await getContent("about");
  const waHref = `https://wa.me/${getWaNumber()}?text=${encodeURIComponent(site.whatsappGreeting)}`;
  return (
    <>
      <div className="bg-ivory pb-16 pt-28 sm:pb-24 sm:pt-40">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <SectionHeading id="about-heading" heading={a.heading} intro={a.intro} tone="dark" />

          <div className="mt-10 grid grid-cols-1 items-start gap-10 md:grid-cols-5 md:gap-14">
            <Reveal className="md:col-span-2">
              <figure className="relative mx-auto max-w-sm md:mx-0">
                <div aria-hidden="true" className="absolute -inset-3 rounded-[2rem] border border-gold/50" />
                <div className="relative overflow-hidden rounded-[2rem] border-2 border-gold bg-teal-deep shadow-[0_30px_70px_-28px_rgba(11,59,60,0.55)]">
                  <Image
                    src={mediaImage(a.ownerImage || site.about.ownerImage)}
                    alt={`${site.name} — ${a.ownerRole}`}
                    width={600}
                    height={800}
                    priority
                    sizes="(max-width: 768px) 100vw, 40vw"
                    className="aspect-[3/4] w-full object-cover object-top"
                  />
                  <span aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />
                  <figcaption className="absolute inset-x-0 bottom-0 p-5 text-center">
                    <p className="font-tagline text-3xl font-bold text-ivory">{site.name}</p>
                    <p className="mt-0.5 text-sm font-semibold uppercase tracking-[0.2em] text-gold-soft">
                      {a.ownerRole}
                    </p>
                  </figcaption>
                </div>
              </figure>
            </Reveal>

            <div className="md:col-span-3">
              <Reveal>
                <p className="font-tagline text-3xl font-bold leading-snug text-plum sm:text-4xl">
                  &ldquo;{a.lede}&rdquo;
                </p>
              </Reveal>
              {a.paragraphs.map((p, i) => (
                <Reveal key={i} delay={i * 80}>
                  <p className="mt-5 text-base leading-relaxed text-ink/85 sm:text-lg">{p}</p>
                </Reveal>
              ))}
              <Reveal delay={120}>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                  <Link
                    href={site.navCta.href}
                    className="rounded-full bg-gold px-8 py-3.5 text-center text-base font-bold text-ink transition-transform hover:-translate-y-0.5"
                  >
                    {site.navCta.label}
                  </Link>
                  <a
                    href={waHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-full border border-teal-deep/30 px-8 py-3.5 text-center text-base font-semibold text-teal-deep transition-all hover:-translate-y-0.5 hover:border-gold"
                  >
                    {site.footer.whatsappLabel}
                  </a>
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
              </Reveal>
            </div>
          </div>
        </div>
      </div>
      <CtaBand />
    </>
  );
}
