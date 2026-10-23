import { site, serviceHref, clientHref } from "@/data/site";
import { getServices, getContent } from "@/lib/content";

export default async function sitemap() {
  const [services, clients] = await Promise.all([getServices(), getContent("clients")]);
  const hidden = clients.visible === false;
  const base = [site.homeHref, site.servicesPage.href, ...site.nav.map((l) => l.href), site.navCta.href];
  const routes = hidden ? base.filter((r) => r !== site.clients.href) : base;
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
  // /clients/[slug] twins only exist while the Clients section is on;
  // hiding the section in the CMS drops them (and the list page) here too.
  const clientDetail = hidden
    ? []
    : services.map((s) => ({
        url: `${site.url}${clientHref(s.slug)}`,
        lastModified: new Date(),
        changeFrequency: "monthly",
        priority: 0.6
      }));
  return [...pages, ...detail, ...clientDetail];
}
