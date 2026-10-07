---
name: HeroCount
description: A quiet, category-standard frame around a playful pixel-hero visitor counter.
colors:
  accent: "#e5484d"
  accent-dark: "#ff6369"
  paper: "#ffffff"
  paper-subtle: "#fafafa"
  panel-recessed: "#f4f4f5"
  hairline: "#e5e5e5"
  hairline-strong: "#cfcfd3"
  ink: "#0a0a0a"
  mute: "#666666"
  focus-blue: "#2563eb"
  ok-green: "#15803d"
  err-red: "#c8102e"
  paper-dark: "#0a0a0a"
  paper-subtle-dark: "#101011"
  panel-recessed-dark: "#19191b"
  hairline-dark: "#26262a"
  hairline-strong-dark: "#3a3a40"
  ink-dark: "#ededed"
  mute-dark: "#a1a1aa"
  focus-blue-dark: "#7aa8ff"
  ok-green-dark: "#4ade80"
  err-red-dark: "#ff8b8f"
typography:
  display:
    fontFamily: "Geist, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(36px, 5.4vw, 60px)"
    fontWeight: 600
    lineHeight: 1.05
    letterSpacing: "-0.035em"
  headline:
    fontFamily: "Geist, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(24px, 3vw, 32px)"
    fontWeight: 600
    lineHeight: 1.15
    letterSpacing: "-0.025em"
  metric:
    fontFamily: "Geist, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(26px, 3.4vw, 40px)"
    fontWeight: 600
    lineHeight: 1.05
    letterSpacing: "-0.03em"
  title:
    fontFamily: "Geist, ui-sans-serif, system-ui, sans-serif"
    fontSize: "16px"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "0"
  lead:
    fontFamily: "Geist, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(17px, 2vw, 19px)"
    fontWeight: 400
    lineHeight: 1.55
  body:
    fontFamily: "Geist, ui-sans-serif, system-ui, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.6
    fontFeature: "\"tnum\""
  label:
    fontFamily: "Geist, ui-sans-serif, system-ui, sans-serif"
    fontSize: "14px"
    fontWeight: 500
    lineHeight: 1
  caption:
    fontFamily: "Geist, ui-sans-serif, system-ui, sans-serif"
    fontSize: "13px"
    fontWeight: 400
    lineHeight: 1.5
  code:
    fontFamily: "Geist Mono, ui-monospace, Menlo, monospace"
    fontSize: "13px"
    fontWeight: 400
    lineHeight: 1.65
  code-input:
    fontFamily: "Geist Mono, ui-monospace, Menlo, monospace"
    fontSize: "15px"
    fontWeight: 500
    lineHeight: 1
rounded:
  sm: "4px"
  md: "8px"
  lg: "12px"
spacing:
  xs: "8px"
  sm: "12px"
  md: "16px"
  lg: "24px"
  xl: "32px"
  2xl: "48px"
  section: "72px"
components:
  button-primary:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
    typography: "{typography.label}"
    rounded: "{rounded.md}"
    padding: "0 18px"
    height: "40px"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    rounded: "{rounded.md}"
    padding: "0 18px"
    height: "40px"
  button-small:
    rounded: "{rounded.md}"
    padding: "0 12px"
    height: "32px"
  input-id:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    typography: "{typography.code-input}"
    rounded: "{rounded.md}"
    padding: "0 12px"
    height: "40px"
  segmented-option:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    padding: "0 14px"
    height: "34px"
  segmented-option-selected:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
  chip:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    padding: "0 12px"
    height: "32px"
  chip-selected:
    backgroundColor: "{colors.panel-recessed}"
    textColor: "{colors.ink}"
  tab:
    backgroundColor: "transparent"
    textColor: "{colors.mute}"
    padding: "10px 12px"
  tab-selected:
    textColor: "{colors.ink}"
  container:
    backgroundColor: "{colors.paper}"
    rounded: "{rounded.lg}"
    padding: "24px"
  code-block:
    backgroundColor: "{colors.panel-recessed}"
    typography: "{typography.code}"
    rounded: "{rounded.md}"
    padding: "16px 56px 16px 16px"
  nav-link:
    textColor: "{colors.mute}"
    rounded: "{rounded.md}"
    padding: "8px 12px"
