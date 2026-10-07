#!/usr/bin/env node
// Replaces the text between <!-- herocount:start --> and <!-- herocount:end --> with the current visitor count.
// Reads HC_ID, HC_FILE (default README.md), HC_HOST (default https://herocount.kevish.dev), HC_TEMPLATE (default "{count}").
import fs from "node:fs";

const id = process.env.HC_ID;
const file = process.env.HC_FILE || "README.md";
const host = (process.env.HC_HOST || "https://herocount.kevish.dev").replace(/\/+$/, "");
const template = process.env.HC_TEMPLATE || "{count}";

if (!/^[a-z0-9][a-z0-9_-]{0,38}$/i.test(id || "")) { console.error("HC_ID is missing or not a valid id"); process.exit(1); }

const compact = (n) => n < 1000 ? String(n) : n < 10000 ? (n / 1000).toFixed(1).replace(/\.0$/, "") + "K" : n < 1e6 ? Math.round(n / 1000) + "K" : (n / 1e6).toFixed(1).replace(/\.0$/, "") + "M";

const r = await fetch(`${host}/c/${encodeURIComponent(id.toLowerCase())}.json`, { headers: { accept: "application/json" } });
if (!r.ok) { console.error(`HeroCount answered ${r.status} for "${id}"`); process.exit(1); }
const { count } = await r.json();
if (!Number.isFinite(count)) { console.error("Unexpected response from HeroCount"); process.exit(1); }

const text = template.replaceAll("{count}", count.toLocaleString("en-US")).replaceAll("{compact}", compact(count));
const src = fs.readFileSync(file, "utf8");
const re = /(<!--\s*herocount:start\s*-->)([\s\S]*?)(<!--\s*herocount:end\s*-->)/;
if (!re.test(src)) { console.error(`No <!-- herocount:start --> ... <!-- herocount:end --> markers found in ${file}`); process.exit(1); }
const out = src.replace(re, (_, a, __, b) => `${a}${text}${b}`);
if (out === src) console.log(`${file} already shows ${text}`);
else { fs.writeFileSync(file, out); console.log(`${file}: visitor count is now ${text}`); }
