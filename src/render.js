// HeroCount renderer. Pure function: renderCounter(count, opts) -> SVG string.
// Original stylised pixel figures (not official art). No JS in the SVG; CSS animation only.
import { U, CW, CH, PAD, Grid, signSvg, pixelText, pixelTextWidth } from "./art.js";
import { CLASSIC } from "./heroes/classic.js";
import { MARVEL2 } from "./heroes/marvel2.js";
import { RETRO } from "./heroes/retro.js";
import { CRITTERS } from "./heroes/critters.js";
import { DC } from "./heroes/dc.js";
import { ANIME } from "./heroes/anime.js";

const LABELS = { "black-panther": "Black Panther", "captain-america": "Captain America", thor: "Thor", hulk: "Hulk", "doctor-strange": "Doctor Strange", "spider-man": "Spider-Man", "iron-man": "Iron Man" };
const TRICKS = { "black-panther": "Suit lines pulse", "captain-america": "Shield catches the light", thor: "Calls down lightning", hulk: "Breathes, then rages", "doctor-strange": "Spins his rings", "spider-man": "Shoots a web, blinks", "iron-man": "Fires the boot jets" };
const ORDER = ["black-panther", "captain-america", "thor", "hulk", "doctor-strange", "spider-man", "iron-man"];
const classic = [...CLASSIC].sort((x, y) => ORDER.indexOf(x.name) - ORDER.indexOf(y.name)).map((h) => ({ ...h, label: LABELS[h.name], trick: TRICKS[h.name], pack: "marvel" }));

