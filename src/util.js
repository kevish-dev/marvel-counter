import { HERO_IDS } from "./render.js";

export const ID_RE = /^[a-z0-9][a-z0-9_-]{0,38}$/;
const RESERVED = new Set(["api", "c", "www", "admin", "root", "herocount", "preview", "count", "create", "static", "public", "assets", "about", "help", "null", "undefined"]);

export function normalizeId(raw) {
  const id = String(raw ?? "").trim().toLowerCase();
  if (!ID_RE.test(id)) return { ok: false, error: "Use 1-39 letters, numbers, - or _ (must start with a letter or number)." };
  if (RESERVED.has(id)) return { ok: false, error: "That id is reserved." };
  return { ok: true, id };
}

export function parseOptions(searchParams) {
  const t = searchParams.get("theme");
  const theme = t === "light" || t === "auto" || t === "clear" ? t : "dark";
  const d = parseInt(searchParams.get("digits") || "7", 10);
  const digits = Number.isFinite(d) ? Math.min(9, Math.max(3, d)) : 7;
  const heroes = (searchParams.get("heroes") || "").split(",").map((x) => x.trim()).filter(Boolean).slice(0, 9);
  return { theme, digits, heroes };
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