---

# Design System: HeroCount

## Overview

**Creative North Star: "The Plain Frame"**

Everything the site draws is a quiet frame for the one thing allowed to be playful: the pixel-hero counter image. The UI belongs to the Vercel and Linear craft family played straight: a white ground, near-black ink, a single gray for secondary text, 1px hairlines and no shadows. It is light by default and follows the system into dark mode with the same structure, just inverted.

Density is moderate and calm. Pages are a single 1080px column with left-aligned headlines, generous 72px section rhythm, and controls that read as standard, unremarkable tools so the counter carries all the character. The counter images (rendered server-side with their own palette, plates and "by kevish.dev" credit) are content the UI frames, not part of this system; they are shown at whole-pixel scale with `image-rendering: pixelated` and never restyled by the UI.

The world refuses the retro-arcade, neon, hard-shadow and card-chrome look the earlier draft wore. Pixel character lives inside the counter images; the UI around them stays neutral.

**Key Characteristics:**
- One accent, red, held to the logo mark, favicon, chart and referrer bars, and the selection tint.
- Selection and primary emphasis are carried by ink, not by the accent.
- Flat surfaces separated by 1px hairlines; zero shadows.
- Two radii: 8px for controls, 12px for containers.
- Self-hosted Geist for UI, Geist Mono for ids, code and snippets; tabular numerals everywhere.
- Light by default; dark follows `prefers-color-scheme` with identical structure.

## Colors

A neutral grayscale with one red accent and three functional state hues; every value has a light and a dark counterpart that swap through `prefers-color-scheme`.

### Primary
- **Signal Red** (accent; accent-dark in dark mode): the logo's 12px square mark, the favicon, the dashboard's daily-view bars and referrer bars, and the 28% `color-mix` text-selection tint. It never fills a button, never marks a selected control and never colors text.

### Neutral
- **Paper** (paper / paper-dark): page ground, nav background, input wells, chip and code-copy backgrounds.
- **Paper Subtle** (paper-subtle / paper-subtle-dark): hero lineup tiles and the id-input prefix cell; the one step of tonal lift off the ground.
- **Recessed Panel** (panel-recessed / panel-recessed-dark): code blocks, the terminal sample, the edit-key box, selected chips and segmented-control hover.
- **Hairline** (hairline / hairline-dark): every structural border: containers, nav and footer rules, table rows, tab baseline, dividers inside segmented controls.
- **Strong Hairline** (hairline-strong / hairline-strong-dark): borders on interactive controls at rest (ghost buttons, inputs, chips, segmented groups) and the scrollbar thumb.
- **Ink** (ink / ink-dark): body text, headlines, primary button fill, selected segment fill, active tab underline, hover border on every control, featured pricing plan border, range and checkbox accent.
- **Mute** (mute / mute-dark): secondary text: ledes, hints, nav links at rest, table headers, footer.

### Functional
- **Focus Blue** (focus-blue / focus-blue-dark): the 2px focus-visible outline only.
- **OK Green** and **Error Red** (ok-green, err-red and their dark pairs): inline status messages and the danger button border. The terminal sample's syntax colors reuse these hues (`#c8102e` / `#15803d` keywords and strings, `#6b6b70` comments, with dark pairs `#ff8b8f` / `#7ee2a0` / `#8e8e96`).

### Named Rules
**The One Signal Rule.** Signal Red marks brand and data, nothing else: the logo square, the favicon and chart bars. If a control needs to look selected, use ink.

**The Ink Selects Rule.** Every selected, pressed, active or featured state is expressed in ink: a filled ink segment, an ink underline, an ink border. Never a tinted accent background.

## Typography

**Display Font:** Geist (with ui-sans-serif, system-ui, sans-serif)
**Body Font:** Geist
**Label/Mono Font:** Geist Mono (with ui-monospace, Menlo, monospace)

**Character:** One neutral grotesk does all the UI work at three weights (400, 500, 600), tightened with negative tracking as size grows; Geist Mono appears only where the user is reading or typing literal text (ids, keys, snippets, URLs).

