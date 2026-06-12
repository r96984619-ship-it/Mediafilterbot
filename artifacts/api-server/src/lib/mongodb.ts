import { MongoClient, Db } from "mongodb";
import { logger } from "./logger";

const uri = process.env["MONGODB_URI"];
const dbName = process.env["MONGODB_DB_NAME"] || "Rajappan";
const collectionName = process.env["MONGODB_COLLECTION_NAME"] || "Telegram_files";

if (!uri) {
  logger.warn("MONGODB_URI is not set — all DB queries will return empty results");
}
if (!process.env["MONGODB_DB_NAME"]) {
  logger.warn({ dbName }, "MONGODB_DB_NAME not set, using default — set this to match your bot's DATABASE_NAME env var on Render");
}

let connectionPromise: Promise<Db | null> | null = null;
let retryAfter = 0;
const RETRY_COOLDOWN_MS = 30_000;

async function connect(): Promise<Db | null> {
  if (!uri) return null;
  try {
    const client = new MongoClient(uri, { serverSelectionTimeoutMS: 10_000 });
    await client.connect();
    const db = client.db(dbName);
    retryAfter = 0;
    logger.info({ dbName }, "Connected to MongoDB");
    return db;
  } catch (err) {
    logger.error({ err }, "Failed to connect to MongoDB");
    retryAfter = Date.now() + RETRY_COOLDOWN_MS;
    connectionPromise = null;
    return null;
  }
}

export function getDb(): Promise<Db | null> {
  if (!connectionPromise) {
    if (retryAfter && Date.now() < retryAfter) {
      const waitSec = Math.ceil((retryAfter - Date.now()) / 1000);
      logger.warn({ waitSec }, "MongoDB connection cooling down after failure — skipping retry");
      return Promise.resolve(null);
    }
    connectionPromise = connect();
  }
  return connectionPromise;
}

export { collectionName };
