// Hydration audit: flags client-side code patterns that cause
// server/client HTML mismatches. Verified-false-positives live in ALLOW
// with reasons; everything else fails the build gate.
// Run: node scripts/hydrate-check.cjs
const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");

// file :: substring-present-on-the-flagged-line :: reason
const ALLOW = [
  ["components\\home\\Hero.jsx", "window.matchMedia", "inside useEffect only (verified by read)"],
  ["components\\home\\Hero.jsx", "Date.now()", "ref/effect/handler timing only; never rendered"],
  ["components\\home\\Hero.jsx", "document.hidden", "inside interval callback only"],
  ["components\\home\\HowItWorks.jsx", "window.matchMedia", "inside useEffect only"],
  ["components\\home\\HowItWorks.jsx", "window.innerWidth", "inside rAF effect only"],
  ["components\\home\\HowItWorks.jsx", "window.innerHeight", "inside rAF effect only"],
  ["components\\layout\\Navbar.jsx", "window.addEventListener", "inside useEffect only"],
  ["components\\layout\\Navbar.jsx", "window.removeEventListener", "inside useEffect only"],
  ["components\\layout\\Footer.jsx", "new Date().getFullYear()", "mitigated with suppressHydrationWarning"],
  ["components\\ui\\SiteLoader.jsx", "Date.now()", "useRef initializer + effect math; never rendered"],
  ["components\\ui\\SiteLoader.jsx", "window.matchMedia", "inside useEffect only"],
  ["components\\ui\\SiteLoader.jsx", "document.readyState", "inside useEffect only"],
  ["components\\ui\\SiteLoader.jsx", "window.addEventListener", "inside useEffect only"],
  ["components\\ui\\SiteLoader.jsx", "window.removeEventListener", "inside useEffect only"],
  ["components\\layout\\Navbar.jsx", "window.scrollY", "inside scroll effect only (verified by read)"],
  ["components\\layout\\Navbar.jsx", "document.body.style", "inside menu-lock effect only"],
  ["components\\ui\\ShowcaseSlider.jsx", "Date.now()", "ref/effect/handler timing only; never rendered"],
  ["components\\ui\\ShowcaseSlider.jsx", "window.matchMedia", "inside autoplay effect only"],
  ["components\\ui\\ShowcaseSlider.jsx", "document.hidden", "inside interval callback only"],
  ["components\\home\\Testimonials.jsx", "Date.now()", "ref/effect/handler timing only; never rendered"],
  ["components\\home\\Testimonials.jsx", "window.matchMedia", "inside autoplay effect only"],
  ["components\\home\\Testimonials.jsx", "document.hidden", "inside interval callback only"],
  ["components\\admin\\LoginForm.jsx", "sessionStorage.setItem", "inside submit handler only; never rendered"],
  ["components\\admin\\DashboardPanel.jsx", "sessionStorage", "auth header builder + logout handler only; never rendered"],
  ["components\\admin\\DashboardPanel.jsx", "document.body.style", "inside drawer-lock effect only; never rendered"],
  ["components\\admin\\DashboardPanel.jsx", "document.visibilityState", "inside re-verify effect only"],
  ["components\\admin\\DashboardPanel.jsx", "window.addEventListener", "inside re-verify effect only"],
  ["components\\admin\\DashboardPanel.jsx", "window.removeEventListener", "inside re-verify effect only"],
  ["components\\admin\\DashboardPanel.jsx", "document.addEventListener", "inside re-verify effect only"],
  ["components\\admin\\DashboardPanel.jsx", "document.removeEventListener", "inside re-verify effect only"],
  ["components\\admin\\LoginForm.jsx", "sessionStorage.getItem", "inside session-check effect only"],
  ["components\\admin\\upload.js", "sessionStorage", "token helper called from handlers/effects only"],
  ["components\\admin\\DashboardPanel.jsx", "window.confirm", "inside delete handler only"],
  ["components\\ui\\SmoothScroll.jsx", "window.scrollTo", "inside route-change effect only"],
  ["components\\ui\\SmoothScroll.jsx", "window.matchMedia", "inside init effect only (verified by read)"]
];

// Server-only modules emit no client HTML — time/proofs there are safe.
const SERVER_ONLY = new Set([
  "app\\api\\health\\route.js",
  "app\\api\\enquire\\route.js",
  "app\\api\\media\\sign\\route.js",
  "app\\sitemap.js",
  "app\\robots.js"
]);

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

const SUSPECT = /Date\.(now|parse)\(|new Date\(\)|Math\.random\(|window\.|document\.|navigator\.|localStorage|sessionStorage/g;
let problems = 0;

for (const d of ["components", "app"]) {
  for (const f of walk(path.join(ROOT, d))) {
    const rel = path.relative(ROOT, f);
    if (SERVER_ONLY.has(rel)) continue;
    const lines = fs.readFileSync(f, "utf8").split("\n");
    lines.forEach((line, i) => {
      // Skip lines that cannot reach render output.
      if (/^\s*(\/\/|import|console\.|catch)/.test(line)) return;
      const hits = line.match(SUSPECT);
      if (!hits) return;
      const allowed = ALLOW.some(([file, sub]) => rel === file && line.includes(sub));
      if (!allowed) {
        problems++;
        console.log(`[suspect] ${rel}:${i + 1}: ${line.trim().slice(0, 100)}`);
      }
    });
  }
}

// usePathname consumers must render under layout's Suspense boundary.
const layoutSrc = fs.readFileSync(path.join(ROOT, "app", "layout.jsx"), "utf8");
const hasSuspense = /<Suspense[\s>]/.test(layoutSrc);
const users = [];
for (const d of ["components", "app"]) {
  for (const f of walk(path.join(ROOT, d))) {
    if (/usePathname\(\)/.test(fs.readFileSync(f, "utf8"))) users.push(path.relative(ROOT, f));
  }
}
if (!hasSuspense && users.length) {
  problems += users.length;
  users.forEach((u) => console.log(`[no-suspense] ${u}`));
} else {
  console.log(`[suspense] boundary present; covers: ${users.join(", ") || "none"}`);
}

console.log(problems === 0 ? "HYDRATION AUDIT: CLEAN" : `HYDRATION AUDIT: ${problems} problem(s)`);
process.exit(problems === 0 ? 0 : 1);
