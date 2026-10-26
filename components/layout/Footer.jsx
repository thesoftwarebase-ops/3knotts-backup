import Link from "next/link";
import { site, services as seedServices, serviceHref, getWaNumber } from "@/data/site";
import { InstagramIcon, WhatsAppIcon } from "../ui/SocialIcons";

function ClockIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true" className="h-3.5 w-3.5 shrink-0">
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3 2" strokeLinecap="round" />
    </svg>
  );
}

function Arrow() {
  return (
    <span
      aria-hidden="true"
      className="-translate-x-1.5 text-golden opacity-0 transition-all duration-500 group-hover:translate-x-0 group-hover:opacity-100"
    >
      →
    </span>
  );
}

const linkCls =
  "group flex items-center justify-between gap-3 py-2 text-[12px] font-medium leading-snug text-paper/50 transition-colors duration-300 hover:text-paper";

export default function Footer({ services = seedServices, settings = {} }) {
  const ft = site.footer;
  const address = settings.address || site.address;
  const hoursDays = settings.hoursDays || ft.hoursDays;
  const hoursTime = settings.hoursTime || ft.hoursTime;
  const waNumber = settings.whatsappNumber || getWaNumber();
  const waHref = `https://wa.me/${waNumber}?text=${encodeURIComponent(site.whatsappGreeting)}`;
  const mapsHref = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
  const exploreLinks = [
    { label: site.servicesPage.breadcrumbHome, href: site.homeHref },
    ...site.nav,
    site.navCta
  ];

  return (
    <footer data-scheme="wine" className="relative overflow-hidden border-t border-frame/20 bg-noir">
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-golden/50 to-transparent" />
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_-20%,rgba(166,124,0,0.06),transparent_60%)]" />

      <div className="relative mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-12">
          {/* Brand */}
          <div className="lg:col-span-4">
            <Link href={site.homeHref} className="group inline-flex items-center gap-3.5" aria-label={`${site.name} — home`}>
              <span className="inline-flex rounded-full border border-frame/50 p-[3px] transition-colors duration-500 group-hover:border-golden/60">
                <img
                  src={site.logoSm}
                  alt={site.logoAlt}
                  width={56}
                  height={56}
                  loading="lazy"
                  className="h-12 w-12 rounded-full object-cover"
                />
              </span>
              <span className="font-heading text-[19px] leading-none text-transparent">
                <span className="wordmark">{site.name}</span>
              </span>
            </Link>

            <p className="mt-6 text-[9px] font-semibold uppercase leading-none tracking-[0.32em] text-frame/70">
              {site.tagline}
            </p>
            <p className="mt-5 max-w-xs text-[12.5px] leading-[1.9] text-paper/50">
              {site.name} — {ft.about}
            </p>

            <div className="mt-7 flex items-center gap-2.5">
              <a
                href={site.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${site.instagramLabel} — ${site.instagramHandle}`}
                className="inline-flex h-10 w-10 items-center justify-center border border-frame/25 text-paper/70 transition-colors duration-300 hover:border-golden hover:text-golden"
              >
                <InstagramIcon className="h-4 w-4" />
              </a>
              <a
                href={waHref}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={ft.whatsappLabel}
                className="inline-flex h-10 w-10 items-center justify-center border border-frame/25 text-whatsapp transition-colors duration-300 hover:border-whatsapp hover:bg-whatsapp/10"
              >
                <WhatsAppIcon className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Explore */}
          <nav aria-label={site.a11y.footerNav} className="lg:col-span-2">
            <p className="text-[9px] font-semibold uppercase leading-none tracking-[0.3em] text-frame/80">
              {ft.exploreTitle}
            </p>
            <ul className="mt-5 flex flex-col border-t border-frame/10">
              {exploreLinks.map((l) => (
                <li key={l.href + l.label} className="border-b border-frame/10">
                  <Link href={l.href} className={linkCls}>
                    <span>{l.label}</span>
                    <Arrow />
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Services */}
          <nav aria-label={ft.servicesTitle} className="sm:col-span-2 lg:col-span-3">
            <p className="text-[9px] font-semibold uppercase leading-none tracking-[0.3em] text-frame/80">
              <Link href={site.servicesPage.href} className="transition-colors duration-300 hover:text-paper">
                {ft.servicesTitle}
              </Link>
            </p>
            <ul className="mt-5 grid grid-cols-1 gap-x-8 border-t border-frame/10 sm:grid-cols-2 lg:grid-cols-1">
              {services.map((s) => (
                <li key={s.slug} className="border-b border-frame/10">
                  <Link href={serviceHref(s.slug)} className={linkCls}>
                    <span>{s.title}</span>
                    <Arrow />
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Contact + hours */}
          <div className="lg:col-span-3">
            <p className="text-[9px] font-semibold uppercase leading-none tracking-[0.3em] text-frame/80">
              {ft.contactTitle}
            </p>
            <address className="mt-5 border-t border-frame/10 pt-4 text-[12.5px] not-italic leading-[1.85] text-paper/50">
              <p>{address}</p>
              <p className="mt-3">
                <a
                  href={mapsHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-2 font-medium text-paper/75 transition-colors duration-300 hover:text-golden"
                >
                  <span className="border-b border-frame/30 pb-0.5">{site.mapsLabel}</span>
                  <span aria-hidden="true" className="-translate-x-1 opacity-0 transition-all duration-500 group-hover:translate-x-0 group-hover:opacity-100">
                    →
                  </span>
                </a>
              </p>
            </address>

            <div className="mt-7 border border-frame/20 p-4">
              <p className="flex items-center gap-2 text-[9px] font-semibold uppercase leading-none tracking-[0.26em] text-frame/80">
                <ClockIcon />
                {ft.hoursTitle}
              </p>
              <p className="mt-3 text-[11px] font-medium text-paper/45">{hoursDays}</p>
              <p className="mt-1.5 font-heading text-[15px] tracking-[0.06em] text-paper">{hoursTime}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Oversized wordmark lockup — the sign-off of every page */}
      <div className="relative border-t border-frame/10">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-5 pb-8 pt-12 sm:flex-row sm:items-end sm:justify-between sm:px-8">
          <p className="font-heading text-[clamp(1.9rem,8vw,4.6rem)] leading-[0.9] text-transparent">
            <span className="wordmark">{site.name}</span>
          </p>
          <p className="max-w-[15rem] text-[12px] font-medium uppercase leading-[2] tracking-[0.28em] text-frame/45 sm:text-right">
            {site.tagline}
          </p>
        </div>
      </div>

      <div className="relative border-t border-frame/10">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-4 px-5 py-6 sm:flex-row sm:items-center sm:px-8">
          <p className="text-[9px] font-medium uppercase tracking-[0.22em] text-paper/30" suppressHydrationWarning>
            © {new Date().getFullYear()} {site.name}
          </p>
          <a
            href={`#${site.anchors.top}`}
            className="group inline-flex shrink-0 items-center gap-2.5 border border-frame/20 px-4 py-2 text-[9px] font-semibold uppercase tracking-[0.24em] text-paper/60 transition-colors duration-300 hover:border-golden hover:text-golden"
          >
            <span aria-hidden="true" className="transition-transform duration-500 group-hover:-translate-y-0.5">↑</span>
            {ft.backToTop}
          </a>
        </div>
      </div>
    </footer>
  );
}
