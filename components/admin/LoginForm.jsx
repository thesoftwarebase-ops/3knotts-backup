"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { showBusy, hideBusy } from "@/lib/busy";
import { site } from "@/data/site";

export default function LoginForm() {
  const t = site.adminLogin;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState(false);
  const router = useRouter();

  // Already holding a live session? Skip the login screen.
  useEffect(() => {
    let live = true;
    const token = sessionStorage.getItem("admin-jwt") || "";
    if (!token) return;
    fetch("/api/admin/auth/me", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(async (res) => {
        const data = await res.json().catch(() => ({}));
        if (live && res.ok && data.ok) {
          router.push("/dashboard");
          router.refresh();
        }
      })
      .catch(() => {});
    return () => {
      live = false;
    };
  }, [router]);

  async function onSubmit(e) {
    e.preventDefault();
    if (!email.trim() || !password) return;
    setBusy(true);
    showBusy(t.signingIn);
    try {
      const res = await fetch("/api/admin/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password })
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.ok || !data.token) throw new Error(data.error || t.error);
      sessionStorage.setItem("admin-jwt", data.token);
      toast.success(t.unlocked);
      router.push("/dashboard");
      router.refresh();
    } catch (err) {
      toast.error(err.message || t.error);
    } finally {
      hideBusy();
      setBusy(false);
    }
  }

  const inputCls =
    "w-full rounded-xl border border-paper/15 bg-noir/50 px-4 py-3 text-base text-paper placeholder:text-paper/35 transition-all focus:border-brand focus:bg-noir/70 focus:outline-none focus:ring-2 focus:ring-brand/30";

  return (
    <form
      onSubmit={onSubmit}
      className="relative w-full max-w-sm overflow-hidden rounded-3xl border border-brand/40 bg-charcoal/80 p-6 shadow-[0_28px_70px_-28px_rgba(166,124,0,0.22)] sm:p-8"
    >
      <span aria-hidden="true" className="pointer-events-none absolute inset-2 rounded-2xl border border-brand/20" />
      <div aria-hidden="true" className="relative mx-auto h-2 w-2 rotate-45 bg-brand" />
      <h1 className="relative mt-4 text-center font-tagline text-4xl font-bold text-plum">
        {t.title}
      </h1>
      <label htmlFor="admin-email" className="relative mb-1.5 mt-6 block text-sm font-bold text-paper">
        {t.emailLabel}
      </label>
      <input
        id="admin-email"
        type="email"
        autoComplete="email"
        suppressHydrationWarning
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder={t.emailPlaceholder}
        className={`relative ${inputCls}`}
      />
      <label htmlFor="admin-password" className="relative mb-1.5 mt-4 block text-sm font-bold text-paper">
        {t.passwordLabel}
      </label>
      <div className="relative">
        <input
          id="admin-password"
          type={showPassword ? "text" : "password"}
          autoComplete="current-password"
          suppressHydrationWarning
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder={t.passwordPlaceholder}
          className={`relative w-full ${inputCls} pr-12`}
        />
        <button
          type="button"
          onClick={() => setShowPassword((v) => !v)}
          aria-pressed={showPassword}
          aria-label={showPassword ? t.hidePassword : t.showPassword}
          className="absolute right-2 top-1/2 inline-flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full text-paper/50 transition-colors hover:bg-brand/15 hover:text-paper"
        >
          {showPassword ? (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true" className="h-5 w-5">
              <path d="M4 4l16 16" strokeLinecap="round" />
              <path d="M10.6 5.1A9.8 9.8 0 0 1 12 5c5 0 9 4.5 10 7-.4 1-1.3 2.6-2.7 4M6.6 6.6C4 8.2 2.5 10.5 2 12c1 2.5 5 7 10 7 1.5 0 2.9-.4 4.1-1" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true" className="h-5 w-5">
              <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" strokeLinejoin="round" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          )}
        </button>
      </div>
      <button
        type="submit"
        disabled={busy || !email.trim() || !password}
        className="relative mt-4 w-full rounded-full bg-brand px-6 py-3.5 text-base font-bold text-ivory transition-transform hover:-translate-y-0.5 disabled:opacity-60"
      >
        {t.button}
      </button>
    </form>
  );
}
