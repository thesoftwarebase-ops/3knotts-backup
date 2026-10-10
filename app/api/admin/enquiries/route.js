import { NextResponse } from "next/server";
import { verifySession, bearerToken } from "@/lib/admin-auth";
import { listEnquiries, setEnquiryStatus, deleteEnquiry } from "@/lib/db";
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
    return NextResponse.json({ ok: true, rows: await listEnquiries() });
  } catch (e) {
    console.error("admin list error:", e);
    return NextResponse.json({ ok: false, error: "Could not load enquiries." }, { status: 500 });
  }
}

export async function PATCH(request) {
  if (!(await authed(request))) return denied();
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: site.dashboard.errors.badRequest }, { status: 400 });
  }
  try {
    return NextResponse.json({ ok: true, status: await setEnquiryStatus(body.id, body.status) });
  } catch (e) {
    return NextResponse.json({ ok: false, error: e.message || "Update failed." }, { status: 400 });
  }
}

export async function DELETE(request) {
  if (!(await authed(request))) return denied();
  const id = new URL(request.url).searchParams.get("id") || "";
  try {
    await deleteEnquiry(id);
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ ok: false, error: e.message || "Delete failed." }, { status: 400 });
  }
}
