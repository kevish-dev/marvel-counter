# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users
Developers dressing up a GitHub profile or project README. They arrive from a profile or a friend's README, want a visitor counter in under a minute, and copy one line of Markdown. Secondary visitors (bloggers, site owners, Notion users) use the same site but are not the design target.

## Product Purpose
HeroCount is a free, hosted, animated visitor counter delivered as a plain SVG. Each digit is held up on a sign by a pixel-art hero (25 heroes in four packs). Success: a visitor creates an id, picks a look, copies a snippet, and the counter appears in their README. The author also sells self-host licenses.

## Positioning
Other counters are flat number badges. HeroCount's counter is a row of animated pixel characters, each holding a digit, with one small animation per hero, delivered as a single image that works anywhere images do and needs no sign-up.

## Operating Context
Static site on Vercel (HTML, CSS, vanilla JS in `public/`) plus serverless functions in `api/`, Upstash Redis storage, domain herocount.kevish.dev. Visitors work on desktop and phone. Counter images are embedded on GitHub, GitLab, Notion, blogs and personal sites.

## Capabilities and Constraints
- Pages: home (hero lineup, generator), pricing, dashboard (stats via edit key), integrations (snippets, GitHub Action, shields endpoint), admin (token). All logic is vanilla JS wired by element ids; the redesign must keep every id, form behavior and API call working.
- Counts page loads, not unique people. GitHub hides referrers.
- Fonts are self-hosted (public/fonts); icons come from Phosphor.
- The "by kevish.dev" credit is baked into every counter image and the site footer links the source-available license. Both must stay visible.
- Product copy rule from the author: no em-dashes or en-dashes in visible text.

## Brand Commitments
- Name: HeroCount. Domain: herocount.kevish.dev. Built by Kevish (kevish.dev).
- The pixel-art heroes are the visual subject of the site; the Marvel-style characters remain the lead pack.
- Footer states the art is fan-made and not affiliated with Marvel.

- Standing look preference (chosen by the author): minimal, readable and calm, in the craft family of Vercel and Linear. Light by default, dark follows the system. Not funky, no retro or arcade chrome around the UI; the pixel heroes are the only playful element.

## Evidence on Hand
Real, live counters and their SVG output (preview.svg, /count.svg), the 25 hero sprites, and a real self-host price of $49 per year on the pricing page. No testimonials, customer logos or usage numbers exist; none may be invented.

## Product Principles
- The image is the product: show real counters, never mockups of them.
- One minute from landing to a working snippet; the generator is the primary path.
- Pixel art is crafted, not decorative: crisp edges, whole-unit scaling.
- Honest limits: say plainly what is counted and what is not.

## Accessibility & Inclusion
Respect prefers-reduced-motion and color-scheme; keep text contrast at WCAG AA; all controls keyboard reachable with visible focus.
