import { MongoClient, ObjectId } from "mongodb";

const uri = process.env.MONGODB_URI || "";
const dbName = process.env.MONGODB_DB || "";

function getClientPromise() {
  if (!uri) return null;
  if (!globalThis._mongoClientPromise) {
    const client = new MongoClient(uri, { serverSelectionTimeoutMS: 5000 });
    globalThis._mongoClientPromise = client.connect();
  }
  return globalThis._mongoClientPromise;
}

export async function getDb() {
  const promise = getClientPromise();
  if (!promise) throw new Error("MONGODB_URI is not configured");
  const client = await promise;
  return client.db(dbName || undefined);
}

// Single enquiry function: stamps status + createdAt, inserts once.
export async function saveEnquiry(payload) {
  const db = await getDb();
  const doc = {
    name: String(payload.name || "").trim(),
    phone: String(payload.phone || "").trim(),
    date: String(payload.date || "").trim(),
    location: String(payload.location || "").trim(),
    functionType: String(payload.functionType || payload.function || "").trim(),
    requirement: String(payload.requirement || "").trim(),
    budget: String(payload.budget || "").trim(),
    status: "new",
    createdAt: new Date(),
    source: "website"
  };
  const result = await db.collection("enquiries").insertOne(doc);
  return { id: result.insertedId.toString(), doc };
}

const STATUSES = ["new", "contacted", "done"];

// Newest-first list for the dashboard.
export async function listEnquiries(limit = 200) {
  const db = await getDb();
  const rows = await db
    .collection("enquiries")
    .find({})
    .sort({ createdAt: -1 })
    .limit(Math.min(Math.max(limit, 1), 500))
    .toArray();
  return rows.map((r) => ({
    id: r._id.toString(),
    name: r.name || "",
    phone: r.phone || "",
    date: r.date || "",
    location: r.location || "",
    functionType: r.functionType || "",
    requirement: r.requirement || "",
    budget: r.budget || "",
    status: STATUSES.includes(r.status) ? r.status : "new",
    createdAt: r.createdAt ? new Date(r.createdAt).toISOString() : null
  }));
}

export async function setEnquiryStatus(id, status) {
  if (!STATUSES.includes(status)) throw new Error("Bad status");
  let oid;
  try {
    oid = new ObjectId(id);
  } catch {
    throw new Error("Bad id");
  }
  const db = await getDb();
  const res = await db.collection("enquiries").updateOne({ _id: oid }, { $set: { status } });
  if (!res.matchedCount) throw new Error("Not found");
  return status;
}

export async function deleteEnquiry(id) {
  let oid;
  try {
    oid = new ObjectId(id);
  } catch {
    throw new Error("Bad id");
  }
  const db = await getDb();
  const res = await db.collection("enquiries").deleteOne({ _id: oid });
  if (!res.deletedCount) throw new Error("Not found");
  return true;
}
