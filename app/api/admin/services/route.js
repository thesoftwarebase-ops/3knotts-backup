import { NextResponse } from "next/server";
import { verifySession, bearerToken } from "@/lib/admin-auth";
import { getServices, getFeatured, setServices } from "@/lib/content";
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
    const [services, featured] = await Promise.all([getServices(), getFeatured()]);
    return NextResponse.json({ ok: true, services, featured });
  } catch (e) {
    console.error("admin services read error:", e);
    return NextResponse.json({ ok: false, error: "Could not load services." }, { status: 500 });
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
    return NextResponse.json({ ok: true, ...(await setServices(body.services, body.featured)) });
  } catch (e) {
    return NextResponse.json({ ok: false, error: e.message || "Save failed." }, { status: 400 });
  }
}
