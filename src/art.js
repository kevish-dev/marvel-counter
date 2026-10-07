// Shared pixel-art helpers: grid painter, body parts, number font, sign.
export const U = 5;           // px per art unit
export const CW = 24, CH = 39; // hero cell (units)
export const PAD = 2;

export const FONT = {
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
  K: ["10001", "10010", "10100", "11000", "10100", "10010", "10001"],
  M: ["10001", "11011", "10101", "10101", "10001", "10001", "10001"],
  ".": ["00000", "00000", "00000", "00000", "00000", "01100", "01100"],
  ",": ["00000", "00000", "00000", "00000", "01100", "00100", "01000"],
};

export class Grid {
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

export const rects = (list, c, extra = "") => list.map(([x, y, w = 1, h = 1]) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${c}"${extra}/>`).join("");

// ---- shared body parts ---------------------------------------------------
export function headBase(g, skin) {
  g.rect(8, 0, 15, 0, skin);
  g.rect(6, 1, 17, 8, skin);
  g.rect(7, 9, 16, 9, skin);
  g.rect(8, 10, 15, 10, skin);
}
export function body(g, { suit, sleeve = suit, glove, legs, boots, skin = "#f0c29a", neck = skin, lower = suit }) {
  g.rect(10, 11, 13, 12, neck);
  g.rect(6, 12, 17, 23, suit);          // torso (mostly hidden by the sign)
  g.rect(6, 24, 17, 24, lower);
  g.rect(3, 13, 4, 20, sleeve); g.rect(19, 13, 20, 20, sleeve);
  g.rect(3, 21, 4, 22, glove); g.rect(19, 21, 20, 22, glove);
  g.rect(7, 25, 10, 30, legs); g.rect(13, 25, 16, 30, legs);
  g.rect(6, 31, 10, 34, boots); g.rect(13, 31, 17, 34, boots);
}
export function eyes(g, c = "#1c2330", y = 5) {
  g.rect(8, y, 9, y + 1, c); g.rect(14, y, 15, y + 1, c);
}


// ---- sign ----------------------------------------------------------------
export function signSvg(d, theme) {
  const edge = theme === "light" ? "#1f2328" : "#2b2f36";
  const parts = [];
  parts.push(`<rect x="5" y="13" width="14" height="11" fill="${edge}"/>`);
  parts.push(`<rect x="6" y="14" width="12" height="9" fill="#f2f2f2"/>`);
  parts.push(`<rect x="6" y="14" width="12" height="1" fill="#ffffff"/>`);
  const rows = FONT[d] || [];
  let dpath = "";
  for (let r = 0; r < 7; r++) {
    for (let c = 0; c < 5; c++) {
      if (!rows[r] || rows[r][c] !== "1") continue;
      let w = 1;
      while (c + w < 5 && rows[r][c + w] === "1") w++;
      dpath += `M${9 + c} ${15 + r}h${w}v1h-${w}z`;
      c += w - 1;
    }
  }
  parts.push(`<path d="${dpath}" fill="#16181d"/>`);
  return parts.join("");
}


// ---- 3x5 pixel text (credit line, "since" label) ------------------------------
const P3 = {
  a: "010101111101101", b: "110101110101110", c: "011100100100011", d: "110101101101110", e: "111100110100111",
  f: "111100110100100", g: "011100101101011", h: "101101111101101", i: "111010010010111", j: "001001001101010",
  k: "101110100110101", l: "100100100100111", m: "101111111101101", n: "110101101101101", o: "010101101101010",
  p: "110101110100100", q: "010101101111011", r: "110101110101101", s: "011100010001110", t: "111010010010010",
  u: "101101101101111", v: "101101101101010", w: "101101111111101", x: "101101010101101", y: "101101010010010",
  z: "111001010100111",
  0: "111101101101111", 1: "010110010010111", 2: "111001111100111", 3: "111001111001111", 4: "101101111001001",
  5: "111100111001111", 6: "111100111101111", 7: "111001001001001", 8: "111101111101111", 9: "111101111001111",
  ".": "000000000000010", " ": "000000000000000", "-": "000000111000000",
};
export function pixelTextWidth(text, px = 2) { return text.length * 4 * px - px; }
export function pixelText(text, x0, y0, px, fill, attrs = "") {
  let d = "";
  [...String(text).toLowerCase()].forEach((ch, i) => {
    const g = P3[ch] || P3[" "];
    for (let r = 0; r < 5; r++) for (let c = 0; c < 3; c++) {
      if (g[r * 3 + c] === "1") d += `M${x0 + i * 4 * px + c * px} ${y0 + r * px}h${px}v${px}h-${px}z`;
    }
  });
  return `<path ${attrs} d="${d}" fill="${fill}" opacity=".85"/>`;
}
