import { Router } from "express";
import { getDb } from "../lib/mongodb";

const router = Router();

router.get("/chats", async (req, res) => {
  const db = await getDb();
  if (!db) {
    res.json([]);
    return;
  }

  try {
    const docs = await db.collection("groups").find({}).limit(200).toArray();
    const chats = docs.map((c) => ({
      id: String(c.id ?? c._id),
      title: (c.title as string | undefined) ?? null,
      username: (c.username as string | undefined) ?? null,
      chat_status: c.chat_status?.is_disabled !== true,
    }));
    res.json(chats);
  } catch (err) {
    req.log.error({ err }, "Failed to get chats");
    res.status(500).json({ error: "Failed to get chats" });
  }
});

export default router;
