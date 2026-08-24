---
name: Shante Zhou
description: A personal technical blog that is only its text — white paper, black ink, one monospace face.
colors:
  paper: "#fff"
  ink: "#000"
typography:
  title:
    fontFamily: "JetBrains Mono, ui-monospace, SF Mono, Menlo, Consolas, monospace"
    fontSize: "1.125rem"
    fontWeight: 700
    lineHeight: 1.5
  headline:
    fontFamily: "JetBrains Mono, ui-monospace, SF Mono, Menlo, Consolas, monospace"
    fontSize: "1rem"
    fontWeight: 700
    lineHeight: 1.5
  body:
    fontFamily: "JetBrains Mono, ui-monospace, SF Mono, Menlo, Consolas, monospace"
    fontSize: "0.9375rem"
    fontWeight: 400
    lineHeight: 1.75
  small:
    fontFamily: "JetBrains Mono, ui-monospace, SF Mono, Menlo, Consolas, monospace"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.6
spacing:
  flow: "1rem"
  block: "1.5rem"
  section: "2.5rem"
  frame: "3.5rem"
  page-top: "4.5rem"
components:
  link:
    textColor: "{colors.ink}"
  link-hover:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
  code-block:
    typography: "{typography.small}"
    padding: "1rem 1.25rem"
---

# Design System: Shante Zhou

## Overview

**Creative North Star: "The Kept Terminal Page"**

The blog is only its text. There is no interface layered on top of the writing — the typography *is* the interface. A reader lands on a name, a one-line subject, and a dated list; a click opens a post set like a beautifully kept terminal page: monospace throughout, black ink on white paper, hairline rules where structure is needed, and nothing else. The design refuses the card-grid blog index and every piece of chrome — no nav bar, no hero, no imagery, no icons, no buttons.

Because the palette and the face never vary, all expression comes from four quiet devices: weight (bold), posture (italic), hairline rules (1px solid ink), and inversion (ink and paper swap on hover, selection, and `<mark>`). Restraint is the identity: every addition must justify itself against "literally nothing at all" (a binding product commitment).

**Key Characteristics:**
- Two colors total: pure white paper, pure black ink — no grays, ever.
- One typeface for every character: JetBrains Mono (400, 700, italics).
- 1px solid ink rules are the only structural device.
- Full ink/paper inversion is the only state change and the only highlight.
- Static HTML + CSS; one file per post; zero JavaScript, zero build step.

## Colors

The palette is binary: everything is either paper or ink, and any element may swap the two.

