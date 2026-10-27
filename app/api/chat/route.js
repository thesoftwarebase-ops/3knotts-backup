import { NextResponse } from "next/server";
import { getContent } from "@/lib/content";
import { site } from "@/data/site";

// Public chat endpoint for the floating widget's "Ask a question" mode.
// Reads the Groq key, model and knowledge paragraph from the database so
// the key never reaches the browser. Guided-question answers never pass
// through here - they are captured client-side and handed off on WhatsApp.
const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";
const GROQ_MODEL = "openai/gpt-oss-120b";
const MAX_CONTEXT = 10; // history messages sent to the model
const MAX_CHARS = 600; // per-message cap
const MAX_REPLY_TOKENS = 350; // cost cap
const TIMEOUT_MS = 30000;
const MAX_RETRIES = 2;
const RETRY_DELAY_MS = 800;

// Light in-memory rate limit per IP (per server instance; enough to
// blunt casual abuse of the Groq bill).
const RATE = { windowMs: 10 * 60 * 1000, max: 30 };
const hits = new Map();

function limited(ip) {
  const now = Date.now();
  const list = (hits.get(ip) || []).filter((t) => now - t < RATE.windowMs);
  if (list.length >= RATE.max) {
    hits.set(ip, list);
    return true;
  }
  list.push(now);
  hits.set(ip, list);
  if (hits.size > 500) {
    for (const [k, v] of hits) {
      if (v.every((t) => now - t >= RATE.windowMs)) hits.delete(k);
    }
  }
  return false;
}

function systemPrompt(cfg) {
  const parts = [
    `You are the assistant for ${site.name}, an event decoration and gifting studio in Chennai. Reply briefly and warmly in simple English (1-3 sentences). Do not invent prices, dates or availability - invite the visitor to send an enquiry or continue on WhatsApp for exact quotes and booking.`,
    "Everything you know about the business is the paragraph below. If an answer is not in it, say you will check with the team and point them to the enquiry form or WhatsApp.",
    cfg.chatParagraph
  ];
  return parts.filter(Boolean).join("\n\n");
}

export async function POST(request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  if (limited(ip)) {
    return NextResponse.json({ ok: false, error: site.chatWidget.error }, { status: 429 });
  }
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Bad request." }, { status: 400 });
  }
  const incoming = Array.isArray(body?.messages) ? body.messages : [];
  const history = incoming
    .filter((m) => (m?.role === "user" || m?.role === "assistant") && typeof m?.content === "string" && m.content.trim())
    .slice(-MAX_CONTEXT)
    .map((m) => ({ role: m.role, content: m.content.trim().slice(0, MAX_CHARS) }));
  if (!history.length || history[history.length - 1].role !== "user") {
    return NextResponse.json({ ok: false, error: "Bad request." }, { status: 400 });
  }
  try {
    const cfg = await getContent("chatbot");
    if (!cfg.enabled || !cfg.apiKey || !cfg.chatParagraph) {
      return NextResponse.json({ ok: false, error: site.chatWidget.askUnavailable }, { status: 503 });
    }
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
    let res;
    try {
      for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
        try {
          res = await fetch(GROQ_URL, {
            method: "POST",
            headers: {
              Authorization: `Bearer ${cfg.apiKey}`,
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              model: GROQ_MODEL,
              messages: [{ role: "system", content: systemPrompt(cfg) }, ...history],
              temperature: 0.4,
              max_tokens: MAX_REPLY_TOKENS
            }),
            signal: controller.signal
          });
          break;
        } catch (fetchErr) {
          if (attempt === MAX_RETRIES) throw fetchErr;
          await new Promise((r) => setTimeout(r, RETRY_DELAY_MS * (attempt + 1)));
        }
      }
    } finally {
      clearTimeout(timer);
    }
    const data = await res.json().catch(() => ({}));
    const reply = data?.choices?.[0]?.message?.content;
    if (!res.ok || !reply) {
      console.error("Groq error:", res.status, data?.error?.message || data?.error || "");
      return NextResponse.json({ ok: false, error: site.chatWidget.error }, { status: 502 });
    }
    return NextResponse.json({ ok: true, reply: String(reply).slice(0, 1200) });
  } catch (e) {
    console.error("chat proxy error:", e.message || e);
    return NextResponse.json({ ok: false, error: site.chatWidget.error }, { status: 502 });
  }
}