### Hierarchy
- **Display** (600, clamp 36 to 60px, 1.05, -0.035em): one page headline per page, left-aligned, balanced wrap. Inner pages use the same face and tracking at a slightly smaller clamp (32 to 56px; pricing reaches 64px, admin 48px).
- **Headline** (600, clamp 24 to 32px, 1.15, -0.025em): section headings, max 24ch.
- **Metric** (600, clamp 26 to 40px, 1.05, -0.03em): KPI numbers on dashboard and admin; pricing figures use the same treatment up to 56px.
- **Title** (600, 16px, 1.2, no tracking): panel and table headings inside containers. Tile names step down to 15px, plan names up to 20px.
- **Lead** (400, clamp 17 to 19px, 1.55, mute): the sentence under a display headline, max 46 to 56ch. Section ledes use 17px.
- **Body** (400, 16px, 1.6): running text, tabular numerals on by default.
- **Label** (500, 14px, 1): buttons, field labels, nav links. Segments, chips and tabs use 13px.
- **Caption** (400, 13px, 1.5, mute): hints, tile descriptions, KPI captions.
- **Code** (Geist Mono 400, 13px, 1.65): snippet and terminal blocks. **Code input** (Geist Mono 500, 15px) for id and key fields.

### Named Rules
**The Mono Means Literal Rule.** Geist Mono is used only for text the user copies or types verbatim. It is never a decorative or label face.

**The Sentence Case Rule.** Headings and labels are plain sentence case at normal tracking or tighter. No uppercase tracked labels above headings.

## Layout

A single centered column (`max-width: 1080px`, 24px side padding, 16px under 560px). Sections stack at 72px vertical padding (56px on phones); the home hero opens at 72px top. The nav is a sticky 56px bar on the page ground with a bottom hairline; under 560px it wraps and the links scroll horizontally on their own row.

The generator is a 5:7 two-column grid (32px gap) with a sticky preview at `top: 80px`; the API block is 5:6 (40px gap). Both collapse to one column at 900px. The hero lineup is a 7-column grid with 12px gaps, dropping to 4 at 1000px and 2 at 560px. Dashboard KPIs run 4 across (2 under 860px); pricing plans run 3 across (1 under 980px, featured plan first).

Spacing rhythm in the shared stylesheet is 8 / 12 / 16 / 24 / 32 / 48 / 72px. Inside containers: 24px panel padding, 24px between fields, 8px from label to control, 12px between paired buttons. Under 560px, buttons go full width.

## Elevation & Depth

The system is flat. There are no shadows anywhere. Depth comes from two things only: 1px hairlines that outline containers and controls, and one step of tonal shift (paper to paper-subtle or panel-recessed) for wells such as code blocks, tiles and the key box. The sticky nav separates from content with its bottom hairline, not a shadow or blur.

### Named Rules
**The Hairline Rule.** Separation is a 1px line in hairline or strong-hairline, never a shadow, glow, blur or offset.

## Shapes

Two radii carry the whole system: gently rounded 8px corners on everything you click or type into (buttons, inputs, chips, segmented groups, nav links, code blocks, copy buttons), and 12px on everything that holds content (boxes, tiles, KPI cards, chart and panel containers, pricing plans, the login bar, the terminal sample). The only smaller radius is 4px on the count badge inside a chip. Borders are always 1px. The logo mark is a sharp 12px square in Signal Red, echoing the pixel grid of the counters without borrowing their palette.

## Components

### Buttons
Solid, compact, unadorned.
- **Shape:** gently rounded (8px), 40px tall, 1px border.
- **Primary:** ink fill, paper text, ink border; 500 14px label, 18px side padding, optional 8px-gap Phosphor icon.
- **Hover / Active:** hover drops opacity to 0.86 (0.15s ease); active nudges down 1px. Focus-visible gets the 2px focus-blue outline at 3px offset.
- **Ghost:** transparent with strong-hairline border and ink text; hover darkens the border to ink without changing opacity.
- **Small:** 32px tall, 12px side padding, 13px label. Used for secondary actions inside panels.
- **Danger:** a ghost button with error-red border and text.
- **Disabled:** 0.45 opacity, not-allowed cursor, no motion.

