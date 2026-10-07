// Marvel-inspired pixel-art visitor counter. Pure function: renderCounter(count, opts) -> SVG string.
// Original stylised pixel figures (not official art). No JS in the SVG; CSS animation only.

const U = 5;           // px per art unit
const CW = 24, CH = 39; // hero cell (units)
const PAD = 2;

const FONT = {
  0: ["01110", "10001", "10001", "10001", "10001", "10001", "01110"],
  1: ["00100", "01100", "00100", "00100", "00100", "00100", "01110"],
  2: ["01110", "10001", "00001", "00010", "00100", "01000", "11111"],
  3: ["11110", "00001", "00001", "01110", "00001", "00001", "11110"],
  4: ["00010", "00110", "01010", "10010", "11111", "00010", "00010"],
  5: ["11111", "10000", "11110", "00001", "00001", "10001", "01110"],
  6: ["00110", "01000", "10000", "11110", "10001", "10001", "01110"],
  7: ["11111", "00001", "00010", "00100", "01000", "01000", "01000"],
  8: ["01110", "10001", "10001", "01110", "10001", "10001", "01110"],
  9: ["01110", "10001", "10001", "01111", "00001", "00010", "01100"],
};

class Grid {
  constructor(cls) { this.cls = cls; this.g = Array.from({ length: CH }, () => Array(CW).fill(null)); }
  px(x, y, c) { if (x >= 0 && y >= 0 && x < CW && y < CH) this.g[y][x] = c; return this; }
  rect(x0, y0, x1, y1, c) { for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) this.px(x, y, c); return this; }
  mirror(fn) { fn((x) => x); fn((x) => 23 - x); return this; } // symmetric painting helper
  svg() {
    // run-length merge horizontally, then vertically
    const runs = [];
    for (let y = 0; y < CH; y++) {
      let x = 0;
      while (x < CW) {
        const c = this.g[y][x];
        if (!c) { x++; continue; }
        let w = 1;
        while (x + w < CW && this.g[y][x + w] === c) w++;
        runs.push({ x, y, w, h: 1, c });
        x += w;
      }
    }
    const out = [];
    const open = new Map();
    for (const r of runs) {
      const k = `${r.x}|${r.w}|${r.c}`;
      const prev = open.get(k);
      if (prev && prev.y + prev.h === r.y) { prev.h++; } else { const o = { ...r }; open.set(k, o); out.push(o); }
    }
    const body = out.map((r) => `<rect x="${r.x}" y="${r.y}" width="${r.w}" height="${r.h}" fill="${r.c}"/>`).join("");
    return this.cls ? `<g class="${this.cls}">${body}</g>` : `<g>${body}</g>`;
  }
}

