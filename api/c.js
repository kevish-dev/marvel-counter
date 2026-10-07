import { renderCounter, renderBadge, renderNotFound, isMilestone, formatCount } from "../src/render.js";
import { getStore, dayOf } from "../src/store.js";
import { normalizeId, parseOptions, sendSvg, sendJson, isBot, refHost, clientIp } from "../src/util.js";
import { gate } from "../src/license.js";

// GET /c/:id.svg          animated counter, +1 per GET (HEAD, ?peek=1 and bots only read)
// GET /c/:id.badge.svg    compact shields-style badge, counts like the counter
// GET /c/:id.json         { id, count, ... } read-only, CORS open
// GET /c/:id.shields.json shields.io endpoint schema, read-only
export default async function handler(req, res) {
  const url = new URL(req.url, "http://x");
  const kind = url.searchParams.get("format") || "svg"; // svg | json | shields | badge
  const asData = kind === "json" || kind === "shields";
  const n = normalizeId(url.searchParams.get("id"));
  const opts = parseOptions(url.searchParams);
  const lightTheme = opts.theme === "light" ? "light" : "dark";
  if (!(await gate(req, res, { kind: asData ? "json" : "svg", theme: lightTheme }))) return;
  if (!n.ok) return asData ? sendJson(res, 400, { error: n.error }) : sendSvg(res, renderNotFound("invalid", lightTheme), { cache: true });

  const store = getStore();
  const bump = !asData && req.method === "GET" && !url.searchParams.has("peek") && !isBot(req.headers["user-agent"]);
  let r = null;
  try {
    if (asData) r = await store.peek(n.id);
    else r = await store.hit(n.id, { day: dayOf(), ref: refHost(req), ip: clientIp(req), bump });
  } catch {
    return asData ? sendJson(res, 503, { error: "storage unavailable" }) : sendSvg(res, renderNotFound(n.id), { cache: false });
  }
  if (!r) return asData ? sendJson(res, 404, { error: "id not found" }) : sendSvg(res, renderNotFound(n.id, lightTheme), { cache: false, head: req.method === "HEAD" });

  if (kind === "json") return sendJson(res, 200, { id: n.id, count: r.count, created: r.created ? new Date(r.created).toISOString() : null, claimed: !!r.claimed, by: "https://kevish.dev" });
  if (kind === "shields") return sendJson(res, 200, { schemaVersion: 1, label: opts.label, message: formatCount(r.count, opts.format === "plain" ? "sep" : opts.format, 7), color: (opts.color || "#e5484d").slice(1) });
  if (kind === "badge") return sendSvg(res, renderBadge(r.count, { label: opts.label, format: opts.format, color: opts.color, theme: lightTheme }), { head: req.method === "HEAD" });
  const celebrate = opts.celebrate || (opts.milestone && isMilestone(r.count));
  return sendSvg(res, renderCounter(r.count, { ...opts, since: opts.since && r.created ? r.created : undefined, celebrate }), { head: req.method === "HEAD" });
}
