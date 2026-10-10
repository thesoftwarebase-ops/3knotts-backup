import { NextResponse } from "next/server";
import { verifySession, bearerToken } from "@/lib/admin-auth";

export async function GET(request) {
  const token = bearerToken(request);
  if (!(await verifySession(token))) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }
  try {
    const [, payload] = token.split(".");
    const { email } = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
    return NextResponse.json({ ok: true, email: email || null });
  } catch {
    return NextResponse.json({ ok: true, email: null });
  }
}
