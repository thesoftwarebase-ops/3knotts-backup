// Seeds MongoDB with EVERYTHING the app reads:
// hero slides, services + featured, brand, testimonials, faq, steps,
// about — plus an optional admin login.
// Usage: node scripts/seed-all.cjs [admin-email] [admin-password]
// Without args: content only, admin untouched.
const { createRequire } = require("node:module");
const path = require("node:path");
const fs = require("fs");

const ROOT = path.join(__dirname, "..");
const requireFromProject = createRequire(path.join(ROOT, "package.json"));
const bcrypt = requireFromProject("bcryptjs");
const { MongoClient } = requireFromProject("mongodb");

const env = {};
for (const line of fs.readFileSync(path.join(ROOT, ".env.local"), "utf8").replace(/\r/g, "").split("\n")) {
  const m = line.match(/^([A-Z_]+)=(.*)$/);
  if (m) env[m[1]] = m[2].trim();
}

async function main() {
  if (!env.MONGODB_URI) {
    console.log("MONGODB_URI is not set in .env.local");
    process.exit(1);
  }
  const { pathToFileURL } = require("node:url");
  const mod = await import(pathToFileURL(path.join(ROOT, "data", "site.js")).href);
  const S = mod.site;
  const seedServices = mod.services;
  const client = new MongoClient(env.MONGODB_URI, { serverSelectionTimeoutMS: 15000 });
  try {
    await client.connect();
    const db = client.db(env.MONGODB_DB || undefined);
    const content = db.collection("site_content");
    const docs = [
      { _id: "hero", slides: S.hero.slides },
      { _id: "services", services: seedServices, featured: S.featuredServices },
      { _id: "section:brand", value: S.brand },
      { _id: "section:testimonials", value: S.testimonials.items },
      { _id: "section:faq", value: S.faq.items },
      { _id: "section:steps", value: S.steps },
      { _id: "section:about", value: S.about }
    ];
    for (const d of docs) {
      await content.updateOne(
        { _id: d._id },
        { $set: { ...d, updatedAt: new Date() } },
        { upsert: true }
      );
      console.log("seeded:", d._id);
    }

    const email = String(process.argv[2] || "").trim().toLowerCase();
    const password = String(process.argv[3] || "");
    if (email && password) {
      const passHash = await bcrypt.hash(password, 10);
      await db.collection("admins").updateOne(
        { email },
        { $set: { email, passHash, updatedAt: new Date() }, $setOnInsert: { createdAt: new Date() } },
        { upsert: true }
      );
      console.log("seeded admin:", email, "(bcrypt hash stored)");
    } else {
      console.log("admin skipped (no email/password args)");
    }
  } finally {
    await client.close().catch(() => {});
  }
}

main().catch((e) => {
  console.log("SEED FAILED:", e.message);
  process.exit(1);
});
