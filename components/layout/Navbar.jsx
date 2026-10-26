"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { site, getWaNumber } from "@/data/site";
import { InstagramIcon, WhatsAppIcon } from "../ui/SocialIcons";

// navLinks arrives filtered from the server layout so CMS-hidden
// sections (e.g. Clients) never flash in the menu on either platform.
export default function Navbar({ navLinks = site.nav } = {}) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [progress, setProgress] = useState(0);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => {
      const doc = document.documentElement;
      const max = doc.scrollHeight - window.innerHeight;
      setScrolled(window.scrollY > 14);
      setProgress(max > 0 ? Math.min(1, window.scrollY / max) : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const waHref = `https://wa.me/${getWaNumber()}`;

  return (
    <header data-scheme="wine" className="fixed inset-x-0 top-0 z-50">
      {/* Utility strip */}
      <div className="hidden border-b border-frame/10 bg-noir/85 backdrop-blur-md sm:block">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-2.5 text-[10px] font-medium uppercase leading-none tracking-[0.3em] text-paper/40">
          <a
            href={waHref}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2.5 transition-colors duration-300 hover:text-golden"
          >
            <WhatsAppIcon className="h-3 w-3" />
            {site.footer.whatsappLabel}
            <span aria-hidden="true" className="h-2.5 w-px bg-frame/20" />
            {site.addressParts.locality}
          </a>
          <a
            href={site.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2.5 transition-colors duration-300 hover:text-golden"
          >
            <InstagramIcon className="h-3 w-3" />
            {site.instagramHandle}
          </a>
        </div>
      </div>

      {/* Main bar */}
      <div
        className={`relative border-b bg-noir/90 backdrop-blur-xl transition-[border-color,box-shadow,background-color] duration-500 ${
          scrolled
            ? "border-frame/20 shadow-[0_30px_70px_-40px_rgba(0,0,0,0.95)]"
            : "border-frame/10"
        }`}
      >
        <nav
          aria-label={site.a11y.primaryNav}
          className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-4 py-3.5 sm:px-6 sm:py-4"
        >
          <Link href={site.homeHref} className="group flex shrink-0 items-center gap-3.5" aria-label={`${site.name} — home`}>
            <span className="relative inline-flex rounded-full border border-frame/50 p-[3px] transition-colors duration-500 group-hover:border-golden/60">
              <img
                src={site.logoSm}
                alt={site.logoAlt}
                width={112}
                height={112}
                loading="eager"
                className="h-16 w-16 rounded-full object-cover transition-transform duration-700 group-hover:scale-105 sm:h-[72px] sm:w-[72px]"
              />
            </span>
            <span className="hidden flex-col gap-1.5 leading-none sm:flex">
              <span className="font-heading text-[15px] tracking-[0.14em] text-paper transition-colors duration-300 group-hover:text-golden">
                {site.name}
              </span>
              <span className="text-[9px] font-medium uppercase tracking-[0.3em] text-frame/65">
                {site.tagline}
              </span>
            </span>
          </Link>

          <button
            type="button"
            className="inline-flex items-center gap-2.5 border border-frame/30 px-4 py-2.5 text-[10px] font-semibold uppercase tracking-[0.24em] text-paper transition-colors duration-300 hover:border-golden hover:text-golden md:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen(true)}
          >
            <span aria-hidden="true" className="flex flex-col gap-[3px]">
              <span className="h-px w-4 bg-paper/70" />
              <span className="h-px w-4 bg-paper/70" />
              <span className="h-px w-2.5 bg-brand" />
            </span>
            {site.menuClosedLabel}
          </button>

          <ul className="hidden items-center gap-8 md:flex lg:gap-10">
            {navLinks.map((l) => {
              const isActive = pathname === l.href;
              return (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    aria-current={isActive ? "page" : undefined}
                    className={`group relative block py-2 text-[13px] font-medium uppercase tracking-[0.26em] transition-colors duration-300 ${
                      isActive ? "text-golden" : "text-paper/65 hover:text-paper"
                    }`}
                  >
                    {l.label}
                    <span
                      aria-hidden="true"
                      className={`absolute -bottom-px left-0 h-px w-full origin-left bg-gradient-to-r from-golden to-ember transition-transform duration-500 ${
                        isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                      }`}
                    />
                  </Link>
                </li>
              );
            })}
            <li>
              <Link
                href={site.navCta.href}
                className="btn btn-brand px-6 py-3 text-[11px] tracking-[0.24em]"
              >
                {site.navCta.label}
              </Link>
            </li>
          </ul>
        </nav>

        {/* Reading progress — brand into gold */}
        <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-px bg-frame/10">
          <div
            className="h-px origin-left bg-gradient-to-r from-brand-dark via-brand to-golden shadow-[0_0_14px_rgba(252,204,48,0.45)] transition-transform duration-150 ease-out"
            style={{ transform: `scaleX(${progress})` }}
          />
        </div>
      </div>

      {/* Fullscreen mobile menu */}
      <div
        id="mobile-menu"
        aria-hidden={!open}
        className={`fixed inset-0 z-[60] flex flex-col overflow-hidden bg-noir transition-all duration-500 md:hidden ${
          open ? "visible opacity-100" : "pointer-events-none invisible opacity-0"
        }`}
      >
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_80%_0%,rgba(166,124,0,0.08),transparent_55%)]" />
        <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-golden/[0.06] to-transparent" />

        <div className="relative flex items-center justify-between border-b border-frame/15 px-5 py-4">
          <span className="inline-flex items-center gap-3">
            <img
              src={site.logoSm}
              alt=""
              width={48}
              height={48}
              loading="eager"
              className="h-10 w-10 rounded-full border border-frame/50 object-cover"
            />
            <span className="font-heading text-[11px] tracking-[0.14em] text-paper">{site.name}</span>
          </span>
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label={site.menuOpenLabel}
            className="inline-flex h-10 w-10 items-center justify-center border border-frame/30 text-xl leading-none text-paper transition-colors hover:border-golden hover:text-golden"
          >
            <span aria-hidden="true">×</span>
          </button>
        </div>

        <nav aria-label={site.a11y.mobileNav} className="relative flex flex-1 flex-col justify-center px-6">
          <p className="text-[9px] font-semibold uppercase leading-none tracking-[0.34em] text-frame/60">
            {site.tagline}
          </p>
          <ul className="mt-8 flex flex-col border-t border-frame/15">
            {navLinks.map((l, i) => {
              const isActive = pathname === l.href;
              return (
                <li key={l.href} className="border-b border-frame/15">
                  <Link
                    href={l.href}
                    tabIndex={open ? 0 : -1}
                    aria-current={isActive ? "page" : undefined}
                    onClick={() => setOpen(false)}
                    className="group flex items-center gap-5 py-5"
                  >
                    <span aria-hidden="true" className="text-[9px] font-semibold tracking-[0.24em] text-golden/80">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span
                      className={`font-heading text-[clamp(1.5rem,7vw,2rem)] leading-none transition-colors duration-300 ${
                        isActive ? "text-transparent" : "text-paper group-hover:text-golden"
                      }`}
                    >
                      <span className={isActive ? "wordmark" : undefined}>{l.label}</span>
                    </span>
                    <span aria-hidden="true" className="ml-auto text-frame/40 transition-transform duration-500 group-hover:translate-x-1.5 group-hover:text-golden">
                      →
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="relative shrink-0 border-t border-frame/15 px-6 py-7">
          <Link
            href={site.navCta.href}
            tabIndex={open ? 0 : -1}
            onClick={() => setOpen(false)}
            className="btn btn-brand w-full"
          >
            {site.navCta.label}
            <span aria-hidden="true">→</span>
          </Link>
          <div className="mt-3 flex gap-3">
            <a
              href={waHref}
              target="_blank"
              rel="noopener noreferrer"
              tabIndex={open ? 0 : -1}
              className="btn btn-ghost flex-1 px-4 text-[10px]"
            >
              <WhatsAppIcon className="h-4 w-4" />
              {site.footer.whatsappLabel}
            </a>
            <a
              href={site.instagram}
              target="_blank"
              rel="noopener noreferrer"
              tabIndex={open ? 0 : -1}
              aria-label={site.instagramLabel}
              className="inline-flex h-[46px] w-[46px] items-center justify-center border border-frame/30 transition-colors hover:border-golden"
            >
              <InstagramIcon className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
