import { rects, headBase, body, eyes } from "../art.js";

const orbit = (cx, cy, r, n = 6, off = 0) => {
  const out = [];
  for (let i = 0; i < n; i++) { const a = off + (i * 2 * Math.PI) / n; out.push([Math.round(cx + Math.cos(a) * r - 0.5), Math.round(cy + Math.sin(a) * r - 0.5)]); }
  return out;
};

export const MARVEL2 = [
  { name: "scarlet-witch", label: "Scarlet Witch", pack: "marvel", trick: "Red energy orbits her hand",
    draw(ctx) {
      const g = ctx.layer();
      const suit = "#a3131c", hair = "#7a2a1c", skin = "#f0c29a";
      body(g, { suit, glove: "#1b1b1b", legs: "#232323", boots: "#7d0f16", lower: "#232323", skin });
      headBase(g, skin);
      g.rect(5, 0, 18, 2, hair); g.rect(5, 3, 6, 13, hair); g.rect(17, 3, 18, 13, hair); g.rect(7, 3, 16, 3, hair);
      g.rect(8, 4, 9, 4, hair); g.rect(14, 4, 15, 4, hair);
      g.rect(8, 1, 15, 1, "#c8202f"); g.px(9, 0, "#c8202f"); g.px(11, 0, "#c8202f"); g.px(12, 0, "#c8202f"); g.px(14, 0, "#c8202f");
      g.rect(7, 12, 16, 12, "#7d0f16");
      eyes(g, "#1c2330", 5);
      g.rect(10, 9, 13, 9, "#c46a5a");
      ctx.over(`<g class="ring">${rects(orbit(20.5, 21.5, 3.2), "#ff4a5a")}${rects([[20, 21]], "#ffd0d4")}</g>` +
        `<g class="pulse fast">${rects([[8, 5, 2, 2], [14, 5, 2, 2]], "#ff4a5a")}</g>`);
    } },
  { name: "loki", label: "Loki", pack: "marvel", trick: "His outline flickers like an illusion",
    draw(ctx) {
      const cape = ctx.layer("cape");
      cape.rect(2, 13, 21, 33, "#14513a"); cape.rect(2, 31, 21, 33, "#0f3f2d");
      const g = ctx.layer();
      const gold = "#e0b13a", skin = "#e6c9b0", hair = "#14141a", green = "#1f6b4a";
      body(g, { suit: green, glove: "#c89a3a", legs: "#14141a", boots: "#14141a", lower: gold, skin });
      headBase(g, skin);
      g.rect(6, 0, 17, 2, hair); g.rect(5, 3, 6, 10, hair); g.rect(17, 3, 18, 10, hair); g.rect(7, 3, 16, 3, hair);
      g.rect(7, 1, 16, 1, gold); g.rect(11, 0, 12, 0, gold);
      g.px(5, 3, gold); g.px(4, 2, gold); g.px(4, 1, gold); g.px(5, 0, gold);
      g.px(18, 3, gold); g.px(19, 2, gold); g.px(19, 1, gold); g.px(18, 0, gold);
      eyes(g, "#3fd39a", 5);
      g.px(11, 9, "#a8665a"); g.px(12, 9, "#a8665a"); g.px(13, 8, "#a8665a");
      ctx.over(`<g class="flicker">${rects([[1, 4, 1, 9], [22, 4, 1, 9], [2, 14, 1, 10], [21, 14, 1, 10]], "#7dffb8", ' opacity=".5"')}</g>` +
        `<g class="pulse">${rects([[1, 19, 3, 3]], "#7dffb8", ' opacity=".6"')}${rects([[2, 20]], "#e8fff3")}</g>`);
    } },
  { name: "deadpool", label: "Deadpool", pack: "marvel", trick: "Squints, and a katana catches the light",
    draw(ctx) {
      const sw = ctx.layer();
      for (let i = 0; i < 5; i++) { sw.px(3 + i, 5 + i, "#6b7280"); sw.px(20 - i, 5 + i, "#6b7280"); }
      sw.rect(2, 4, 3, 4, "#14141a"); sw.rect(20, 4, 21, 4, "#14141a");
      const g = ctx.layer();
      const red = "#c1121f", blk = "#14141a";
      body(g, { suit: red, glove: blk, legs: red, boots: blk, lower: blk, neck: red });
      g.rect(7, 25, 7, 30, blk); g.rect(16, 25, 16, 30, blk);
      headBase(g, red);
      g.rect(7, 4, 10, 7, blk); g.rect(13, 4, 16, 7, blk);
      g.rect(11, 0, 12, 1, "#8f0d17"); g.rect(11, 8, 12, 10, "#8f0d17");
      ctx.over(`<g class="squint">${rects([[8, 5, 3, 2], [13, 5, 3, 2]], "#f4f7fb")}</g>` +
        `<g class="twinkle">${rects([[7, 9], [3, 4]], "#ffffff")}</g>` +
        `<g class="twinkle" style="animation-delay:-.7s">${rects([[16, 9], [20, 4]], "#ffffff")}</g>`);
    } },
  { name: "groot", label: "Groot", pack: "marvel", trick: "Leaves sway and a bud blooms",
    draw(ctx) {
      const g = ctx.layer();
      const bark = "#7a5230", dark = "#5b3c22", moss = "#4f8f3a";
      body(g, { suit: "#6b4a2b", sleeve: bark, glove: dark, legs: bark, boots: dark, lower: dark, skin: bark, neck: dark });
      g.rect(2, 13, 2, 22, bark); g.rect(21, 13, 21, 22, bark);
      g.rect(7, 29, 10, 30, dark); g.rect(13, 29, 16, 30, dark);
      g.rect(6, 31, 10, 34, "#4a301b"); g.rect(13, 31, 17, 34, "#4a301b");
      headBase(g, bark);
      g.rect(8, 1, 8, 9, dark); g.rect(15, 1, 15, 9, dark); g.rect(11, 2, 11, 4, dark); g.rect(7, 7, 9, 7, dark);
      g.rect(6, 5, 7, 5, moss); g.rect(16, 7, 17, 7, moss);
      eyes(g, "#101010", 5); g.px(8, 5, "#e8fff0"); g.px(14, 5, "#e8fff0");
      g.rect(10, 9, 13, 9, "#2b1a0e");
      ctx.over(`<g class="leafsway">${rects([[10, 0, 2, 2], [12, 0, 2, 1], [9, 1, 1, 1], [14, 1, 1, 1]], "#4caf50")}</g>` +
        `<g class="sprout">${rects([[16, 1, 1, 3]], "#4caf50")}${rects([[16, 0], [17, 0]], "#ff8fb1")}</g>`);
    } },
];
