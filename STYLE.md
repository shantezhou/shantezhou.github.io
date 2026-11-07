# Style guide

What to do when adding to the site, and the rules every change follows. DESIGN.md explains the
system behind them. Update both when the style changes.

## Add a project

Projects go in `<section id="projects">` in `index.html`, newest first. The title links to the
thing itself: the live app if there is one, else the repo. The screenshot links to the same place.
This is the template. It sits in a comment below Reactor Lab, ready for Avalon Agents:

```html
      <article class="project">
        <h3><a href="https://github.com/shantezhou/avalon-agents">Avalon Agents</a></h3>
        <p class="meta"><time datetime="2026-04-17">2026-04-17</time></p>
        <a class="shot" href="https://github.com/shantezhou/avalon-agents" aria-hidden="true" tabindex="-1"><img src="img/avalon-agents.webp" alt="" width="1200" height="HEIGHT" loading="lazy" decoding="async"></a>
      </article>
```

- Keep the order h3, meta, screenshot: they stack on the page's centre line at every width.
- A status, if Shante gives one, follows the date on the same line:
  `<time datetime="2026-10-23">2026-10-23</time> · early beta`.
- The screenshot link stays `aria-hidden="true" tabindex="-1"` with `alt=""`. The title is the same
  link, so screen readers and the keyboard meet it once.
- To bring Avalon Agents back: add `img/avalon-agents.webp`, put its height in `height=""`, and
  delete the comment's first line and its last line (`-->`). The first line is:
  `<!-- Avalon Agents: add back once it has an interface to screenshot.`
- Projects are built and hosted elsewhere. This repo only links to them.

## Change a profile link

The four marks under the name (Discord, LinkedIn, X, GitHub) link to Shante's profiles. They are in
`index.html` and again in `contact.html`: change both. In each page's `<p class="marks">`, change
only the `href` of the `<a>`:

| mark | `href` |
|---|---|
| Discord | `https://discord.com/users/<user id>`: the number, not the @name (Discord: Settings → Advanced → Developer Mode on, then right-click your name → Copy User ID) |
| LinkedIn | `https://www.linkedin.com/in/<handle>` |
| X | `https://x.com/<handle>` |
| GitHub | `https://github.com/shantezhou` |

- Keep `rel="me"` and the `aria-label`, and add no `target`: links open in the same tab, like every
  link here.
- Never publish a made-up or placeholder address. Before every publish, search both files for
  `PLACEHOLDER`: there must be none.
- Leave the `<svg>` alone. Each mark is pixel art drawn from a bitmap (DESIGN.md, Profile marks):
  the first path is the black moat, the second the white ink, and each `M x y h w v h h -w z` is a
  block of font pixels. To redraw a mark, change its bitmap in `tools/marks.py` and run
  `python3 tools/marks.py`: it rewrites the svg in both pages and leaves the links alone
  (`--check` only reports whether the pages match the bitmaps). It builds the moat as the
  silhouette with everything it encloses filled (for GitHub, the whole disc: the cat opens at its
  bottom, so filling holes alone leaves sky inside the cat), widened by `--moat`'s reach: three
  pixels to the left, four to the right, two above and below. Then come the `viewBox` and the
  `width` and `height` attributes (the drawing's size plus that reach, in font pixels; the
  attributes in ems, eight font pixels to the em). Update DESIGN.md's copy of the bitmaps too.
- To drop a profile, delete its `<a>` from both pages; the row closes up. A new one needs Shante's
  OK, a bitmap drawn the same way, and the hard-rule exception below extended.

## Add a post

1. Make the post page, `posts/<slug>.html`, from the page shell below. Notes from Obsidian go
   through PUBLISHING.md. No post page exists yet: the first post also designs it.

   The shell below has no page layout yet: `body > main` only gets side margins, so a post built
   from it starts at the top edge, its title, date and text touch, and the footer follows straight
   after the text. Before the first post ships, add a post layout to style.css within DESIGN.md's
   system (space above the title, the title at a token size, the footer at the bottom of the last
   screen) and put it in this shell.
