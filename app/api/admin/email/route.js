import { NextResponse } from "next/server";
import { verifySession, bearerToken } from "@/lib/admin-auth";
import { getEmailSettings, setEmailSettings, removeEmailSettings, buildTestPayloads } from "@/lib/email";
import { site } from "@/data/site";

const ERR = site.dashboard.emailMgr.errors;

async function authed(request) {
  return verifySession(bearerToken(request));
}

function denied() {
  return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
}

// The key never leaves the server in full via GET — the dashboard gets a
// masked preview only. Full keys are only relayed to a live session:
// POST (below) hands test payloads to the admin browser, and the public
// enquiry flow hands the key to the visitor's tab — public-grade by
// Web3Forms design (it only sends into the inbox).
function maskKey(k) {
  return `•••• ${String(k).slice(-4)}`;
}

async function summary() {
  const s = await getEmailSettings();
  return {
    hasKey: s.keys.length > 0,
    keyPreview: s.keys.map(maskKey).join(" · "),
    // The gmail row is public site content — returned in full.
    gmail: s.gmail || ""
  };
}

export async function GET(request) {
  if (!(await authed(request))) return denied();
  try {
    return NextResponse.json({ ok: true, ...(await summary()) });
  } catch (e) {
    console.error("admin email read error:", e);
    return NextResponse.json({ ok: false, error: "Could not load email settings." }, { status: 500 });
  }
}

export async function PUT(request) {
  if (!(await authed(request))) return denied();
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: site.dashboard.errors.badRequest }, { status: 400 });
  }
  try {
    await setEmailSettings({ key: body.key, gmail: body.gmail });
    return NextResponse.json({ ok: true, ...(await summary()) });
  } catch (e) {
    return NextResponse.json({ ok: false, error: e.message || ERR.failed }, { status: 400 });
  }
}

// Test: server composes one payload per key on file; the dashboard
// relays each browser-side (Web3Forms accepts browser traffic only).
export async function POST(request) {
  if (!(await authed(request))) return denied();
  try {
    const payloads = await buildTestPayloads();
    return NextResponse.json({ ok: true, ...(await summary()), payloads });
  } catch (e) {
    return NextResponse.json({ ok: false, error: e.message || ERR.testFailed }, { status: 400 });
  }
}

export async function DELETE(request) {
  if (!(await authed(request))) return denied();
  try {
    await removeEmailSettings();
    return NextResponse.json({ ok: true, ...(await summary()) });
  } catch (e) {
    console.error("admin email clear error:", e);
    return NextResponse.json({ ok: false, error: ERR.deleteFailed }, { status: 400 });
  }
}
