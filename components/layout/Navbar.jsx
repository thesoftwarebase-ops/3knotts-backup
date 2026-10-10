"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { site, getWaNumber } from "@/data/site";
import { InstagramIcon, WhatsAppIcon } from "../ui/SocialIcons";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open ]);

  const waHref = `https://wa.me/${getWaNumber()}`;

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      {/* Utility strip */}
      <div className="hidden bg-teal-deep text-ivory sm:block">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-2 text-[13px] font-medium leading-none tracking-wide">
          <a href={waHref} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 rounded text-ivory/90 transition-colors hover:text-gold-soft">
            <WhatsAppIcon />
            {site.footer.whatsappLabel} · {site.addressParts.locality}
          </a>
          <a
            href={site.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded text-ivory/90 transition-colors hover:text-gold-soft"
          >
            <InstagramIcon className="h-5 w-5" />
            {site.instagramHandle}
          </a>
        </div>
      </div>

      {/* Main bar — ivory, gold rules */}
      <div
        className={`bg-ivory/95 backdrop-blur transition-shadow duration-300 ${
          scrolled ? "shadow-[0_10px_36px_-14px_rgba(11,59,60,0.5)]" : ""
        }`}
      >
        <div aria-hidden="true" className="h-[3px] bg-gradient-to-r from-gold/20 via-gold to-gold/20" />
        <nav aria-label={site.a11y.primaryNav} className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-2 sm:px-6">
          <Link href={site.homeHref} className="group flex shrink-0 items-center" aria-label={`${site.name} — home`}>
            <span className="inline-flex rounded-full shadow-[0_6px_20px_-6px_rgba(11,59,60,0.55)] ring-[3px] ring-gold ring-offset-2 ring-offset-ivory transition-transform duration-300 group-hover:scale-[1.04]">
              <img
                src={site.logoSm}
                alt={site.logoAlt}
                width={96}
                height={96}
                loading="eager"
                className="h-20 w-20 rounded-full object-cover sm:h-24 sm:w-24"
              />
            </span>
          </Link>

          <button
            type="button"
            className="inline-flex items-center gap-2.5 rounded-full bg-teal-deep px-5 py-2.5 text-sm font-semibold text-ivory ring-1 ring-gold/60 transition-transform hover:-translate-y-0.5 md:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen(true)}
          >
            <span aria-hidden="true" className="flex flex-col gap-1">
              <span className="h-0.5 w-5 bg-gold-soft" />
              <span className="h-0.5 w-5 bg-gold-soft" />
              <span className="h-0.5 w-3.5 bg-gold-soft" />
            </span>
            {site.menuClosedLabel}
          </button>

          <ul className="hidden items-center gap-10 md:flex">
            {site.nav.map((l) => {
              const isActive = pathname === l.href;
              return (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    aria-current={isActive ? "page" : undefined}
                    className={`group relative rounded py-1 font-tagline text-2xl font-bold transition-colors ${
                      isActive ? "text-teal-bright" : "text-ink hover:text-teal-bright"
                    }`}
                  >
                    {l.label}
                    <span
                      aria-hidden="true"
                      className={`absolute -bottom-1 left-0 h-[2px] w-full origin-left rounded bg-gold transition-transform duration-300 ${
                        isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                      }`}
                    />
                    <span
                      aria-hidden="true"
                      className="absolute -bottom-[7px] left-1/2 h-1.5 w-1.5 -translate-x-1/2 rotate-45 bg-gold transition-opacity duration-300"
                      style={{ opacity: isActive ? 1 : 0 }}
                    />
                  </Link>
                </li>
              );
            })}
            <li className="ml-1">
              <Link
                href={site.navCta.href}
                className="rounded-full bg-gold px-7 py-2.5 text-[13px] font-bold uppercase tracking-[0.14em] text-ink shadow-[0_6px_18px_-6px_rgba(212,167,60,0.9)] transition-all hover:-translate-y-0.5 hover:shadow-[0_10px_26px_-6px_rgba(212,167,60,1)]"
              >
                {site.navCta.label}
              </Link>
            </li>
          </ul>
        </nav>
        <div aria-hidden="true" className="h-px bg-gold/50" />
      </div>

      {/* Fullscreen mobile menu */}
      <div
        id="mobile-menu"
        aria-hidden={!open}
        className={`fixed inset-0 z-[60] flex flex-col bg-teal-deep transition-all duration-300 md:hidden ${
          open ? "visible opacity-100" : "invisible opacity-0"
        }`}
      >
        <div aria-hidden="true" className="h-[3px] shrink-0 bg-gradient-to-r from-gold/20 via-gold to-gold/20" />
        <div className="flex items-center justify-between px-5 py-3">
          <span className="inline-flex rounded-full ring-2 ring-gold">
            <img src={site.logoSm} alt="" width={52} height={52} loading="eager" className="h-13 w-13 rounded-full object-cover" />
          </span>
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label={site.menuOpenLabel}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-gold/60 text-2xl leading-none text-gold-soft"
          >
            <span aria-hidden="true">×</span>
          </button>
        </div>

        <nav aria-label={site.a11y.mobileNav} className="flex flex-1 flex-col justify-center px-8">
          <p className="font-tagline text-2xl text-gold-soft">{site.tagline}</p>
          <ul className="mt-6 flex flex-col">
            {site.nav.map((l, i) => {
              const isActive = pathname === l.href;
              return (
                <li key={l.href} className="border-b border-ivory/10 last:border-0">
                  <Link
                    href={l.href}
                    tabIndex={open ? 0 : -1}
                    aria-current={isActive ? "page" : undefined}
                    onClick={() => setOpen(false)}
                    className={`flex items-baseline gap-4 rounded py-4 ${
                      isActive ? "text-gold-soft" : "text-ivory"
                    }`}
                  >
                    <span aria-hidden="true" className="text-sm font-semibold text-gold/80">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="font-tagline text-5xl font-bold">{l.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="shrink-0 px-8 pb-10">
          <Link
            href={site.navCta.href}
            tabIndex={open ? 0 : -1}
            onClick={() => setOpen(false)}
            className="mb-4 block rounded-full bg-gold px-4 py-3.5 text-center text-sm font-bold uppercase tracking-[0.14em] text-ink"
          >
            {site.navCta.label}
          </Link>
          <div className="flex gap-3">
            <a
              href={waHref}
              target="_blank"
              rel="noopener noreferrer"
              tabIndex={open ? 0 : -1}
              className="flex flex-1 items-center justify-center gap-2 rounded-full bg-whatsapp px-4 py-3.5 text-sm font-bold text-white"
            >
              <WhatsAppIcon className="h-5 w-5" />
              {site.footer.whatsappLabel}
            </a>
          </div>
          <a
            href={site.instagram}
            target="_blank"
            rel="noopener noreferrer"
            tabIndex={open ? 0 : -1}
            className="mt-4 flex items-center justify-center gap-2 text-sm font-medium text-ivory/80"
          >
            <InstagramIcon className="h-5 w-5" />
            {site.instagramHandle}
          </a>
        </div>
      </div>
    </header>
  );
}
