// Storage adapter. Today: Upstash/Vercel KV REST, or in-memory for local dev.
// To move to another Redis later, add a class with the same methods and select it in createStore().
//
// Keys:  c:<id> count (legacy ids keep their old key)   d:<id> hash day->views   r:<id> hash referrer->views
//        m:<id> hash {created, kh=sha256 of edit key}   top zset id->views   stat:ids  stat:hits  recent list  meta:first_run
import crypto from "node:crypto";

export const LEGACY_KEYS = { "kevish-dev": "visits" };
export const PROTECTED_IDS = new Set(["kevish-dev"]);       // cannot be claimed through the public API
export const keyFor = (id) => LEGACY_KEYS[id] || "c:" + id;
export const hashKey = (k) => crypto.createHash("sha256").update(String(k)).digest("hex");
export const newEditKey = () => "hck_" + crypto.randomBytes(24).toString("base64url");
export const dayOf = (ms = Date.now()) => new Date(ms).toISOString().slice(0, 10);
const TTL = 10368000; // 120 days for daily/referrer history

// One atomic call per view: exists? rate-limited? count, daily bucket, referrer, leaderboard, global counter.
const HIT_LUA = `
if redis.call('EXISTS',KEYS[1])==0 then return {-1,''} end
local created=redis.call('HGET',KEYS[7],'created') or ''
if ARGV[4]=='0' then return {tonumber(redis.call('GET',KEYS[1])),created} end
local r=redis.call('INCR',KEYS[4]); if r==1 then redis.call('EXPIRE',KEYS[4],60) end
if r>tonumber(ARGV[3]) then return {tonumber(redis.call('GET',KEYS[1])),created} end
local n=redis.call('INCR',KEYS[1])
redis.call('HINCRBY',KEYS[2],ARGV[1],1); redis.call('EXPIRE',KEYS[2],${TTL})
if ARGV[2]~='' then redis.call('HINCRBY',KEYS[3],ARGV[2],1); redis.call('EXPIRE',KEYS[3],${TTL}) end
redis.call('ZINCRBY',KEYS[5],1,ARGV[5]); redis.call('INCR',KEYS[6])
return {n,created}`;

const lastDays = (n, hash) => {
  const out = [];
  for (let i = n - 1; i >= 0; i--) { const d = dayOf(Date.now() - i * 86400000); out.push({ day: d, count: Number(hash?.[d] || 0) }); }
  return out;
};
const topRefs = (h, n = 10) => Object.entries(h || {}).map(([k, v]) => [k, Number(v)]).sort((a, b) => b[1] - a[1]).slice(0, n);
const toObj = (flat) => { if (!flat) return {}; if (!Array.isArray(flat)) return flat; const o = {}; for (let i = 0; i < flat.length; i += 2) o[flat[i]] = flat[i + 1]; return o; };

export class MemoryStore {
  constructor() {
    this.c = new Map(); this.d = new Map(); this.r = new Map(); this.m = new Map(); this.top = new Map(); this.recent = []; this.hits = 0; this.exp = new Map(); this.rl = new Map();
    for (const k of Object.values(LEGACY_KEYS)) this.c.set(k, 0);
  }
  async hit(id, { day = dayOf(), ref = "", ip = "", limit = 120, bump = true } = {}) {
    const k = keyFor(id); if (!this.c.has(k)) return null;
    const created = Number(this.m.get(id)?.created) || null;
    if (!bump) return { count: this.c.get(k), created };
    if (!(await this.rateLimit(`rl:h:${ip}:${id}`, limit, 60))) return { count: this.c.get(k), created };
    this.c.set(k, this.c.get(k) + 1);
    const d = this.d.get(id) || {}; d[day] = (d[day] || 0) + 1; this.d.set(id, d);
    if (ref) { const r = this.r.get(id) || {}; r[ref] = (r[ref] || 0) + 1; this.r.set(id, r); }
    this.top.set(id, (this.top.get(id) || 0) + 1); this.hits++;
    return { count: this.c.get(k), created };
  }
  async peek(id) { const k = keyFor(id); return this.c.has(k) ? { count: this.c.get(k), created: Number(this.m.get(id)?.created) || null, claimed: !!this.m.get(id)?.kh } : null; }
  async create(id, { kh, now = Date.now() }) {
    const k = keyFor(id); if (this.c.has(k)) return false;
    this.c.set(k, 0); this.m.set(id, { created: now, kh }); this.recent.unshift({ id, at: now }); this.recent.length = Math.min(this.recent.length, 100); return true;
  }
  async claim(id, kh, now = Date.now()) { const k = keyFor(id); if (!this.c.has(k)) return false; const m = this.m.get(id) || {}; if (m.kh) return false; this.m.set(id, { created: m.created || null, ...m, kh }); return true; }
  async keyState(id, kh) { const m = this.m.get(id); if (!m?.kh) return "unclaimed"; return m.kh === kh ? "ok" : "bad"; }
  async stats(id, days = 30) { const p = await this.peek(id); if (!p) return null; return { id, ...p, daily: lastDays(days, this.d.get(id)), refs: topRefs(this.r.get(id)) }; }
  async reset(id) { this.c.set(keyFor(id), 0); this.d.delete(id); this.r.delete(id); this.top.delete(id); }
  async remove(id) { this.c.delete(keyFor(id)); this.d.delete(id); this.r.delete(id); this.m.delete(id); this.top.delete(id); }
  async rotate(id, kh) { const m = this.m.get(id) || {}; this.m.set(id, { ...m, kh }); }
  async rateLimit(key, limit, windowSec) {
    const now = Date.now(); const e = this.rl.get(key);
    if (!e || e.until < now) { this.rl.set(key, { n: 1, until: now + windowSec * 1000 }); return true; }
    e.n++; return e.n <= limit;
  }
  async total() { return this.c.size; }
  async firstRun(now) { return (this.first ??= now); }
  async admin() { return { ids: this.c.size, hits: this.hits, top: [...this.top].sort((a, b) => b[1] - a[1]).slice(0, 20), recent: this.recent.slice(0, 20) }; }
}

