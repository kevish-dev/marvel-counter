import { rects, headBase, body, eyes } from "../art.js";

export const DC = [
  { name: "batman", label: "Batman", pack: "dc", trick: "Cape sways, a bat flits past",
    draw(ctx) {
      const cape = ctx.layer("cape"); cape.rect(2, 13, 21, 33, "#1b1e27"); cape.rect(2, 31, 21, 33, "#12141b");
      const g = ctx.layer();
      const cowl = "#2b2f3a", gray = "#6b7280", skin = "#e9b994";
      body(g, { suit: gray, sleeve: gray, glove: cowl, legs: gray, boots: cowl, lower: "#f2c230", neck: cowl });
      g.rect(8, 2, 15, 2, cowl); g.rect(6, 3, 17, 7, cowl); g.rect(7, 8, 16, 8, cowl);
      g.px(7, 0, cowl); g.rect(7, 1, 8, 2, cowl); g.px(16, 0, cowl); g.rect(15, 1, 16, 2, cowl);
      g.rect(8, 8, 15, 10, skin); g.rect(9, 10, 14, 10, skin); g.rect(10, 9, 13, 9, "#b07a5a");
      g.rect(8, 5, 10, 5, "#f4f7fb"); g.rect(13, 5, 15, 5, "#f4f7fb");
      ctx.over(`<g class="scan">${rects([[19, 1, 1, 1], [20, 0, 1, 2], [21, 1, 1, 1], [18, 0], [22, 0]], "#c9d1d9")}</g>`);
    } },
  { name: "superman", label: "Superman", pack: "dc", trick: "Cape sways, eyes flash red",
    draw(ctx) {
      const cape = ctx.layer("cape"); cape.rect(2, 13, 21, 33, "#c8202f"); cape.rect(2, 31, 21, 33, "#a3131c");
      const g = ctx.layer();
      const blue = "#1f4fd1", skin = "#f0c29a", hair = "#14141a";
      body(g, { suit: blue, glove: blue, legs: blue, boots: "#c8202f", lower: "#f2c230", skin });
      headBase(g, skin);
      g.rect(6, 0, 17, 2, hair); g.rect(6, 3, 6, 5, hair); g.rect(17, 3, 17, 5, hair); g.px(11, 3, hair); g.px(10, 4, hair);
      eyes(g, "#1c3a8a", 5); g.rect(10, 9, 13, 9, "#c98f6a");
      ctx.over(`<g class="rage">${rects([[8, 5, 2, 2], [14, 5, 2, 2]], "#ff3b30")}</g>`);
    } },
  { name: "wonder-woman", label: "Wonder Woman", pack: "dc", trick: "Golden lasso spins",
    draw(ctx) {
      const g = ctx.layer();
      const skin = "#e2a77f", hair = "#14141a", gold = "#e0b13a";
      body(g, { suit: "#c8202f", glove: gold, legs: "#1f4fd1", boots: "#c8202f", lower: gold, skin });
      g.rect(6, 33, 10, 33, "#f4f7fb"); g.rect(13, 33, 17, 33, "#f4f7fb");
      headBase(g, skin);
      g.rect(5, 0, 18, 2, hair); g.rect(5, 3, 6, 13, hair); g.rect(17, 3, 18, 13, hair);
      g.rect(7, 2, 16, 2, gold); g.px(11, 1, "#c8202f"); g.px(12, 1, "#c8202f");
      eyes(g, "#1c2330", 5); g.rect(10, 9, 13, 9, "#b0604f");
      const ring = []; for (let i = 0; i < 8; i++) { const a = (i * Math.PI) / 4; ring.push([Math.round(3.5 + Math.cos(a) * 3.2 - 0.5), Math.round(21.5 + Math.sin(a) * 3.2 - 0.5)]); }
      ctx.over(`<g class="ring">${rects(ring, "#ffd23f")}</g><g class="twinkle">${rects([[19, 21], [20, 22]], "#ffffff")}</g>`);
    } },
  { name: "flash", label: "The Flash", pack: "dc", trick: "Speed lines crackle",
    draw(ctx) {
      const g = ctx.layer();
      const red = "#c8202f", gold = "#f2c230", skin = "#f0c29a";
      body(g, { suit: red, glove: red, legs: red, boots: gold, lower: gold, neck: red });
      headBase(g, red);
      g.rect(8, 7, 15, 10, skin); g.rect(9, 10, 14, 10, skin); g.rect(10, 9, 13, 9, "#c98f6a");
      g.rect(8, 4, 15, 6, red); g.rect(8, 5, 10, 5, "#f4f7fb"); g.rect(13, 5, 15, 5, "#f4f7fb");
      g.px(5, 3, gold); g.px(4, 2, gold); g.px(5, 1, gold); g.px(18, 3, gold); g.px(19, 2, gold); g.px(18, 1, gold);
      ctx.over(`<g class="flicker">${rects([[0, 14, 3, 1], [1, 18, 2, 1], [0, 26, 3, 1], [1, 30, 2, 1]], "#ffd23f")}</g>` +
        `<g class="flicker" style="animation-delay:-1.3s">${rects([[0, 16, 2, 1], [0, 22, 3, 1], [1, 28, 2, 1]], "#ffffff")}</g>`);
    } },
  { name: "aquaman", label: "Aquaman", pack: "dc", trick: "Bubbles drift up",
    draw(ctx) {
      const g = ctx.layer();
      const scale = "#e08a1e", green = "#2f8f4e", skin = "#d9a273", hair = "#7a5230";
      body(g, { suit: scale, sleeve: green, glove: green, legs: green, boots: "#1f6b3a", lower: "#e0b13a", skin });
      headBase(g, skin);
      g.rect(5, 0, 18, 2, hair); g.rect(5, 3, 6, 11, hair); g.rect(17, 3, 18, 11, hair); g.rect(7, 3, 16, 3, hair);
      g.rect(8, 8, 15, 10, hair); g.rect(10, 9, 13, 9, "#a06a4a");
      eyes(g, "#1c4a6a", 5);
      ctx.over(`<g class="twinkle">${rects([[21, 12], [22, 8]], "#7df9ff")}</g><g class="twinkle" style="animation-delay:-.6s">${rects([[20, 5], [1, 10]], "#bff3ff")}</g><g class="twinkle" style="animation-delay:-1s">${rects([[2, 6], [0, 13]], "#7df9ff")}</g>`);
    } },
  { name: "green-lantern", label: "Green Lantern", pack: "dc", trick: "Power ring glows",
    draw(ctx) {
      const g = ctx.layer();
      const green = "#1f9d55", blk = "#14141a", skin = "#e2a77f", hair = "#5a3b22";
      body(g, { suit: green, sleeve: blk, glove: "#f4f7fb", legs: green, boots: blk, lower: blk, skin });
      headBase(g, skin);
      g.rect(6, 0, 17, 2, hair); g.rect(6, 3, 7, 4, hair); g.rect(16, 3, 17, 4, hair);
      g.rect(7, 4, 16, 6, green); g.rect(8, 5, 9, 5, "#f4f7fb"); g.rect(14, 5, 15, 5, "#f4f7fb");
      g.rect(10, 9, 13, 9, "#b0604f");
      ctx.over(`<g class="pulse fast">${rects([[18, 20, 4, 4]], "#5dff9e", ' opacity=".45"')}${rects([[19, 21, 2, 2]], "#5dff9e")}</g>`);
    } },
  { name: "joker", label: "Joker", pack: "dc", trick: "Laughs, a card flips",
    draw(ctx) {
      const g = ctx.layer();
      const purple = "#6b2fa0", white = "#f4f4f2", hair = "#3fbf4f";
      body(g, { suit: purple, glove: purple, legs: purple, boots: "#14141a", lower: "#ff9a2e", skin: white, neck: "#ff9a2e" });
      headBase(g, white);
      g.rect(6, 0, 17, 2, hair); g.rect(6, 3, 7, 6, hair); g.rect(16, 3, 17, 6, hair); g.px(9, 3, hair); g.px(14, 3, hair);
      eyes(g, "#1c2330", 5); g.rect(7, 4, 10, 4, "#3a3a46"); g.rect(13, 4, 16, 4, "#3a3a46");
      g.rect(8, 8, 15, 8, "#c8202f"); g.px(7, 7, "#c8202f"); g.px(16, 7, "#c8202f");
      ctx.over(`<g class="pant">${rects([[9, 9, 6, 1]], "#7a1020")}</g><g class="twinkle">${rects([[20, 18, 2, 3]], "#ffffff")}${rects([[20, 19]], "#c8202f")}</g>`);
    } },
];
