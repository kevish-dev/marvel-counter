import { rects, headBase, body, eyes } from "../art.js";

export const CLASSIC = [
  { name: "spider-man",
    draw(ctx) {
      const g = ctx.layer();
      const red = "#d3202e", dark = "#8e1218", blue = "#1b3f94";
      body(g, { suit: red, glove: red, legs: blue, boots: red, lower: blue, neck: red });
      headBase(g, red);
      g.rect(11, 0, 12, 3, dark); g.rect(6, 3, 9, 3, dark); g.rect(14, 3, 17, 3, dark);
      g.rect(7, 8, 10, 8, dark); g.rect(13, 8, 16, 8, dark); g.rect(11, 8, 12, 10, dark);
      g.rect(7, 4, 11, 7, "#0b0b10"); g.rect(12, 4, 16, 7, "#0b0b10");
      g.rect(8, 5, 10, 6, "#f4f7fb"); g.rect(13, 5, 15, 6, "#f4f7fb");
      ctx.over(`<g class="web">${rects([[20, 3, 1, 17]], "#f4f7fb")}</g>` +
        `<g class="webtip">${rects([[19, 2], [21, 2], [20, 1], [20, 3], [19, 4], [21, 4]], "#f4f7fb")}</g>` +
        `<g class="blink">${rects([[8, 5, 3, 2], [13, 5, 3, 2]], "#0b0b10")}</g>`);
    } },
  { name: "iron-man",
    draw(ctx) {
      const g = ctx.layer();
      const red = "#b3151b", gold = "#e0b13a";
      body(g, { suit: red, glove: gold, legs: red, boots: gold, lower: gold, neck: gold });
      headBase(g, red);
      g.rect(8, 3, 15, 10, gold); g.rect(9, 10, 14, 10, gold);
      g.rect(6, 4, 7, 8, red); g.rect(16, 4, 17, 8, red);
      g.rect(8, 5, 10, 5, "#d8f6ff"); g.rect(13, 5, 15, 5, "#d8f6ff");
      g.rect(10, 8, 13, 8, "#a8802a");
      g.rect(10, 0, 13, 2, "#8a0f14");
      ctx.over(
        `<g class="pulse fast">${rects([[8, 5, 3, 1], [13, 5, 3, 1]], "#ffffff")}</g>` +
        `<g class="glow">${rects([[2, 20, 4, 4], [18, 20, 4, 4]], "#7fe9ff", ' opacity=".35"')}${rects([[3, 21, 2, 2], [19, 21, 2, 2]], "#d8f6ff")}</g>` +
        `<g class="flame f1">${rects([[7, 35, 3, 1], [8, 36, 1, 2]], "#ffb12e")}${rects([[8, 35, 1, 1]], "#fff2b0")}</g>` +
        `<g class="flame f2">${rects([[14, 35, 3, 1], [15, 36, 1, 2]], "#ffb12e")}${rects([[15, 35, 1, 1]], "#fff2b0")}</g>`);
    } },
  { name: "captain-america",
    draw(ctx) {
      const g = ctx.layer();
      const blue = "#1d3f9c", red = "#c8202f", skin = "#f0c29a";
      body(g, { suit: blue, glove: red, legs: blue, boots: red, lower: red, skin });
      headBase(g, blue);
      g.rect(8, 4, 15, 10, skin); g.rect(9, 10, 14, 10, skin);
      g.rect(7, 5, 7, 8, skin); g.rect(16, 5, 16, 8, skin);
      g.rect(11, 1, 12, 1, "#fff"); g.rect(10, 2, 13, 2, "#fff"); g.px(10, 3, "#fff"); g.px(13, 3, "#fff");
      g.rect(5, 2, 5, 3, "#fff"); g.rect(18, 2, 18, 3, "#fff");
      eyes(g, "#1c2330", 5);
      g.rect(10, 9, 13, 9, "#c98f6a");
      const s = ctx.layer("shield");
      const ring = (cx, cy, r, c) => { for (let y = -r; y <= r; y++) for (let x = -r; x <= r; x++) if (x * x + y * y <= r * r + 1) s.px(cx + x, cy + y, c); };
      ring(2, 27, 3, red); ring(2, 27, 2, "#e8eaee"); ring(2, 27, 1, blue); s.px(2, 27, "#fff");
      ctx.over(`<g class="glint">${rects([[3, 25], [2, 26], [1, 27]], "#ffffff")}</g>` +
        `<g class="twinkle">${rects([[11, 1, 2, 1], [10, 2, 4, 1]], "#ffe66b")}</g>`);
    } },
  { name: "thor",
    draw(ctx) {
      const cape = ctx.layer("cape");
      cape.rect(2, 14, 21, 33, "#c02a2a"); cape.rect(2, 31, 21, 33, "#a82222");
      const g = ctx.layer();
      const gray = "#3a4350", hair = "#f2d56b", skin = "#f0c29a";
      body(g, { suit: gray, glove: "#6b4a2b", legs: "#2c333d", boots: "#6b4a2b", lower: "#c9d1d9", skin });
      g.rect(8, 13, 15, 14, "#c9d1d9");
      headBase(g, skin);
      g.rect(5, 2, 18, 3, hair); g.rect(6, 0, 17, 1, hair); g.rect(7, 0, 16, 0, hair);
      g.rect(5, 4, 6, 11, hair); g.rect(17, 4, 18, 11, hair);
      g.rect(7, 4, 16, 4, hair); g.rect(7, 4, 8, 5, hair); g.rect(15, 4, 16, 5, hair);
      g.rect(8, 9, 15, 10, "#e3c35a");
      g.rect(7, 1, 16, 1, "#c9d1d9"); g.rect(3, 0, 4, 2, "#e5e9ee"); g.rect(19, 0, 20, 2, "#e5e9ee");
      eyes(g, "#3c78c8", 5);
      ctx.over(`<g class="bolt">${rects([[21, 0, 2, 1], [20, 1, 2, 1], [21, 2, 2, 1], [19, 3, 3, 1], [20, 4, 1, 1], [19, 5, 2, 1]], "#fff6a0")}</g>` +
        `<g class="bolt" style="animation-delay:-1.7s">${rects([[1, 2, 2, 1], [0, 3, 2, 1], [1, 4, 2, 1], [0, 5, 1, 1]], "#fff6a0")}</g>`);
    } },
  { name: "hulk",
    draw(ctx) {
      const g = ctx.layer();
      const green = "#5aa84a", shade = "#3f7d36", purple = "#6b3fa0";
      body(g, { suit: green, sleeve: green, glove: green, legs: purple, boots: green, lower: purple, skin: green });
      g.rect(2, 13, 2, 22, green); g.rect(21, 13, 21, 22, green);
      g.rect(2, 21, 4, 23, shade); g.rect(19, 21, 21, 23, shade);
      g.rect(7, 29, 10, 30, "#4d2f80"); g.rect(13, 29, 16, 30, "#4d2f80");
      const h = ctx.layer("bob");
      headBase(h, green);
      h.rect(6, 0, 17, 2, "#1b1b1b"); h.rect(7, 3, 8, 3, "#1b1b1b"); h.rect(15, 3, 16, 3, "#1b1b1b"); h.rect(9, 3, 9, 3, "#1b1b1b");
      h.rect(7, 4, 10, 4, shade); h.rect(13, 4, 16, 4, shade);
      h.rect(8, 5, 9, 6, "#f4f7fb"); h.rect(14, 5, 15, 6, "#f4f7fb"); h.px(9, 6, "#1b2a17"); h.px(14, 6, "#1b2a17");
      h.rect(9, 9, 14, 9, "#1b2a17"); h.rect(10, 9, 10, 9, "#f4f7fb"); h.rect(13, 9, 13, 9, "#f4f7fb");
      h.rect(8, 10, 15, 10, shade);
      ctx.over(`<g class="rage">${rects([[8, 5, 2, 2], [14, 5, 2, 2]], "#ff4a3a")}</g>` +
        `<g class="pulse">${rects([[2, 21, 3, 3], [19, 21, 3, 3]], "#b8ff8a", ' opacity=".5"')}</g>`);
    } },
  { name: "black-panther",
    draw(ctx) {
      const g = ctx.layer();
      const blk = "#232331", purple = "#7a4cff", silver = "#bfc7d5";
      body(g, { suit: blk, glove: blk, legs: blk, boots: "#171722", lower: blk, neck: blk });
      g.rect(9, 11, 14, 11, silver); g.rect(10, 12, 13, 12, silver);
      g.rect(3, 22, 4, 22, silver); g.rect(19, 22, 20, 22, silver);
      g.rect(6, 33, 10, 34, "#171722"); g.rect(13, 33, 17, 34, "#171722");
      g.rect(6, 34, 10, 34, silver); g.rect(13, 34, 17, 34, silver);
      g.rect(8, 2, 15, 2, blk); g.rect(6, 3, 17, 8, blk); g.rect(7, 9, 16, 9, blk); g.rect(8, 10, 15, 10, blk);
      g.px(7, 1, blk); g.rect(7, 2, 8, 2, blk); g.px(6, 2, blk); g.px(7, 0, blk);
      g.px(16, 1, blk); g.rect(15, 2, 16, 2, blk); g.px(17, 2, blk); g.px(16, 0, blk);
      g.rect(9, 5, 10, 5, "#f4f7fb"); g.rect(8, 6, 10, 6, "#f4f7fb");
      g.rect(13, 5, 14, 5, "#f4f7fb"); g.rect(13, 6, 15, 6, "#f4f7fb");
      ctx.over(`<g class="pulse">${rects([[3, 14, 1, 6], [20, 14, 1, 6], [7, 25, 1, 6], [16, 25, 1, 6], [11, 13, 2, 1]], purple)}</g>` +
        `<g class="pulse fast">${rects([[9, 5, 2, 1], [8, 6, 3, 1], [13, 5, 2, 1], [13, 6, 3, 1]], "#d6c8ff")}</g>`);
    } },
  { name: "doctor-strange",
    draw(ctx) {
      const cape = ctx.layer("cape");
      cape.rect(2, 12, 21, 33, "#a31f27"); cape.rect(2, 30, 21, 33, "#8a181f");
      const g = ctx.layer();
      const blue = "#26478f", skin = "#e8b48b", hair = "#2a2018";
      body(g, { suit: blue, glove: "#c89a3a", legs: "#1c3470", boots: "#6b4a2b", lower: "#c89a3a", skin });
      g.rect(4, 10, 7, 14, "#a31f27"); g.rect(16, 10, 19, 14, "#a31f27"); g.rect(5, 9, 6, 9, "#a31f27"); g.rect(17, 9, 18, 9, "#a31f27");
      headBase(g, skin);
      g.rect(6, 0, 17, 2, hair); g.rect(7, 3, 16, 3, hair); g.rect(8, 0, 15, 0, hair);
      g.rect(6, 3, 7, 6, "#c9ccd3"); g.rect(16, 3, 17, 6, "#c9ccd3");
      g.rect(9, 9, 14, 10, hair); g.rect(11, 9, 12, 9, skin);
      eyes(g, "#1c2330", 5);
      g.rect(8, 4, 10, 4, hair); g.rect(13, 4, 15, 4, hair);
      const ring = [];
      for (let i = 0; i < 8; i++) { const a = (i * Math.PI) / 4; ring.push([Math.round(3.5 + Math.cos(a) * 3.2 - 0.5), Math.round(21.5 + Math.sin(a) * 3.2 - 0.5)]); }
      ctx.over(`<g class="ring">${rects(ring, "#ff9a2e")}${rects([[3, 21, 1, 1]], "#ffd27a")}</g>` +
        `<g class="ring rev">${rects([[3, 19], [5, 21], [3, 23], [1, 21]], "#ffd27a")}</g>`);
    } },
];
