import { getStore, hashKey, newEditKey } from "../src/store.js";
import { normalizeId, sendJson, clientIp, readBody } from "../src/util.js";
import { gate } from "../src/license.js";

const PER_IP_PER_HOUR = Number(process.env.CREATE_PER_IP_PER_HOUR || 10);
const MAX_IDS = Number(process.env.MAX_IDS || 50000);

// POST /api/create  { "id": "your-name" }  -> registers a counter starting at 0 and returns its edit key (shown once)
export default async function handler(req, res) {
  if (req.method === "OPTIONS") { res.setHeader("Access-Control-Allow-Origin", "*"); res.setHeader("Access-Control-Allow-Methods", "POST"); res.setHeader("Access-Control-Allow-Headers", "content-type"); res.statusCode = 204; return res.end(); }
  if (req.method !== "POST") return sendJson(res, 405, { error: "POST only" });
  if (!(await gate(req, res, { kind: "json" }))) return;
  const n = normalizeId((await readBody(req)).id);
  if (!n.ok) return sendJson(res, 400, { error: n.error });

  const store = getStore();
  try {
    if (!(await store.rateLimit(`rl:create:${clientIp(req)}`, PER_IP_PER_HOUR, 3600))) return sendJson(res, 429, { error: "Too many new counters from this network. Try again in an hour." });
    if ((await store.total()) >= MAX_IDS) return sendJson(res, 503, { error: "HeroCount is full right now. Please try later." });
    const key = newEditKey();
    const created = await store.create(n.id, { kh: hashKey(key) });
    if (!created) return sendJson(res, 409, { error: "That id is already taken. Pick another." });
    return sendJson(res, 201, { id: n.id, count: 0, url: `/c/${n.id}.svg`, key, note: "Save this edit key. It is shown once and lets you view stats, reset, rotate or delete this counter." });
  } catch { return sendJson(res, 503, { error: "storage unavailable" }); }
}
