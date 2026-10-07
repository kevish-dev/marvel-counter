import { getStore } from "../src/store.js";
import { sendJson, adminOk } from "../src/util.js";

// GET /api/admin with "Authorization: Bearer $ADMIN_TOKEN" -> totals, leaderboard, recent counters
export default async function handler(req, res) {
  const a = adminOk(req);
  if (a === "unset") return sendJson(res, 503, { error: "ADMIN_TOKEN is not set on this deployment." });
  if (a !== "ok") return sendJson(res, 401, { error: "Unauthorized." });
  try { return sendJson(res, 200, await getStore().admin()); } catch { return sendJson(res, 503, { error: "storage unavailable" }); }
}
