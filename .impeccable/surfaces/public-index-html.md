---
version: 1
slug: "public-index-html"
primary_target: "public/index.html"
related_targets: ["public/pricing.html","public/dashboard.html","public/integrations.html","public/admin.html"]
---

# Surface brief: HeroCount site (home, pricing, dashboard, integrations, admin)

Scope and visitor mode: Persuade (home, pricing), Operate (dashboard, admin, generator), Read (integrations).
Audience and job: developers dressing up a GitHub README; copy one line of Markdown in under a minute.
Proof and content: the live counter and the 25 real hero sprites; no invented customers or numbers.
Constraints: keep every element id and API call; keep the by kevish.dev credit and license link; no em-dashes.

## Direction contract

THESIS: The counter is the only thing on the page that is allowed to be playful; everything around it is quiet, plain and fast. Refuses the retro-arcade, hard-shadow, neon and card-chrome look the first draft wore.
OWN-WORLD: Vercel and Linear craft at full fidelity. White ground (#ffffff), near-black text (#0a0a0a), gray secondary (#666), 1px #eaeaea borders, 8px radius everywhere, no shadows, Geist for UI and Geist Mono for code. One accent (#e5484d) used only for the logo mark, selected indicators and chart bars. Primary button is solid near-black. Dark mode inverts to #0a0a0a ground with #ededed text, same structure.
STORY: The visitor sees a counter, understands what it is in one line, scrolls once to the generator, creates an id, copies a snippet, leaves. Pricing and docs are calm, honest and short.
FIRST VIEWPORT: Slim 56px nav. Left-aligned two-line headline at about 60px, one 18px sentence, a solid Make my counter button and a quiet text link, then the live counter in a single thin-bordered frame spanning the content width. Nothing else above the fold.
FORM: Category standard, played straight (the standing exit), seed key a2fea6a0. Order: hero, generator, hero lineup, API note, footer.
FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