const rects = (list, c, extra = "") => list.map(([x, y, w = 1, h = 1]) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${c}"${extra}/>`).join("");

// ---- shared body parts ---------------------------------------------------
function headBase(g, skin) {
  g.rect(8, 0, 15, 0, skin);
  g.rect(6, 1, 17, 8, skin);
  g.rect(7, 9, 16, 9, skin);
  g.rect(8, 10, 15, 10, skin);
}
function body(g, { suit, sleeve = suit, glove, legs, boots, skin = "#f0c29a", neck = skin, lower = suit }) {
  g.rect(10, 11, 13, 12, neck);
  g.rect(6, 12, 17, 23, suit);          // torso (mostly hidden by the sign)
  g.rect(6, 24, 17, 24, lower);
  g.rect(3, 13, 4, 20, sleeve); g.rect(19, 13, 20, 20, sleeve);
  g.rect(3, 21, 4, 22, glove); g.rect(19, 21, 20, 22, glove);
  g.rect(7, 25, 10, 30, legs); g.rect(13, 25, 16, 30, legs);
  g.rect(6, 31, 10, 34, boots); g.rect(13, 31, 17, 34, boots);
}
function eyes(g, c = "#1c2330", y = 5) {
  g.rect(8, y, 9, y + 1, c); g.rect(14, y, 15, y + 1, c);
}

// ---- heroes (Marvel-inspired pixel figures) --------------------------------
const HEROES = [
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

const ORDER = ["black-panther", "captain-america", "thor", "hulk", "doctor-strange", "spider-man", "iron-man"];
HEROES.sort((x, y) => ORDER.indexOf(x.name) - ORDER.indexOf(y.name));

// ---- sign ----------------------------------------------------------------
function signSvg(d, theme) {
  const edge = theme === "light" ? "#1f2328" : "#2b2f36";
  const parts = [];
  parts.push(`<rect x="5" y="13" width="14" height="11" fill="${edge}"/>`);
  parts.push(`<rect x="6" y="14" width="12" height="9" fill="#f2f2f2"/>`);
  parts.push(`<rect x="6" y="14" width="12" height="1" fill="#ffffff"/>`);
  const rows = FONT[d];
  let dpath = "";
  for (let r = 0; r < 7; r++) {
    for (let c = 0; c < 5; c++) {
      if (rows[r][c] !== "1") continue;
      let w = 1;
      while (c + w < 5 && rows[r][c + w] === "1") w++;
      dpath += `M${9 + c} ${15 + r}h${w}v1h-${w}z`;
      c += w - 1;
    }
  }
  parts.push(`<path d="${dpath}" fill="#16181d"/>`);
  return parts.join("");
}

const CSS = `
.web{transform-box:fill-box;transform-origin:50% 100%;animation:web 4s ease-in-out infinite}
.webtip{animation:tip 4s ease-in-out infinite}
.flame{transform-box:fill-box;transform-origin:50% 0;animation:flame .35s steps(2,end) infinite}
.f2{animation-delay:.17s}
.glow{animation:pulse 1.6s ease-in-out infinite}
.glint{animation:glint 3.6s ease-in-out infinite}
.bolt{animation:bolt 3.4s linear infinite}
.cape{animation:sway 2.4s ease-in-out infinite alternate}
.bob{animation:bob 3s ease-in-out infinite alternate}
.pulse{animation:pulse 2.2s ease-in-out infinite}
.ring{transform-box:fill-box;transform-origin:50% 50%;animation:spin 4s linear infinite}
.idle{animation:idle 1.8s ease-in-out infinite alternate}
.blink{animation:blink 4.2s linear infinite}
.twinkle{animation:twinkle 1.5s ease-in-out infinite}
.shield{animation:shield 1.4s ease-in-out infinite alternate}
.rage{animation:rage 3s ease-in-out infinite}
.fast{animation-duration:1s}
.rev{animation-direction:reverse;animation-duration:2.6s}
@keyframes idle{from{transform:translateY(0)}to{transform:translateY(-.5px)}}
@keyframes blink{0%,90%,100%{opacity:0}92%,96%{opacity:1}}
@keyframes twinkle{0%,100%{opacity:0}50%{opacity:.9}}
@keyframes shield{from{transform:translateY(0)}to{transform:translateY(-.6px)}}
@keyframes rage{0%,55%,100%{opacity:0}65%,85%{opacity:.95}}
@keyframes web{0%,8%{transform:scaleY(0)}30%,58%{transform:scaleY(1)}80%,100%{transform:scaleY(0)}}
@keyframes tip{0%,28%{opacity:0}34%,56%{opacity:1}62%,100%{opacity:0}}
@keyframes flame{0%{transform:scaleY(1);opacity:.95}50%{transform:scaleY(.55);opacity:.7}100%{transform:scaleY(1);opacity:.95}}
@keyframes pulse{0%,100%{opacity:.35}50%{opacity:1}}
@keyframes glint{0%,70%,100%{opacity:0}78%,86%{opacity:1}}
@keyframes bolt{0%,86%{opacity:0}88%{opacity:1}90%{opacity:.15}92%{opacity:1}96%,100%{opacity:0}}
@keyframes sway{from{transform:translateX(-.4px)}to{transform:translateX(.4px)}}
@keyframes bob{from{transform:translateY(0)}to{transform:translateY(-.9px)}}
@keyframes spin{to{transform:rotate(360deg)}}
@media (prefers-reduced-motion:reduce){*{animation:none!important}.web,.webtip,.bolt,.glint,.blink,.rage,.twinkle{opacity:0}}
`.replace(/\n/g, "");

export const HERO_IDS = HEROES.map((h) => h.name);
const ALIASES = { panther: "black-panther", bp: "black-panther", cap: "captain-america", captain: "captain-america", strange: "doctor-strange", doctor: "doctor-strange", spidey: "spider-man", spiderman: "spider-man", ironman: "iron-man", iron: "iron-man" };
export const resolveHero = (n) => { const k = String(n).toLowerCase().trim(); const id = ALIASES[k] || k; return HEROES.find((h) => h.name === id); };

const AUTO_CSS = "@media(prefers-color-scheme:light){.bg{fill:#f6f8fa}.bd{stroke:#d0d7de}}";

// opts: theme "dark" | "light" | "auto", digits 3..9, heroes: array of hero ids/aliases (cycled)
export function renderCounter(count, { theme = "dark", digits = 7, heroes } = {}) {
  digits = Math.min(9, Math.max(3, Math.floor(Number(digits)) || 7));
  const n = Math.max(0, Math.floor(Number(count) || 0));
  const s = String(n).padStart(digits, "0").slice(-digits);
  const W = (CW * digits + PAD * 2) * U, H = (CH + PAD * 2) * U;
  const cast = (heroes || []).map(resolveHero).filter(Boolean);
  const lineup = cast.length ? cast : HEROES;
  const auto = theme === "auto";
  const light = theme === "light";
  const bgAttrs = auto ? 'class="bg" fill="#0d1117"' : `fill="${light ? "#f6f8fa" : "#0d1117"}"`;
  const bdAttrs = auto ? 'class="bd" stroke="#21262d"' : `stroke="${light ? "#d0d7de" : "#21262d"}"`;
  const cells = [];
  for (let i = 0; i < digits; i++) {
    const hero = lineup[i % lineup.length];
    const layers = [], overs = [];
    hero.draw({ layer: (cls) => { const g = new Grid(cls); layers.push(g); return g; }, over: (x) => overs.push(x) });
    cells.push(`<g transform="translate(${PAD * U + i * CW * U} ${PAD * U}) scale(${U})" data-hero="${hero.name}">` +
      `<g class="idle" style="animation-delay:${(-i * 0.37).toFixed(2)}s">` + layers.map((l) => l.svg()).join("") + `<g>${signSvg(s[i], light ? "light" : "dark")}</g>` + overs.join("") + `</g></g>`);
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" shape-rendering="crispEdges" role="img" aria-label="Visitor count ${n}">` +
    `<title>Visitor count: ${n}</title><style>${CSS}${auto ? AUTO_CSS : ""}</style>` +
    `<rect width="${W}" height="${H}" rx="14" ${bgAttrs}/><rect x=".5" y=".5" width="${W - 1}" height="${H - 1}" rx="14" fill="none" ${bdAttrs}/>` +
    cells.join("") + `</svg>`;
}

// Small SVG shown for unknown ids (no storage write, cacheable).
export function renderNotFound(id, theme = "dark") {
  const light = theme === "light";
  const bg = light ? "#f6f8fa" : "#0d1117", fg = light ? "#1f2328" : "#c9d1d9", sub = light ? "#57606a" : "#8b949e";
  const safe = String(id).replace(/[^a-zA-Z0-9_-]/g, "").slice(0, 39);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="560" height="120" viewBox="0 0 560 120" role="img" aria-label="HeroCount: id not found">` +
    `<rect width="560" height="120" rx="14" fill="${bg}"/><text x="280" y="52" text-anchor="middle" font-family="ui-monospace,Menlo,monospace" font-size="18" fill="${fg}">HeroCount: id &quot;${safe}&quot; not found</text>` +
    `<text x="280" y="82" text-anchor="middle" font-family="ui-monospace,Menlo,monospace" font-size="14" fill="${sub}">Create it free at herocount.kevish.dev</text></svg>`;
}
