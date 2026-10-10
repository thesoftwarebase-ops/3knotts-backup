// Full sweep: hydration suppressions, console leaks, image hygiene,
// client-component boundaries. Run: node scripts/full-check.cjs
const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
let problems = 0;
const flag = (msg) => {
  problems++;
  console.log("[full] " + msg);
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

const files = [...walk(path.join(ROOT, "app")), ...walk(path.join(ROOT, "components")), ...walk(path.join(ROOT, "lib"))];

// 1. suppressHydrationWarning inventory (informational — rule 5 gates form
// controls, the footer year is separately documented).
for (const f of files) {
  const rel = path.relative(ROOT, f);
  if (rel === path.join("data", "site.js")) continue;
  const n = (fs.readFileSync(f, "utf8").match(/suppressHydrationWarning/g) || []).length;
  if (n > 0) {
    console.log(`[full] suppressions in ${rel}: ${n} (form controls + documented footer year)`);
  }
}

// 2. console.* belongs on the server only (API routes + lib).
for (const f of files) {
  const rel = path.relative(ROOT, f);
  const lines = fs.readFileSync(f, "utf8").split("\n");
  lines.forEach((line, i) => {
    if (/console\.(log|warn|info|debug)/.test(line)) flag(`${rel}:${i + 1} console output in shipped code`);
    if (/console\.error/.test(line) && !rel.startsWith("app" + path.sep + "api") && !rel.startsWith("lib" + path.sep)) {
      flag(`${rel}:${i + 1} console.error outside server code`);
    }
  });
}

// 3. Every <img> must carry an alt attribute (empty + aria-hidden for decor).
for (const f of files) {
  const src = fs.readFileSync(f, "utf8");
  const tags = src.match(/<img[\s\S]*?(\/>|>)/g) || [];
  tags.forEach((tag) => {
    if (!/alt=/.test(tag)) flag(`${path.relative(ROOT, f)} has <img> without alt: ${tag.slice(0, 70)}`);
  });
}

// 4. "use client" allowlist — every client boundary must earn its JS.
const CLIENT_ALLOW = new Set([
  "components\\home\\EnquiryForm.jsx",
  "components\\home\\Hero.jsx",
  "components\\home\\HowItWorks.jsx",
  "components\\home\\Testimonials.jsx",
  "components\\admin\\LoginForm.jsx",
  "components\\admin\\DashboardPanel.jsx",
  "components\\admin\\AboutManager.jsx",
  "components\\admin\\HeroManager.jsx",
  "components\\admin\\HomeManagers.jsx",
  "components\\admin\\ServicesManager.jsx",
  "components\\admin\\upload.js",
  "components\\ui\\Reveal.jsx",
  "components\\ui\\ShowcaseSlider.jsx",
  "components\\ui\\BusyOverlay.jsx",
  "components\\ui\\SiteLoader.jsx",
  "components\\ui\\SmoothScroll.jsx",
  "components\\layout\\Navbar.jsx"
]);
for (const f of files) {
  const rel = path.relative(ROOT, f);
  if (/"use client"/.test(fs.readFileSync(f, "utf8")) && !CLIENT_ALLOW.has(rel)) {
    flag(`${rel} is client-rendered without a documented reason`);
  }
}
// 5. Every form control must carry suppressHydrationWarning — password
// managers and form fillers inject attributes (fdprocessedid et al)
// before React hydrates, which otherwise throws hydration errors.
// Tag bodies are scanned raw (regex stops at the tag's own close)
// so => arrows inside handlers can't truncate the match.
for (const f of files) {
  const src = fs.readFileSync(f, "utf8");
  const rel = path.relative(ROOT, f);
  const re = /<(input|select|textarea)\b/g;
  let m;
  while ((m = re.exec(src)) !== null) {
    const start = m.index;
    // Find the tag's own close: first "/>" or ">" that is NOT part of "=>".
    let end = -1;
    for (let i = start + m[0].length; i < src.length; i++) {
      if (src[i] === ">" && src[i - 1] !== "=") {
        end = i;
        break;
      }
    }
    const tag = end === -1 ? "" : src.slice(start, end + 1);
    if (tag && !/suppressHydrationWarning/.test(tag)) {
      flag(`${rel} has a form control without suppressHydrationWarning: ${tag.replace(/\s+/g, " ").slice(0, 90)}`);
    }
  }
}

console.log(problems === 0 ? "FULL CHECK: CLEAN" : `FULL CHECK: ${problems} problem(s)`);
process.exit(problems === 0 ? 0 : 1);
