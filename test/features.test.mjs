import test from "node:test";
import assert from "node:assert/strict";
import { renderCounter, renderBadge, formatCount, compactNumber, sinceLabel, isMilestone, PACKS, HERO_CATALOG, resolveHero } from "../src/render.js";
import { parseOptions, isBot, refHost } from "../src/util.js";
import { _internals, hashKey } from "../src/store.js";
import cH from "../api/c.js";
import createH from "../api/create.js";
import manageH from "../api/manage.js";
import adminH from "../api/admin.js";
import heroesH from "../api/heroes.js";

const call = async (handler, { method = "GET", url = "/", headers = {}, body } = {}) => {
  const res = { statusCode: 200, h: {}, setHeader(k, v) { this.h[k.toLowerCase()] = v; }, end(b) { this.body = b; } };
  await handler({ method, url, headers: { "x-forwarded-for": "9.9.9.9", ...headers }, body, socket: {} }, res);
  return res;
};
const json = (r) => JSON.parse(r.body);
const mk = async (id) => json(await call(createH, { method: "POST", body: { id } }));

test("every hero in every pack renders valid, unique-id art", async () => {
  const ids = new Set();
  for (const h of HERO_CATALOG) { assert.ok(!ids.has(h.id), "dup " + h.id); ids.add(h.id); }
  assert.equal(HERO_CATALOG.length, 25);
  assert.deepEqual(Object.fromEntries(Object.entries(PACKS).map(([k, v]) => [k, v.length])), { classic: 7, marvel: 11, retro: 7, critters: 7 });
  const dom = (await import("node:util")).default; // sanity: parse as XML via regex balance
  for (const h of HERO_CATALOG) {
    const svg = renderCounter(3, { digits: 3, heroes: [h.id] });
    assert.ok(svg.includes(`data-hero="${h.id}"`));
    assert.equal((svg.match(/<g[ >]/g) || []).length, (svg.match(/<\/g>/g) || []).length, h.id);
  }
  assert.equal(resolveHero("wanda").name, "scarlet-witch");
});
test("pack option cycles that pack", () => {
  const svg = renderCounter(1234, { digits: 4, pack: "critters" });
  assert.deepEqual([...svg.matchAll(/data-hero="([^"]+)"/g)].map((m) => m[1]), ["cat", "dog", "fox", "panda"]);
});
test("number formats", () => {
  assert.equal(compactNumber(999), "999"); assert.equal(compactNumber(1234), "1.2K"); assert.equal(compactNumber(12500), "13K"); assert.equal(compactNumber(1200000), "1.2M"); assert.equal(compactNumber(2000), "2K");
  assert.equal(formatCount(1234567, "sep", 7), "1,234,567"); assert.equal(formatCount(5, "plain", 4), "0005");
  assert.equal(formatCount(1234567890, "sep", 7), "1B".length ? compactNumber(1234567890) : "");
  assert.equal((renderCounter(1234, { format: "compact" }).match(/data-hero=/g) || []).length, 4); // "1.2K"
});
test("since label and milestone window", () => {
  assert.equal(sinceLabel(Date.UTC(2026, 9, 7)), "since oct 2026");
  assert.ok((renderCounter(5, { since: Date.UTC(2026, 9, 7) }).match(/<path /g) || []).length > (renderCounter(5).match(/<path /g) || []).length);
  assert.equal(isMilestone(99), false); assert.equal(isMilestone(100), true); assert.equal(isMilestone(129), true); assert.equal(isMilestone(130), false); assert.equal(isMilestone(1000), true);
  assert.match(renderCounter(100, { celebrate: true }), /class="celebrate"/);
  assert.ok(!/class="celebrate"/.test(renderCounter(100)));
});
test("badge is valid-looking, credited, escapes label", () => {
  const b = renderBadge(1204, { label: '<x>"' });
  assert.match(b, /data-credit="kevish\.dev"/); assert.ok(!b.includes("<x>")); assert.match(b, /1,204/);
});
test("parseOptions: format, pack, since, milestone, color", () => {
  const o = parseOptions(new URLSearchParams("format=compact&pack=retro&since=1&milestone=0&color=ff00aa"));
  assert.equal(o.format, "compact"); assert.equal(o.pack, "retro"); assert.equal(parseOptions(new URLSearchParams("pack=evil")).pack, undefined); assert.equal(o.since, true); assert.equal(o.milestone, false); assert.equal(o.color, "#ff00aa");
  assert.equal(parseOptions(new URLSearchParams("format=weird")).format, "plain");
});
test("bot filter keeps camo, drops crawlers", () => {
  assert.equal(isBot("github-camo (a1b2c3)"), false); assert.equal(isBot("Mozilla/5.0 (compatible; Googlebot/2.1)"), true); assert.equal(isBot("curl/8.0"), true); assert.equal(isBot("Mozilla/5.0 Chrome/120"), false);
  assert.equal(refHost({ headers: { referer: "https://Example.com/page" } }), "example.com"); assert.equal(refHost({ headers: {} }), "");
});

test("create returns a one-time key; stats need it; wrong key rejected", async () => {
  const c = await mk("feat-alice");
  assert.match(c.key, /^hck_/); assert.equal(c.count, 0);
  assert.equal((await call(createH, { method: "POST", body: { id: "feat-alice" } })).statusCode, 409);
  for (let i = 0; i < 3; i++) await call(cH, { url: "/c?id=feat-alice", headers: { "user-agent": "github-camo", referer: "https://blog.example.org/post" } });
  const ok = await call(manageH, { method: "POST", body: { id: "feat-alice", key: c.key, action: "stats" } });
  assert.equal(ok.statusCode, 200);
  const s = json(ok);
  assert.equal(s.count, 3); assert.equal(s.daily.length, 30); assert.equal(s.daily.at(-1).count, 3); assert.deepEqual(s.refs, [["blog.example.org", 3]]);
  assert.equal((await call(manageH, { method: "POST", body: { id: "feat-alice", key: "nope", action: "stats" } })).statusCode, 403);
  assert.equal(JSON.stringify(json(await call(cH, { url: "/c?id=feat-alice&format=json" }))).includes(c.key), false);
});
test("bots and peeks do not count; json/shields/badge shapes", async () => {
  const c = await mk("feat-bob");
  await call(cH, { url: "/c?id=feat-bob", headers: { "user-agent": "Googlebot/2.1" } });
  await call(cH, { url: "/c?id=feat-bob&peek=1" });
  await call(cH, { method: "HEAD", url: "/c?id=feat-bob" });
  assert.equal(json(await call(cH, { url: "/c?id=feat-bob&format=json" })).count, 0);
  await call(cH, { url: "/c?id=feat-bob", headers: { "user-agent": "Mozilla/5.0" } });
  const j = json(await call(cH, { url: "/c?id=feat-bob&format=json" }));
  assert.equal(j.count, 1); assert.equal(j.claimed, true); assert.ok(j.created);
  const sh = json(await call(cH, { url: "/c?id=feat-bob&format=shields&label=views&color=00ff00" }));
  assert.deepEqual(sh, { schemaVersion: 1, label: "views", message: "1", color: "00ff00" });
  const badge = await call(cH, { url: "/c?id=feat-bob&format=badge" });
  assert.match(badge.h["content-type"], /svg/); assert.match(badge.body, /data-credit/);
  assert.equal(json(await call(cH, { url: "/c?id=feat-bob&format=json" })).count, 2); // badge counted
  assert.equal(c.key.length > 20, true);
});
test("milestone: the 100th view celebrates, the 130th does not", async () => {
  await mk("feat-mile");
  let last;
  for (let i = 0; i < 100; i++) last = await call(cH, { url: "/c?id=feat-mile&digits=3", headers: { "x-forwarded-for": "1.1.1.1" } });
  assert.match(last.body, /class="celebrate"/);
  const off = await call(cH, { url: "/c?id=feat-mile&digits=3&milestone=0", headers: { "x-forwarded-for": "1.1.1.2" } });
  assert.ok(!/class="celebrate"/.test(off.body));
});
test("reset, rotate (old key dies), delete", async () => {
  const c = await mk("feat-carol");
  await call(cH, { url: "/c?id=feat-carol" });
  const act = (action, key) => call(manageH, { method: "POST", body: { id: "feat-carol", key, action } });
  assert.deepEqual(json(await act("reset", c.key)), { ok: true, count: 0 });
  const r = json(await act("rotate", c.key));
  assert.equal((await act("stats", c.key)).statusCode, 403);
  assert.equal((await act("stats", r.key)).statusCode, 200);
  assert.equal((await act("delete", r.key)).statusCode, 200);
  assert.equal((await call(cH, { url: "/c?id=feat-carol&format=json" })).statusCode, 404);
});
test("claim: legacy ids can be claimed once, protected ids never", async () => {
  const store = (await import("../src/store.js")).getStore();
  await store.create("feat-legacy", { kh: "" }); // simulate an id created before edit keys (empty hash = unclaimed)
  const m = store.m.get("feat-legacy"); delete m.kh;
  const c1 = await call(manageH, { method: "POST", body: { id: "feat-legacy", action: "claim" } });
  assert.equal(c1.statusCode, 200);
  assert.equal((await call(manageH, { method: "POST", body: { id: "feat-legacy", action: "claim" } })).statusCode, 409);
  assert.equal((await call(manageH, { method: "POST", body: { id: "kevish-dev", action: "claim" } })).statusCode, 403);
  assert.equal((await call(manageH, { method: "POST", body: { id: "feat-legacy", key: json(c1).key, action: "stats" } })).statusCode, 200);
});
test("per-id per-ip rate limit stops count inflation", async () => {
  const s = new _internals.MemoryStore(); await s.create("rl", { kh: "x" });
  let n = 0; for (let i = 0; i < 150; i++) n = (await s.hit("rl", { ip: "7.7.7.7", limit: 120 })).count;
  assert.equal(n, 120);
  assert.equal((await s.hit("rl", { ip: "8.8.8.8", limit: 120 })).count, 121); // another ip still counts
});
test("admin: unset, wrong token, ok", async () => {
  delete process.env.ADMIN_TOKEN;
  assert.equal((await call(adminH)).statusCode, 503);
  process.env.ADMIN_TOKEN = "s3cret-test";
  assert.equal((await call(adminH, { headers: { authorization: "Bearer nope" } })).statusCode, 401);
  const ok = await call(adminH, { headers: { authorization: "Bearer s3cret-test" } });
  assert.equal(ok.statusCode, 200); const a = json(ok); assert.ok(a.ids >= 1 && a.hits >= 1 && Array.isArray(a.top) && Array.isArray(a.recent));
  delete process.env.ADMIN_TOKEN;
});
test("heroes catalog endpoint", async () => {
  const r = json(await call(heroesH));
  assert.equal(r.heroes.length, 25); assert.deepEqual(r.packs, ["classic", "marvel", "retro", "critters"]);
});

test("upstash adapter: parses script replies, falls back to plain commands, builds pipelines", async () => {
  const seen = [];
  const realFetch = globalThis.fetch;
  let mode = "script";
  globalThis.fetch = async (url, init) => {
    const body = JSON.parse(init.body); seen.push([url, body]);
    const reply = (r) => ({ ok: true, json: async () => r });
    if (url.endsWith("/pipeline")) return reply(body.map(() => ({ result: 1 })));
    if (body[0] === "EVAL") { if (mode === "script") return reply({ result: [42, "1700000000000"] }); return { ok: false, status: 500, json: async () => ({}) }; }
    if (body[0] === "EXISTS") return reply({ result: 1 });
    if (body[0] === "INCR") return reply({ result: 43 });
    return reply({ result: null });
  };
  try {
    const u = new _internals.UpstashStore("https://r.example", "t");
    const h = await u.hit("some-id", { day: "2026-10-07", ref: "x.dev", ip: "1.2.3.4" });
    assert.deepEqual(h, { count: 42, created: 1700000000000 });
    const ev = seen.find(([, b]) => b[0] === "EVAL")[1];
    assert.equal(ev[2], "7"); assert.equal(ev[3], "c:some-id"); assert.equal(ev[ev.length - 1], "some-id");
    mode = "broken";
    assert.equal((await u.hit("some-id", {})).count, 43); // fell back to EXISTS + INCR
    const p = await u.pipe([["GET", "a"], ["GET", "b"]]);
    assert.deepEqual(p, [1, 1]);
  } finally { globalThis.fetch = realFetch; }
});

import fs from "node:fs";
test("every page: script parses, no em or en dashes, links the shared stylesheet", () => {
  for (const f of ["index", "pricing", "dashboard", "integrations", "admin"]) {
    const h = fs.readFileSync(new URL(`../public/${f}.html`, import.meta.url), "utf8");
    const m = h.match(/<script>([\s\S]*)<\/script>/);
    if (m) new Function(m[1]);
    assert.equal((h.match(/[–—]/g) || []).length, 0, f);
    assert.ok(h.includes('href="/site.css"'), f);
  }
});
test("action script updates markers, is idempotent and fails loudly", async () => {
  const { execFileSync, spawnSync } = await import("node:child_process");
  const os = await import("node:os"); const path = await import("node:path");
  const http = await import("node:http");
  const srv = http.createServer((q, r) => { r.setHeader("content-type", "application/json"); r.end(JSON.stringify({ count: 12345 })); });
  await new Promise((ok) => srv.listen(0, ok));
  const port = srv.address().port;
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "hc-"));
  const f = path.join(dir, "README.md"); fs.writeFileSync(f, "a <!-- herocount:start -->0<!-- herocount:end --> b");
  const env = { ...process.env, HC_ID: "x", HC_HOST: `http://localhost:${port}`, HC_FILE: f, HC_TEMPLATE: "{count}/{compact}" };
  const run = () => new Promise((ok) => { import("node:child_process").then(({ execFile }) => execFile("node", [new URL("../scripts/update-readme.mjs", import.meta.url).pathname], { env }, (e, so) => ok({ code: e?.code ?? 0, so }))); });
  assert.equal((await run()).code, 0);
  assert.equal(fs.readFileSync(f, "utf8"), "a <!-- herocount:start -->12,345/12K<!-- herocount:end --> b");
  assert.match((await run()).so, /already shows/);
  fs.writeFileSync(f, "no markers"); assert.equal((await run()).code, 1);
  srv.close();
});
