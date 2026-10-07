import { rects, headBase, eyes } from "../art.js";

// shared critter body: fur body, paws, legs, feet. Returns the main grid.
function critterBody(ctx, { fur, paw = fur, feet, belly }) {
  const g = ctx.layer();
  g.rect(6, 12, 17, 24, fur);
  if (belly) g.rect(8, 14, 15, 24, belly);
  g.rect(3, 13, 4, 22, fur); g.rect(19, 13, 20, 22, fur);
  g.rect(3, 21, 4, 22, paw); g.rect(19, 21, 20, 22, paw);
  g.rect(7, 25, 10, 30, fur); g.rect(13, 25, 16, 30, fur);
  g.rect(6, 31, 10, 34, feet); g.rect(13, 31, 17, 34, feet);
  return g;
}

export const CRITTERS = [
  { name: "cat", label: "Cat", pack: "critters", trick: "Ear twitches, tail swishes",
    draw(ctx) {
      const t = ctx.layer("tail"); t.rect(19, 26, 22, 27, "#e8a24a"); t.rect(21, 22, 22, 25, "#e8a24a"); t.rect(21, 22, 22, 22, "#c47a2a");
      const g = critterBody(ctx, { fur: "#e8a24a", paw: "#f6d9a8", feet: "#c47a2a" });
      headBase(g, "#e8a24a");
      g.rect(10, 2, 10, 3, "#c47a2a"); g.rect(12, 2, 12, 3, "#c47a2a"); g.rect(13, 1, 13, 2, "#c47a2a");
      g.rect(16, 0, 17, 0, "#e8a24a"); g.rect(15, 1, 17, 1, "#e8a24a"); g.rect(15, 2, 17, 2, "#e8a24a"); g.px(16, 1, "#f4a3b5"); g.px(16, 2, "#f4a3b5");
      eyes(g, "#1c2330", 5); g.px(8, 5, "#7be07b"); g.px(14, 5, "#7be07b");
      g.px(11, 8, "#f4a3b5"); g.px(12, 8, "#f4a3b5"); g.px(11, 9, "#4a2e1a"); g.px(12, 9, "#4a2e1a");
      g.px(5, 8, "#f4f7fb"); g.px(4, 9, "#f4f7fb"); g.px(18, 8, "#f4f7fb"); g.px(19, 9, "#f4f7fb");
      ctx.over(`<g class="ear">${rects([[6, 0, 2, 1], [6, 1, 3, 1], [6, 2, 4, 1]], "#e8a24a")}${rects([[7, 1], [7, 2]], "#f4a3b5")}</g>`);
    } },
  { name: "dog", label: "Dog", pack: "critters", trick: "Ears flop, tongue pants",
    draw(ctx) {
      const t = ctx.layer("tail"); t.rect(19, 25, 21, 26, "#b0763a"); t.rect(21, 23, 21, 25, "#b0763a");
      const g = critterBody(ctx, { fur: "#b0763a", paw: "#f0d9b5", feet: "#7a4a1e" });
      headBase(g, "#b0763a");
      g.rect(9, 7, 14, 10, "#f0d9b5"); g.rect(10, 6, 13, 6, "#f0d9b5");
      eyes(g, "#1c2330", 4); g.px(11, 7, "#14141a"); g.px(12, 7, "#14141a");
      ctx.over(`<g class="ear">${rects([[4, 2, 2, 7]], "#7a4a1e")}</g><g class="ear" style="animation-delay:-1.4s">${rects([[18, 2, 2, 7]], "#7a4a1e")}</g>` +
        `<g class="pant">${rects([[11, 10, 2, 2]], "#f4748b")}</g>`);
    } },
  { name: "fox", label: "Fox", pack: "critters", trick: "Bushy tail swishes",
    draw(ctx) {
      const t = ctx.layer("tail"); t.rect(19, 25, 22, 31, "#e0662a"); t.rect(21, 25, 22, 27, "#f4f7fb"); t.rect(20, 29, 21, 31, "#c24f1a");
      const g = critterBody(ctx, { fur: "#e0662a", paw: "#2b2b33", feet: "#2b2b33", belly: "#f4eadf" });
      headBase(g, "#e0662a");
      g.rect(8, 6, 15, 9, "#f4eadf"); g.rect(10, 10, 13, 10, "#f4eadf"); g.rect(9, 5, 14, 5, "#f4eadf");
      g.rect(6, 0, 8, 0, "#e0662a"); g.rect(6, 1, 8, 2, "#e0662a"); g.px(6, 0, "#2b2b33"); g.px(7, 0, "#2b2b33");
      g.rect(15, 0, 17, 0, "#e0662a"); g.rect(15, 1, 17, 2, "#e0662a"); g.px(16, 0, "#2b2b33"); g.px(17, 0, "#2b2b33");
      eyes(g, "#1c2330", 4); g.px(11, 7, "#14141a"); g.px(12, 7, "#14141a");
      ctx.over(`<g class="ear">${rects([[6, 0, 3, 3]], "#e0662a")}${rects([[6, 0, 2, 1]], "#2b2b33")}</g>`);
    } },
  { name: "panda", label: "Panda", pack: "critters", trick: "Blinks and wiggles an ear",
    draw(ctx) {
      const g = critterBody(ctx, { fur: "#f2f2f2", paw: "#1b1b1f", feet: "#1b1b1f" });
      g.rect(3, 13, 4, 22, "#1b1b1f"); g.rect(19, 13, 20, 22, "#1b1b1f");
      g.rect(7, 25, 10, 30, "#1b1b1f"); g.rect(13, 25, 16, 30, "#1b1b1f");
      headBase(g, "#f2f2f2");
      g.rect(7, 4, 10, 7, "#1b1b1f"); g.rect(13, 4, 16, 7, "#1b1b1f");
      g.px(9, 5, "#f4f7fb"); g.px(9, 6, "#f4f7fb"); g.px(14, 5, "#f4f7fb"); g.px(14, 6, "#f4f7fb");
      g.rect(11, 8, 12, 8, "#1b1b1f"); g.px(10, 9, "#1b1b1f"); g.px(13, 9, "#1b1b1f"); g.rect(11, 9, 12, 9, "#1b1b1f");
      g.rect(16, 0, 17, 2, "#1b1b1f");
      ctx.over(`<g class="ear">${rects([[6, 0, 2, 3]], "#1b1b1f")}</g><g class="blink">${rects([[9, 5, 1, 2], [14, 5, 1, 2]], "#1b1b1f")}</g>`);
    } },
  { name: "frog", label: "Frog", pack: "critters", trick: "Throat puffs, eyes blink",
    draw(ctx) {
      const g = critterBody(ctx, { fur: "#5bbf4a", paw: "#8fdc7a", feet: "#3f9a33", belly: "#d9f08a" });
      g.rect(5, 31, 10, 34, "#3f9a33"); g.rect(13, 31, 18, 34, "#3f9a33");
      headBase(g, "#5bbf4a");
      g.rect(6, 0, 9, 3, "#5bbf4a"); g.rect(14, 0, 17, 3, "#5bbf4a");
      g.rect(7, 1, 9, 3, "#f4f7fb"); g.rect(14, 1, 16, 3, "#f4f7fb"); g.rect(8, 2, 9, 3, "#14141a"); g.rect(14, 2, 15, 3, "#14141a");
      g.rect(8, 8, 15, 8, "#2f6e27");
      ctx.over(`<g class="pant">${rects([[9, 9, 6, 2]], "#d9f08a")}</g>` +
        `<g class="blink">${rects([[7, 1, 3, 3], [14, 1, 3, 3]], "#5bbf4a")}</g>`);
    } },
  { name: "penguin", label: "Penguin", pack: "critters", trick: "Flippers flap",
    draw(ctx) {
      const g = ctx.layer();
      const blk = "#1f2430", wht = "#f2f2f2";
      g.rect(6, 12, 17, 24, blk); g.rect(8, 14, 15, 24, wht);
      g.rect(3, 21, 4, 22, blk); g.rect(19, 21, 20, 22, blk);
      g.rect(7, 25, 10, 30, blk); g.rect(13, 25, 16, 30, blk);
      g.rect(6, 31, 10, 34, "#ff9f1c"); g.rect(13, 31, 17, 34, "#ff9f1c");
      headBase(g, blk);
      g.rect(8, 4, 15, 9, wht); g.rect(9, 3, 14, 3, wht); g.rect(10, 10, 13, 10, wht);
      eyes(g, "#14141a", 5); g.rect(10, 7, 13, 8, "#ff9f1c");
      ctx.over(`<g class="flap">${rects([[2, 13, 3, 9]], blk)}</g><g class="flap" style="animation-delay:-.25s">${rects([[19, 13, 3, 9]], blk)}</g>`);
    } },
  { name: "bunny", label: "Bunny", pack: "critters", trick: "Ears twitch, tail wags",
    draw(ctx) {
      const t = ctx.layer("tail"); t.rect(19, 27, 21, 29, "#ffffff");
      const g = critterBody(ctx, { fur: "#efe7de", paw: "#ffffff", feet: "#d9cdbf", belly: "#ffffff" });
      g.rect(8, 3, 15, 3, "#efe7de"); g.rect(6, 4, 17, 8, "#efe7de"); g.rect(7, 9, 16, 9, "#efe7de"); g.rect(8, 10, 15, 10, "#efe7de");
      eyes(g, "#1c2330", 5);
      g.px(11, 8, "#f4a3b5"); g.px(12, 8, "#f4a3b5"); g.px(11, 9, "#ffffff"); g.px(12, 9, "#ffffff"); g.px(8, 8, "#f8c9d3"); g.px(15, 8, "#f8c9d3");
      ctx.over(`<g class="ear">${rects([[8, 0, 2, 5]], "#efe7de")}${rects([[9, 1, 1, 3]], "#f4a3b5")}</g>` +
        `<g class="ear" style="animation-delay:-1.2s">${rects([[14, 0, 2, 5]], "#efe7de")}${rects([[14, 1, 1, 3]], "#f4a3b5")}</g>`);
    } },
];
