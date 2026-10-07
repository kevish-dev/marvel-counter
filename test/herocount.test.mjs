import test from "node:test";
import assert from "node:assert/strict";
import { renderCounter, renderNotFound, HERO_IDS } from "../src/render.js";
import { normalizeId, parseOptions } from "../src/util.js";
import { _internals } from "../src/store.js";

test("renders 7 heroes in the chosen order, valid structure", () => {
  const svg = renderCounter(1234567, { heroes: ["spidey", "iron-man"], digits: 4 });
  assert.equal((svg.match(/data-hero=/g) || []).length, 4);
  assert.deepEqual([...svg.matchAll(/data-hero="([^"]+)"/g)].map((m) => m[1]), ["spider-man", "iron-man", "spider-man", "iron-man"]);
  assert.ok(svg.startsWith("<svg") && svg.endsWith("</svg>"));
});
test("default lineup has all heroes", () => assert.equal(HERO_IDS.length, 7));
test("digits clamp 3..9 and pad", () => {
  assert.equal((renderCounter(5, { digits: 99 }).match(/data-hero=/g) || []).length, 9);
  assert.equal((renderCounter(5, { digits: 1 }).match(/data-hero=/g) || []).length, 3);
});
test("theme auto adds media query", () => assert.match(renderCounter(1, { theme: "auto" }), /prefers-color-scheme:light/));
test("theme clear has no background plate", () => { const c = renderCounter(1, { theme: "clear" }); assert.ok(!c.includes('rx="14"')); assert.equal(parseOptions(new URLSearchParams("theme=clear")).theme, "clear"); });
test("ids: valid, invalid, reserved", () => {
  assert.equal(normalizeId("Kevish-Dev").id, "kevish-dev");
  for (const bad of ["", "-x", "a b", "a/b", "../x", "x".repeat(40), "<script>", "api"]) assert.equal(normalizeId(bad).ok, false, bad);
});
test("parseOptions sanitises", () => {
  const o = parseOptions(new URLSearchParams("theme=evil&digits=abc&heroes=thor,,hulk"));
  assert.deepEqual(o, { theme: "dark", digits: 7, heroes: ["thor", "hulk"] });
});
test("not-found svg escapes id", () => assert.ok(!renderNotFound('"><script>').includes("<script>")));
test("memory store: create, hit, peek, legacy alias, rate limit", async () => {
  const s = new _internals.MemoryStore();
  assert.equal(await s.hit("nobody"), null);
  assert.equal(await s.create("alice"), true);
  assert.equal(await s.create("alice"), false);
  assert.equal(await s.hit("alice"), 1);
  assert.equal(await s.hit("alice"), 2);
  assert.equal(await s.peek("alice"), 2);
  assert.equal(await s.peek("kevish-dev"), 0); // legacy key preserved
  const r = []; for (let i = 0; i < 4; i++) r.push(await s.rateLimit("k", 3, 60));
  assert.deepEqual(r, [true, true, true, false]);
});