### Chips
- **Style:** 32px tall, 8px radius, strong-hairline border, paper fill, 500 13px ink label, optional 18px ink count badge (4px radius, 600 11px).
- **State:** hover borders in ink; selected (`aria-pressed`) gets an ink border and recessed-panel fill.

### Segmented Control
- **Style:** a single strong-hairline outline at 8px radius, options 34px tall separated by hairline dividers, 500 13px labels.
- **State:** the pressed option fills with ink and reverses to paper text; unpressed options take the recessed fill on hover.

### Tabs
- **Style:** a hairline baseline; 500 13px mute labels, 10px by 12px padding.
- **State:** hover and selected turn ink; selected adds a 2px ink underline sitting on the baseline.

### Cards / Containers
- **Corner Style:** 12px.
- **Background:** paper; hero tiles use paper-subtle.
- **Shadow Strategy:** none (see Elevation & Depth).
- **Border:** 1px hairline; the featured pricing plan uses an ink border.
- **Internal Padding:** 24px for the generator panel; tiles 16px.

### Inputs / Fields
- **Style:** 40px tall, 8px radius, strong-hairline border on a paper well. The id field carries a fixed prefix cell in paper-subtle with a hairline divider, and the value is set in Geist Mono 500 15px. Placeholders are mute; caret is ink.
- **Focus:** the border turns ink and a 2px focus-blue outline sits 2px outside.
- **Error / Success:** messages below the field in error-red or ok-green at 14px; no field recoloring.
- **Range and checkbox:** native controls tinted with ink via `accent-color`.

### Navigation
- **Style:** sticky 56px bar, paper ground, bottom hairline. Logo at left in Geist 600 16px, -0.02em, preceded by the 12px Signal Red square.
- **Links:** 14px mute, 8px by 12px padding, 8px radius; hover and `aria-current` turn ink. The source link is an outlined control (strong hairline, ink text, Phosphor GitHub icon) that borders in ink on hover.
- **Mobile:** links wrap to their own horizontally scrolling row.

### Code Block
The copy surface the whole product funnels toward.
- **Style:** recessed-panel well, 1px hairline, 8px radius, Geist Mono 13px/1.65, wrapping anywhere; right padding leaves room for a 36px square copy button (paper fill, hairline border, 8px radius, Phosphor copy icon) pinned 8px from the top-right corner; its border turns ink on hover.
- **Terminal sample:** the same recessed well at 12px radius with 20px padding and the functional syntax colors.

### Counter Stage
The counter image sits directly on the page ground at full column width, unframed, in both the home stage and the generator preview, rendered with `image-rendering: pixelated`. The image's own plate is the frame. Hero tiles crop the sprite sheet inside a fixed 130 by 220px window (scaled 0.88 in the 7-column layout).

### Motion
One calm entrance and one scroll reveal, transform and opacity only: elements rise 8px (entrance, 0.55s, staggered 60ms) or 10px (reveal) on `cubic-bezier(.16,1,.3,1)`. Both are disabled under `prefers-reduced-motion`, which also turns off smooth scrolling and button transitions.

## Do's and Don'ts

### Do:
- **Do** keep the accent on the logo square, favicon and data bars only; express every selected or featured state in ink.
- **Do** use 8px radius on controls and 12px on containers, with 1px borders throughout.
- **Do** separate surfaces with hairlines and at most one tonal step (paper-subtle or panel-recessed).
- **Do** set ids, keys, URLs and snippets in Geist Mono; everything else in Geist.
- **Do** show real counter output at whole-pixel scale with `image-rendering: pixelated`.
- **Do** define every new color as a light and dark pair on `:root` and its `prefers-color-scheme: dark` override.
- **Do** give every interactive element the 2px focus-blue focus-visible outline.

### Don't:
- **Don't** add box shadows, glows, blurs or offset shadows to any UI surface.
- **Don't** fill buttons, chips, tabs or segments with Signal Red.
- **Don't** introduce a second display face or a pixel/arcade font into the UI; pixel character belongs to the counter images.
- **Don't** put uppercase tracked labels or eyebrows above headlines.
- **Don't** restyle, recolor or re-frame the counter images to match the UI.
- **Don't** use em-dashes or en-dashes in visible text.
