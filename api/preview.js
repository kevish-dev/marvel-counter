import { renderCounter } from "../src/render.js";
import { parseOptions, sendSvg } from "../src/util.js";
import { gate } from "../src/license.js";

// GET /preview.svg?theme=&digits=&heroes=&pack=&format=&since=1&celebrate=1&n=1234567  -> stateless sample, safe to cache
export default async function handler(req, res) {
  const url = new URL(req.url, "http://x");
  if (!(await gate(req, res))) return;
  const n = Math.min(999999999, Math.max(0, parseInt(url.searchParams.get("n") || "1234567", 10) || 0));
  const o = parseOptions(url.searchParams);
  sendSvg(res, renderCounter(n, { ...o, since: o.since ? Date.UTC(2026, 9, 7) : undefined }), { cache: true, head: req.method === "HEAD" });
}
