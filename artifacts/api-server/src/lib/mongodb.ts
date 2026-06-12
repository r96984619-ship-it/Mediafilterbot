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

async function connect(): Promise<Db | null> {
  if (!uri) return null;
  try {
    const client = new MongoClient(uri, { serverSelectionTimeoutMS: 10_000 });
    await client.connect();
    const db = client.db(dbName);
    logger.info({ dbName }, "Connected to MongoDB");
    return db;
  } catch (err) {
    logger.error({ err }, "Failed to connect to MongoDB");
    connectionPromise = null;
    return null;
  }
}

export function getDb(): Promise<Db | null> {
  if (!connectionPromise) {
    connectionPromise = connect();
  }
  return connectionPromise;
}

export { collectionName };