// packs: classic is the default lineup (the original seven, in order). "marvel" adds four more.
export const PACKS = { classic, marvel: [...classic, ...MARVEL2], dc: DC, anime: ANIME, retro: RETRO, critters: CRITTERS };
const ALL = [...classic, ...MARVEL2, ...DC, ...ANIME, ...RETRO, ...CRITTERS];
export const HERO_CATALOG = ALL.map((h) => ({ id: h.name, label: h.label, pack: h.pack, trick: h.trick }));
export const HERO_IDS = ALL.map((h) => h.name);
const ALIASES = { panther: "black-panther", bp: "black-panther", cap: "captain-america", captain: "captain-america", strange: "doctor-strange", doctor: "doctor-strange", spidey: "spider-man", spiderman: "spider-man", ironman: "iron-man", iron: "iron-man", wanda: "scarlet-witch", scarlet: "scarlet-witch", dp: "deadpool", wizard: "wizard", bunny: "bunny", rabbit: "bunny", bats: "batman", supes: "superman", ww: "wonder-woman", wonderwoman: "wonder-woman", gl: "green-lantern", "the-flash": "flash", sailor: "sailor-moon", sailormoon: "sailor-moon" };
export const resolveHero = (n) => { const k = String(n).toLowerCase().trim(); const id = ALIASES[k] || k; return ALL.find((h) => h.name === id); };

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
.flicker{animation:flicker 2.6s steps(1,end) infinite}
.sprout{transform-box:fill-box;transform-origin:50% 100%;animation:sprout 3.4s ease-in-out infinite}
.leafsway{transform-box:fill-box;transform-origin:50% 100%;animation:leafsway 2.2s ease-in-out infinite alternate}
.tail{transform-box:fill-box;transform-origin:0 100%;animation:tail 1.6s ease-in-out infinite alternate}
.ear{transform-box:fill-box;transform-origin:50% 100%;animation:ear 3.2s ease-in-out infinite}
.flap{transform-box:fill-box;transform-origin:50% 0;animation:flap .55s ease-in-out infinite alternate}
.pant{transform-box:fill-box;transform-origin:50% 0;animation:pant .6s steps(2,end) infinite}
.squint{transform-box:fill-box;transform-origin:50% 50%;animation:squint 3.6s ease-in-out infinite}
.scan{animation:scan 2.4s steps(4,end) infinite alternate}
.blink2{animation:blink 3.6s linear infinite}
.celebrate .idle{animation:hop .5s ease-in-out infinite alternate}
.cf{transform-box:fill-box;transform-origin:50% 50%;animation:fall 2.6s linear infinite}
@keyframes flicker{0%,100%{opacity:1}8%{opacity:.15}12%{opacity:1}55%{opacity:.35}58%{opacity:1}}
@keyframes sprout{0%,100%{transform:scaleY(.4)}50%{transform:scaleY(1)}}
@keyframes leafsway{from{transform:rotate(-9deg)}to{transform:rotate(9deg)}}
@keyframes tail{from{transform:rotate(-10deg)}to{transform:rotate(14deg)}}
@keyframes ear{0%,86%,100%{transform:rotate(0)}90%{transform:rotate(-14deg)}95%{transform:rotate(7deg)}}
@keyframes flap{from{transform:rotate(-14deg)}to{transform:rotate(14deg)}}
@keyframes pant{0%{transform:scaleY(1)}100%{transform:scaleY(1.7)}}
@keyframes squint{0%,38%,52%,100%{transform:scaleY(1)}44%{transform:scaleY(.25)}}
@keyframes scan{from{transform:translateX(-.8px)}to{transform:translateX(.8px)}}
@keyframes hop{from{transform:translateY(0)}to{transform:translateY(-2px)}}
@keyframes fall{0%{transform:translateY(-24px) rotate(0)}100%{transform:translateY(260px) rotate(540deg)}}
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
@media (prefers-reduced-motion:reduce){*{animation:none!important}.web,.webtip,.bolt,.glint,.blink,.blink2,.rage,.twinkle,.cf{opacity:0}.squint,.sprout,.leafsway,.tail,.ear,.flap,.pant{transform:none}}
`.replace(/\n/g, "");

// ---- number formats -------------------------------------------------------------
export function compactNumber(n) {
  if (n < 1000) return String(n);
  if (n < 10000) return (n / 1000).toFixed(1).replace(/\.0$/, "") + "K";
  if (n < 1e6) return Math.round(n / 1000) + "K";
  if (n < 1e7) return (n / 1e6).toFixed(1).replace(/\.0$/, "") + "M";
  return Math.min(999, Math.round(n / 1e6)) + "M";
}
export function formatCount(n, format, digits) {
  if (format === "compact") return compactNumber(n);
  if (format === "sep") { const t = n.toLocaleString("en-US"); return t.length <= 9 ? t : compactNumber(n); }
  return String(n).padStart(digits, "0").slice(-digits);
}
const MONTHS = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];
export const sinceLabel = (ms) => { const d = new Date(ms); return `since ${MONTHS[d.getUTCMonth()]} ${d.getUTCFullYear()}`; };

// ---- milestones: celebrate for a short window after the count crosses a round number ----
export const MILESTONES = [100, 250, 500, 1000, 2500, 5000, 10000, 25000, 50000, 100000, 250000, 500000, 1000000];
export const MILESTONE_WINDOW = 30;
export const isMilestone = (n) => MILESTONES.some((m) => n >= m && n < m + MILESTONE_WINDOW);

const CONFETTI = ["#ff5a5f", "#ffc83d", "#4da3ff", "#5fd38d", "#ffffff", "#c58bff"];
function confettiSvg(W) {
  let out = "";
  for (let i = 0; i < 26; i++) {
    const x = Math.round(((i * 97 + 31) % 100) / 100 * (W - 20)) + 8, sz = 6 + (i % 3) * 2;
    out += `<rect class="cf" x="${x}" y="0" width="${sz}" height="${sz}" fill="${CONFETTI[i % CONFETTI.length]}" style="animation-delay:${(-(i * 0.37) % 2.6).toFixed(2)}s;animation-duration:${(2.1 + (i % 5) * 0.25).toFixed(2)}s"/>`;
  }
  return out;
}

const AUTO_CSS = "@media(prefers-color-scheme:light){.bg{fill:#f6f8fa}.bd{stroke:#d0d7de}}";

// opts: theme "dark" | "light" | "auto" | "clear", digits 3..9 (plain format), heroes: ids/aliases (cycled), pack,
//       format "plain" | "sep" | "compact", since: ms timestamp (adds a "since" label), celebrate: boolean
export function renderCounter(count, { theme = "dark", digits = 7, heroes, pack, format = "plain", since, celebrate = false } = {}) {
  digits = Math.min(9, Math.max(3, Math.floor(Number(digits)) || 7));
  const n = Math.max(0, Math.floor(Number(count) || 0));
  const text = formatCount(n, format, digits);
  const slots = text.length;
  const W = (CW * slots + PAD * 2) * U, H = (CH + PAD * 2 + 1) * U;
  const cast = (heroes || []).map(resolveHero).filter(Boolean);
  const lineup = cast.length ? cast : PACKS[pack] || PACKS.classic;
  const auto = theme === "auto";
  const light = theme === "light";
  const bgAttrs = auto ? 'class="bg" fill="#0d1117"' : `fill="${light ? "#f6f8fa" : "#0d1117"}"`;
  const bdAttrs = auto ? 'class="bd" stroke="#21262d"' : `stroke="${light ? "#d0d7de" : "#21262d"}"`;
  const cells = [];
  for (let i = 0; i < slots; i++) {
    const hero = lineup[i % lineup.length];
    const layers = [], overs = [];
    hero.draw({ layer: (cls) => { const g = new Grid(cls); layers.push(g); return g; }, over: (x) => overs.push(x) });
    cells.push(`<g transform="translate(${PAD * U + i * CW * U} ${PAD * U}) scale(${U})" data-hero="${hero.name}">` +
      `<g class="idle" style="animation-delay:${(-i * 0.37).toFixed(2)}s">` + layers.map((l) => l.svg()).join("") + `<g>${signSvg(text[i], light ? "light" : "dark")}</g>` + overs.join("") + `</g></g>`);
  }
  const fill = light ? "#57606a" : "#8b93a1";
  const sinceSvg = since ? pixelText(sinceLabel(since), 16, H - 17, 2, fill) : "";
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" shape-rendering="crispEdges" role="img" aria-label="Visitor count ${n}"${celebrate ? ' class="celebrate"' : ""}>` +
    `<title>Visitor count: ${n}</title><desc>HeroCount, made by Kevish (https://kevish.dev)</desc><style>${CSS}${auto ? AUTO_CSS : ""}</style>` +
    (theme === "clear" ? "" : `<rect width="${W}" height="${H}" rx="14" ${bgAttrs}/><rect x=".5" y=".5" width="${W - 1}" height="${H - 1}" rx="14" fill="none" ${bdAttrs}/>`) +
    cells.join("") + sinceSvg + creditSvg(W, H, light ? "light" : "dark") + (celebrate ? confettiSvg(W) : "") + `</svg>`;
}

