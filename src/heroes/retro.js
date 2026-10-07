import { rects, headBase, body, eyes } from "../art.js";

export const RETRO = [
  { name: "knight", label: "Knight", pack: "retro", trick: "Plume waves, steel catches the light",
    draw(ctx) {
      const g = ctx.layer();
      const steel = "#aeb7c4", dk = "#7b8696", blue = "#2d5bd6";
      body(g, { suit: blue, sleeve: steel, glove: dk, legs: steel, boots: dk, lower: "#e0b13a", skin: dk, neck: dk });
      headBase(g, steel);
      g.rect(6, 1, 17, 1, "#c9d1d9"); g.rect(8, 5, 15, 5, "#1c2330"); g.rect(11, 6, 12, 10, dk);
      g.px(9, 8, dk); g.px(14, 8, dk); g.px(9, 9, dk); g.px(14, 9, dk);
      g.rect(11, 2, 12, 4, "#c9d1d9");
      ctx.over(`<g class="leafsway">${rects([[10, 0, 4, 1], [13, 0, 3, 1]], "#d6313a")}</g>` +
        `<g class="glint">${rects([[7, 3], [8, 2]], "#ffffff")}</g>`);
    } },
  { name: "wizard", label: "Wizard", pack: "retro", trick: "Stars twinkle, the staff orb pulses",
    draw(ctx) {
      const g = ctx.layer();
      const robe = "#5b2fb3", skin = "#f0c29a", beard = "#eceff4";
      body(g, { suit: robe, glove: skin, legs: "#3d1f80", boots: "#2a1450", lower: "#e0b13a", skin, neck: beard });
      headBase(g, skin);
      g.rect(8, 8, 15, 10, beard); g.rect(9, 11, 14, 12, beard);
      g.rect(11, 0, 12, 0, robe); g.rect(10, 1, 13, 1, robe); g.rect(9, 2, 14, 2, robe); g.rect(8, 3, 15, 3, robe);
      g.rect(5, 4, 18, 4, "#3d1f80"); g.rect(6, 5, 17, 5, "#3d1f80");
      eyes(g, "#1c2330", 6);
      g.px(11, 2, "#ffe066");
      ctx.over(`<g class="twinkle">${rects([[11, 2], [9, 3]], "#ffe066")}</g>` +
        `<g class="twinkle" style="animation-delay:-.8s">${rects([[13, 1], [15, 3]], "#ffe066")}</g>` +
        `<g class="pulse">${rects([[1, 18, 3, 3]], "#7df9ff", ' opacity=".55"')}${rects([[2, 19]], "#e8fbff")}</g>`);
    } },
  { name: "ninja", label: "Ninja", pack: "retro", trick: "Headband tails flutter, a shuriken spins",
    draw(ctx) {
      const g = ctx.layer();
      const blk = "#1a1a22", gray = "#3a3a46";
      body(g, { suit: blk, glove: gray, legs: blk, boots: gray, lower: "#d6313a", skin: blk, neck: blk });
      headBase(g, blk);
      g.rect(7, 5, 16, 6, "#d9a273"); g.rect(6, 3, 17, 4, "#d6313a");
      g.rect(9, 5, 9, 6, "#101010"); g.rect(14, 5, 14, 6, "#101010"); g.px(9, 5, "#f4f7fb"); g.px(14, 5, "#f4f7fb");
      ctx.over(`<g class="tail">${rects([[18, 3, 4, 1], [19, 4, 3, 1], [20, 5, 2, 1]], "#d6313a")}</g>` +
        `<g class="ring">${rects([[1, 20, 1, 3], [0, 21, 3, 1]], "#c9d1d9")}${rects([[1, 21]], "#1a1a22")}</g>`);
    } },
  { name: "astronaut", label: "Astronaut", pack: "retro", trick: "Visor glints, the antenna blinks",
    draw(ctx) {
      const g = ctx.layer();
      const white = "#e8edf3", gray = "#aab6c6";
      body(g, { suit: white, glove: gray, legs: white, boots: gray, lower: "#ff8a1f", skin: white, neck: gray });
      headBase(g, white);
      g.rect(7, 3, 16, 8, "#233a63"); g.rect(8, 9, 15, 9, "#233a63");
      g.rect(6, 4, 6, 7, gray); g.rect(17, 4, 17, 7, gray);
      g.rect(17, 0, 17, 1, gray);
      ctx.over(`<g class="twinkle">${rects([[8, 4, 2, 1], [8, 5]], "#ffffff")}</g>` +
        `<g class="pulse fast">${rects([[17, 0]], "#ff4a4a")}</g>`);
    } },
  { name: "robot", label: "Robot", pack: "retro", trick: "Eyes scan, the antenna light blinks",
    draw(ctx) {
      const g = ctx.layer();
      const m = "#9aa7b4", dk = "#6b7886";
      body(g, { suit: "#5a6b7e", glove: dk, legs: dk, boots: "#ff8a1f", lower: m, skin: m, neck: dk });
      g.rect(6, 1, 17, 10, m); g.rect(6, 1, 17, 1, "#c3ccd6"); g.rect(11, 0, 12, 0, dk);
      g.rect(8, 4, 10, 6, "#0f1a22"); g.rect(13, 4, 15, 6, "#0f1a22");
      g.rect(9, 8, 14, 8, dk); g.rect(9, 10, 14, 10, dk); g.px(10, 9, "#0f1a22"); g.px(12, 9, "#0f1a22"); g.px(14, 9, "#0f1a22");
      ctx.over(`<g class="scan">${rects([[8, 4, 2, 3], [13, 4, 2, 3]], "#7df9ff")}</g>` +
        `<g class="pulse fast">${rects([[11, 0, 2, 1]], "#ff4a4a")}</g>`);
    } },
  { name: "pirate", label: "Pirate", pack: "retro", trick: "Gold glints on the hat and earring",
    draw(ctx) {
      const g = ctx.layer();
      const coat = "#a3201f", skin = "#f0c29a", blk = "#14141a";
      body(g, { suit: coat, glove: "#6b4a2b", legs: "#2a2a35", boots: blk, lower: "#6b4a2b", skin });
      headBase(g, skin);
      g.rect(7, 0, 16, 2, blk); g.rect(4, 3, 19, 4, blk); g.rect(5, 5, 18, 5, blk);
      g.px(11, 1, "#f4f7fb"); g.px(12, 1, "#f4f7fb"); g.px(11, 2, "#f4f7fb"); g.px(12, 2, "#f4f7fb");
      g.rect(13, 6, 15, 8, blk); g.rect(7, 6, 12, 6, blk); g.px(8, 7, "#1c2330"); g.px(9, 7, "#1c2330");
      g.rect(8, 10, 15, 10, blk); g.rect(10, 9, 13, 9, "#a8665a");
      ctx.over(`<g class="twinkle">${rects([[11, 1], [5, 8]], "#ffe066")}</g>` +
        `<g class="twinkle" style="animation-delay:-.9s">${rects([[19, 20]], "#ffe066")}</g>`);
    } },
  { name: "alien", label: "Alien", pack: "retro", trick: "Antenna orbs pulse, big eyes blink",
    draw(ctx) {
      const g = ctx.layer();
      const grn = "#6fd36f", suit = "#9aa7b4";
      body(g, { suit, glove: grn, legs: "#7b8696", boots: grn, lower: grn, skin: grn, neck: grn });
      g.rect(8, 0, 15, 0, grn); g.rect(5, 1, 18, 8, grn); g.rect(6, 9, 17, 9, grn); g.rect(8, 10, 15, 10, grn);
      g.px(7, 0, null);
      g.rect(7, 4, 10, 7, "#101820"); g.rect(13, 4, 16, 7, "#101820"); g.px(8, 5, "#cfe9ff"); g.px(14, 5, "#cfe9ff");
      g.rect(11, 9, 12, 9, "#3a8f3a");
      ctx.over(`<g class="blink2">${rects([[7, 4, 4, 4], [13, 4, 4, 4]], "#6fd36f")}</g>` +
        `<g class="pulse">${rects([[6, 0, 2, 1]], "#ffe066")}</g><g class="pulse" style="animation-delay:-1.1s">${rects([[16, 0, 2, 1]], "#ffe066")}</g>`);
    } },
];
