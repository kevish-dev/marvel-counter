import { renderCounter } from "./src/render.js";
import fs from "node:fs";
fs.mkdirSync("out", { recursive: true });
for (const [n, t] of [[1234567, "dark"], [0, "dark"], [9082015, "light"]]) fs.writeFileSync(`out/${n}-${t}.svg`, renderCounter(n, { theme: t }));
fs.writeFileSync("out/index.html", `<body style="margin:0;background:#161b22;padding:20px;display:flex;flex-direction:column;gap:20px"><img src="1234567-dark.svg"><img src="0-dark.svg"><div style="background:#fff;padding:10px"><img src="9082015-light.svg"></div></body>`);
