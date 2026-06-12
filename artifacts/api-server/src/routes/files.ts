import { Router } from "express";
import { getDb, collectionName } from "../lib/mongodb";
import { GetFilesQueryParams } from "@workspace/api-zod";

const router = Router();

router.get("/files", async (req, res) => {
  const parsed = GetFilesQueryParams.safeParse(req.query);
  const page = parsed.success && parsed.data.page ? parsed.data.page : 1;
  const limit = parsed.success && parsed.data.limit ? parsed.data.limit : 20;
  const search = parsed.success ? parsed.data.search : undefined;

  const db = await getDb();
  if (!db) {
    res.json({ files: [], total: 0, page, pages: 0 });
    return;
  }

  try {
    const filter: Record<string, unknown> = {};
    if (search && search.trim()) {
      const escaped = search.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const regex = { $regex: escaped, $options: "i" };
      filter["$or"] = [{ file_name: regex }, { caption: regex }];
    }

    const skip = (page - 1) * limit;
    const [docs, total] = await Promise.all([
      db.collection(collectionName).find(filter).skip(skip).limit(limit).toArray(),
      db.collection(collectionName).countDocuments(filter),
    ]);

    const files = docs.map((f) => ({
      id: (f.file_id as string | undefined) ?? String(f._id),
      file_name: (f.file_name as string | undefined) ?? null,
      file_size: (f.file_size as number | undefined) ?? null,
      mime_type: (f.mime_type as string | undefined) ?? null,
      caption: (f.caption as string | undefined) ?? null,
    }));

    res.json({ files, total, page, pages: Math.ceil(total / limit) });
  } catch (err) {
    req.log.error({ err }, "Failed to get files");
    res.status(500).json({ error: "Failed to get files" });
  }
});

export default router;
