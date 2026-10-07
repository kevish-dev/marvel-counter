import http from "node:http";
import fs from "node:fs";
import handler from "./api/count.js";
const port = process.env.PORT || 3000;
http.createServer((req, res) => {
  if (req.url.startsWith("/count.svg") || req.url.startsWith("/api/count")) return handler(req, res);
  if (req.url === "/" ) { res.setHeader("Content-Type","text/html"); return res.end(fs.readFileSync(new URL("./live.html", import.meta.url))); }
  res.statusCode = 404; res.end("not found");
}).listen(port, () => console.log(`http://localhost:${port}/count.svg`));
