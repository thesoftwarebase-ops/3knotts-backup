import { NextResponse } from "next/server";
import { verifySession, bearerToken, changeAccount } from "@/lib/admin-auth";
import { site } from "@/data/site";

export async function PUT(request) {
  const token = bearerToken(request);
  if (!(await verifySession(token))) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: site.dashboard.errors.badRequest }, { status: 400 });
  }
  try {
    const [, payload] = token.split(".");
    const { email } = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
    const next = await changeAccount(email, body.currentPassword, {
      newEmail: body.newEmail,
      newPassword: body.newPassword
    });
    return NextResponse.json({ ok: true, email: next });
  } catch (e) {
    return NextResponse.json({ ok: false, error: e.message || "Update failed." }, { status: 400 });
  }
}
