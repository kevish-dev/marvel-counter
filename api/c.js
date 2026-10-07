import { renderCounter, renderNotFound } from "../src/render.js";
import { getStore } from "../src/store.js";
import { normalizeId, parseOptions, sendSvg, sendJson } from "../src/util.js";

// GET /c/:id.svg   -> animated counter, +1 per GET (HEAD and ?peek=1 only read)
// GET /c/:id.json  -> { id, count } read-only, CORS open
export default async function handler(req, res) {
  const url = new URL(req.url, "http://x");
  const wantJson = url.searchParams.get("format") === "json";
  const n = normalizeId(url.searchParams.get("id"));
  const opts = parseOptions(url.searchParams);
  if (!n.ok) return wantJson ? sendJson(res, 400, { error: n.error }) : sendSvg(res, renderNotFound("invalid", opts.theme === "light" ? "light" : "dark"), { cache: true });

  const store = getStore();
  const increment = !wantJson && req.method === "GET" && !url.searchParams.has("peek");
  let count = null;
  try { count = increment ? await store.hit(n.id) : await store.peek(n.id); }
  catch { /* storage hiccup: fall through to not-found rather than a broken image */ return wantJson ? sendJson(res, 503, { error: "storage unavailable" }) : sendSvg(res, renderNotFound(n.id), { cache: false }); }

  if (count == null) return wantJson ? sendJson(res, 404, { error: "id not found" }) : sendSvg(res, renderNotFound(n.id, opts.theme === "light" ? "light" : "dark"), { cache: false, head: req.method === "HEAD" });
  if (wantJson) return sendJson(res, 200, { id: n.id, count, by: "https://kevish.dev" });
  return sendSvg(res, renderCounter(count, opts), { head: req.method === "HEAD" });
}
