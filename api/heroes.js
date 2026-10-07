import { HERO_CATALOG } from "../src/render.js";
import { PACK_IDS } from "../src/util.js";

// GET /api/heroes -> every hero (id, label, pack, trick) and the available packs
export default function handler(req, res) {
  res.statusCode = 200;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "public, max-age=3600, s-maxage=86400");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.end(JSON.stringify({ packs: PACK_IDS, heroes: HERO_CATALOG, by: "https://kevish.dev" }));
}
