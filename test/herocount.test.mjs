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
test("default lineup is the classic seven; catalog has all packs", () => { assert.equal(HERO_IDS.length, 25); assert.equal((renderCounter(1).match(/data-hero=/g) || []).length, 7); });
test("digits clamp 3..9 and pad", () => {
  assert.equal((renderCounter(5, { digits: 99 }).match(/data-hero=/g) || []).length, 9);
  assert.equal((renderCounter(5, { digits: 1 }).match(/data-hero=/g) || []).length, 3);
});
test("theme auto adds media query", () => assert.match(renderCounter(1, { theme: "auto" }), /prefers-color-scheme:light/));
test("theme clear has no background plate", () => { const c = renderCounter(1, { theme: "clear" }); assert.ok(!c.includes('rx="14"')); assert.equal(parseOptions(new URLSearchParams("theme=clear")).theme, "clear"); });
test("every counter carries the kevish.dev credit, in every theme", () => {
  for (const theme of ["dark", "light", "auto", "clear"]) {
    const svg = renderCounter(42, { theme, digits: 3 });
    assert.match(svg, /data-credit="kevish\.dev"/, theme);
    assert.match(svg, /made by Kevish/, theme);
  }
});
test("ids: valid, invalid, reserved", () => {
  assert.equal(normalizeId("Kevish-Dev").id, "kevish-dev");
  for (const bad of ["", "-x", "a b", "a/b", "../x", "x".repeat(40), "<script>", "api"]) assert.equal(normalizeId(bad).ok, false, bad);
});
test("parseOptions sanitises", () => {
  const o = parseOptions(new URLSearchParams("theme=evil&digits=abc&heroes=thor,,hulk"));
  assert.equal(o.theme, "dark"); assert.equal(o.digits, 7); assert.deepEqual(o.heroes, ["thor", "hulk"]);
});
test("not-found svg escapes id", () => assert.ok(!renderNotFound('"><script>').includes("<script>")));

import crypto from "node:crypto";
import { signKey, verifyKey, isOfficial, licenseStatus, _resetLicenseCache, TRIAL_DAYS, PUBLIC_KEY_PEM } from "../src/license.js";
const kp = crypto.generateKeyPairSync("ed25519");
const priv = kp.privateKey.export({ type: "pkcs8", format: "pem" });
const pub = kp.publicKey.export({ type: "spki", format: "pem" });

test("license key: valid, tampered, expired, wrong key, garbage", () => {
  const good = signKey({ sub: "Acme", plan: "standard" }, priv);
  assert.equal(verifyKey(good, Date.now(), pub).ok, true);
  assert.equal(verifyKey(good, Date.now(), pub).licensee, "Acme");
  const [t, p, s] = good.split(".");
  const forged = `${t}.${Buffer.from(JSON.stringify({ v: 1, sub: "Evil", plan: "standard" })).toString("base64url")}.${s}`;
  assert.equal(verifyKey(forged, Date.now(), pub).ok, false);
  const old = signKey({ sub: "Acme", exp: new Date(Date.now() - 1000).toISOString() }, priv);
  assert.equal(verifyKey(old, Date.now(), pub).reason, "expired");
  assert.equal(verifyKey(good).ok, false); // not signed by the embedded public key
  for (const bad of ["", "x", "hc1.a", "hc1.a.b.c", null]) assert.equal(verifyKey(bad, Date.now(), pub).ok, false);
  assert.ok(PUBLIC_KEY_PEM.includes("BEGIN PUBLIC KEY"));
});
test("official deployment is recognised, forks are not", () => {
  assert.equal(isOfficial({ VERCEL_GIT_REPO_OWNER: "kevish-dev", VERCEL_GIT_REPO_SLUG: "marvel-counter" }), true);
  assert.equal(isOfficial({ VERCEL_GIT_REPO_OWNER: "someone", VERCEL_GIT_REPO_SLUG: "marvel-counter" }), false);
  assert.equal(isOfficial({}), false);
});
test("evaluation: 7 days then expired, key licenses, official exempt", async () => {
  const s = new _internals.MemoryStore();
  const t0 = 1_700_000_000_000, day = 86400000;
  const base = { env: {}, store: s, noCache: true };
  assert.equal((await licenseStatus({ ...base, now: t0 })).mode, "trial");
  assert.equal((await licenseStatus({ ...base, now: t0 + 3 * day })).daysLeft, 4);
  const after = await licenseStatus({ ...base, now: t0 + TRIAL_DAYS * day + 1 });
  assert.equal(after.ok, false); assert.equal(after.mode, "expired");
  // an invalid key does not rescue an expired copy
  assert.equal((await licenseStatus({ ...base, env: { HEROCOUNT_LICENSE_KEY: "hc1.bad.bad" }, now: t0 + 9 * day })).ok, false);
  assert.equal((await licenseStatus({ ...base, env: { VERCEL_GIT_REPO_OWNER: "kevish-dev", VERCEL_GIT_REPO_SLUG: "marvel-counter" }, now: t0 + 99 * day })).mode, "official");
  _resetLicenseCache();
});
