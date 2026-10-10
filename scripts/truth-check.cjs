// Single-source-of-truth audit: proves every page/component reads its
// content from data/site.js and nothing else.
// Run: node scripts/truth-check.cjs
const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
let problems = 0;
const flag = (msg) => {
  problems++;
  console.log("[truth] " + msg);
};

function walk(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) {
      if (e.name === "node_modules" || e.name === ".next") continue;
      walk(p, out);
    } else if (/\.(jsx|js)$/.test(e.name)) {
      out.push(p);
    }
  }
  return out;
}

// 1. data/ must contain exactly one module: site.js
const dataFiles = fs.readdirSync(path.join(ROOT, "data")).filter((f) => f.endsWith(".js"));
if (dataFiles.length !== 1 || dataFiles[0] !== "site.js") {
  flag("data/ should contain only site.js, found: " + dataFiles.join(", "));
} else {
  console.log("[truth] data/ contains only site.js");
}

// 2. Nobody may import any other data module.
const srcFiles = [...walk(path.join(ROOT, "app")), ...walk(path.join(ROOT, "components")), ...walk(path.join(ROOT, "lib"))];
for (const f of srcFiles) {
  const src = fs.readFileSync(f, "utf8");
  if (/data\/services|from "\.\/services"/.test(src)) {
    flag(path.relative(ROOT, f) + " references a split data module");
  }
}

// 3. No business-data literals outside site.js.
const DATA_RES = [
  /phoneDisplay/,
  /phoneIntl/,
  /instagram\.com/,
  /Washermanpet/,
  /600021/,
  /Jain School/,
  /7:00 AM/,
  /8:30 ?PM/,
  /Monday/,
  / Cele[a-z]+, Our Crea[a-z]+/,
  /₹/,
  /@gmail\.|@yahoo\.|@outlook\./
];
for (const f of srcFiles) {
  const rel = path.relative(ROOT, f);
  if (rel === path.join("data", "site.js")) continue;
  const src = fs.readFileSync(f, "utf8");
  for (const re of DATA_RES) {
    const m = src.match(re);
    if (m) flag(`${rel} contains hard business data: ${JSON.stringify(m[0])}`);
  }
}

// 4. Every UI file must consume site.js — except documented pass-throughs
// (composition only, props-only primitives, null renderers, infra routes).
const PASS_THROUGH = new Set([
  "app\\(site)\\page.jsx",
  "app\\dashboard\\page.jsx",
  "components\\admin\\upload.js",
  "components\\ui\\BusyOverlay.jsx",
  "app\\api\\health\\route.js",
  "app\\api\\media\\sign\\route.js",
  "components\\ui\\Reveal.jsx",
  "components\\ui\\SectionHeading.jsx",
  "components\\ui\\ServiceIcon.jsx",
  "components\\ui\\SmoothScroll.jsx",
  "components\\ui\\SocialIcons.jsx"
]);
for (const f of srcFiles) {
  const rel = path.relative(ROOT, f);
  if (rel === path.join("data", "site.js")) continue;
  if (rel.startsWith("lib" + path.sep)) continue; // infrastructure, no UI copy
  if (rel.startsWith("app" + path.sep + "api")) continue; // JSON-only routes
  if (PASS_THROUGH.has(rel)) continue;
  if (!/from ["']@\/data\/site["']/.test(fs.readFileSync(f, "utf8"))) {
    flag(`${rel} renders UI without importing @/data/site`);
  }
}

console.log(problems === 0 ? "TRUTH AUDIT: site.js is the single source" : `TRUTH AUDIT: ${problems} problem(s)`);
process.exit(problems === 0 ? 0 : 1);
