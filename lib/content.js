import { getDb } from "./db";
import { site, services as seedServices } from "@/data/site";

// Editable site content lives in MongoDB, with site.js as the seed
// and fallback. Pattern: read DB first, fall back to site.js so the
// site (and the build) never breaks when the database is unreachable.

// ---- Hero slides: [{ src, alt }] ----
export function heroDefaults() {
  return site.hero.slides.map((s) => ({ src: s.src, alt: s.alt }));
}

function cleanSlides(input) {
  if (!Array.isArray(input)) throw new Error("Slides must be a list.");
  const out = input
    .slice(0, 8)
    .map((s) => ({ src: String(s?.src || "").trim(), alt: String(s?.alt || "").trim() }))
    .filter((s) => s.src);
  if (!out.length) throw new Error("At least one slide is needed.");
  return out;
}

export async function getHeroSlides() {
  try {
    const db = await getDb();
    const doc = await db.collection("site_content").findOne({ _id: "hero" });
    if (doc && Array.isArray(doc.slides) && doc.slides.length) {
      return cleanSlides(doc.slides);
    }
  } catch (e) {
    console.error("hero read fallback:", e.message || e);
  }
  return heroDefaults();
}

export async function setHeroSlides(input) {
  const slides = cleanSlides(input);
  const db = await getDb();
  await db.collection("site_content").updateOne(
    { _id: "hero" },
    { $set: { slides, updatedAt: new Date() } },
    { upsert: true }
  );
  return slides;
}

// ---- Services: full array override. The seed array in site.js. ----
export function servicesDefaults() {
  return JSON.parse(JSON.stringify(seedServices));
}

function cleanService(s) {
  const slug = String(s?.slug || "").trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
  const title = String(s?.title || "").trim();
  if (!slug || !title) throw new Error("Every service needs a title.");
  const gallery = Array.isArray(s?.gallery)
    ? s.gallery
        .map((g) => ({
          src: String(g?.src || "").trim(),
          caption: String(g?.caption || "")
            .trim()
            .split(/\s+/)
            .filter(Boolean)
            .slice(0, 4)
            .join(" "),
          featured: g?.featured === true
        }))
        .filter((g) => g.src)
    : [];
  // Second, separate photo set shown on the Clients page. Same format
  // and caption rules as the service gallery, minus the featured flag
  // (Our Work never uses these).
  const clientShots = Array.isArray(s?.clients)
    ? s.clients
        .map((g) => ({
          src: String(g?.src || "").trim(),
          caption: String(g?.caption || "")
            .trim()
            .split(/\s+/)
            .filter(Boolean)
            .slice(0, 4)
            .join(" "),
          // Optional per-photo sentence: the slide description on the
          // individual client page. Capped to keep sliders tidy.
          text: String(g?.text || "").trim().slice(0, 220)
        }))
        .filter((g) => g.src)
    : [];
  if (gallery.length > 15 || clientShots.length > 15) throw new Error(site.dashboard.servicesMgr.shotsMax);
  return {
    slug,
    title,
    blurb: String(s?.blurb || "").trim(),
    icon: String(s?.icon || "gift").trim() || "gift",
    image: String(s?.image || "").trim(),
    details: Array.isArray(s?.details) ? s.details.map(String).map((x) => x.trim()).filter(Boolean) : [],
    whyUs: Array.isArray(s?.whyUs) ? s.whyUs.map(String).map((x) => x.trim()).filter(Boolean) : [],
    gallery,
    clients: clientShots
  };
}

export async function getServices() {
  try {
    const db = await getDb();
    const doc = await db.collection("site_content").findOne({ _id: "services" });
    if (doc && Array.isArray(doc.services) && doc.services.length) {
      const seen = new Set();
      return doc.services.map(cleanService).filter((s) => {
        if (seen.has(s.slug)) return false;
        seen.add(s.slug);
        return true;
      });
    }
  } catch (e) {
    console.error("services read fallback:", e.message || e);
  }
  return servicesDefaults();
}

// Featured slugs for the home grid. DB wins when present.
export async function getFeatured() {
  try {
    const db = await getDb();
    const doc = await db.collection("site_content").findOne({ _id: "services" });
    if (doc && Array.isArray(doc.featured) && doc.featured.length) return doc.featured.map(String);
  } catch (e) {
    console.error("featured read fallback:", e.message || e);
  }
  return [...site.featuredServices];
}

