import { site, serviceHref } from "@/data/site";
import { getServices } from "@/lib/content";

const routes = [site.homeHref, site.servicesPage.href, ...site.nav.map((l) => l.href), site.navCta.href];

export default async function sitemap() {
  const services = await getServices();
  const pages = [...new Set(routes)].map((r) => ({
    url: `${site.url}${r}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: r === site.homeHref ? 1 : 0.8
  }));
  const detail = services.map((s) => ({
    url: `${site.url}${serviceHref(s.slug)}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.7
  }));
  return [...pages, ...detail];
}
