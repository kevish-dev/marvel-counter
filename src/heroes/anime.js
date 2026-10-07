import { rects, headBase, body, eyes } from "../art.js";

export const ANIME = [
  { name: "goku", label: "Goku", pack: "anime", trick: "Ki aura flares",
    draw(ctx) {
      const g = ctx.layer();
      const gi = "#f08a24", blue = "#1f4fd1", skin = "#f0c29a", hair = "#14141a";
      body(g, { suit: gi, sleeve: gi, glove: blue, legs: gi, boots: blue, lower: blue, skin });
      headBase(g, skin);
      g.rect(5, 1, 18, 3, hair); g.rect(5, 4, 6, 6, hair); g.rect(17, 4, 18, 6, hair);
      g.px(6, 0, hair); g.px(9, 0, hair); g.px(12, 0, hair); g.px(15, 0, hair); g.px(17, 0, hair); g.px(4, 2, hair); g.px(19, 2, hair);
      g.rect(8, 4, 9, 4, hair); g.rect(14, 4, 15, 4, hair);
      eyes(g, "#1c2330", 5); g.rect(10, 9, 13, 9, "#c98f6a");
      ctx.over(`<g class="flicker">${rects([[4, 0, 1, 12], [19, 0, 1, 12], [3, 13, 1, 10], [20, 13, 1, 10]], "#ffd23f", ' opacity=".7"')}</g>`);
    } },
  { name: "naruto", label: "Naruto", pack: "anime", trick: "A swirling sphere spins",
    draw(ctx) {
      const g = ctx.layer();
      const orange = "#f08a24", blk = "#1b1b22", skin = "#f0c29a", hair = "#f7d046";
      body(g, { suit: orange, glove: skin, legs: orange, boots: "#1f4fd1", lower: blk, skin });
      g.rect(3, 13, 4, 15, blk); g.rect(19, 13, 20, 15, blk);
      headBase(g, skin);
      g.rect(5, 0, 18, 1, hair); g.px(4, 1, hair); g.px(19, 1, hair); g.px(6, -1, hair);
      g.rect(6, 2, 17, 3, "#3a5ad9"); g.rect(9, 2, 14, 3, "#c9d1d9");
      g.rect(5, 4, 6, 6, hair); g.rect(17, 4, 18, 6, hair);
      eyes(g, "#2f6bff", 5);
      g.px(7, 7, "#b07a5a"); g.px(7, 8, "#b07a5a"); g.px(16, 7, "#b07a5a"); g.px(16, 8, "#b07a5a");
      g.rect(10, 9, 13, 9, "#c98f6a");
      const ring = []; for (let i = 0; i < 8; i++) { const a = (i * Math.PI) / 4; ring.push([Math.round(20.5 + Math.cos(a) * 2.6 - 0.5), Math.round(21.5 + Math.sin(a) * 2.6 - 0.5)]); }
      ctx.over(`<g class="ring">${rects(ring, "#7df9ff")}${rects([[20, 21]], "#e8fbff")}</g>`);
    } },
  { name: "luffy", label: "Luffy", pack: "anime", trick: "Straw hat tips",
    draw(ctx) {
      const g = ctx.layer();
      const red = "#d6313a", skin = "#e9b994", hair = "#14141a";
      body(g, { suit: red, sleeve: skin, glove: skin, legs: "#2f6bd6", boots: "#c9a66b", lower: "#e0b13a", skin });
      headBase(g, skin);
      g.rect(6, 3, 17, 4, hair); g.rect(6, 5, 6, 6, hair); g.rect(17, 5, 17, 6, hair);
      eyes(g, "#1c2330", 6); g.rect(8, 8, 9, 8, "#a8664a");
      g.rect(9, 9, 14, 9, "#7a3020");
      ctx.over(`<g class="leafsway">${rects([[8, 0, 8, 2], [4, 2, 16, 1]], "#f2cc5a")}${rects([[8, 1, 8, 1]], "#c8202f")}</g>`);
    } },
  { name: "saitama", label: "Saitama", pack: "anime", trick: "Head shines, cape sways",
    draw(ctx) {
      const cape = ctx.layer("cape"); cape.rect(2, 13, 21, 33, "#f4f4f2"); cape.rect(2, 31, 21, 33, "#dcdcd8");
      const g = ctx.layer();
      const yellow = "#f2c230", skin = "#f2cfa8";
      body(g, { suit: yellow, glove: "#d6313a", legs: yellow, boots: "#d6313a", lower: "#14141a", skin });
      headBase(g, skin);
      g.px(8, 5, "#14141a"); g.px(15, 5, "#14141a"); g.rect(10, 9, 13, 9, "#b07a5a");
      g.rect(7, 4, 9, 4, "#c99a78"); g.rect(14, 4, 16, 4, "#c99a78");
      ctx.over(`<g class="twinkle">${rects([[9, 1, 2, 1], [9, 2]], "#ffffff")}</g>`);
    } },
  { name: "tanjiro", label: "Tanjiro", pack: "anime", trick: "Water swirls, earrings sway",
    draw(ctx) {
      const g = ctx.layer();
      const grn = "#1f8a5a", blk = "#14141a", skin = "#f0c29a", hair = "#5a1a1a";
      body(g, { suit: blk, sleeve: grn, glove: skin, legs: blk, boots: "#f4f4f2", lower: "#f4f4f2", skin });
      for (let y = 13; y <= 20; y++) for (const x of [3, 4, 19, 20]) if ((x + y) % 2) g.px(x, y, blk);
      headBase(g, skin);
      g.rect(6, 0, 17, 3, hair); g.rect(6, 4, 6, 7, hair); g.rect(17, 4, 17, 7, hair); g.px(8, 4, hair); g.px(15, 4, hair);
      g.px(9, 3, "#b03a3a"); g.px(10, 3, "#b03a3a");
      eyes(g, "#7a1f1f", 5); g.rect(10, 9, 13, 9, "#c98f6a");
      const ring = []; for (let i = 0; i < 8; i++) { const a = (i * Math.PI) / 4; ring.push([Math.round(3.5 + Math.cos(a) * 3.2 - 0.5), Math.round(21.5 + Math.sin(a) * 3.2 - 0.5)]); }
      ctx.over(`<g class="ring">${rects(ring, "#4da3ff")}</g><g class="twinkle">${rects([[5, 8, 1, 2], [18, 8, 1, 2]], "#ffffff")}</g>`);
    } },
  { name: "sailor-moon", label: "Sailor Moon", pack: "anime", trick: "Tiara sparkles",
    draw(ctx) {
      const g = ctx.layer();
      const hair = "#f7d046", skin = "#f6d2b5", navy = "#1f3fa8";
      body(g, { suit: "#f4f4f2", glove: "#f4f4f2", legs: skin, boots: "#d6313a", lower: navy, skin });
      headBase(g, skin);
      g.rect(6, 1, 17, 3, hair); g.rect(5, 4, 6, 7, hair); g.rect(17, 4, 18, 7, hair);
      g.rect(3, 0, 6, 2, hair); g.rect(17, 0, 20, 2, hair);
      g.rect(2, 8, 4, 30, hair); g.rect(19, 8, 21, 30, hair);
      g.rect(9, 2, 14, 2, "#e0b13a"); g.px(11, 1, "#d6313a"); g.px(12, 1, "#d6313a");
      eyes(g, "#2f6bff", 5); g.rect(10, 9, 13, 9, "#d98a7a");
      g.rect(7, 11, 16, 12, navy);
      ctx.over(`<g class="twinkle">${rects([[11, 1], [12, 0]], "#ffffff")}</g><g class="twinkle" style="animation-delay:-.75s">${rects([[13, 1]], "#ffffff")}</g>`);
    } },
  { name: "totoro", label: "Totoro", pack: "anime", trick: "Blinks, ears twitch",
    draw(ctx) {
      const g = ctx.layer();
      const fur = "#7d8590", belly = "#e8e2d0";
      g.rect(5, 12, 18, 24, fur); g.rect(7, 14, 16, 24, belly);
      g.px(9, 16, "#7d8590"); g.px(11, 16, "#7d8590"); g.px(13, 16, "#7d8590"); g.px(10, 19, "#7d8590"); g.px(12, 19, "#7d8590");
      g.rect(3, 13, 4, 22, fur); g.rect(19, 13, 20, 22, fur);
      g.rect(6, 25, 17, 30, fur); g.rect(5, 31, 10, 34, "#5c636d"); g.rect(13, 31, 18, 34, "#5c636d");
      g.rect(7, 2, 16, 2, fur); g.rect(5, 3, 18, 10, fur); g.rect(6, 11, 17, 11, fur);
      g.rect(7, 6, 9, 7, "#f4f7fb"); g.rect(14, 6, 16, 7, "#f4f7fb"); g.px(8, 6, "#14141a"); g.px(15, 6, "#14141a");
      g.rect(11, 7, 12, 7, "#14141a"); g.rect(9, 9, 14, 9, "#3a3f47");
      g.px(4, 8, "#3a3f47"); g.px(3, 9, "#3a3f47"); g.px(19, 8, "#3a3f47"); g.px(20, 9, "#3a3f47");
      g.rect(15, 0, 16, 2, fur);
      ctx.over(`<g class="ear">${rects([[7, 0, 2, 3]], fur)}</g><g class="blink">${rects([[7, 6, 3, 2], [14, 6, 3, 2]], fur)}</g>`);
    } },
];
