import { NextResponse } from "next/server";
import { verifySession, bearerToken } from "@/lib/admin-auth";
import { getHeroSlides, getHeroTagline, setHeroSlides } from "@/lib/content";
import { site } from "@/data/site";

async function authed(request) {
  return verifySession(bearerToken(request));
}

function denied() {
  return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
}

export async function GET(request) {
  if (!(await authed(request))) return denied();
  try {
    const [slides, tagline] = await Promise.all([getHeroSlides(), getHeroTagline()]);
    return NextResponse.json({ ok: true, slides, tagline });
  } catch (e) {
    console.error("admin hero read error:", e);
    return NextResponse.json({ ok: false, error: "Could not load slides." }, { status: 500 });
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
    const slides = await setHeroSlides(body.slides, body.tagline);
    const tagline = await getHeroTagline();
    return NextResponse.json({ ok: true, slides, tagline });
  } catch (e) {
    return NextResponse.json({ ok: false, error: e.message || "Save failed." }, { status: 400 });
  }
}
