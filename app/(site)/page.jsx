import Hero from "@/components/home/Hero";
import BrandIntro from "@/components/home/BrandIntro";
import Services from "@/components/home/Services";
import HowItWorks from "@/components/home/HowItWorks";
import WorkGrid from "@/components/home/WorkGrid";
import Testimonials from "@/components/home/Testimonials";
import Faq from "@/components/home/Faq";
import CtaBand from "@/components/ui/CtaBand";
import { getHeroSlides, getHeroTagline, getServices, getFeatured, getContent } from "@/lib/content";

// Dashboard edits go live within a minute — no rebuild needed.
export const revalidate = 60;

export default async function HomePage() {
  const [slides, tagline, services, featured, brand, testimonials, faq, steps] = await Promise.all([
    getHeroSlides(),
    getHeroTagline(),
    getServices(),
    getFeatured(),
    getContent("brand"),
    getContent("testimonials"),
    getContent("faq"),
    getContent("steps")
  ]);
  return (
    <>
      <Hero slides={slides} tagline={tagline} brand={brand} />
      <BrandIntro brand={brand} />
      <Services featuredOnly services={services} featured={featured} />
      <HowItWorks steps={steps} />
      <WorkGrid services={services} />
      <Testimonials items={testimonials} />
      <Faq items={faq} />
      <CtaBand />
    </>
  );
}
