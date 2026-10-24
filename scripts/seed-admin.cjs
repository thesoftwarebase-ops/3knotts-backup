// Seeds the admins collection with one owner login.
// Usage: node scripts/seed-admin.cjs <email> <password>
// Never commit real credentials — pass them as arguments.
const { createRequire } = require("node:module");
const path = require("node:path");

const ROOT = path.join(__dirname, "..");
const requireFromProject = createRequire(path.join(ROOT, "package.json"));
const bcrypt = requireFromProject("bcryptjs");
const { MongoClient } = requireFromProject("mongodb");

const fs = require("fs");
const env = {};
const raw = fs
  .readFileSync(path.join(ROOT, ".env.local"), "utf8")
  .replace(/^\uFEFF/, "")
  .replace(/\r/g, "");
for (const line of raw.split("\n")) {
  const m = line.match(/^([A-Z_]+)=(.*)$/);
  if (m) env[m[1]] = m[2].trim();
}

async function main() {
  const email = String(process.argv[2] || "").trim().toLowerCase();
  const password = String(process.argv[3] || "");
  if (!email || !password) {
    console.log("Usage: node scripts/seed-admin.cjs <email> <password>");
    process.exit(1);
  }
  if (!env.MONGODB_URI) {
    console.log("MONGODB_URI is not set in .env.local");
    process.exit(1);
  }
  const client = new MongoClient(env.MONGODB_URI, { serverSelectionTimeoutMS: 15000 });
  try {
    await client.connect();
    const db = client.db(env.MONGODB_DB || undefined);
    const passHash = await bcrypt.hash(password, 10);
    await db.collection("admins").updateOne(
      { email },
      { $set: { email, passHash, updatedAt: new Date() }, $setOnInsert: { createdAt: new Date() } },
      { upsert: true }
    );
    console.log("SEEDED admin: " + email + " (bcrypt hash stored, password never saved)");
  } finally {
    await client.close().catch(() => {});
  }
}

main().catch((e) => {
  console.log("SEED FAILED:", e.message);
  process.exit(1);
});
