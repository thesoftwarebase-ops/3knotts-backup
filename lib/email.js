// SERVER-SIDE storage + composition for Web3Forms enquiry email. Never
// import from a client component. Submissions happen from the visitor's
// browser — Web3Forms' own guidance: their edge only accepts browser
// traffic on the free plan (plain server POSTs get Cloudflare-challenged),
// while the access key is public-grade by design: it can only send
// messages INTO that inbox, nothing more. The server validates, stores
// the key and composes payloads; the browser relays them.
import { getDb } from "./db";
import { site } from "@/data/site";
import { buildEnquiryMessage } from "./whatsapp";

const ERR = () => site.dashboard.emailMgr.errors;
const MAX_KEYS = 5;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function cleanKeys(input) {
  const raw = Array.isArray(input) ? input : String(input || "").split(",");
  const keys = [...new Set(raw.map((k) => String(k || "").trim()).filter(Boolean))];
  if (!keys.length) throw new Error(ERR().noKey);
  for (const k of keys) {
    if (!/^[a-zA-Z0-9-]{16,80}$/.test(k)) throw new Error(ERR().wrongFormat);
  }
  return keys.slice(0, MAX_KEYS);
}

// Current settings. No document (or DB down) = no key, no contact row.
// `keys` drive the enquiry notifications; `gmail` drives the public
// mailto row on the Enquiry page's contact panel.
export async function getEmailSettings() {
  try {
    const db = await getDb();
    const doc = await db.collection("site_content").findOne({ _id: "email" });
    if (doc && ((Array.isArray(doc.keys) && doc.keys.length) || (doc.gmail && String(doc.gmail).trim()))) {
      return {
        keys: Array.isArray(doc.keys) ? doc.keys.map(String) : [],
        gmail: typeof doc.gmail === "string" ? doc.gmail : ""
      };
    }
  } catch (e) {
    console.error("email read fallback:", e.message || e);
  }
  return { keys: [], gmail: "" };
}

// Semantics for the dashboard save: an empty key keeps whatever is
// stored, a non-empty key replaces the stored set. An empty gmail
// clears the public contact row; absent (undefined) leaves it as is.
// Saving nothing at all (no key on file, no address) throws noKey.
export async function setEmailSettings({ key, gmail } = {}) {
  const db = await getDb();
  const stored = await db.collection("site_content").findOne({ _id: "email" });
  let keys;
  if (key === undefined || key === null || String(key).trim() === "") {
    keys = stored && Array.isArray(stored.keys) ? stored.keys.map(String) : [];
  } else {
    keys = cleanKeys(key);
  }
  let address;
  if (gmail === undefined) {
    address = stored && typeof stored.gmail === "string" ? stored.gmail : "";
  } else {
    address = String(gmail || "").trim().slice(0, 120);
    if (address && !EMAIL_RE.test(address)) throw new Error(ERR().badGmail);
  }
  if (!keys.length && !address) throw new Error(ERR().noKey);
  const value = { keys, gmail: address, updatedAt: new Date() };
  await db.collection("site_content").updateOne(
    { _id: "email" },
    { $set: value },
    { upsert: true }
  );
  return value;
}

// Wipes everything on the Email tab: notifications key(s) + contact row.
export async function removeEmailSettings() {
  const db = await getDb();
  await db.collection("site_content").updateOne(
    { _id: "email" },
    { $set: { keys: [], gmail: "", updatedAt: new Date() } },
    { upsert: true }
  );
}

// Public contact row for the Enquiry page — "" hides it. Falls back
// gracefully so the build never breaks when the database is down.
export async function getContactGmail() {
  const { gmail } = await getEmailSettings();
  return gmail || "";
}

// Ready-to-relay test payloads — one per key on file. The dashboard
// POSTs each of these browser-side to api.web3forms.com/submit.
export async function buildTestPayloads() {
  const { keys } = await getEmailSettings();
  if (!keys.length) throw new Error(ERR().noKey);
  const base = {
    subject: "Test email — enquiry notifications",
    from_name: site.name,
    message: [
      `Test from the ${site.name} dashboard.`,
      "If you can read this, website enquiry emails are wired up.",
      `Sent: ${new Date().toLocaleString("en-IN", { dateStyle: "long", timeStyle: "short" })}`
    ].join("\n")
  };
  return keys.map((k) => ({ ...base, access_key: k }));
}
