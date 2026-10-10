import Link from "next/link";
import { site, services as seedServices, serviceHref, getWaNumber } from "@/data/site";
import { InstagramIcon, WhatsAppIcon } from "../ui/SocialIcons";

function ClockIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true" className="h-5 w-5 shrink-0">
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3 2" strokeLinecap="round" />
    </svg>
  );
}

function Arrow() {
  return (
    <span
      aria-hidden="true"
      className="-translate-x-2 text-lg leading-none text-teal-bright opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100"
    >
      →
    </span>
  );
}

export default function Footer({ services = seedServices }) {
  const waNumber = getWaNumber();
  const ft = site.footer;
  const waHref = `https://wa.me/${waNumber}?text=${encodeURIComponent(site.whatsappGreeting)}`;
  const exploreLinks = [
    { label: site.servicesPage.breadcrumbHome, href: site.homeHref },
    ...site.nav,
    site.navCta
  ];
  return (
    <footer className="border-t-2 border-gold/60 bg-ivory text-ink">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-16">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-5">
          {/* Brand */}
          <div>
            <Link href={site.homeHref} className="group inline-flex rounded-full ring-2 ring-gold ring-offset-2 ring-offset-ivory transition-shadow hover:shadow-[0_0_24px_rgba(212,167,60,0.5)]" aria-label={`${site.name} — home`}>
              <img
                src={site.logoSm}
                alt={site.logoAlt}
                width={64}
                height={64}
                loading="lazy"
                className="h-16 w-16 rounded-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </Link>
            <p className="mt-4 font-tagline text-3xl font-bold leading-tight text-plum">{site.tagline}</p>
            <p className="mt-2 text-[15px] leading-relaxed text-ink/70">
              {site.name} — {ft.about}
            </p>
            <div className="mt-4 flex items-center gap-3">
              <a
                href={site.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${site.instagramLabel} — ${site.instagramHandle}`}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-gold/60 bg-white transition-all duration-300 hover:-translate-y-1 hover:border-gold hover:shadow-[0_10px_20px_-8px_rgba(212,167,60,0.8)]"
              >
                <InstagramIcon className="h-5 w-5" />
              </a>
              <a
                href={waHref}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={ft.whatsappLabel}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-whatsapp text-white transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_10px_20px_-6px_rgba(37,211,102,0.7)]"
              >
                <WhatsAppIcon className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Explore */}
          <nav aria-label={site.a11y.footerNav}>
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-ink">{ft.exploreTitle}</p>
            <ul className="mt-3 flex flex-col gap-0.5">
              {exploreLinks.map((l) => (
                <li key={l.href + l.label}>
                  <Link
                    href={l.href}
                    className="group flex items-center gap-2 rounded-xl px-3 py-2 transition-all duration-300 hover:translate-x-1.5 hover:bg-gold/15"
                  >
                    <span className="flex-1 text-[15px] font-medium text-ink/75 transition-colors group-hover:text-ink">
                      {l.label}
                    </span>
                    <Arrow />
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Services */}
          <nav aria-label={ft.servicesTitle} className="sm:col-span-2 lg:col-span-2">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-ink">
              <Link
                href={site.servicesPage.href}
                className="rounded transition-colors hover:text-teal-bright"
              >
                {ft.servicesTitle}
              </Link>
            </p>
            <ul className="mt-3 grid grid-cols-1 gap-0.5 lg:grid-cols-2">
              {services.map((s) => (
                <li key={s.slug}>
                  <Link
                    href={serviceHref(s.slug)}
                    className="group flex items-center gap-2 rounded-xl px-3 py-2 transition-all duration-300 hover:translate-x-1.5 hover:bg-gold/15"
                  >
                    <span className="flex-1 text-[15px] font-medium leading-snug text-ink/75 transition-colors group-hover:text-ink">
                      {s.title}
                    </span>
                    <Arrow />
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Contact + hours */}
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-ink">{ft.contactTitle}</p>
            <address className="mt-3 text-[15px] not-italic leading-relaxed text-ink/75">
              <p>{site.address}</p>
              <p className="mt-2">
                <a href={site.mapsUrl} target="_blank" rel="noopener noreferrer" className="group inline-flex items-center gap-2 rounded font-medium text-teal-bright">
                  <span className="underline decoration-gold underline-offset-4">{site.mapsLabel}</span>
                  <span aria-hidden="true" className="-translate-x-1 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100">→</span>
                </a>
              </p>
            </address>
            <div className="group mt-4 rounded-2xl border border-gold/60 bg-white/70 p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-gold hover:shadow-[0_16px_36px_-20px_rgba(11,59,60,0.5)]">
              <p className="flex items-center gap-2 text-sm font-bold text-plum">
                <ClockIcon />
                {ft.hoursTitle}
              </p>
              <p className="mt-2 text-sm text-ink/75">{ft.hoursDays}</p>
              <p className="font-tagline text-2xl font-bold text-ink">{ft.hoursTime}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-gold/40">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-5 sm:px-6">
          <p className="text-sm text-ink/60" suppressHydrationWarning>
            © {new Date().getFullYear()} {site.name}. {site.tagline}
          </p>
          <a
            href={`#${site.anchors.top}`}
            className="group inline-flex shrink-0 items-center gap-1.5 rounded-full border border-gold/60 px-4 py-2 text-sm font-semibold text-ink transition-all duration-300 hover:-translate-y-0.5 hover:border-gold hover:bg-gold/10"
          >
            <span aria-hidden="true" className="transition-transform duration-300 group-hover:-translate-y-0.5">↑</span>
            {ft.backToTop}
          </a>
        </div>
      </div>
    </footer>
  );
}
