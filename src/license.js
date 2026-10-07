// License gate for self-hosted copies. See LICENSE section 3-5.
//  - the official deployment (kevish-dev's Vercel project) is always allowed
//  - a valid license key (HEROCOUNT_LICENSE_KEY) is allowed
//  - otherwise there is a 7 day evaluation from the first request this copy ever served
//  - after that, counters and the API answer 402 "license required"
// This is a speed bump plus a clear signal, not DRM: anyone can edit this file.
// The license itself (LICENSE) is what requires the credit and the key. The credit is never keyed off.
import crypto from "node:crypto";
import { getStore } from "./store.js";

export const TRIAL_DAYS = 7;
const DAY = 86400000;
export const CONTACT = "https://kevish.dev";

// Ed25519 public key. The matching private key stays with the licensor and signs keys via scripts/issue-license.mjs.
export const PUBLIC_KEY_PEM = `-----BEGIN PUBLIC KEY-----
MCowBQYDK2VwAyEA3a0CJRD1K/iv0ZcM3PcYWca0b5ZULdWcYFizaJoiyOQ=
-----END PUBLIC KEY-----
`;

const b64u = (b) => Buffer.from(b).toString("base64url");

// key format: hc1.<base64url(JSON payload)>.<base64url(ed25519 signature of "hc1.<payload>")>
export function signKey(payload, privateKeyPem) {
  const body = "hc1." + b64u(JSON.stringify({ v: 1, ...payload }));
  const sig = crypto.sign(null, Buffer.from(body), privateKeyPem);
  return body + "." + b64u(sig);
}

export function verifyKey(key, now = Date.now(), publicKeyPem = PUBLIC_KEY_PEM) {
  try {
    const [tag, payload, sig, extra] = String(key || "").trim().split(".");
    if (tag !== "hc1" || !payload || !sig || extra !== undefined) return { ok: false, reason: "malformed" };
    const good = crypto.verify(null, Buffer.from(`${tag}.${payload}`), publicKeyPem, Buffer.from(sig, "base64url"));
    if (!good) return { ok: false, reason: "bad signature" };
    const p = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
    if (p.exp && now > Date.parse(p.exp)) return { ok: false, reason: "expired", licensee: p.sub };
    return { ok: true, licensee: p.sub, plan: p.plan || "standard", exp: p.exp };
  } catch { return { ok: false, reason: "invalid" }; }
}

export function isOfficial(env = process.env) {
  const owner = String(env.VERCEL_GIT_REPO_OWNER || "").toLowerCase();
  const slug = String(env.VERCEL_GIT_REPO_SLUG || "").toLowerCase();
  return owner === "kevish-dev" && (slug === "marvel-counter" || slug === "herocount");
}

let cache = { until: 0, status: null };

export async function licenseStatus({ env = process.env, store, now = Date.now(), noCache = false } = {}) {
  if (!noCache && cache.status && cache.until > now) return cache.status;
  let status;
  if (isOfficial(env)) status = { ok: true, mode: "official" };
  else if (env.HEROCOUNT_LICENSE_KEY) {
    const v = verifyKey(env.HEROCOUNT_LICENSE_KEY, now);
    status = v.ok ? { ok: true, mode: "licensed", licensee: v.licensee } : { ok: false, mode: "invalid-key", reason: v.reason };
  }
  if (!status || !status.ok) {
    // fall back to the evaluation window (an invalid key does not extend or shorten it)
    let first;
    try { first = await (store || getStore()).firstRun(now); } catch { first = now; }
    const left = TRIAL_DAYS - (now - first) / DAY;
    const trial = left > 0 ? { ok: true, mode: "trial", daysLeft: Math.ceil(left) } : { ok: false, mode: "expired", reason: status?.reason };
    status = trial;
  }
  if (!noCache) cache = { status, until: now + (status.mode === "trial" ? 60_000 : 300_000) };
  return status;
}
export const _resetLicenseCache = () => { cache = { until: 0, status: null }; };

const NOTICE = (theme = "dark") => {
  const light = theme === "light";
  const bg = light ? "#f6f8fa" : "#0d1117", fg = light ? "#1f2328" : "#c9d1d9", sub = light ? "#57606a" : "#8b949e";
  return `<svg xmlns="http://www.w3.org/2000/svg" width="640" height="120" viewBox="0 0 640 120" role="img" aria-label="HeroCount: license required">` +
    `<rect width="640" height="120" rx="14" fill="${bg}"/>` +
    `<text x="320" y="50" text-anchor="middle" font-family="ui-monospace,Menlo,monospace" font-size="17" fill="${fg}">HeroCount evaluation ended: a license is required</text>` +
    `<text x="320" y="80" text-anchor="middle" font-family="ui-monospace,Menlo,monospace" font-size="14" fill="${sub}">Get one at kevish.dev</text></svg>`;
};

// Returns true if the request may proceed. Otherwise it has already answered 402.
export async function gate(req, res, { kind = "svg", theme = "dark" } = {}) {
  const s = await licenseStatus();
  res.setHeader("X-HeroCount-License", s.mode + (s.daysLeft ? `; ${s.daysLeft}d left` : ""));
  if (s.ok) return true;
  res.statusCode = 402;
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("X-Made-By", "Kevish (https://kevish.dev)");
  if (kind === "json") {
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    res.end(JSON.stringify({ error: "license required", detail: "The 7-day evaluation of this self-hosted copy has ended.", contact: CONTACT }));
  } else {
    res.setHeader("Content-Type", "image/svg+xml; charset=utf-8");
    res.end(NOTICE(theme));
  }
  return false;
}
