#!/usr/bin/env node
// Licensor tool: issue a HeroCount license key.
//   node scripts/issue-license.mjs --to "Acme Inc" [--days 365] [--plan standard] [--private ~/.herocount/license-private.pem]
// Keep the private key secret and backed up. Anyone holding it can mint keys. It must never be committed.
import fs from "node:fs";
import os from "node:os";
import { signKey, verifyKey } from "../src/license.js";

const arg = (n, d) => { const i = process.argv.indexOf("--" + n); return i > 0 ? process.argv[i + 1] : d; };
const to = arg("to");
if (!to) { console.error('usage: issue-license.mjs --to "Licensee" [--days N] [--plan name] [--private path]'); process.exit(1); }
const pem = fs.readFileSync(arg("private", os.homedir() + "/.herocount/license-private.pem"), "utf8");
const days = arg("days");
const payload = { sub: to, plan: arg("plan", "standard"), iat: new Date().toISOString() };
if (days) payload.exp = new Date(Date.now() + Number(days) * 86400000).toISOString();
const key = signKey(payload, pem);
const v = verifyKey(key);
if (!v.ok) { console.error("self-check failed:", v.reason); process.exit(2); }
console.log(key);
console.error(`issued to "${to}"${payload.exp ? `, expires ${payload.exp}` : ", no expiry"}`);
