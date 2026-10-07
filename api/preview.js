import { renderCounter } from "../src/render.js";
import { parseOptions, sendSvg } from "../src/util.js";

// GET /preview.svg?theme=&digits=&heroes=&n=1234567  -> stateless sample, safe to cache
export default function handler(req, res) {
  const url = new URL(req.url, "http://x");
  const n = Math.min(999999999, Math.max(0, parseInt(url.searchParams.get("n") || "1234567", 10) || 0));
  sendSvg(res, renderCounter(n, parseOptions(url.searchParams)), { cache: true, head: req.method === "HEAD" });
}
