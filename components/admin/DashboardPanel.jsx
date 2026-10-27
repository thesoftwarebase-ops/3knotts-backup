"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { showBusy, hideBusy } from "@/lib/busy";
import { site } from "@/data/site";
import HeroManager from "./HeroManager";
import ServicesManager from "./ServicesManager";
import AboutManager from "./AboutManager";
import EmailManager from "./EmailManager";
import SettingsManager from "./SettingsManager";
import ChatbotManager from "./ChatbotManager";
import {
  BrandManager,
  FeaturedManager,
  StepsManager,
  WorkNote,
  TestimonialsManager,
  FaqManager,
  ClientsManager
} from "./HomeManagers";

const TABS = site.dashboard.tabOrder;

const ORDER = ["new", "contacted", "done"];

function authHeaders() {
  const token = sessionStorage.getItem("admin-jwt") || "";
  return { "Content-Type": "application/json", Authorization: `Bearer ${token}` };
}

export default function DashboardPanel() {
  const t = site.dashboard;
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [email, setEmail] = useState("");
  const [tab, setTab] = useState("enquiries");
  const [homeOpen, setHomeOpen] = useState(false);
  const [drawer, setDrawer] = useState(false);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [account, setAccount] = useState({ currentPassword: "", newEmail: "", newPassword: "" });

  const logout = useCallback(() => {
    sessionStorage.removeItem("admin-jwt");
    router.push("/login");
    router.refresh();
  }, [router]);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/enquiries", { headers: authHeaders() });
      const data = await res.json().catch(() => ({}));
      if (res.status === 401 || !data.ok) throw new Error(t.sessionExpired);
      setRows(data.rows || []);
    } catch (err) {
      if (String(err.message || "").includes("Session expired")) {
        logout();
        return;
      }
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }, [logout, t.sessionExpired]);

  useEffect(() => {
    let live = true;
    fetch("/api/admin/auth/me", { headers: authHeaders() })
      .then(async (res) => {
        const data = await res.json().catch(() => ({}));
        if (!res.ok || !data.ok) throw new Error("unauthorized");
        if (live) {
          setEmail(data.email || "");
          setAccount((a) => ({ ...a, newEmail: data.email || "" }));
          setReady(true);
        }
      })
      .catch(() => logout());
    return () => {
      live = false;
    };
  }, [logout]);

  useEffect(() => {
    if (ready && tab === "enquiries") load();
  }, [ready, tab, load]);

  // Re-verify the session whenever the tab regains focus or a cached
  // page is restored (back/forward) — logged-out sessions bounce to login.
  useEffect(() => {
    if (!ready) return;
    let live = true;
    const verify = () => {
      fetch("/api/admin/auth/me", {
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${sessionStorage.getItem("admin-jwt") || ""}` }
      })
        .then(async (res) => {
          const data = await res.json().catch(() => ({}));
          if (live && (!res.ok || !data.ok)) logout();
        })
        .catch(() => {});
    };
    const onVis = () => {
      if (document.visibilityState === "visible") verify();
    };
    window.addEventListener("focus", verify);
    window.addEventListener("pageshow", verify);
    document.addEventListener("visibilitychange", onVis);
    return () => {
      live = false;
      window.removeEventListener("focus", verify);
      window.removeEventListener("pageshow", verify);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [ready, logout]);

  useEffect(() => {
    document.body.style.overflow = drawer ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [drawer]);

  async function advance(row) {
    const next = ORDER[(ORDER.indexOf(row.status) + 1) % ORDER.length];
    showBusy(t.working);
    try {
      const res = await fetch("/api/admin/enquiries", {
        method: "PATCH",
        headers: authHeaders(),
        body: JSON.stringify({ id: row.id, status: next })
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.ok) throw new Error(data.error || "Update failed.");
      setRows((rs) => rs.map((r) => (r.id === row.id ? { ...r, status: data.status } : r)));
      toast.success(t.updated);
    } catch (err) {
      toast.error(err.message);
    } finally {
      hideBusy();
    }
  }

  async function remove(row) {
    if (!window.confirm(t.removeConfirm)) return;
    showBusy(t.working);
    try {
      const res = await fetch(`/api/admin/enquiries?id=${encodeURIComponent(row.id)}`, {
        method: "DELETE",
        headers: authHeaders()
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.ok) throw new Error(data.error || "Delete failed.");
      setRows((rs) => rs.filter((r) => r.id !== row.id));
      toast.success(t.deleted);
    } catch (err) {
      toast.error(err.message);
    } finally {
      hideBusy();
    }
  }

  async function saveAccount(e) {
    e.preventDefault();
    showBusy(t.save);
    try {
      const res = await fetch("/api/admin/auth/account", {
        method: "PUT",
        headers: authHeaders(),
        body: JSON.stringify(account)
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.ok) throw new Error(data.error || "Update failed.");
      toast.success(t.saved);
      setAccount({ currentPassword: "", newEmail: data.email || "", newPassword: "" });
      if (data.email) setEmail(data.email);
    } catch (err) {
      toast.error(err.message);
    } finally {
      hideBusy();
    }
  }

  const pill =
    "inline-flex items-center rounded-full px-3 py-1 text-[13px] font-bold ";
  const pillTone = (s) =>
    s === "new"
      ? "bg-gold/20 text-golden"
      : s === "contacted"
        ? "bg-teal-deep/10 text-teal-bright"
        : "bg-green-900/30 text-green-400";

  const inputCls =
    "w-full rounded-xl border border-frame/25 bg-charcoal/60 px-4 py-3 text-base text-paper placeholder:text-paper/40 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/40";

  if (!ready) {
    return (
      <div className="flex min-h-svh items-center justify-center bg-noir">
        <p className="text-paper/60">{t.loading}</p>
      </div>
    );
  }

  const nav = (
    <>
      <div className="flex items-center gap-3">
        <span className="inline-flex rounded-full ring-2 ring-gold">
          <Image src={site.logoSm} alt="" width={44} height={44} className="h-11 w-11 rounded-full object-cover" />
        </span>
        <div>
          <p className="font-tagline text-2xl font-bold leading-none text-plum">{t.title}</p>
          {email ? <p className="mt-1 truncate text-xs font-medium text-paper/60">{email}</p> : null}
        </div>
      </div>
      <nav aria-label={t.title} className="nice-scroll mt-8 flex min-h-0 flex-1 flex-col gap-1 overflow-y-auto pr-1">
        {TABS.map((k) =>
          k === "home" ? (
            <div key="home">
              <button
                type="button"
                onClick={() => setHomeOpen((v) => !v)}
                aria-expanded={homeOpen}
                className={`flex w-full items-center justify-between rounded-xl px-4 py-3 text-left text-[15px] font-bold transition-all ${
                  tab.startsWith("home-")
                    ? "bg-gold/20 text-paper"
                    : "text-paper/70 hover:translate-x-0.5 hover:bg-gold/10 hover:text-paper"
                }`}
              >
                {t.homeLabel}
                <span aria-hidden="true" className={`text-gold transition-transform duration-300 ${homeOpen ? "rotate-90" : ""}`}>
                  ›
                </span>
              </button>
              <div className={`grid transition-all duration-300 ${homeOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
                <div className="overflow-hidden">
                  <div className="flex flex-col gap-0.5 py-1 pl-3">
                    {site.dashboard.homeOrder.map((h) => {
                      const id = `home-${h}`;
                      const isActive = tab === id;
                      return (
                        <button
                          key={id}
                          type="button"
                          onClick={() => {
                            setTab(id);
                            setDrawer(false);
                          }}
                          aria-current={isActive ? "page" : undefined}
                          className={`rounded-lg px-4 py-2 text-left text-sm font-semibold transition-all ${
                            isActive
                              ? "bg-gold text-ivory shadow-[0_8px_20px_-8px_rgba(166,124,0,0.5)]"
                              : "text-paper/65 hover:translate-x-0.5 hover:bg-gold/10 hover:text-paper"
                          }`}
                        >
                          {t.homeTabs[h]}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <button
              key={k}
              type="button"
              onClick={() => {
                setTab(k);
                setDrawer(false);
              }}
              aria-current={tab === k ? "page" : undefined}
              className={`rounded-xl px-4 py-3 text-left text-[15px] font-bold transition-all ${
                tab === k
                  ? "bg-gold text-ivory shadow-[0_8px_20px_-8px_rgba(166,124,0,0.5)]"
                  : "text-paper/70 hover:translate-x-0.5 hover:bg-gold/10 hover:text-paper"
              }`}
            >
              {t.tabs[k]}
            </button>
          )
        )}
      </nav>
      <button
        type="button"
        onClick={logout}
        className="mt-auto rounded-full border border-gold/60 px-5 py-2.5 text-sm font-bold text-paper transition-all hover:-translate-y-0.5 hover:border-gold"
      >
        {t.logout}
      </button>
      <Link
        href={site.homeHref}
        className="group mt-2 inline-flex items-center justify-center gap-2 rounded-full bg-teal-deep px-5 py-2.5 text-center text-sm font-bold text-ivory transition-all hover:-translate-y-0.5"
      >
        {t.viewLive}
        <span aria-hidden="true" className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5">↗</span>
      </Link>
    </>
  );

  return (
    <div className="relative min-h-svh overflow-clip bg-noir lg:pl-64">
      <img src={site.flower} alt="" aria-hidden="true" draggable={false} loading="lazy" className="pointer-events-none fixed left-0 top-0 z-0 h-auto w-40 rotate-180 select-none opacity-15 [mask-image:radial-gradient(farthest-side_at_0%_0%,black_55%,transparent)] sm:w-56" />
      <img src={site.flower} alt="" aria-hidden="true" draggable={false} loading="lazy" className="pointer-events-none fixed right-0 top-0 z-0 h-auto w-40 -rotate-90 select-none opacity-15 [mask-image:radial-gradient(farthest-side_at_100%_0%,black_55%,transparent)] sm:w-56" />
      <img src={site.flower} alt="" aria-hidden="true" draggable={false} loading="lazy" className="pointer-events-none fixed bottom-0 left-0 z-0 h-auto w-40 rotate-90 select-none opacity-15 [mask-image:radial-gradient(farthest-side_at_0%_100%,black_55%,transparent)] sm:w-56" />
      <img src={site.flower} alt="" aria-hidden="true" draggable={false} loading="lazy" className="pointer-events-none fixed bottom-0 right-0 z-0 h-auto w-40 select-none opacity-15 [mask-image:radial-gradient(farthest-side_at_100%_100%,black_55%,transparent)] sm:w-56" />

      {/* Sidebar — desktop */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r border-gold/40 bg-noir/90 px-5 py-6 backdrop-blur lg:flex">
        {nav}
      </aside>

      {/* Top bar + drawer — mobile */}
      <div className="sticky top-0 z-40 flex items-center justify-between border-b border-gold/40 bg-noir/95 px-4 py-3 backdrop-blur lg:hidden">
        <p className="font-tagline text-2xl font-bold text-plum">{t.title}</p>
        <button
          type="button"
          onClick={() => setDrawer(true)}
          aria-label={site.menuClosedLabel}
          aria-expanded={drawer}
          aria-controls="dash-drawer"
          className="inline-flex items-center gap-2 rounded-full bg-teal-deep px-5 py-2.5 text-sm font-bold text-ivory"
        >
          <span aria-hidden="true" className="flex flex-col gap-1">
            <span className="h-0.5 w-5 bg-gold-soft" />
            <span className="h-0.5 w-5 bg-gold-soft" />
            <span className="h-0.5 w-3.5 bg-gold-soft" />
          </span>
          {site.menuClosedLabel}
        </button>
      </div>
      <div
        id="dash-drawer"
        aria-hidden={!drawer}
        className={`fixed inset-0 z-[70] transition-all duration-300 lg:hidden ${
          drawer ? "visible opacity-100" : "invisible opacity-0"
        }`}
      >
        <div aria-hidden="true" className="absolute inset-0 bg-noir/70" onClick={() => setDrawer(false)} />
        <div className="absolute inset-y-0 left-0 flex w-72 max-w-[85vw] flex-col bg-noir px-5 py-6 shadow-2xl">
          <button
            type="button"
            onClick={() => setDrawer(false)}
            aria-label={t.logout}
            className="absolute right-4 top-4 inline-flex h-10 w-10 items-center justify-center rounded-full border border-gold/60 text-2xl leading-none text-plum"
          >
            <span aria-hidden="true">×</span>
          </button>
          {nav}
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-10">
        {tab === "enquiries" ? (
          <div>
            <p className="text-sm font-medium text-paper/60">
              {rows.length} {t.showing}
            </p>
            {loading ? (
              <p className="mt-6 text-paper/60">{t.loading}</p>
            ) : rows.length === 0 ? (
              <p className="mt-6 rounded-2xl border border-gold/40 bg-charcoal/60 p-6 text-center text-paper/70">
                {t.empty}
              </p>
            ) : (
              <ul className="mt-4 flex flex-col gap-4">
                {rows.map((r) => {
                  const next = ORDER[(ORDER.indexOf(r.status) + 1) % ORDER.length];
                  return (
                    <li key={r.id} className="rounded-2xl border border-gold/50 bg-charcoal/60 p-5">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <p className="font-tagline text-2xl font-bold text-paper">{r.name}</p>
                        <span className={pill + pillTone(r.status)}>{t.status[r.status] || r.status}</span>
                      </div>
                      <dl className="mt-3 grid grid-cols-1 gap-x-6 gap-y-1 text-[15px] text-paper/80 sm:grid-cols-2">
                        <div><dt className="sr-only">{site.form.phoneLabel}</dt><dd><a className="font-semibold text-teal-bright" href={`tel:${r.phone}`}>{r.phone}</a></dd></div>
                        <div><dt className="sr-only">{site.form.dateLabel}</dt><dd>{r.date}</dd></div>
                        <div><dt className="sr-only">{site.form.locationLabel}</dt><dd>{r.location}</dd></div>
                        <div><dt className="sr-only">{site.form.functionLabel}</dt><dd>{r.functionType}</dd></div>
                        {r.budget ? <div><dt className="sr-only">{site.form.budgetLabel}</dt><dd>{r.budget}</dd></div> : null}
                        {r.createdAt ? <div><dt className="sr-only">{t.received}</dt><dd className="text-paper/60">{new Date(r.createdAt).toLocaleString()}</dd></div> : null}
                      </dl>
                      <p className="mt-3 rounded-xl bg-noir px-4 py-3 text-[15px] leading-relaxed text-paper/85">
                        {r.requirement}
                      </p>
                      <div className="mt-4 flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => advance(r)}
                          className="rounded-full bg-gold px-5 py-2 text-sm font-bold text-paper transition-transform hover:-translate-y-0.5"
                        >
                          {t.next} {t.status[next]}
                        </button>
                        <button
                          type="button"
                          onClick={() => remove(r)}
                          className="rounded-full border border-plum/30 px-5 py-2 text-sm font-semibold text-plum transition-colors hover:border-plum"
                        >
                          {t.remove}
                        </button>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        ) : tab === "email" ? (
          <EmailManager />
        ) : tab === "settings" ? (
          <SettingsManager />
        ) : tab === "chatbot" ? (
          <ChatbotManager />
        ) : tab === "home-hero" ? (
          <HeroManager />
        ) : tab === "home-brand" ? (
          <BrandManager />
        ) : tab === "home-featured" ? (
          <FeaturedManager />
        ) : tab === "home-steps" ? (
          <StepsManager />
        ) : tab === "home-work" ? (
          <WorkNote onGoServices={() => setTab("services")} />
        ) : tab === "home-testimonials" ? (
          <TestimonialsManager />
        ) : tab === "home-faq" ? (
          <FaqManager />
        ) : tab === "clients" ? (
          <ClientsManager />
        ) : tab === "services" ? (
          <ServicesManager />
        ) : tab === "about" ? (
          <AboutManager />
        ) : (
          <form onSubmit={saveAccount} className="max-w-md rounded-2xl border border-gold/50 bg-charcoal/60 p-6">
            <p className="font-tagline text-3xl font-bold text-plum">{t.accountTitle}</p>
            <p className="mt-1 text-sm text-paper/70">{t.accountIntro}</p>
            {email ? (
              <p className="mt-3 rounded-xl bg-noir px-4 py-2.5 text-sm font-bold text-teal-bright">
                {email}
              </p>
            ) : null}
            <label htmlFor="acc-current" className="mb-1.5 mt-5 block text-sm font-bold text-paper">
              {site.adminLogin.passwordLabel} *
            </label>
            <input
              id="acc-current"
              type="password"
              autoComplete="current-password"
              required
              value={account.currentPassword}
              onChange={(e) => setAccount((a) => ({ ...a, currentPassword: e.target.value }))}
              suppressHydrationWarning
              className={inputCls}
            />
            <label htmlFor="acc-email" className="mb-1.5 mt-4 block text-sm font-bold text-paper">
              {t.newEmailLabel}
            </label>
            <input
              id="acc-email"
              type="email"
              autoComplete="email"
              value={account.newEmail}
              onChange={(e) => setAccount((a) => ({ ...a, newEmail: e.target.value }))}
              suppressHydrationWarning
              className={inputCls}
            />
            <label htmlFor="acc-new" className="mb-1.5 mt-4 block text-sm font-bold text-paper">
              {t.newPasswordLabel}
            </label>
            <input
              id="acc-new"
              type="password"
              autoComplete="new-password"
              value={account.newPassword}
              onChange={(e) => setAccount((a) => ({ ...a, newPassword: e.target.value }))}
              suppressHydrationWarning
              className={inputCls}
            />
            <button
              type="submit"
              className="mt-5 w-full rounded-full bg-teal-deep px-6 py-3 text-base font-bold text-ivory transition-transform hover:-translate-y-0.5"
            >
              {t.save}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
