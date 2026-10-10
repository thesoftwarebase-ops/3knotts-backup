import { site } from "@/data/site";

export function buildEnquiryMessage(d) {
  const m = site.waMsg;
  const lines = [
    m.intro,
    `${m.name}: ${d.name || m.empty}`,
    `${m.phone}: ${d.phone || m.empty}`,
    `${m.date}: ${d.date || m.empty}`,
    `${m.location}: ${d.location || m.empty}`,
    `${m.function}: ${d.functionType || d.function || m.empty}`,
    `${m.requirement}: ${d.requirement || m.empty}`,
    d.budget ? `${m.budget}: ${d.budget}` : null
  ].filter(Boolean);
  return lines.join("\n");
}

export function enquiryWhatsAppUrl(waNumber, data) {
  const msg = buildEnquiryMessage(data);
  return `https://wa.me/${waNumber}?text=${encodeURIComponent(msg)}`;
}
