"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { site } from "@/data/site";

// Floating assistant with two modes:
//  - "I need a service": walks the guided questions set in the dashboard,
//    captures the answers, then locks the input and pops the Enquire
//    button that packs everything into a WhatsApp message.
//  - "Ask a question": free chat answered by the AI on the server from the
//    knowledge paragraph fed in the dashboard.
// The conversation lives in localStorage (3knotts-chat-v1) with a clear
// button; nothing about the visitor leaves the site until Enquire.
const LS_KEY = "3knotts-chat-v1";
const T = site.chatWidget;
const MAX_CONTEXT = 10;
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// "2026-12-12" -> "12 Dec 2026" (manual split: no timezone surprises)
function fmtDate(iso) {
  const [y, m, d] = String(iso).split("-").map(Number);
  if (!y || !m || !d) return String(iso);
  return `${d} ${MONTHS[m - 1]} ${y}`;
}

// Today as "YYYY-MM-DD" for the date input's min attribute
function todayIso() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export default function ChatWidget({ chat, waNumber }) {
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState(() => (chat ? [{ who: "bot", text: chat.welcome }] : []));
  const [answers, setAnswers] = useState([]);
  const [askLog, setAskLog] = useState([]);
  const [step, setStep] = useState(0);
  const [mode, setMode] = useState("menu");
  const [done, setDone] = useState(false);
  const [draft, setDraft] = useState("");
  const [dateVal, setDateVal] = useState("");
  const [busy, setBusy] = useState(false);
  const listRef = useRef(null);
  const questions = chat?.questions || [];

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(LS_KEY);
      if (raw) {
        const s = JSON.parse(raw);
        if (s && Array.isArray(s.messages) && s.messages.length) {
          setMessages(s.messages.filter((m) => m && typeof m.text === "string" && m.text));
          setAnswers(Array.isArray(s.answers) ? s.answers : []);
          setAskLog(Array.isArray(s.askLog) ? s.askLog : []);
          setStep(Number(s.step) || 0);
          setMode(["menu", "guided", "ask"].includes(s.mode) ? s.mode : "menu");
          setDone(Boolean(s.done));
        }
      }
    } catch {}
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || !chat) return;
    try {
      window.localStorage.setItem(
        LS_KEY,
        JSON.stringify({ mode, messages, answers, askLog, step, done, savedAt: Date.now() })
      );
    } catch {}
  }, [mounted, chat, mode, messages, answers, askLog, step, done]);

  useEffect(() => {
    if (open && listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [open, messages, busy]);

  if (!chat) return null;

  const push = (m) => setMessages((prev) => [...prev, m]);

  function choose(kind) {
    if (busy || done || mode !== "menu") return;
    if (kind === "guided" && questions.length) {
      push({ who: "user", text: T.needService });
      setMode("guided");
      push({
        who: "bot",
        text: questions[0].text,
        meta: T.questionOf.replace("{n}", "1").replace("{total}", String(questions.length))
      });
    } else if (chat.askEnabled) {
      push({ who: "user", text: T.askQuestion });
      setMode("ask");
      push({ who: "bot", text: T.askIntro });
    }
  }

  function advanceGuided(aText) {
    const next = [...answers, { q: questions[step].text, a: aText }];
    const n = step + 1;
    setAnswers(next);
    setStep(n);
    if (n < questions.length) {
      push({
        who: "bot",
        text: questions[n].text,
        meta: T.questionOf.replace("{n}", String(n + 1)).replace("{total}", String(questions.length))
      });
    } else {
      setDone(true);
      push({ who: "bot", text: T.doneNote });
    }
  }

  function tapService(title) {
    if (busy || done || mode !== "guided") return;
    push({ who: "user", text: title });
    advanceGuided(title);
  }

  function submitDate() {
    if (!dateVal || busy || done || mode !== "guided") return;
    const a = fmtDate(dateVal);
    push({ who: "user", text: a });
    setDateVal("");
    advanceGuided(a);
  }

  async function send() {
    const text = draft.trim();
    if (!text || busy || done || mode === "menu") return;
    setDraft("");
    const userMsg = { who: "user", text };
    push(userMsg);
    if (mode === "guided") {
      advanceGuided(text);
      return;
    }
    setBusy(true);
    try {
      const history = [...messages, userMsg]
        .slice(-MAX_CONTEXT)
        .map((m) => ({ role: m.who === "user" ? "user" : "assistant", content: m.text }));
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history })
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.ok) throw new Error(data.error || T.error);
      push({ who: "bot", text: data.reply });
      setAskLog((prev) => [...prev, { q: text, a: data.reply }].slice(-10));
    } catch (e) {
      push({ who: "bot", text: e.message || T.error });
    } finally {
      setBusy(false);
    }
  }

  function enquire() {
    const lines = [];
    lines.push(`*${T.handoffIntro}*`);
    lines.push("");
    if (answers.length) {
      lines.push(`*${T.handoffAnswers}*`);
      lines.push("───────────────────");
      answers.forEach((it, i) => {
        lines.push(`*${i + 1}.* ${it.q}`);
        lines.push(`   ${it.a}`);
        if (i < answers.length - 1) lines.push("");
      });
      lines.push("");
    }
    if (askLog.length) {
      lines.push(`*${T.handoffChat}*`);
      lines.push("───────────────────");
      askLog.forEach((it) => {
        lines.push(`*${T.youLabel}:* ${it.q}`);
        lines.push(`*${T.botLabel}:* ${it.a}`);
        lines.push("");
      });
    }
    let text = lines.join("\n").trim();
    if (text.length > 1800) text = `${text.slice(0, 1800)}...`;
    window.open(
      `https://wa.me/${waNumber}?text=${encodeURIComponent(text)}`,
      "_blank",
      "noopener,noreferrer"
    );
  }

  function clearChat() {
    setMessages([{ who: "bot", text: chat.welcome }]);
    setAnswers([]);
    setAskLog([]);
    setStep(0);
    setMode("menu");
    setDone(false);
    setDraft("");
    setDateVal("");
    setBusy(false);
  }

  const canType = mode !== "menu" && !done && !busy;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? T.closeLabel : T.openLabel}
        aria-expanded={open}
        className="group fixed bottom-20 right-5 z-50 inline-flex h-12 w-12 items-center justify-center rounded-full border border-frame/50 bg-noir/85 text-frame shadow-[0_18px_40px_-14px_rgba(166,58,68,0.7)] backdrop-blur-md transition-all duration-500 hover:border-brand hover:bg-brand hover:text-ivory sm:bottom-24 sm:right-7 sm:h-14 sm:w-14"
      >
        <span
          aria-hidden="true"
          className="absolute -inset-1.5 -z-10 rounded-full border border-frame/25 transition-all duration-500 group-hover:-inset-2 group-hover:border-frame/50"
        />
        {!open ? (
          <span aria-hidden="true" className="chat-halo absolute -inset-2.5 -z-20 rounded-full border border-frame/30" />
        ) : null}
        {open ? (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true" className="h-5 w-5 sm:h-6 sm:w-6">
            <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true" className="h-5 w-5 sm:h-6 sm:w-6">
            <path
              d="M21 11.5c0 4.1-4 7.5-9 7.5-1 0-2-.13-2.9-.38L4 21l1.6-3.6C4.6 16.1 3 13.9 3 11.5 3 7.4 7 4 12 4s9 3.4 9 7.5Z"
              strokeLinejoin="round"
            />
            <circle cx="8.2" cy="11.5" r="1" fill="currentColor" stroke="none" />
            <circle cx="12" cy="11.5" r="1" fill="currentColor" stroke="none" />
            <circle cx="15.8" cy="11.5" r="1" fill="currentColor" stroke="none" />
          </svg>
        )}
      </button>

      {open ? (
        <div
          data-scheme="wine"
          className="chat-panel-in fixed bottom-[9.25rem] right-5 z-50 flex h-[min(72vh,540px)] w-[min(92vw,380px)] flex-col overflow-hidden rounded-3xl border border-frame/30 bg-noir shadow-[0_30px_80px_-20px_rgba(0,0,0,0.65)] sm:bottom-[10.75rem] sm:right-7"
        >
          {/* Layered washes: gold sheen top, burgundy bloom bottom-right,
              a whisper of the knot motif and a soft vignette. */}
          <div aria-hidden="true" className="pointer-events-none absolute inset-0">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(252,204,48,0.08),transparent_62%)]" />
            <div className="ambient-drift-slow absolute -right-[30%] -top-[28%] h-[70%] w-[80%] rounded-full bg-[radial-gradient(circle,rgba(166,58,68,0.16),transparent_62%)] blur-[70px]" />
            <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22120%22%20height%3D%22120%22%20viewBox%3D%220%200%20120%20120%22%3E%3Cpath%20d%3D%22M60%2020c0%2022-18%2040-40%2040%2022%200%2040%2018%2040%2040%200-22%2018-40%2040-40-22%200-40-18-40-40z%22%20fill%3D%22none%22%20stroke%3D%22%238C6D2A%22%20stroke-width%3D%220.5%22%2F%3E%3Ccircle%20cx%3D%2260%22%20cy%3D%2260%22%20r%3D%228%22%20fill%3D%22none%22%20stroke%3D%22%238C6D2A%22%20stroke-width%3D%220.4%22%2F%3E%3C%2Fsvg%3E')] bg-[length:120px_120px] opacity-[0.05]" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_45%,transparent_55%,rgba(42,11,16,0.55)_100%)]" />
          </div>

          <div className="relative z-10 flex items-center gap-3 border-b border-frame/20 bg-wine-soft/70 px-4 py-3">
            <Image
              src="/logo-sm.png"
              alt=""
              width={34}
              height={34}
              className="rounded-full border border-frame/50"
            />
            <div className="min-w-0 flex-1">
              <p className="font-tagline truncate text-[15px] font-bold tracking-[0.08em] text-ivory">{T.title}</p>
              <p className="truncate text-[9px] font-semibold uppercase tracking-[0.28em] text-frame/70">{site.tagline}</p>
            </div>
            <button
              type="button"
              onClick={clearChat}
              aria-label={T.clearLabel}
              title={T.clearLabel}
              className="rounded-lg p-1.5 text-ivory/60 transition-colors hover:bg-brand/40 hover:text-ivory"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true" className="h-4 w-4">
                <path d="M3 6h18M8 6V4h8v2M6 6l1 14h10l1-14M10 11v6M14 11v6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label={T.closeLabel}
              title={T.closeLabel}
              className="rounded-lg p-1.5 text-ivory/60 transition-colors hover:bg-brand/40 hover:text-ivory"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true" className="h-4 w-4">
                <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
              </svg>
            </button>
          </div>

          {mode === "guided" && questions.length ? (
            <div className="relative z-10 h-[3px] bg-charcoal/50">
              <div
                className="h-full bg-golden transition-all duration-500"
                style={{ width: `${Math.min(100, (step / questions.length) * 100)}%` }}
              />
            </div>
          ) : null}

          <div
            ref={listRef}
            className="chat-scroll relative z-10 flex min-h-0 flex-1 flex-col overflow-y-auto px-4 py-4"
          >
            <div className="mt-auto flex flex-col gap-2.5">
            {messages.map((m, i) => (
              <div key={i} className={m.who === "user" ? "flex justify-end" : "flex flex-col items-start"}>
                <p
                  className={`max-w-[85%] px-3.5 py-2.5 text-[14px] leading-relaxed ${
                    m.who === "user"
                      ? "rounded-2xl rounded-br-sm border border-frame/25 bg-gradient-to-br from-brand to-brand-dark text-ivory shadow-[0_6px_18px_-8px_rgba(0,0,0,0.5)]"
                      : "rounded-2xl rounded-bl-sm border border-frame/20 bg-charcoal/60 text-ivory shadow-[0_4px_14px_-8px_rgba(0,0,0,0.45)]"
                  }`}
                >
                  {m.text}
                </p>
                {m.meta ? (
                  <p className="mt-0.5 pl-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-frame/80">{m.meta}</p>
                ) : null}
              </div>
            ))}
            {busy ? (
              <div className="flex">
                <div className="flex items-center gap-1.5 rounded-2xl rounded-bl-sm border border-frame/20 bg-charcoal/60 px-4 py-3">
                  <span className="chat-dot h-1.5 w-1.5 rounded-full bg-frame/80" />
                  <span className="chat-dot h-1.5 w-1.5 rounded-full bg-frame/80" />
                  <span className="chat-dot h-1.5 w-1.5 rounded-full bg-frame/80" />
                  <span className="sr-only">{T.typing}</span>
                </div>
              </div>
            ) : null}
            </div>
          </div>

          {mode === "menu" ? (
            <div className="relative z-10 flex flex-col gap-2 border-t border-frame/15 bg-wine-soft/50 px-4 py-3">
              {questions.length ? (
                <button
                  type="button"
                  onClick={() => choose("guided")}
                  className="group flex items-center justify-center gap-2 rounded-xl border border-frame/40 bg-charcoal/50 px-4 py-3 text-[12px] font-bold uppercase tracking-[0.18em] text-ivory transition-all duration-300 enabled:hover:-translate-y-0.5 enabled:hover:border-golden enabled:hover:bg-brand enabled:hover:shadow-[0_10px_24px_-10px_rgba(166,58,68,0.8)]"
                >
                  <span aria-hidden="true" className="text-[10px] text-golden transition-colors group-hover:text-ivory">
                    ✦
                  </span>
                  {T.needService}
                </button>
              ) : null}
              <button
                type="button"
                onClick={() => choose("ask")}
                disabled={!chat.askEnabled}
                className="group flex items-center justify-center gap-2 rounded-xl border border-frame/40 bg-charcoal/50 px-4 py-3 text-[12px] font-bold uppercase tracking-[0.18em] text-ivory transition-all duration-300 enabled:hover:-translate-y-0.5 enabled:hover:border-golden enabled:hover:bg-brand enabled:hover:shadow-[0_10px_24px_-10px_rgba(166,58,68,0.8)] disabled:opacity-40"
              >
                <span aria-hidden="true" className="text-[10px] text-golden transition-colors group-hover:text-ivory">
                  ✦
                </span>
                {T.askQuestion}
              </button>
              {!chat.askEnabled ? (
                <p className="text-center text-[12px] text-paper/50">{T.askUnavailable}</p>
              ) : null}
            </div>
          ) : done ? (
            <div className="chat-pop relative z-10 border-t border-frame/15 bg-wine-soft/50 px-4 py-3">
              <button
                type="button"
                onClick={enquire}
                className="w-full rounded-full bg-whatsapp px-4 py-3 text-[13px] font-black uppercase tracking-[0.16em] text-wine shadow-[0_14px_30px_-12px_rgba(37,211,102,0.7)] transition-transform hover:-translate-y-0.5"
              >
                {T.enquire}
              </button>
            </div>
          ) : mode === "guided" && questions[step]?.type === "services" && chat.services?.length ? (
            <div className="relative z-10 border-t border-frame/15 bg-wine-soft/50 px-4 py-3">
              <div className="chat-scroll flex max-h-44 flex-col gap-2 overflow-y-auto pr-0.5">
                {chat.services.map((title) => (
                  <button
                    key={title}
                    type="button"
                    onClick={() => tapService(title)}
                    disabled={busy}
                    className="group flex items-center justify-center gap-2 rounded-xl border border-frame/40 bg-charcoal/50 px-4 py-2.5 text-[12px] font-bold uppercase tracking-[0.16em] text-ivory transition-all duration-300 enabled:hover:-translate-y-0.5 enabled:hover:border-golden enabled:hover:bg-brand enabled:hover:shadow-[0_10px_24px_-10px_rgba(166,58,68,0.8)]"
                  >
                    <span aria-hidden="true" className="text-[10px] text-golden transition-colors group-hover:text-ivory">
                      ✦
                    </span>
                    {title}
                  </button>
                ))}
              </div>
            </div>
          ) : mode === "guided" && questions[step]?.type === "date" ? (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                submitDate();
              }}
              className="relative z-10 flex items-center gap-2 border-t border-frame/15 bg-wine-soft/50 px-3 py-3"
            >
              <input
                type="date"
                value={dateVal}
                onChange={(e) => setDateVal(e.target.value)}
                min={todayIso()}
                disabled={busy}
                suppressHydrationWarning
                className="min-w-0 flex-1 rounded-full border border-frame/25 bg-charcoal/50 px-4 py-2.5 text-[14px] text-ivory [color-scheme:dark] focus:border-golden focus:outline-none disabled:opacity-40"
              />
              <button
                type="submit"
                disabled={!dateVal || busy}
                className="h-10 shrink-0 rounded-full border border-frame/40 bg-charcoal/50 px-4 text-[11px] font-bold uppercase tracking-[0.18em] text-ivory transition-all enabled:hover:-translate-y-0.5 enabled:hover:border-golden enabled:hover:bg-brand disabled:opacity-40"
              >
                {T.dateOk}
              </button>
            </form>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                send();
              }}
              className="relative z-10 flex items-center gap-2 border-t border-frame/15 bg-wine-soft/50 px-3 py-3"
            >
              <input
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                disabled={!canType}
                suppressHydrationWarning
                autoComplete="off"
                placeholder={T.placeholder}
                className="min-w-0 flex-1 rounded-full border border-frame/25 bg-charcoal/50 px-4 py-2.5 text-[14px] text-ivory placeholder:text-ivory/40 focus:border-golden focus:outline-none disabled:opacity-40"
              />
              <button
                type="submit"
                disabled={!canType || !draft.trim()}
                aria-label={T.send}
                className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-frame/30 bg-gradient-to-br from-brand to-brand-dark text-ivory transition-all enabled:hover:-translate-y-0.5 disabled:opacity-40"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="h-4.5 w-4.5">
                  <path d="M3.4 20.6 21.8 12 3.4 3.4l2.1 7.1L15 12l-9.5 1.5-2.1 7.1Z" />
                </svg>
              </button>
            </form>
          )}
        </div>
      ) : null}
    </>
  );
}
