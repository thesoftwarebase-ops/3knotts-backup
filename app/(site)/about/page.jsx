import Image from "next/image";
import Link from "next/link";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";
import CtaBand from "@/components/ui/CtaBand";
import Corners from "@/components/ui/Corners";
import { InstagramIcon } from "@/components/ui/SocialIcons";
import { mediaImage } from "@/lib/media";
import { getContent } from "@/lib/content";
import { site, getWaNumber } from "@/data/site";

export const metadata = {
  title: site.about.heading,
  description: site.about.intro
};

export const revalidate = 60;

export default async function AboutPage() {
  const a = await getContent("about");
  const waHref = `https://wa.me/${getWaNumber()}?text=${encodeURIComponent(site.whatsappGreeting)}`;

  return (
    <>
      <div className="relative overflow-hidden pb-20 pt-32 sm:pb-24 sm:pt-40">
        <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-[30rem] bg-[radial-gradient(ellipse_at_25%_-20%,rgba(126,37,48,0.05),transparent_60%)]" />

        <div className="relative mx-auto max-w-6xl px-5 sm:px-8">
          <SectionHeading as="h1" id="about-heading" heading={a.heading} intro={a.intro} />

          <div className="mt-16 grid grid-cols-1 items-start gap-12 lg:grid-cols-12 lg:gap-16">
            {/* Portrait */}
            <Reveal className="lg:col-span-5">
              <figure className="relative mx-auto max-w-md lg:mx-0">
                <div className="relative overflow-hidden rounded-sm border border-frame/25 bg-noir">
                  <Image
                    src={mediaImage(a.ownerImage || site.about.ownerImage)}
                    alt={`${site.name} — ${a.ownerRole}`}
                    width={600}
                    height={800}
                    priority
                    sizes="(max-width: 1024px) 100vw, 40vw"
                    className="aspect-[3/4] w-full object-cover object-top opacity-90"
                  />
                  <span aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-noir via-noir/10 to-transparent" />
                  <Corners tone="border-frame/35" />
                </div>

                {/* Offset hairline plate for depth */}
                <span aria-hidden="true" className="absolute -bottom-3 -right-3 -z-10 h-full w-full border border-frame/15" />
              </figure>
            </Reveal>

            {/* Story */}
            <div className="lg:col-span-7">
              <Reveal>
                <p className="relative border-l border-brand pl-6 text-[17px] font-normal leading-[1.85] text-paper/85 sm:text-[19px]">
                  &ldquo;{a.lede}&rdquo;
                </p>
              </Reveal>

              <div className="mt-9 border-t border-frame/15">
                {a.paragraphs.map((p, i) => (
                  <Reveal key={i} delay={i * 90}>
                    <p className="border-b border-frame/10 py-6 text-[13px] leading-[2] text-paper/55 sm:text-[14px]">
                      {p}
                    </p>
                  </Reveal>
                ))}
              </div>

              <Reveal delay={140}>
                <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                  <Link href={site.navCta.href} className="btn btn-brand group">
                    {site.navCta.label}
                    <span aria-hidden="true" className="transition-transform duration-500 group-hover:translate-x-1.5">→</span>
                  </Link>
                  <a
                    href={waHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-ghost"
                  >
                    {site.footer.whatsappLabel}
                  </a>
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
              </Reveal>
            </div>
          </div>
        </div>
      </div>
      <CtaBand />
    </>
  );
}