2. In `index.html`, the writings section's `<div class="list">` starts with a comment that holds
   the templates. Copy the post template to just below that comment, newest first. With the first
   post or paper, delete `<p>loading...</p>`.

```html
        <article class="entry">
          <h3><a href="posts/slug.html">Post title</a></h3>
          <p>One or two honest lines about the post.</p>
          <p class="meta"><time datetime="YYYY-MM-DD">YYYY-MM-DD</time></p>
        </article>
```

The one or two lines are new writing, so Shante approves them.

## Add a paper

Papers share the list with posts, in date order. A paper has no page here: its title links to the
paper. Shante's name goes in `<strong>`: it marks the name for screen readers and search, and
looks like the rest of the line (every line is white, and the font has no bold).

```html
        <article class="entry">
          <h3><a href="https://arxiv.org/abs/YYMM.NNNNN">Paper title</a></h3>
          <p class="meta"><strong>S. Zhou</strong>, A. Coauthor</p>
          <p class="meta">arXiv YYMM.NNNNN · <time datetime="YYYY">YYYY</time></p>
          <p class="meta links"><a href="https://arxiv.org/pdf/YYMM.NNNNN">pdf</a><span aria-hidden="true">&nbsp;· </span><a href="https://github.com/shantezhou/repo">code</a></p>
        </article>
```

Keep the separator `<span aria-hidden="true">&nbsp;· </span>` exactly as it is: it keeps each dot
on the same line as the link before it, and its margins keep the dot clear of the focus frame.
Without code, drop the `code` link and its separator.

From 1200px wide the list is set in two balanced columns that line up with the spread's two pages.
Reading order runs down the left page, then the right. Two entries sit one on each page.

## Images

- WebP in `img/`, 1200px wide, named after the thing. For example:
  `cwebp -resize 1200 0 shot.png -o img/<slug>.webp`
- `width="1200"` and `height="..."` with the file's real height, so the page doesn't jump while it
  loads. Also `loading="lazy" decoding="async"`. To read the height:
  `sips -g pixelHeight img/<slug>.webp`
- Shown size: from 1200px wide, the width of the right page, at most `min(960px, 48em)`. That is
  720px on a 16" MacBook, 648 on a 14", and 612 in a 1440px window. Below 1200 the picture sits
  under the words, at most one measure (36em) wide from 720px up and full column width on phones. A
  project's screenshot is centred instead: at most `min(960px, 48em)` wide, and narrower on a short
  window, so that a whole project fits one screen.
- A project screenshot (`.shot img`) has rounded corners, four font pixels, like an app window;
  Shante asked for them. Other pictures, like the about picture, keep square corners. No border
  or shadow on anything.
- A picture that is content (the about picture) gets real alt text. A screenshot inside the hidden
  duplicate link gets `alt=""`.

## Add a page

Every page with the sky starts from this shell. In a folder such as `posts/`, prefix every path
with `../`.

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
  <title>page name · Shante Zhou</title>
  <meta name="description" content="One honest sentence.">
  <meta name="color-scheme" content="dark">
  <meta name="theme-color" content="#000000">
  <link rel="icon" href="favicon.png" type="image/png">
  <link rel="preload" href="fonts/macs-minecraft-regular.woff2" as="font" type="font/woff2" crossorigin>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <canvas id="bg" aria-hidden="true"></canvas>

  <main>
    <!-- the page -->
  </main>

  <footer>
    <p>© 2026 Shante Zhou</p>
  </footer>

  <script src="bg.js" defer></script>
</body>
</html>
```

- `<canvas id="bg" aria-hidden="true">` is the first child of `<body>`, and `bg.js` loads last,
  deferred. One canvas per page. bg.js sets the canvas's size and builds `#sky-clip` and `#sky-rot`
  round it, so don't size it in CSS or wrap it yourself.
