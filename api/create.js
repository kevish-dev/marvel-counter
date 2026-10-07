import { getStore } from "../src/store.js";
import { normalizeId, sendJson, clientIp } from "../src/util.js";

const PER_IP_PER_HOUR = Number(process.env.CREATE_PER_IP_PER_HOUR || 10);
const MAX_IDS = Number(process.env.MAX_IDS || 50000);

// POST /api/create  { "id": "your-name" }  -> registers a counter starting at 0
export default async function handler(req, res) {
  if (req.method === "OPTIONS") { res.setHeader("Access-Control-Allow-Origin", "*"); res.setHeader("Access-Control-Allow-Methods", "POST"); res.setHeader("Access-Control-Allow-Headers", "content-type"); res.statusCode = 204; return res.end(); }
  if (req.method !== "POST") return sendJson(res, 405, { error: "POST only" });
  let body = req.body;
  if (typeof body === "string") { try { body = JSON.parse(body); } catch { body = {}; } }
  if (!body && req.on) body = await new Promise((ok) => { let d = ""; req.on("data", (c) => (d += c)); req.on("end", () => { try { ok(JSON.parse(d)); } catch { ok({}); } }); });
  const n = normalizeId(body?.id);
  if (!n.ok) return sendJson(res, 400, { error: n.error });

  const store = getStore();
  try {
    if (!(await store.rateLimit(`rl:create:${clientIp(req)}`, PER_IP_PER_HOUR, 3600))) return sendJson(res, 429, { error: "Too many new counters from this network. Try again in an hour." });
    if ((await store.total()) >= MAX_IDS) return sendJson(res, 503, { error: "HeroCount is full right now. Please try later." });
    const created = await store.create(n.id);
    if (!created) return sendJson(res, 409, { error: "That id is already taken. Pick another." });
    return sendJson(res, 201, { id: n.id, count: 0, url: `/c/${n.id}.svg` });
  } catch { return sendJson(res, 503, { error: "storage unavailable" }); }
}
