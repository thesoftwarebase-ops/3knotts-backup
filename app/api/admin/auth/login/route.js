import { NextResponse } from "next/server";
import { verifyCredentials, createSession } from "@/lib/admin-auth";
import { site } from "@/data/site";

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: site.adminLogin.error }, { status: 400 });
  }
  if (!(await verifyCredentials(body.email, body.password))) {
    return NextResponse.json({ ok: false, error: site.adminLogin.error }, { status: 401 });
  }
  return NextResponse.json({ ok: true, token: await createSession(body.email) });
}
