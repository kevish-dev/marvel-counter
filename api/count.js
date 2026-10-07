import { renderCounter } from "../src/render.js";

const KEY = process.env.COUNTER_KEY || "visits";
const URL_ = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
const TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;

// Fallback used when no Redis is configured (local dev) or Redis is unreachable.
const mem = (globalThis.__marvelCounter ??= { n: 0 });

async function redis(cmd) {
  const r = await fetch(URL_, {
    method: "POST",
    headers: { Authorization: `Bearer ${TOKEN}`, "Content-Type": "application/json" },
    body: JSON.stringify(cmd),
  });
  if (!r.ok) throw new Error(`redis ${r.status}`);
  const { result } = await r.json();
  return Number(result) || 0;
}

async function bump(increment) {
  if (!URL_ || !TOKEN) { if (increment) mem.n++; return mem.n; }
  try {
    mem.n = await redis(increment ? ["INCR", KEY] : ["GET", KEY]);
  } catch { /* serve the last known value rather than a broken image */ }
  return mem.n;
}

export default async function handler(req, res) {
  const url = new URL(req.url, "http://x");
  const theme = url.searchParams.get("theme") === "light" ? "light" : "dark";
  // Only real GETs count; HEAD requests and ?peek=1 just read.
  const count = await bump(req.method === "GET" && !url.searchParams.has("peek"));
  const svg = renderCounter(count, { theme });
  res.statusCode = 200;
  res.setHeader("Content-Type", "image/svg+xml; charset=utf-8");
  // GitHub proxies images through camo; these headers make it refetch every time.
  res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate, max-age=0, s-maxage=0");
  res.setHeader("CDN-Cache-Control", "no-store");
  res.setHeader("Vercel-CDN-Cache-Control", "no-store");
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("Content-Security-Policy", "default-src 'none'; style-src 'unsafe-inline'");
  res.end(req.method === "HEAD" ? undefined : svg);
}
