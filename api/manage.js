import { getStore, hashKey, newEditKey, PROTECTED_IDS } from "../src/store.js";
import { normalizeId, sendJson, clientIp, readBody } from "../src/util.js";
import { gate } from "../src/license.js";

// POST /api/manage { id, key, action: "stats" | "reset" | "delete" | "rotate" }
// POST /api/manage { id, action: "claim" }   claims an id that predates edit keys (first come, first served)
export default async function handler(req, res) {
  if (req.method !== "POST") return sendJson(res, 405, { error: "POST only" });
  if (!(await gate(req, res, { kind: "json" }))) return;
  const b = await readBody(req);
  const n = normalizeId(b.id);
  if (!n.ok) return sendJson(res, 400, { error: n.error });
  const store = getStore();
  try {
    if (!(await store.rateLimit(`rl:manage:${clientIp(req)}`, 60, 60))) return sendJson(res, 429, { error: "Too many requests. Slow down." });
    if (b.action === "claim") {
      if (PROTECTED_IDS.has(n.id)) return sendJson(res, 403, { error: "This id is reserved." });
      const key = newEditKey();
      if (!(await store.claim(n.id, hashKey(key)))) return sendJson(res, 409, { error: "That id does not exist or already has an edit key." });
      return sendJson(res, 200, { id: n.id, key, note: "Save this edit key. It is shown once." });
    }
    const state = await store.keyState(n.id, hashKey(b.key || ""));
    if (state === "unclaimed") return sendJson(res, 403, { error: "This id has no edit key yet. Claim it first.", claimable: !PROTECTED_IDS.has(n.id) });
    if (state !== "ok") return sendJson(res, 403, { error: "Wrong edit key." });
    switch (b.action) {
      case "stats": { const s = await store.stats(n.id, 30); return s ? sendJson(res, 200, s) : sendJson(res, 404, { error: "id not found" }); }
      case "reset": await store.reset(n.id); return sendJson(res, 200, { ok: true, count: 0 });
      case "delete": await store.remove(n.id); return sendJson(res, 200, { ok: true });
      case "rotate": { const key = newEditKey(); await store.rotate(n.id, hashKey(key)); return sendJson(res, 200, { id: n.id, key }); }
      default: return sendJson(res, 400, { error: "Unknown action." });
    }
  } catch { return sendJson(res, 503, { error: "storage unavailable" }); }
}
