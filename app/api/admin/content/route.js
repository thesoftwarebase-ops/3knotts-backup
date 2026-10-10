import { NextResponse } from "next/server";
import { verifySession, bearerToken } from "@/lib/admin-auth";
import { getContent, setContent, CONTENT_KEYS } from "@/lib/content";
import { site } from "@/data/site";

async function authed(request) {
  return verifySession(bearerToken(request));
}

function denied() {
  return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
}

export async function GET(request) {
  if (!(await authed(request))) return denied();
  const key = new URL(request.url).searchParams.get("key") || "";
  if (!CONTENT_KEYS.includes(key)) {
    return NextResponse.json({ ok: false, error: "Unknown content key." }, { status: 400 });
  }
  try {
    return NextResponse.json({ ok: true, key, value: await getContent(key) });
  } catch (e) {
    console.error("admin content read error:", e);
    return NextResponse.json({ ok: false, error: "Could not load content." }, { status: 500 });
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
  if (!CONTENT_KEYS.includes(body.key)) {
    return NextResponse.json({ ok: false, error: "Unknown content key." }, { status: 400 });
  }
  try {
    return NextResponse.json({ ok: true, key: body.key, value: await setContent(body.key, body.value) });
  } catch (e) {
    return NextResponse.json({ ok: false, error: e.message || "Save failed." }, { status: 400 });
  }
}
