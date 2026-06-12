import { Router } from "express";
import { getDb } from "../lib/mongodb";
import { GetUsersQueryParams } from "@workspace/api-zod";

const router = Router();

router.get("/users", async (req, res) => {
  const parsed = GetUsersQueryParams.safeParse(req.query);
  const page = parsed.success && parsed.data.page ? parsed.data.page : 1;
  const limit = parsed.success && parsed.data.limit ? parsed.data.limit : 20;
  const banned = parsed.success ? parsed.data.banned : undefined;

  const db = await getDb();
  if (!db) {
    res.json({ users: [], total: 0, page, pages: 0 });
    return;
  }

  try {
    const filter: Record<string, unknown> = {};
    if (banned === true) filter["ban_status.is_banned"] = true;
    if (banned === false) filter["ban_status.is_banned"] = { $ne: true };

    const skip = (page - 1) * limit;
    const [users, total] = await Promise.all([
      db.collection("users").find(filter).skip(skip).limit(limit).toArray(),
      db.collection("users").countDocuments(filter),
    ]);

    const mapped = users.map((u) => ({
      id: String(u.id ?? u._id),
      name: (u.name as string | undefined) ?? null,
      username: (u.username as string | undefined) ?? null,
      ban_status: u.ban_status?.is_banned === true,
    }));

    res.json({ users: mapped, total, page, pages: Math.ceil(total / limit) });
  } catch (err) {
    req.log.error({ err }, "Failed to get users");
    res.status(500).json({ error: "Failed to get users" });
  }
});

export default router;