- style.css already holds the sky's rules (`#sky-clip`, `#sky-rot`, `#bg`, `.tw`) and `html, body {
  background: #000; }`. Keep them as they are.

- Content must sit in a layer above the canvas. style.css gives `.sky`, `body > main` and `footer`
  `position: relative; z-index: 1`. Anything outside them is painted under the opaque canvas and
  can't be seen.
- Small text needs the black moat (DESIGN.md, Legibility). Put running text in
  `<div class="words">`, which also caps it at one measure. `.lead`, `.meta`, `.list` and `footer`
  carry the moat too, and so do h1, h2 and h3. The profile marks carry theirs inside their SVGs,
  with the same reach. The name (`.name`) carries nothing: the stars are far smaller than its
  strokes. No text gets a drop shadow.
- Blocks of text in `main` and the footer's line (`h2`, `h3`, `p`, `li`) have the sky fade out behind
  them (DESIGN.md, Legibility, "The backing"). New kinds of text block in `main` need adding to that
  rule in style.css, or a star's glow will show between their lines.
- Keep the font preload. The font uses `font-display: block`, so text stays invisible until it
  arrives.
- Title: `page name · Shante Zhou`. Site pages use their lowercase name (`contact · Shante Zhou`);
  a post uses its title exactly as Shante wrote it.
- Back link, as on contact.html: `<p class="lead links"><a href="./">← index</a></p>` (`../` from a
  folder).
- For a one-screen page, copy contact.html: a `<div class="sky contact">` that holds the page's own
  `<main>` (top left) and a `<header>` with the name as `<p class="name">`, the profile marks and
  the section links (low left).
- New sections or pages need Shante's OK. The brief is three sections on one page for now.

## Voice

- The words on the site are Shante's, verbatim, including capitals and punctuation ("heya!", ":D",
  "ai" in one place and "AI" in another). Don't rewrite, extend, polish or "fix" them without
  asking.
- Never invent anything: facts, skills, projects, numbers, dates, quotes, testimonials or
  descriptions. If something is missing, ask Shante.
- Shante writes in lowercase. Section names, links and page names stay lowercase (about me,
  projects, writings, contact, ← index). Keep whatever capitals Shante uses (AI, PG&E, UC Berkeley,
  Reactor Lab).
- Dates are ISO (`2026-10-23`), inside `<time datetime="...">`.
- Posts are technical, first-person and plain: they teach something or record what Shante is
  learning. Claims must be true; toy examples are fine when labelled as such.
- No filler. "loading..." stays until the first real writing.

## Type sizes

The font draws every letter on a grid of 8 font pixels to the em, so one font pixel is the font
size ÷ 8 (`--px`, `0.125em`). Text is sharp only when every font pixel covers whole device pixels.

- Font sizes are multiples of 8px, sharp at 1x, 2x and 3x. In use: 16, 24, 32, 40, 48, 56, 64, 72,
  80, 96, 120, 136, 160, 208.
- 20px only behind `(min-width: 1440px) and (min-resolution: 2dppx)`, as the body does; the width
  condition keeps 3x phones out. Multiples of 4 that aren't multiples of 8 (12, 20, 28) are sharp
  only on 2x screens; at 1x and 3x their pixels come out uneven.
- Use the tokens (`--name`, `--h2`, `--h3`, `--lead`, `--body`, `--meta`). A new size goes in as a
  token, with a step per breakpoint.
