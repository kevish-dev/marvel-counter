import { renderCounter } from "../src/render.js";
import { parseOptions, sendSvg } from "../src/util.js";
import { gate } from "../src/license.js";

// GET /preview.svg?theme=&digits=&heroes=&n=1234567  -> stateless sample, safe to cache
export default async function handler(req, res) {
  const url = new URL(req.url, "http://x");
  if (!(await gate(req, res))) return;
  const n = Math.min(999999999, Math.max(0, parseInt(url.searchParams.get("n") || "1234567", 10) || 0));
  sendSvg(res, renderCounter(n, parseOptions(url.searchParams)), { cache: true, head: req.method === "HEAD" });
}
