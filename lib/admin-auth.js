// Server-side admin auth (jose JWTs, Edge-safe).
// No cookies: the JWT is returned in the login response body and the
// client sends it back as an Authorization: Bearer header.
import { SignJWT, jwtVerify } from "jose";
import bcrypt from "bcryptjs";
import { getDb } from "./db";
import { site } from "@/data/site";

const MAX_AGE = 7 * 24 * 3600; // seconds
const encoder = new TextEncoder();

// Credentials live in MongoDB (admins collection, bcrypt hashes).
// Returns the admin email on success, null otherwise.
export async function verifyCredentials(email, password) {
  const want = String(email || "").trim().toLowerCase();
  if (!want || !password) return null;
  const db = await getDb();
  const admin = await db.collection("admins").findOne({ email: want });
  if (!admin?.passHash) return null;
  const ok = await bcrypt.compare(String(password), admin.passHash);
  return ok ? admin.email : null;
}

export async function createSession(email) {
  if (!process.env.ADMIN_TOKEN) throw new Error("ADMIN_TOKEN is not configured");
  return new SignJWT({ admin: true, email: String(email).trim().toLowerCase() })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${MAX_AGE} sec`)
    .sign(encoder.encode(process.env.ADMIN_TOKEN));
}

export async function verifySession(value) {
  if (!process.env.ADMIN_TOKEN || !value) return false;
  try {
    const { payload } = await jwtVerify(String(value), encoder.encode(process.env.ADMIN_TOKEN));
    return payload.admin === true;
  } catch {
    return false;
  }
}

// Change the login email and/or password. Requires the current password.
// Returns the new email. Copy lives in site.dashboard.errors.
export async function changeAccount(currentEmail, currentPassword, { newEmail, newPassword }) {
  const ERR = site.dashboard.errors;
  const authed = await verifyCredentials(currentEmail, currentPassword);
  if (!authed) throw new Error(ERR.wrongCurrent);
  const email = String(newEmail || currentEmail).trim().toLowerCase();
  if (!email) throw new Error(ERR.emailRequired);
  if (newPassword && String(newPassword).length < 8) {
    throw new Error(ERR.shortPassword);
  }
  const db = await getDb();
  const taken = await db.collection("admins").findOne({ email });
  if (taken && taken.email !== authed) throw new Error(ERR.emailTaken);
  const update = { email, updatedAt: new Date() };
  if (newPassword) update.passHash = await bcrypt.hash(String(newPassword), 10);
  await db.collection("admins").updateOne({ email: authed }, { $set: update });
  return email;
}

export function bearerToken(request) {
  const h = request.headers.get("authorization") || "";
  const m = h.match(/^Bearer (.+)$/);
  return m ? m[1] : "";
}