### Primary
- **Ink** (#000): every character, every rule, every border, the fill of inverted states (link hover, text selection, `<mark>`, code-block scrollbar thumbs).

### Neutral
- **Paper** (#fff): the page ground and the text color of anything inverted. `color-scheme: light` is set deliberately — the white ground is the design, and the page must not auto-darken.

### Named Rules
**The Two-Ink Rule.** Only `#fff` and `#000` exist. No third color, no grays, no alpha transparency, no syntax highlighting. If an element needs emphasis, it gets weight, italics, a 1px rule, or inversion — never a new color.

**The Inversion Rule.** The one interactive gesture of the site: ink and paper swap. Hover, `::selection`, and `<mark>` all render paper text on solid ink. Nothing dims, tints, or fades.

## Typography

**Body/Display Font:** JetBrains Mono (with `ui-monospace, "SF Mono", Menlo, Consolas, monospace` fallbacks), loaded from Google Fonts in weights 400 and 700 plus both italics.

**Character:** A single monospace voice carries everything — prose, headings, code, math, tables, the footer. The page reads like a well-kept plain-text file: technical, even-tempered, unhurried (body line-height 1.75).

### Hierarchy
- **Title** (700, 1.125rem/18px, 1.5): the site name on the index and the post `<h1>`. The largest type on the site.
- **Headline** (700, 1rem/16px, 1.5): `<h2>` section headings; `<h3>` is the same size in italic, used sparingly for sub-points. Headings take more space above (2.75rem) than below (1rem).
- **Body** (400, 0.9375rem/15px, 1.75): all prose. Inline `<code>`, `<var>`, `<kbd>`, and `<samp>` inherit family and size — they are not set apart.
- **Small** (400, 0.875rem/14px, 1.6): code blocks (`<pre>`) and the footer.

### Named Rules
**The One Face Rule.** Every character on the site is JetBrains Mono. Code inherits the body face and size rather than declaring its own; there is no second family anywhere, including fallbacks-only contexts.

**The Quiet Scale Rule.** The entire type ramp spans 14px–18px. Hierarchy comes from weight, italics, and space — never from large display sizes.

## Layout

One centered column: `max-width: 66ch`, page padding `4.5rem 1.25rem 4rem`. There are no breakpoints — the measure is fluid and simply narrows on small screens (the only media query on the site is `prefers-reduced-motion`). Vertical rhythm is a rem ladder: 1rem paragraph flow, 1.5rem around block elements (code, blockquotes, tables), 2.5rem around `<hr>` and after article headers, 2.75rem above headings, 3.5rem below the site header/nav, 4.5rem of page-top and footer-top air.

The post index is a two-column grid per row: a `10ch` column for the ISO date (`YYYY-MM-DD`), `1.5rem` gap, then the bold post-title link. Fixed-width content inside a post (`pre`, ASCII diagrams) scrolls horizontally inside a 1px-ruled box rather than breaking the measure; ASCII diagrams are authored ≤36 characters wide so phones never need to scroll them (see STYLE.md).

## Elevation & Depth

There is no depth. The site is a single plane of paper: no box shadows, no layering, no overlays, no tonal steps (there are no tones to step through). The one `box-shadow` in the stylesheet — `0 0 0 2px` solid ink on link hover — is not elevation; it is a zero-blur halo that extends the inverted hover background 2px beyond the glyphs, acting as padding for the inversion.

### Named Rules
**The One Plane Rule.** Nothing floats, lifts, or casts. Any blurred, offset, or gray shadow is a defect. The solid hover halo is the only sanctioned `box-shadow`, and it is ink-solid at zero blur.

## Shapes

Everything is rectilinear and hairline. Corners are square — border-radius is never set, anywhere. All structure is drawn with `1px solid` ink: the border around `<pre>`, the left rule of `<blockquote>`, the bottom rule of table headers, `<hr>`, and the footer's top rule. Focus is a square 2px solid ink outline offset 2px.

### Named Rules
**The One-Pixel Rule.** Rules and borders are exactly 1px, solid, and ink. Nothing thicker, nothing dashed or dotted, no double rules, no rounded corners, no background fills behind bordered boxes.

## Components

The site has no buttons, cards, inputs, chips, or nav bars. Its component vocabulary is textual.

### Links
- **Default:** ink text with a 1px underline offset `0.25em` below the baseline; color is inherited, never distinct.
- **Hover:** full inversion — solid ink background, paper text, underline removed, plus the 2px solid-ink halo. Transitions at 80ms linear (background, color, box-shadow), and only under `prefers-reduced-motion: no-preference`; with reduced motion the swap is instant.
- **Focus:** 2px solid ink outline, offset 2px, underline removed.

### Post Index List
- **Structure:** an unstyled `<ul class="posts">`; each row is a `10ch + 1fr` grid — ISO date in `<time>`, then the post link in bold (700). Rows are `0.4rem` apart, newest first. No cards, no excerpts, no tags.

### Back-Link Navigation
- **Style:** the literal text `← index`, a plain link, standing alone in `<nav class="site-nav">` at the top of a post and repeated in the footer. This is the entire navigation system.

### Code Blocks
- **Style:** `<pre>` at 0.875rem/1.6 inside a 1px ink border, padding `1rem 1.25rem`, `overflow-x: auto` with a thin ink-on-paper scrollbar. No background tint, no syntax highlighting — the border is the highlight. ASCII diagrams are bare `<pre>` with `role="img"` and an `aria-label`.

### Blockquote Asides
- **Style:** italic body text behind a 1px ink left rule, `1.25rem` of left padding, `1.5rem` vertical margin. Unattributed blockquotes read as asides; real quotes carry a real attribution.

### Tables
- **Style:** full-width, collapsed borders, left-aligned, top-aligned cells with `0.35rem` vertical padding. Only the header row is ruled (1px ink bottom border) — no zebra striping, no cell borders, no fills.

### Display Math
- **Style:** `<p class="math">`, centered, `2rem` vertical margin. Math is set in HTML — `<var>` for variables, `<sub>`/`<sup>` for indices, Unicode operators (∇ η θ λ ≈ ‖…‖) — never MathJax or images.

## Do's and Don'ts

### Do:
- **Do** set every character in JetBrains Mono; let `code`, `kbd`, `samp`, and `var` inherit the face and size.
- **Do** draw all structure as 1px solid ink rules (`pre` border, `th` bottom rule, `blockquote` left rule, `hr`, footer top rule).
- **Do** keep the single 66ch centered measure and the rem rhythm (1 / 1.5 / 2.5 / 3.5 / 4.5).
- **Do** express every state and every highlight as full inversion: ink on paper becomes paper on ink.
- **Do** keep every page static HTML + CSS — one file per post, one shared `style.css`, one `<li>` added to the index per post.

### Don't:
- **Don't** introduce a third color — no grays, no alpha, no syntax-highlight palettes, no dark mode (`color-scheme: light` is deliberate).
- **Don't** add chrome: nav bars, cards, icons, images, logos, buttons, tags, or badges.
- **Don't** round a corner, thicken a rule past 1px, or use dashed/dotted/double borders.
- **Don't** cast depth: no blurred, offset, or gray shadows — the solid `0 0 0 2px` ink hover halo is the only permitted `box-shadow`.
- **Don't** add JavaScript, a build step, a framework, inline styles, or `<style>` blocks in posts; all styling lives in `style.css`.
