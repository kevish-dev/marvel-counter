// Storage adapter. Today: Upstash/Vercel KV REST, or in-memory for local dev.
// To move to a VPS Redis later, add another class with the same five methods and select it in createStore().
const ID_PREFIX = "c:";
// Existing counters that predate the multi-user product keep their original Redis key.
export const LEGACY_KEYS = { "kevish-dev": "visits" };
export const keyFor = (id) => LEGACY_KEYS[id] || ID_PREFIX + id;

// Atomic "increment only if the key exists".
const HIT_LUA = "if redis.call('EXISTS',KEYS[1])==1 then return redis.call('INCR',KEYS[1]) else return -1 end";

class MemoryStore {
  constructor() { this.m = new Map(); this.exp = new Map(); for (const k of Object.values(LEGACY_KEYS)) this.m.set(k, 0); }
  async hit(id) { const k = keyFor(id); if (!this.m.has(k)) return null; this.m.set(k, this.m.get(k) + 1); return this.m.get(k); }
  async peek(id) { const k = keyFor(id); return this.m.has(k) ? this.m.get(k) : null; }
  async create(id) { const k = keyFor(id); if (this.m.has(k)) return false; this.m.set(k, 0); return true; }
  async rateLimit(key, limit, windowSec) {
    const now = Date.now(); const e = this.exp.get(key);
    if (!e || e.until < now) { this.exp.set(key, { n: 1, until: now + windowSec * 1000 }); return true; }
    e.n++; return e.n <= limit;
  }
  async total() { return this.m.size; }
}

class UpstashStore {
  constructor(url, token) { this.url = url; this.token = token; }
  async cmd(args) {
    const r = await fetch(this.url, { method: "POST", headers: { Authorization: `Bearer ${this.token}`, "Content-Type": "application/json" }, body: JSON.stringify(args) });
    if (!r.ok) throw new Error(`redis ${r.status}`);
    return (await r.json()).result;
  }
  async hit(id) { const v = Number(await this.cmd(["EVAL", HIT_LUA, "1", keyFor(id)])); return v < 0 ? null : v; }
  async peek(id) { const v = await this.cmd(["GET", keyFor(id)]); return v == null ? null : Number(v) || 0; }
  async create(id) { const ok = (await this.cmd(["SET", keyFor(id), "0", "NX"])) === "OK"; if (ok) await this.cmd(["INCR", "stat:ids"]); return ok; }
  async rateLimit(key, limit, windowSec) {
    const n = Number(await this.cmd(["INCR", key]));
    if (n === 1) await this.cmd(["EXPIRE", key, String(windowSec)]);
    return n <= limit;
  }
  async total() { return Number(await this.cmd(["GET", "stat:ids"])) || 0; }
}

let store;
export function createStore(env = process.env) {
  const url = env.UPSTASH_REDIS_REST_URL || env.KV_REST_API_URL;
  const token = env.UPSTASH_REDIS_REST_TOKEN || env.KV_REST_API_TOKEN;
  return url && token ? new UpstashStore(url, token) : new MemoryStore();
}
export const getStore = () => (store ??= createStore());
export const _internals = { MemoryStore };
