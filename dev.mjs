import http from "node:http";
import fs from "node:fs";
import cHandler from "./api/c.js";
import createHandler from "./api/create.js";
import manageHandler from "./api/manage.js";
import adminHandler from "./api/admin.js";
import heroesHandler from "./api/heroes.js";
import previewHandler from "./api/preview.js";

// Local dev server that mimics vercel.json (rewrites + cleanUrls + public/). In-memory storage unless UPSTASH_* env is set.
const port = process.env.PORT || 3000;
const TYPES = { ".html": "text/html; charset=utf-8", ".css": "text/css", ".js": "text/javascript", ".woff2": "font/woff2", ".svg": "image/svg+xml", ".json": "application/json" };

http.createServer((req, res) => {
  const u = new URL(req.url, "http://x");
  const to = (id, format) => { u.searchParams.set("id", id); if (format) u.searchParams.set("format", format); req.url = "/api/c?" + u.searchParams; return cHandler(req, res); };
  let m;
  if ((m = u.pathname.match(/^\/c\/([^/]+)\.badge\.svg$/))) return to(m[1], "badge");
  if ((m = u.pathname.match(/^\/c\/([^/]+)\.shields\.json$/))) return to(m[1], "shields");
  if ((m = u.pathname.match(/^\/c\/([^/]+)\.svg$/))) return to(m[1]);
  if ((m = u.pathname.match(/^\/c\/([^/]+)\.json$/))) return to(m[1], "json");
  if (u.pathname === "/count.svg") return to("kevish-dev");
  if (u.pathname === "/preview.svg") return previewHandler(req, res);
  const api = { "/api/create": createHandler, "/api/manage": manageHandler, "/api/admin": adminHandler, "/api/heroes": heroesHandler }[u.pathname];
  if (api) return api(req, res);
  let file = u.pathname === "/" ? "/index.html" : u.pathname;
  if (!/\.[a-z0-9]+$/.test(file)) file += ".html";
  if (!file.includes("..")) {
    try { const buf = fs.readFileSync(new URL("./public" + file, import.meta.url)); res.setHeader("Content-Type", TYPES[file.slice(file.lastIndexOf("."))] || "application/octet-stream"); return res.end(buf); } catch {}
  }
  res.statusCode = 404; res.setHeader("Content-Type", "text/plain"); res.end("not found");
}).listen(port, () => console.log(`http://localhost:${port}/`));
