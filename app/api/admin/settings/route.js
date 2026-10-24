import { NextResponse } from "next/server";
import { verifySession, bearerToken } from "@/lib/admin-auth";
import { getContent, setContent } from "@/lib/content";
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
    const settings = await getContent("settings");
    return NextResponse.json({ ok: true, settings });
  } catch (e) {
    console.error("admin settings read error:", e);
    return NextResponse.json({ ok: false, error: e.message || "Could not load settings." }, { status: 500 });
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
    const settings = await setContent("settings", body);
    return NextResponse.json({ ok: true, settings });
  } catch (e) {
    return NextResponse.json({ ok: false, error: e.message || "Save failed." }, { status: 400 });
  }
}
