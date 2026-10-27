"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { showBusy, hideBusy } from "@/lib/busy";
import { site } from "@/data/site";
import { authHeaders } from "./upload";

const inputCls =
  "w-full rounded-xl border border-frame/25 bg-charcoal/60 px-4 py-2.5 text-[15px] text-paper focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/40";
const saveBtn =
  "rounded-full bg-gold px-6 py-2.5 text-sm font-bold text-paper transition-transform hover:-translate-y-0.5 disabled:opacity-60";

export default function ChatbotManager() {
  const t = site.dashboard.chatbotMgr;
  const [enabled, setEnabled] = useState(false);
  const [apiKey, setApiKey] = useState("");
  const [showKey, setShowKey] = useState(false);
  const [chatParagraph, setChatParagraph] = useState("");
  const [welcomeMessage, setWelcomeMessage] = useState("");
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let live = true;
    fetch("/api/admin/chatbot", { headers: authHeaders() })
      .then(async (res) => {
        const data = await res.json().catch(() => ({}));
        if (!res.ok || !data.ok) throw new Error(data.error || "Could not load chatbot.");
        if (live) {
          setEnabled(data.chatbot?.enabled === true);
          setApiKey(data.chatbot?.apiKey || "");
          setChatParagraph(data.chatbot?.chatParagraph || "");
          setWelcomeMessage(data.chatbot?.welcomeMessage || "");
          setQuestions(Array.isArray(data.chatbot?.questions) ? data.chatbot.questions : []);
        }
      })
      .catch((err) => toast.error(err.message))
      .finally(() => {
        if (live) setLoading(false);
      });
    return () => {
      live = false;
    };
  }, []);

  function setQuestion(i, text) {
    setQuestions((prev) => prev.map((q, j) => (j === i ? { ...q, text } : q)));
  }

  function setQuestionType(i, type) {
    setQuestions((prev) => prev.map((q, j) => (j === i ? { ...q, type } : q)));
  }

  async function save() {
    setSaving(true);
    showBusy(t.save);
    try {
      const res = await fetch("/api/admin/chatbot", {
        method: "PUT",
        headers: authHeaders(),
        body: JSON.stringify({
          enabled,
          apiKey: apiKey.trim(),
          chatParagraph: chatParagraph.trim(),
          welcomeMessage: welcomeMessage.trim(),
          questions: questions.map((q) => ({ text: q.text.trim(), type: q.type || "text" }))
        })
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.ok) throw new Error(data.error || "Save failed.");
      if (data.chatbot) {
        setEnabled(data.chatbot.enabled === true);
        setApiKey(data.chatbot.apiKey || "");
        setChatParagraph(data.chatbot.chatParagraph || "");
        setWelcomeMessage(data.chatbot.welcomeMessage || "");
        setQuestions(Array.isArray(data.chatbot.questions) ? data.chatbot.questions : []);
      }
      toast.success(t.saved);
    } catch (err) {
      toast.error(err.message);
    } finally {
      hideBusy();
      setSaving(false);
    }
  }

  if (loading) return <p className="mt-6 text-paper/60">{site.dashboard.loading}</p>;

  return (
    <div className="mt-6 flex max-w-2xl flex-col gap-5 rounded-2xl border border-gold/50 bg-charcoal/60 p-5 sm:p-6">
      <div>
        <p className="font-tagline text-3xl font-bold text-plum">{t.title}</p>
        <p className="mt-1 text-sm leading-relaxed text-paper/70">{t.intro}</p>
      </div>

      <label className="flex items-center gap-3">
        <input
          type="checkbox"
          checked={enabled}
          onChange={(e) => setEnabled(e.target.checked)}
          suppressHydrationWarning
          className="h-5 w-5 accent-[var(--color-gold)]"
        />
        <span className="text-sm font-bold text-paper">{t.enabledLabel}</span>
      </label>

      <div>
        <p className="mb-1.5 text-sm font-bold text-paper">{t.apiKeyLabel}</p>
        <div className="relative">
          <input
            type={showKey ? "text" : "password"}
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            suppressHydrationWarning
            autoComplete="off"
            placeholder={t.apiKeyPlaceholder}
            className={`${inputCls} pr-16`}
          />
          <button
            type="button"
            onClick={() => setShowKey((v) => !v)}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg px-2 py-1 text-xs font-bold text-paper/60 hover:text-paper"
          >
            {showKey ? "Hide" : "Show"}
          </button>
        </div>
        <p className="mt-2 text-[13px] text-paper/60">{t.apiKeyNote}</p>
      </div>

      <div>
        <p className="mb-1.5 text-sm font-bold text-paper">{t.paragraphLabel}</p>
        <textarea
          value={chatParagraph}
          onChange={(e) => setChatParagraph(e.target.value)}
          suppressHydrationWarning
          rows={6}
          placeholder={t.paragraphPlaceholder}
          className={`${inputCls} resize-y`}
        />
        <p className="mt-2 text-[13px] text-paper/60">{t.paragraphNote}</p>
      </div>

      <div>
        <p className="mb-1.5 text-sm font-bold text-paper">{t.welcomeLabel}</p>
        <input
          value={welcomeMessage}
          onChange={(e) => setWelcomeMessage(e.target.value)}
          suppressHydrationWarning
          autoComplete="off"
          placeholder={t.welcomePlaceholder}
          className={inputCls}
        />
      </div>

      <div>
        <p className="text-sm font-bold text-paper">{t.questionsLabel}</p>
        <p className="mb-2 mt-1 text-[13px] text-paper/60">{t.questionsNote}</p>
        <div className="flex flex-col gap-2">
          {questions.map((q, i) => (
            <div key={i} className="rounded-xl border border-frame/20 bg-noir/60 p-2.5">
              <div className="mb-2 flex items-center justify-between gap-2">
                <p className="pl-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-frame/80">
                  {t.questionOf.replace("{n}", String(i + 1)).replace("{total}", String(questions.length))}
                </p>
                <button
                  type="button"
                  onClick={() => setQuestions((prev) => prev.filter((_, j) => j !== i))}
                  className="rounded-full border border-plum/30 px-3 py-1.5 text-xs font-semibold text-plum transition-colors hover:border-plum"
                >
                  {t.remove}
                </button>
              </div>
              <input
                value={q.text}
                onChange={(e) => setQuestion(i, e.target.value)}
                suppressHydrationWarning
                placeholder={t.questionPlaceholder}
                className={inputCls}
              />
              <div className="mt-2 flex items-center gap-3 pl-1">
                <p className="text-[12px] font-bold text-paper/80">{t.typeLabel}</p>
                <select
                  value={q.type || "text"}
                  onChange={(e) => setQuestionType(i, e.target.value)}
                  suppressHydrationWarning
                  className="grow rounded-xl border border-frame/25 bg-charcoal/60 px-3 py-2 text-[14px] text-paper focus:border-gold focus:outline-none"
                >
                  {Object.entries(t.typeOptions).map(([v, label]) => (
                    <option key={v} value={v}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={() => setQuestions((prev) => [...prev, { text: "", type: "text" }])}
          className="mt-3 rounded-full border border-gold/60 px-5 py-2 text-sm font-bold text-paper transition-all hover:-translate-y-0.5 hover:border-gold"
        >
          {t.addQuestion}
        </button>
      </div>

      <div>
        <button type="button" onClick={save} disabled={saving} className={saveBtn}>
          {t.save}
        </button>
      </div>
    </div>
  );
}
