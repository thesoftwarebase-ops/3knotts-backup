import { saveEnquiry } from "@/lib/db";
import { getEmailSettings } from "@/lib/email";
import { enquiryWhatsAppUrl } from "@/lib/whatsapp";
import { site, WA_NUMBER } from "@/data/site";

const ERR = site.form.errors;

function bad(message, status = 400) {
  return Response.json({ ok: false, error: message }, { status });
}

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return bad(ERR.resend);
  }

  // Honeypot — pretend success so bots learn nothing
  if (body.company_website) {
    return Response.json({ ok: true, whatsappUrl: null });
  }

  const name = String(body.name || "").trim();
  const phone = String(body.phone || "").trim();
  const date = String(body.date || "").trim();
  const location = String(body.location || "").trim();
  const functionType = String(body.functionType || body.function || "").trim();
  const requirement = String(body.requirement || "").trim();
  const budget = String(body.budget || "").trim();

  if (!name || name.length < 2) return bad(ERR.name);
  if (!phone || !/^[+\d][\d\s-]{6,17}$/.test(phone)) return bad(ERR.phone);
  if (!date) return bad(ERR.date);
  if (!location) return bad(ERR.location);
  if (!functionType) return bad(ERR.functionType);
  if (!requirement || requirement.length < 5) return bad(ERR.requirement);

  // Store first. If storage is down, hand the visitor a WhatsApp link
  // carrying the same details — no enquiry is ever silently lost.
  const data = { name, phone, date, location, functionType, requirement, budget };
  try {
    await saveEnquiry(data);
    // The actual submission to Web3Forms is relayed by the visitor's own
    // browser (their edge only accepts browser traffic on the free plan).
    // Hand back the public-grade key(s); email failures never touch this
    // response — the enquiry is already safe in the dashboard.
    const email = await getEmailSettings();
    return Response.json({ ok: true, notifyKeys: email.keys });
  } catch (e) {
    console.error("enquiry db error:", e);
    return Response.json(
      { ok: false, error: ERR.saveFail, whatsappUrl: enquiryWhatsAppUrl(WA_NUMBER, data) },
      { status: 503 }
    );
  }
}
