import crypto from "node:crypto";
import { HERO_IDS } from "./render.js";

export const ID_RE = /^[a-z0-9][a-z0-9_-]{0,38}$/;
const RESERVED = new Set(["api", "c", "www", "admin", "root", "herocount", "preview", "count", "create", "static", "public", "assets", "about", "help", "null", "undefined"]);

export function normalizeId(raw) {
  const id = String(raw ?? "").trim().toLowerCase();
  if (!ID_RE.test(id)) return { ok: false, error: "Use 1-39 letters, numbers, - or _ (must start with a letter or number)." };
  if (RESERVED.has(id)) return { ok: false, error: "That id is reserved." };
  return { ok: true, id };
}

export const PACK_IDS = ["classic", "marvel", "dc", "anime", "retro", "critters"];
export function parseOptions(searchParams) {
  const t = searchParams.get("theme");
  const theme = t === "light" || t === "auto" || t === "clear" ? t : "dark";
  const d = parseInt(searchParams.get("digits") || "7", 10);
  const digits = Number.isFinite(d) ? Math.min(9, Math.max(3, d)) : 7;
  const heroes = (searchParams.get("heroes") || "").split(",").map((x) => x.trim()).filter(Boolean).slice(0, 9);
  const f = searchParams.get("format");
  const format = f === "sep" || f === "compact" ? f : "plain";
  const p = searchParams.get("pack");
  const pack = PACK_IDS.includes(p) ? p : undefined;
  return {
    theme, digits, heroes, format, pack,
    since: searchParams.get("since") === "1",
    milestone: searchParams.get("milestone") !== "0",
    celebrate: searchParams.get("celebrate") === "1",
    label: (searchParams.get("label") || "visitors").slice(0, 18),
    color: searchParams.get("color") ? "#" + searchParams.get("color").replace(/[^0-9a-f]/gi, "").slice(0, 6) : undefined,
  };
}

// Link-preview, crawler and monitoring traffic should see the image but not inflate the count.
const BOT_RE = /bot|crawl|spider|slurp|preview|headless|python-requests|curl|wget|httpclient|monitor|uptime|pingdom|lighthouse|facebookexternalhit|embedly|whatsapp|telegram|discord|slack/i;
export const isBot = (ua) => { const u = String(ua || ""); return !/github-camo/i.test(u) && BOT_RE.test(u); };

export function refHost(req) {
  try { const h = new URL(String(req.headers.referer || req.headers.referrer || "")).hostname.toLowerCase(); return /^[a-z0-9.-]{3,60}$/.test(h) ? h : ""; } catch { return ""; }
}

export async function readBody(req) {
  let b = req.body;
  if (typeof b === "string") { try { b = JSON.parse(b); } catch { b = {}; } }
  if (!b && req.on) b = await new Promise((ok) => { let d = ""; req.on("data", (c) => (d += c)); req.on("end", () => { try { ok(JSON.parse(d)); } catch { ok({}); } }); });
  return b || {};
}

export function adminOk(req, env = process.env) {
  const want = env.ADMIN_TOKEN; if (!want) return "unset";
  const got = String(req.headers.authorization || "").replace(/^Bearer\s+/i, "");
  const a = Buffer.from(got), b = Buffer.from(want);
  return a.length === b.length && crypto.timingSafeEqual(a, b) ? "ok" : "bad";
}

export function sendSvg(res, svg, { cache = false, head = false } = {}) {
  res.statusCode = 200;
  res.setHeader("Content-Type", "image/svg+xml; charset=utf-8");
  if (cache) {
    res.setHeader("Cache-Control", "public, max-age=3600, s-maxage=86400");
  } else {
    // GitHub proxies images through camo; these make it refetch every time.
    res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate, max-age=0, s-maxage=0");
    res.setHeader("CDN-Cache-Control", "no-store");
    res.setHeader("Vercel-CDN-Cache-Control", "no-store");
    res.setHeader("Pragma", "no-cache");
    res.setHeader("Expires", "0");
  }
  res.setHeader("X-Made-By", "Kevish (https://kevish.dev)");
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("Content-Security-Policy", "default-src 'none'; style-src 'unsafe-inline'");
  res.end(head ? undefined : svg);
}

export function sendJson(res, status, body) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("X-Made-By", "Kevish (https://kevish.dev)");
  res.end(JSON.stringify(body));
}

export const clientIp = (req) => String(req.headers["x-forwarded-for"] || req.socket?.remoteAddress || "unknown").split(",")[0].trim();
export { HERO_IDS };
