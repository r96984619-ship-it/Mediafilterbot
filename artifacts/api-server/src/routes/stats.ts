import { Router } from "express";
import { getDb, collectionName } from "../lib/mongodb";

const router = Router();

router.get("/stats/overview", async (req, res) => {
  const db = await getDb();
  if (!db) {
    res.json({ totalUsers: 0, totalFiles: 0, totalChats: 0, bannedUsers: 0 });
    return;
  }
  try {
    const [totalUsers, totalFiles, totalChats, bannedUsers] = await Promise.all([
      db.collection("users").countDocuments({}),
      db.collection(collectionName).countDocuments({}),
      db.collection("groups").countDocuments({ "chat_status.is_disabled": { $ne: true } }),
      db.collection("users").countDocuments({ "ban_status.is_banned": true }),
    ]);
    res.json({ totalUsers, totalFiles, totalChats, bannedUsers });
  } catch (err) {
    req.log.error({ err }, "Failed to get stats overview");
    res.status(500).json({ error: "Failed to get stats" });
  }
});

const VIDEO_EXTENSIONS = /\.(mkv|mp4|avi|mov|wmv|flv|webm|m4v|ts|mpeg|mpg|3gp)$/i;
const AUDIO_EXTENSIONS = /\.(mp3|flac|aac|ogg|m4a|wav|opus|wma)$/i;

router.get("/stats/files-by-type", async (req, res) => {
  const db = await getDb();
  if (!db) {
    res.json([]);
    return;
  }
  try {
    const result = await db.collection(collectionName).aggregate([
      {
        $addFields: {
          _type: {
            $switch: {
              branches: [
                {
                  case: { $regexMatch: { input: { $ifNull: ["$mime_type", ""] }, regex: "^video" } },
                  then: "Video"
                },
                {
                  case: { $regexMatch: { input: { $ifNull: ["$mime_type", ""] }, regex: "^audio" } },
                  then: "Audio"
                },
                {
                  case: {
                    $regexMatch: {
                      input: { $ifNull: ["$file_name", ""] },
                      regex: VIDEO_EXTENSIONS.source,
                      options: "i"
                    }
                  },
                  then: "Video"
                },
                {
                  case: {
                    $regexMatch: {
                      input: { $ifNull: ["$file_name", ""] },
                      regex: AUDIO_EXTENSIONS.source,
                      options: "i"
                    }
                  },
                  then: "Audio"
                }
              ],
              default: "Other"
            }
          }
        }
      },
      { $group: { _id: "$_type", count: { $sum: 1 } } },
      { $project: { _id: 0, type: "$_id", count: 1 } },
      { $sort: { count: -1 } }
    ]).toArray();
    res.json(result);
  } catch (err) {
    req.log.error({ err }, "Failed to get files by type");
    res.status(500).json({ error: "Failed to get file types" });
  }
});

export default router;