export async function setServices(input, featured) {
  if (!Array.isArray(input) || !input.length) throw new Error("At least one service is needed.");
  const seen = new Set();
  const services = input.map(cleanService).filter((s) => {
    if (seen.has(s.slug)) throw new Error(`Duplicate service: ${s.slug}`);
    seen.add(s.slug);
    return true;
  });
  const slugs = new Set(services.map((s) => s.slug));
  const feat = Array.isArray(featured) ? featured.map(String).filter((x) => slugs.has(x)) : null;
  const db = await getDb();
  const patch = { services, updatedAt: new Date() };
  if (feat) patch.featured = feat;
  await db.collection("site_content").updateOne({ _id: "services" }, { $set: patch }, { upsert: true });
  return { services, featured: feat || (await getFeatured()) };
}

// ---- Generic section content: brand, testimonials, faq, steps ----
// Each key has a validator; unknown keys are rejected. site.js seeds.
const CONTENT_DEFAULTS = {
  brand: () => JSON.parse(JSON.stringify(site.brand)),
  testimonials: () => JSON.parse(JSON.stringify(site.testimonials.items || [])),
  faq: () => JSON.parse(JSON.stringify(site.faq.items || [])),
  steps: () => JSON.parse(JSON.stringify(site.steps)),
  about: () => JSON.parse(JSON.stringify(site.about)),
  clients: () => JSON.parse(JSON.stringify(site.clients || { visible: true }))
};

// Instagram handle for a testimonial: accepts "@user", the full
// profile URL, or a bare name. Keeps only [A-Za-z0-9._]; junk -> "".
// The domain comes from site.instaUrl — the single source of truth.
function cleanInsta(v) {
  const raw = String(v || "").trim();
  const domain = site.instaUrl.replace(/^https?:\/\//, "").replace(/\/+$/, "") + "/";
  const at = raw.indexOf(domain);
  const base = at >= 0 ? raw.slice(at + domain.length) : raw.replace(/^@/, "");
  return base.split(/[/?#]/)[0]
    .replace(/[^A-Za-z0-9._]/g, "")
    .replace(/^\.+|\.+$/g, "")
    .slice(0, 30);
}

function cleanContent(key, value) {
  const str = (x) => String(x || "").trim();
  if (key === "brand") {
    const heading = str(value?.heading);
    const text = str(value?.text);
    if (!heading || !text) throw new Error("Brand needs a heading and text.");
    return {
      heading,
      text,
      cta: {
        label: str(value?.cta?.label) || site.brand.cta.label,
        href: str(value?.cta?.href) || site.brand.cta.href
      }
    };
  }
  if (key === "testimonials") {
    if (!Array.isArray(value)) throw new Error("Testimonials must be a list.");
    return value
      .map((t) => ({ quote: str(t?.quote), name: str(t?.name), detail: str(t?.detail), insta: cleanInsta(t?.insta) }))
      .filter((t) => t.quote && t.name);
  }
  if (key === "faq") {
    if (!Array.isArray(value)) throw new Error("FAQs must be a list.");
    return value
      .map((f) => ({ q: str(f?.q), a: str(f?.a) }))
      .filter((f) => f.q && f.a);
  }
  if (key === "steps") {
    if (!Array.isArray(value) || !value.length) throw new Error("At least one step is needed.");
    return value.map((s, i) => ({
      n: str(s?.n) || String(i + 1).padStart(2, "0"),
      title: str(s?.title),
      text: str(s?.text),
      art: str(s?.art),
      rich: Array.isArray(s?.rich) && s.rich.length ? s.rich : null,
      points: Array.isArray(s?.points) ? s.points.map(str).filter(Boolean) : []
    })).filter((s) => s.title);
  }
  if (key === "about") {
    const heading = str(value?.heading);
    const lede = str(value?.lede);
    if (!heading || !lede) throw new Error("About needs a heading and lede.");
    return {
      heading,
      intro: str(value?.intro),
      ownerImage: str(value?.ownerImage),
      ownerRole: str(value?.ownerRole),
      lede,
      paragraphs: Array.isArray(value?.paragraphs) ? value.paragraphs.map(str).filter(Boolean) : []
    };
  }
  if (key === "clients") {
    return { visible: value?.visible === true };
  }
  throw new Error("Unknown content key.");
}

export const CONTENT_KEYS = Object.keys(CONTENT_DEFAULTS);

export async function getContent(key) {
  if (!CONTENT_DEFAULTS[key]) throw new Error("Unknown content key.");
  try {
    const db = await getDb();
    const doc = await db.collection("site_content").findOne({ _id: `section:${key}` });
    if (doc && doc.value !== undefined) return cleanContent(key, doc.value);
  } catch (e) {
    console.error(`${key} read fallback:`, e.message || e);
  }
  return CONTENT_DEFAULTS[key]();
}

export async function setContent(key, value) {
  const clean = cleanContent(key, value);
  const db = await getDb();
  await db.collection("site_content").updateOne(
    { _id: `section:${key}` },
    { $set: { value: clean, updatedAt: new Date() } },
    { upsert: true }
  );
  return clean;
}
