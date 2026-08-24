# Blog style guide — v0.2

The whole design in one sentence: **the blog is only its text** — pure white
paper, pure black ink, JetBrains Mono for every character, 1px rules as the
only structure, and one gesture (hover/selection inverts ink and paper).

Status: v0.2. Adjust this file whenever the style changes; every new post
must follow it. (v0.2: contact line under the name, bottom category line +
three standalone pages, unframed `pre.art`.)

## Site map

- `index.html` — the blog, and the main thing. Header stack: name (h1),
  category line `about me · projects · contact me` (small), tagline. Then
  the post list. Footer: just the © line. The category line is the site's
  only navigation besides `← index`; the email lives on the contact page
  only.
- `about.html` — About Me: the bio, then the Minecraft picture underneath.
- `projects.html` — Projects: things built or being built, listed like the
  blog index (`projects/<slug>.html` or external links).
- `contact.html` — "Don't be shy" under the heading, then a long pause, then
  the email line and `discord: @unlikelihood` at the bottom.
- `posts/<slug>.html` — blog posts.
- `img/` — the few pictures the site uses, web-compressed (≤1200px WebP).

## Hard rules

1. **Two colors.** `#fff` paper, `#000` ink. Never a third. Grays included.
2. **One face.** JetBrains Mono (400, 700, + italics), loaded from Google
   Fonts. Fallbacks: `ui-monospace, "SF Mono", Menlo, Consolas, monospace`.
3. **HTML + CSS only.** No JavaScript, no build step, no framework, ever.
4. **1px rules only.** Borders on `pre`, `th`, `blockquote`, `hr`, `footer`
   are all 1px solid ink. Nothing thicker, nothing dashed, no shadows,
   no rounded corners, no backgrounds.
5. **No chrome.** No nav bar, cards, icons, buttons, or badges. Navigation
   is `← index` on subpages plus the header category line on the home page.
   Small "for funsies" pictures are allowed where Shante asks (currently the
   contact page): `<img class="pic">`, 1px ink frame, compressed into
   `img/`. Posts stay image-free unless Shante says otherwise.
6. All shared styling lives in `style.css`. Posts carry **zero** inline
   styles and no `<style>` blocks.

## Layout constants (from style.css)

| Thing | Value |
|---|---|
| Measure | `max-width: 66ch`, centered |
| Body type | 15px (`0.9375rem`), line-height 1.75 |
| Headings | h1 18px; h2/h3 16px; h3 italic; more space above than below |
| Code blocks | 14px, line-height 1.6, 1px border, `overflow-x: auto` |
| Page padding | `4.5rem 1.25rem 4rem` |

Posts usually start life as Obsidian notes — the export/convert process
lives in PUBLISHING.md.

## Writing a new post

1. Copy `posts/gradient-descent.html` as `posts/<slug>.html`; keep the
   `<head>` (font links, `../style.css`), the `nav → main > article → footer`
   skeleton, and the `← index` links.
2. Update `<title>` (`Post title · Shante Zhou`), `<meta name="description">`,
   the `<h1>`, and the `<time datetime="YYYY-MM-DD">`.
3. Add one entry to the list in `index.html`, newest first. Entries follow
   the Lilian-Weng-minus-the-box format: bold title, 1–2 line summary, date
   — separated by 1px rules, no cards:

   ```html
   <li>
     <a class="post-title" href="posts/<slug>.html">Post title</a>
     <p class="post-summary">One or two honest lines about the post.</p>
     <time datetime="YYYY-MM-DD">YYYY-MM-DD</time>
   </li>
   ```

## Content elements

- **Math** — no MathJax. Use `<var>` for variables, `<sup>`/`<sub>` for
  indices, and Unicode operators (∇ η θ λ ≈ ‖…‖ Σ). Display equations go in
  `<p class="math">…</p>` (centered).
- **Code** — `<pre><code>…</code></pre>`. Escape `<`, `>`, `&`. No syntax
  highlighting; the border is the highlight.
- **ASCII diagrams** — a `<pre>` with `role="img"` and an `aria-label`
  describing what the picture shows. Keep every line ≤ 36 characters so the
  diagram fits a phone screen without scrolling. Charts/diagrams keep the
  1px frame; decorative art (like the contact cat) uses `<pre class="art">`
  — no frame, no padding.
- **Asides** — `<blockquote>` (renders italic with a 1px left rule). Real
  quotes get a real attribution; unattributed blockquotes read as asides.
- **Headings** — h2 for sections, h3 (italic) sparingly for sub-points.
  Sibling sections are both h2; don't demote for looks.
- **Tables** — plain `<table>`; only the header row is ruled. Keep them
  narrow enough for the 66ch measure.
- **Emphasis** — `<strong>` and `<em>` only. `<mark>` inverts to
  white-on-black; use it rarely.

## Voice

Technical, first-person, plain. Posts either teach something or record what
I'm learning — AI, chemistry, mathematics. Dates are ISO (`2026-08-22`).
Claims must be true; toy examples are fine when labeled as such.