// ---- credit: tiny pixel-font "by kevish.dev" baked into every counter ----------
const CREDIT_TEXT = "by kevish.dev";
function creditSvg(W, H, theme) {
  const px = 2;
  const fill = theme === "light" ? "#57606a" : "#8b93a1";
  return pixelText(CREDIT_TEXT, W - 16 - pixelTextWidth(CREDIT_TEXT, px), H - 17, px, fill, 'data-credit="kevish.dev"');
}

// ---- badge: compact "visitors | 1,204 | by kevish.dev" (shields-style) ------------
const esc = (t) => String(t).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
export function renderBadge(count, { label = "visitors", format = "sep", color = "#e5484d", theme = "dark" } = {}) {
  const n = Math.max(0, Math.floor(Number(count) || 0));
  const value = formatCount(n, format === "plain" ? "sep" : format, 7);
  const safeLabel = esc(String(label).slice(0, 18));
  const safeColor = /^#[0-9a-f]{6}$/i.test(color) ? color : "#e5484d";
  const lw = 16 + 7 * safeLabel.length, vw = 16 + 8 * value.length, cw = 14 + pixelTextWidth("by kevish.dev", 2) / 1;
  const W = lw + vw + cw, H = 24;
  const left = theme === "light" ? "#d0d7de" : "#3a3f4b", ltxt = theme === "light" ? "#1f2328" : "#ecebe6", cbg = theme === "light" ? "#eaeef2" : "#23262e", cfill = theme === "light" ? "#57606a" : "#8b93a1";
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-label="${safeLabel}: ${value}">` +
    `<title>${safeLabel}: ${value}</title><desc>HeroCount, made by Kevish (https://kevish.dev)</desc>` +
    `<clipPath id="r"><rect width="${W}" height="${H}" rx="4"/></clipPath><g clip-path="url(#r)">` +
    `<rect width="${lw}" height="${H}" fill="${left}"/><rect x="${lw}" width="${vw}" height="${H}" fill="${safeColor}"/><rect x="${lw + vw}" width="${cw}" height="${H}" fill="${cbg}"/></g>` +
    `<g font-family="Verdana,Geneva,DejaVu Sans,sans-serif" font-size="12" font-weight="600" text-anchor="middle">` +
    `<text x="${lw / 2}" y="16" fill="${ltxt}">${safeLabel}</text><text x="${lw + vw / 2}" y="16" fill="#ffffff">${value}</text></g>` +
    pixelText("by kevish.dev", lw + vw + 7, 7, 2, cfill, 'data-credit="kevish.dev"') + `</svg>`;
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