- Never use fluid sizes (`clamp()`, `vw`), font sizes in `em` or `%` (a bare `<h2>` gets the
  browser's 1.5em, which is off the grid: give it `var(--h2)`), letter-spacing other than
  multiples of `var(--px)`, `text-align: justify`, or fractional horizontal offsets (vertical
  positions may be fractional: text snaps vertically).
- Headings stay `font-weight: 400`. Only the regular face ships, and `font-synthesis: none` stops
  the browser from faking bold or italic.

## Hard rules

Shante asked for a site without generic AI-website habits: "dont overuse boxes", "nice and spaced
out (not compact)", "full resolution, covering the whole screen for macbooks". Every change keeps
these rules:

1. White on black: every piece of text is `#fff` on `#000`. The stars' dimmer whites and slight blues
   and oranges stay in the sky. No accent colour. Apart from those stars, the only colour is inside
   pictures.
2. One font: mac's Minecraft, in white, without a drop shadow. No icon fonts or icon libraries:
   arrows and symbols come from the font (`←`, `·`, `©`). The only images that aren't pictures
   are the four profile marks under the name (Discord, LinkedIn, X, GitHub), an exception Shante asked for on 2026-11-05
   ("let's replace it with a icon for discord, linkedin, X, and github"). They are each brand's
   own mark redrawn as white pixel art on the font's grid, with a drawn-in moat, never in the
   brands' colours and never from an icon set. No other icons.
3. One script: `bg.js`. Anything else that runs is measured first, against the budget in
   PRODUCT.md.
4. All styling in `style.css`, with tokens on `:root`. No inline styles, no `<style>` blocks. (The
   profile marks' `width`, `height` and `fill` attributes, like an image's size, are only what
   they fall back to without the stylesheet.)
5. No boxes: no card grids; no bordered or rounded boxes around sections or projects; no
   box-shadows or glows; no glassmorphism or `backdrop-filter`; no gradients or gradient text. (The
   stars' glow is in the sky, not on the page, and the black backing behind text is black on black,
   so it can't be seen as a box.)
   Project screenshots have rounded corners; nothing else is rounded. The LinkedIn mark's rounded
   square and GitHub's disc are not rounding: they are the brands' own shapes, drawn in pixels, so
   leave them as they are.
6. No chrome: no sticky or blurred navbar, hamburger menu, CTA buttons, scroll-down indicator,
   theme toggle or custom cursor; no pill tags, badges or chips; no emoji.
7. No template habits: no "Hi, I'm ..." hero with a waving hand; no numbered "01 / 02 / 03" section
   prefixes; no tiny uppercase letter-spaced eyebrow labels; no `<hr>` dividers between sections;
   no "made with love" line.
8. Only the sky moves: no fade-in or slide-in on
   scroll, no hover lift or scale, no typewriter or glitch effects (the typed name on the first
   screen is the one exception: see below). Hover thickens an underline, nothing more (the
   profile marks have no underline, so hovering them changes nothing). Section links jump: no
   smooth scrolling.
9. Nothing invented: no made-up facts, skills, projects, stats or testimonials, and no filler copy.
10. The font, not the game: don't recreate Minecraft's UI (stone buttons, the panorama, splash
    text, logo lettering, hotbar or inventory frames), and no text shadow: Shante asked for the
    plain font, without Minecraft's own grey shadow.
11. Spaced out and full width: keep the wide margins, the one-screen spreads and the sky between
    them. On a MacBook the layout uses the whole screen.

The one exception to rule 8, at Shante's request ("have it so that my name on the landing page when
the user joins is being typed out. then it gets deleted letter by letter, then typed out again. like
minecraft style too"; "for the name i want it to be like Shante Zhou --> Shan --> Shante Zhou", "like
3 perpetual patterns where it doesnt delete fully, sometimes it does and sometimes it doesn't."): the
name on index.html's first screen types itself out behind Minecraft's chat caret (the font's own
`_`), is deleted like a held backspace, back to "Shan", to "Shante" or all the way in turn, and types
again (DESIGN.md, "The typed name"). It stays cheap because `bg.js` changes one attribute on the h1
per step and does nothing between steps, while the name is out of view, in a hidden tab or under
reduced motion; no letter ever moves, and nothing else on the page shifts. Nothing else types or
glitches: on every other page, contact.html included, the name is plain text and stays still.
