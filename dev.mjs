import http from "node:http";
import fs from "node:fs";
import cHandler from "./api/c.js";
import createHandler from "./api/create.js";
import previewHandler from "./api/preview.js";

// Local dev server that mimics the vercel.json rewrites. In-memory storage unless UPSTASH_* env is set.
const port = process.env.PORT || 3000;
const send = (res, code, type, body) => { res.statusCode = code; res.setHeader("Content-Type", type); res.end(body); };
http.createServer((req, res) => {
  const u = new URL(req.url, "http://x");
  let m;
  if ((m = u.pathname.match(/^\/c\/([^/]+)\.svg$/))) { u.searchParams.set("id", m[1]); req.url = u.pathname + "?" + u.searchParams; return cHandler(req, res); }
  if ((m = u.pathname.match(/^\/c\/([^/]+)\.json$/))) { u.searchParams.set("id", m[1]); u.searchParams.set("format", "json"); req.url = u.pathname + "?" + u.searchParams; return cHandler(req, res); }
  if (u.pathname === "/count.svg") { u.searchParams.set("id", "kevish-dev"); req.url = u.pathname + "?" + u.searchParams; return cHandler(req, res); }
  if (u.pathname === "/preview.svg") return previewHandler(req, res);
  if (u.pathname === "/api/create") return createHandler(req, res);
  if (u.pathname === "/") return send(res, 200, "text/html; charset=utf-8", fs.readFileSync(new URL("./public/index.html", import.meta.url)));
  if (u.pathname === "/pricing") return send(res, 200, "text/html; charset=utf-8", fs.readFileSync(new URL("./public/pricing.html", import.meta.url)));
  if (u.pathname === "/site.css") return send(res, 200, "text/css", fs.readFileSync(new URL("./public/site.css", import.meta.url)));
  if (u.pathname.startsWith("/fonts/") && !u.pathname.includes("..")) { try { return send(res, 200, "font/woff2", fs.readFileSync(new URL("./public" + u.pathname, import.meta.url))); } catch {} }
  send(res, 404, "text/plain", "not found");
}).listen(port, () => console.log(`http://localhost:${port}/`));