export class UpstashStore {
  constructor(url, token) { this.url = url; this.token = token; }
  async post(path, body) {
    const r = await fetch(this.url + path, { method: "POST", headers: { Authorization: `Bearer ${this.token}`, "Content-Type": "application/json" }, body: JSON.stringify(body) });
    if (!r.ok) throw new Error(`redis ${r.status}`);
    return r.json();
  }
  async cmd(args) { return (await this.post("", args)).result; }
  async pipe(cmds) { return (await this.post("/pipeline", cmds)).map((x) => x.result); }
  async hit(id, { day = dayOf(), ref = "", ip = "", limit = 120, bump = true } = {}) {
    const k = keyFor(id);
    try {
      const res = await this.cmd(["EVAL", HIT_LUA, "7", k, "d:" + id, "r:" + id, `rl:h:${ip}:${id}`, "top", "stat:hits", "m:" + id, day, ref, String(limit), bump ? "1" : "0", id]);
      const n = Number(res?.[0]);
      if (n >= 0) return { count: n, created: Number(res[1]) || null };
      if (n === -1) return null;
      throw new Error("unexpected script reply");
    } catch {
      // Scripts unavailable or misbehaving: keep counting with plain commands so embeds never break.
      if ((await this.cmd(["EXISTS", k])) !== 1) return null;
      if (!bump) return { count: Number(await this.cmd(["GET", k])) || 0, created: null };
      const n = Number(await this.cmd(["INCR", k]));
      try { await this.pipe([["HINCRBY", "d:" + id, day, "1"], ["ZINCRBY", "top", "1", id], ["INCR", "stat:hits"]]); } catch { /* stats are best effort */ }
      return { count: n, created: null };
    }
  }
  async peek(id) {
    const [c, created, kh] = await this.pipe([["GET", keyFor(id)], ["HGET", "m:" + id, "created"], ["HGET", "m:" + id, "kh"]]);
    return c == null ? null : { count: Number(c) || 0, created: Number(created) || null, claimed: !!kh };
  }
  async create(id, { kh, now = Date.now() }) {
    const ok = (await this.cmd(["SET", keyFor(id), "0", "NX"])) === "OK"; if (!ok) return false;
    await this.pipe([["HSET", "m:" + id, "created", String(now), "kh", kh], ["INCR", "stat:ids"], ["LPUSH", "recent", JSON.stringify({ id, at: now })], ["LTRIM", "recent", "0", "99"]]);
    return true;
  }
  async claim(id, kh, now = Date.now()) {
    if ((await this.cmd(["EXISTS", keyFor(id)])) !== 1) return false;
    const won = (await this.cmd(["HSETNX", "m:" + id, "kh", kh])) === 1;
    if (won) await this.cmd(["HSETNX", "m:" + id, "created", String(now)]);
    return won;
  }
  async keyState(id, kh) { const cur = await this.cmd(["HGET", "m:" + id, "kh"]); if (!cur) return "unclaimed"; return cur === kh ? "ok" : "bad"; }
  async stats(id, days = 30) {
    const [c, created, d, r] = await this.pipe([["GET", keyFor(id)], ["HGET", "m:" + id, "created"], ["HGETALL", "d:" + id], ["HGETALL", "r:" + id]]);
    if (c == null) return null;
    return { id, count: Number(c) || 0, created: Number(created) || null, daily: lastDays(days, toObj(d)), refs: topRefs(toObj(r)) };
  }
  async reset(id) { await this.pipe([["SET", keyFor(id), "0"], ["DEL", "d:" + id], ["DEL", "r:" + id], ["ZREM", "top", id]]); }
  async remove(id) { await this.pipe([["DEL", keyFor(id)], ["DEL", "d:" + id], ["DEL", "r:" + id], ["DEL", "m:" + id], ["ZREM", "top", id]]); }
  async rotate(id, kh) { await this.cmd(["HSET", "m:" + id, "kh", kh]); }
  async rateLimit(key, limit, windowSec) {
    const n = Number(await this.cmd(["INCR", key]));
    if (n === 1) await this.cmd(["EXPIRE", key, String(windowSec)]);
    return n <= limit;
  }
  async total() { return Number(await this.cmd(["GET", "stat:ids"])) || 0; }
  async firstRun(now) { await this.cmd(["SET", "meta:first_run", String(now), "NX"]); return Number(await this.cmd(["GET", "meta:first_run"])) || now; }
  async admin() {
    const [ids, hits, top, recent] = await this.pipe([["GET", "stat:ids"], ["GET", "stat:hits"], ["ZREVRANGE", "top", "0", "19", "WITHSCORES"], ["LRANGE", "recent", "0", "19"]]);
    const t = []; for (let i = 0; i < (top || []).length; i += 2) t.push([top[i], Number(top[i + 1])]);
    return { ids: Number(ids) || 0, hits: Number(hits) || 0, top: t, recent: (recent || []).map((x) => { try { return JSON.parse(x); } catch { return null; } }).filter(Boolean) };
  }
}

let store;
export function createStore(env = process.env) {
  const url = env.UPSTASH_REDIS_REST_URL || env.KV_REST_API_URL;
  const token = env.UPSTASH_REDIS_REST_TOKEN || env.KV_REST_API_TOKEN;
  return url && token ? new UpstashStore(url, token) : new MemoryStore();
}
export const getStore = () => (store ??= createStore());
export const _internals = { MemoryStore, UpstashStore };
