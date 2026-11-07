# Design

The design as built on 2026-11-06. STYLE.md has the how-tos and the rules. This file explains the
system and the night sky.

## Concept

"Sky first": the night sky is the main thing on screen, and a few words are set into it.

- The first screen is open black sky, with "Shante Zhou" very large in the lower-left corner and,
  under it, a row of four profile marks (Discord, LinkedIn, X, GitHub) and the three section
  links.
- Each section (about me, projects, writings) is a spread at least one screen tall: a heading, then
  words on the left page and the picture on the right, or each project on the centre line. Sky fills
  the gaps between spreads.
- The page ends on a screen with "© 2026 Shante Zhou" in its lower-left corner, mirroring the name
  on the first screen.
- The name on the first screen types itself out behind Minecraft's chat caret, is deleted part of
  the way or all of it and types again, at Shante's request: the one thing besides the sky that
  moves (see "The typed name").

The type is the only ornament: no boxes, lines or buttons, and no icons except the four profile
marks under the name, which Shante asked for ("let's replace it with a icon for discord, linkedin,
X, and github") and which are drawn in the font's own pixels. Plain white pixel text in Minecraft's
font, with no drop shadow; stars of every brightness in the sky, most of them white; black everywhere
else.

## Colour

| colour | token | use |
|---|---|---|
| `#000` | | page and canvas background, the moat (the profile marks' too), the backing behind text |
| `#fff` | `--white` | all text (dates, meta lines and the footer too), the profile marks, underlines, the focus frame, the selection background |

There are no text greys and no drop shadow: Shante asked for the plain font in white. Shante's name
in a paper's author line is marked up (`.meta strong`) but looks like the rest of the line. The
stars are light at every strength, from pure white with a soft glow to about 22 % white. Most are
white; some are slightly blue (`#d8e4ff`, `#c0d2ff`, `#aac0ff`) or slightly orange (`#ffe8d0`,
`#ffd6aa`, `#ffc48c`), at Shante's request ("i think it would be cool to have some of the stars be with
a slight blueish and orangeish hues. since stars may be of not the same hues"). Pages set `color-scheme: dark` and `theme-color`
`#000000`. Apart from those stars, the only colour on the site is inside the pictures.

## Type

mac's Minecraft, regular only: a 1:1 recreation of the Java Edition font. It is proportional, with
8 font pixels to the em, a cap height of 7, an x-height of 5 and a 4-pixel space. `--px` is one
font pixel (`0.125em`). `html` sets `-webkit-font-smoothing: none`, `font-synthesis: none` and
`font-kerning: none`. The `@font-face` uses `font-display: block`, and every page preloads the
file.

### Scale (font sizes in px)

| viewport width | name | h2 | h3 | lead | body, footer | meta |
|---|---|---|---|---|---|---|
| under 360 | 56 | 32 | 24 | 16 | 16 | 16 |
| 360–389 | 64 | 40 | 24 | 16 | 16 | 16 |
| 390–719 | 72 | 40 | 24 | 16 | 16 | 16 |
| 720–1023 | 80 | 48 | 32 | 24 | 16 | 16 |
| 1024–1199 | 96 | 48 | 32 | 24 | 16 | 16 |
| 1200–1439 | 120 | 56 | 32 | 24 | 16 | 16 |
| 1440–1679 | 136 | 56 | 32 | 24 | 20 on 2x screens, else 16 | 16 |
| 1680–2199 | 160 | 64 | 32 | 24 | 20 on 2x screens, else 16 | 16 |
| 2200 and up | 208 | 80 | 40 | 32 | 24 | 24 |

- name: `.name` (the `<h1>` on index, a `<p>` on contact). h2: section headings, and contact's
  `<h1>`. h3: project, post and paper titles. lead: the section links, the contact lines and
  `← index`; the profile marks are drawn in its font pixels. meta: `.meta` lines.
- Line height: 1.125 (the font's own 9-pixel line) for the name, h1 and h2; `--lh` (1.75) for
  everything else, h3 included, so a title that wraps keeps its underline clear of the next line.
- On the 16" MacBook (1728 wide, 2x): name 160, h2 64, h3 32, lead 24, body 20, meta 16.
- Below 360 the name and h2 are a step smaller, so the longest words ("contact", "projects") fit a
  small phone.
- The tagline, "my notes about AI, chem, trading, and other whimsicals", left the first screen on
  2026-11-05 ("i think we should delete the "my notes" part"); the profile marks took its place. It
  is still the `<meta name="description">` of index.html and contact.html, which search results
  and link previews show.

## Layout

### Tokens and steps

Sizes are tokens on `:root`, phone first, stepped at 360, 390, 720, 1024, 1200, 1440, 1680 and
2200px wide. Type sizes and horizontal tokens never follow the window. Vertical spacing may:
`--spread-top` uses vh, and short windows get their own steps. Vertical positions can come out
fractional, which is fine because engines snap text vertically; keep x offsets and letter-spacing
in whole font pixels.

| viewport width | `--m` | `--spread-top` | `--after-h2` | `--between` | `--sky-bottom` |
|---|---|---|---|---|---|
| under 720 | 24 | 96px | 40 | 64 | 48 |
| 720–1199 | 48 | max(96px, 14vh) | 48 | 64 | 48 |
| 1200–1679 | 72 | max(120px, 16vh) | 64 | 128 | 72 |
| 1680–2199 | 96 | max(120px, 16vh) | 80 | 128 | 96 |
| 2200 and up | 144 | max(120px, 16vh) | 96 | 128 | 144 |

In a window at least 1200px wide and at most 820px tall, `--spread-top` is 96px and `--after-h2`
48px, so a section's text ends clear of the bottom edge (in a 1440×790 window, a 13" MacBook's
Safari, the about text ends 58px above it).

- `--m`: the outer margin, and the gutter between the two pages. Side padding is
  `max(var(--m), env(safe-area-inset-left))` (and `-right`).
- `--measure`: 36em of body text, about 55 characters: 720px at 20px, 576 at 16, 864 at 24.
- `--spread-top`: space above each heading and below each spread's content. `--after-h2`: space
  under each heading. `--between`: between projects (half of it under each post or paper).
  `--sky-bottom`: under the name block on the first screen.
- `--foot`: the footer's height, one body line plus its bottom padding:
  `calc(var(--body) * var(--lh) + max(var(--m), env(safe-area-inset-bottom)))`.
- Media queries mostly move tokens. The structural steps: from 720, `.picture` and `.shot` are at
  most one measure wide; from 1200, the two-page grid, the list columns and a picture cap of
  `min(960px, 48em)`. After the width steps come the short-window step above, contact.html's
  short-window margins and the print styles; the `.links` line height below 360px sits next to the
  links.

### First screen

`header.sky` is at least one screen tall (`100svh`, with a `100vh` fallback): a flex column pushed
to the bottom. The name, the profile marks 1.25em under it, and the section links 1.5em under those
(ems of the lead: 10 and 12 of its font pixels) sit in the lower-left corner, `--sky-bottom` above
the bottom edge (or the safe-area inset, if larger). The row and its two gaps are exactly as tall as
the tagline's line and its two gaps were, so wherever the tagline fitted one line (590–719px
wide, and from 909px) the name is where it always was, to the pixel. Where it wrapped, the name
now sits lower: one lead line (42px) at 720–908px wide, one (28px) at 338–589, and two (56px)
below 338. The section links never moved. The rest of the screen is sky.

### Spreads

Each `section.spread` is at least one screen tall, with `--spread-top` above its heading and below
its content. So a section link lands every heading at the same height: 160px in a 1728×1000
window, 96px in a 1440×790 one and on phones. The last spread is one footer (`--foot`) shorter, so
the footer ends the last screen.

From 1200px wide a spread has two pages: a grid of
`minmax(0, min(var(--measure), (100% - var(--m)) / 2)) minmax(0, 1fr)` with `--m` between them.
The left page is one measure or half the spread, whichever is narrower; the right page takes the
rest.

- 16" MacBook (1728 wide, 2x): 96 | 720 | 96 | 720 | 96px.
- 1440 wide, 2x: 72 | 612 | 72 | 612 | 72px. The about text runs about 43 characters a line at
  1440, 48 at 1512 and 54 at 1728.
- The heading spans both pages; the words take the left page, the picture the right.
- Each project stands on the page's centre line: the title, the date, then the screenshot, at every
  width, under a heading that stays on the left like the others. Shante: "im wondering what it would
  look like for the image to be centered and then the title be above it, centered as well", and of
  the result: "the centered is fine for now we can optimize it later". The screenshot is at most
  `min(960px, 48em)` wide, and narrower on a short window, so that a whole project fits one screen
  (857px wide at 1440×900; checked at eleven sizes from 320 to 2560px wide, in both engines). On paper
  it stays on the left.
- The writings list becomes two balanced columns on the same lines (`columns: 2`).
- The top of the picture meets the top of the capitals beside it.

Below 1200 there is one column: the heading, the words, then the picture under them.

### contact.html

The home page's shell on one screen. The contact block (the heading at h2 size, the two lines,
`← index`) sits top left; the name block sits low left as on the home page, with the footer under
it. On short screens the gap between the two blocks shrinks to one lead line. The page needs a
window 712px tall from 720px wide (730 at 1024–1199), 838px from 1200, 863px from 1440 (856 at 1x),
971px from 1680 (964 at 1x) and 1326px from 2200 (754 at 720–908 before the profile marks
replaced the tagline, which wrapped there). In a shorter window the top margin, the space
under the name block and the footer's bottom padding are halved (the contact media query near the
end of style.css, whose height limits are those heights minus 1), so it still fits one screen down
to about 755px tall at 1440 wide (640 at 720, 658 at 1024, 730 from 1200, 827 from 1680, 1110 from
2200).
Shorter windows scroll a little. Re-measure the heights if contact.html's content changes.

### Redirect stubs

`about.html`, `projects.html` and `writings.html` were pages in the old design. Each now redirects
at once (`<meta http-equiv="refresh" content="0; url=./#about">` and so on) to its section. Each
has a canonical URL, `noindex`, the font preload, and one visible link in case the refresh is
blocked. They have no canvas and no script.

## Legibility over the sky

- **The moat.** Small text (`.lead`, `.words`, `.list`, `.meta`, `footer`) and the headings (h1,
  h2, h3) carry `--moat`: 39 black `text-shadow`s, one at every offset of a grid of font pixels
  that reaches two above and below each letter, three to its left and four to its right. It is
  built on `--ring`, the 24 shadows of a 5×5 square (two font pixels all round). On black it can't
  be seen. When a star passes behind the text, it is cut away around each letter, and the wider
  sides close every gap inside a line: a word space leaves five empty pixel columns, the space
  after a comma or full stop seven, and an "a" has a notch at its top-left.
- **The backing.** The moat leaves thin gaps between lines, and the sky turns, so sooner or later a
  star's glow would sit under a block of text and show there as grey slices. So on screen each
  block in `main` and the footer's line (`h2`, `h3`, `p`, `li`, `footer p`) has a black background,
  as wide as its text (`width: fit-content`), with a soft black edge (`box-shadow: 0 0 20px 10px
  #000`): the sky fades out behind the words. It is black on black, so nothing shows but stars
  dimming as they pass behind. Every element sits exactly where it does without it (checked at ten
  widths from 320 to 2560px in both engines). The first screen's links and marks keep to the moat.
- **Headings and the name.** h2 and h3 carry `--moat` too. The name carries nothing: at 56–208px
  its strokes are far bigger than any star, so the stars pass behind it, and a star showing in the
  counter of its "o" can't be mistaken for part of a letter. There is no drop shadow anywhere
  (Minecraft's own `#3f3f3f` shadow was removed at Shante's request).
- **The profile marks.** An SVG can't take `text-shadow`, so each mark carries its moat inside its
  SVG: a black copy of the mark's silhouette (the ink and everything it encloses: Discord's eyes,
  the "in", the cat, the hollow of X's wide stroke), widened by `--moat`'s reach (three font pixels
  to the left, four to the right, two above and below, as the text) and painted
  under the white ink. A star passing behind is cut away at least two pixels above or
  below a mark and three or four beside it, so it can't read as part of a mark, not even beside
  the X's one-pixel strokes; no sky ever shows inside a mark. The marks are 16 font pixels apart,
  so their moats never touch. On black nothing shows: no box, outline or glow.
- **Value and motion.** Text is pure white and, apart from the typed name, still; the stars are
  far smaller, mostly dim, and move slowly.
- **Size.** The body steps up to 20px on 2x screens from 1440px wide.
- **Cost.** None measured: with `bg.js` blocked the page costs 0.0 CPU points over a blank tab, and
  Chromium counts no layout or style work per second.

## Components

- **Links.** White (they inherit their text's colour), with a one-font-pixel underline three font
  pixels below the baseline, clear of the moat under descenders; `text-decoration-skip-ink: none`.
  On devices that hover, hovering doubles the underline to two font pixels, and pointing at a
  project screenshot does the same to its title (`.project:has(.shot:hover) h3 a`). Nothing else
  changes: no colour, no movement. The profile marks have no underline, so hovering one changes
  nothing (see Profile marks).
- **Focus.** `a:focus-visible` gets a one-font-pixel white outline four font pixels out, one pixel
  clear of the underline; round a profile mark, four font pixels out from its box. Tab order on
  index: Discord, LinkedIn, X, GitHub, about me, projects, writings, Reactor Lab (the screenshot
  links are skipped); contact.html has the same marks and section links after `← index`. Safari
  only tabs to links with Option-Tab unless "Press Tab to highlight each item" is on.
- **Small links** (`.links`: the section links, `← index`, a paper's pdf · code). The dot between
  two links is `<span aria-hidden="true">&nbsp;· </span>`, with two font pixels of margin on each
  side, so it wraps with the link before it and stays clear of a focus frame. An invisible
  `::after` (`inset: -.75em -.25em`) makes each link a finger-sized target, about 42px tall at
  16px. Below 360px wide the section links wrap onto two lines, so `.links` gets
  `line-height: 2.75` (44px at 16px) and the targets of the two lines don't overlap.
- **Profile marks** (`p.marks`, under the name on index.html and contact.html). Four links, in
  this order: Discord, LinkedIn, X, GitHub. Each is that brand's own mark, redrawn in white as pixel
  art on the lead's font-pixel grid (one font pixel = the lead's size ÷ 8), never in the brands'
  colours: Discord's controller face, LinkedIn's "in" knocked out of a rounded square, X's X (the
  wide stroke drawn as an outline round a hollow, the thin one broken where it meets it), GitHub's
  Invertocat knocked out of a disc.

  | lead | font pixel | marks (Discord, LinkedIn, X, GitHub) | gap | row | target (each) |
  |---|---|---|---|---|---|
  | 16 (below 720) | 2px | 36, 28, 32, 32 × 32px | 32 | 224px | mark + 8px all round: 48px tall |
  | 24 (720–2199) | 3px | 54, 42, 48, 48 × 48px | 48 | 336px | mark + 12px: 72px tall |
  | 32 (2200 up) | 4px | 72, 56, 64, 64 × 64px | 64 | 448px | mark + 16px: 96px tall |

  - Size: each link's box is 16 font pixels tall (two lines of the lead) and as wide as its
    drawing; the gap between boxes is 16, one mark's width. Discord (18 × 14) and LinkedIn
    (14 × 14) sit one pixel in from the top and bottom, the X and GitHub (16 × 16) fill the height:
    a square looks bigger than a disc of the same height, and Clyde's face is wider than tall.
  - Shapes: LinkedIn's rounded square (one pixel cut from each corner) and GitHub's disc are the
    brands' own shapes, drawn in pixels; they are not rounding (STYLE.md, hard rule 5), so don't
    square them off.
  - Drawing: an inline `<svg viewBox>` counted in font pixels, reaching past the box by the moat's
    reach (x from −3 to the width + 4, y from −2 to 18; negative margins keep the box), with two
    paths of whole-pixel rectangles (`M x y h w v h h -w z` each): the moat, then the ink. Paint,
    `shape-rendering: crispEdges` and the size are set in style.css; the svg's `width` and
    `height` attributes, in ems (Discord `3.125em` × `2.5em`), and its `fill` attributes
    (`currentColor` for the ink, `none` for the moat) are only what it falls back to without the
    stylesheet, where the marks then draw in the browser's link colour. `tools/marks.py` writes
    the svgs from the bitmaps below. Every size is a whole number of device pixels at 1x, 2x and 3x, so
    each font pixel of a mark is a solid square, as in the type. Checked headless in WebKit and
    Chromium at 12 sizes from 320 to 2560 wide at 1x, 2x and 3x, on both pages, on black and on a
    flat grey sky: every font pixel of every mark and of its moat is one flat square of the right
    colour.
  - Moat: see Legibility. Print drops it (`fill: none`); the ink follows `--white`, so it prints
    black on white.
  - Targets: an invisible `::after`, four font pixels all round (48px tall on phones), clear of
    the next mark's and, by at least 8px, of the section links'.
  - Hover: nothing changes. The site's rule is that hover thickens an underline and does nothing
    else, and a mark has no underline to thicken. An underline that appears on hover was tried (two
    font pixels, two pixels under the mark, as on a hovered word): under a 48px mark it reads as a
    selected-tab bar, which is chrome. The pointer cursor and, from the keyboard, the focus frame
    are the feedback.
  - Accessibility: each link's name is the platform's (`aria-label="Discord"` and so on), and the
    SVG is `aria-hidden`. The links open in the same tab, like every link here, and carry
    `rel="me"`: they are Shante's own profiles.
  - Changing a link: STYLE.md, "Change a profile link". The bitmaps the paths were made from
    (`#` = white ink; the moat is worked out from them). `tools/marks.py` holds the same bitmaps
    and is their source; this copy is for reading:

    ```
    Discord 18x14        LinkedIn 14x14   X 16x16            GitHub 16x16
    ..................   ..............   ####..........#.   .....######.....
    .....##....##.....   .############.   .#..#........#..   ...##########...
    ..##############..   ##############   ..#..#......#...   ..##.######.##..
    ..##############..   ##..##########   ..#..#.....#....   .###..####..###.
    .################.   ##..##########   ...#..#...#.....   .###........###.
    .################.   ##############   ....#..#.#......   ####........####
    ##################   ##..#..#...###   .....#..#.......   ###..........###
    #####..####..#####   ##..#.......##   ......#..#......   ###..........###
    ####....##....####   ##..#..###..##   ......#..#......   ###..........###
    ####....##....####   ##..#..###..##   ......##..#.....   ###..........###
    #####..####..#####   ##..#..###..##   .....#..#..#....   ####........####
    ##################   ##..#..###..##   ....#....#..#...   .#.###....#####.
    ##################   ##..#..###..##   ...#......#..#..   .##.##....#####.
    .####........####.   ##############   ..#.......#..#..   ..##......####..
    ...##........##...   .############.   .#.........#..#.   ...###....###...
    ..................   ..............   #...........####   .....#....#.....
    ```
- **Selection.** White background, black text, no moat.
- **Section heading.** The section's lowercase name as an `<h2>`, then `--after-h2` of space.
- **Project** (`article.project`). The title link (`h3`), a meta line (the date, then an optional
  status after a dot), the screenshot link, all centred. Projects are `--between` apart.
- **Post and paper** (`article.entry`). At most one measure wide, with half of `--between` under
  each, never split across the two columns. A post: title, one or two lines, date. A paper: title,
  authors, arXiv id and year, pdf · code.
- **Picture** (`img.picture`). The about picture, unframed, with square corners.
- **Screenshot** (`.shot img`). A project's screenshot reads as an app window: its corners round by
  four font pixels (`calc(4 * var(--px))`: 8px on phones, 10px on 2x screens from 1440px, 12px at
  2200px and up). Nothing else: no border, no shadow.
- **Footer.** "© 2026 Shante Zhou" in white, at body size, with the moat, in the lower left of the
  last screen.
- **Favicon.** A pixel star, scaled ×4, white on black, 32×32.
- **Print.** `@media print` moves the tokens to black type on white (no ring or moat; the profile
  marks print black on white, without their moat), hides the sky, drops the backing behind text,
  drops the screen-tall heights and leaves no padding under the sky or the footer, so
  contact.html prints on one sheet in Safari as well as Chrome.

Nothing on the page moves except the sky and the typed name on the first screen. Section links jump straight to their section:
smooth scrolling would also glide every visit that opens a #section URL.

## The typed name

Shante asked for it: "have it so that my name on the landing page when the user joins is being
typed out. then it gets deleted letter by letter, then typed out again. like minecraft style too".
And on 2026-11-06: "for the name i want it to be like Shante Zhou --> Shan --> Shante Zhou", "like 3
perpetual patterns where it doesnt delete fully, sometimes it does and sometimes it doesn't."
Only the `<h1>` on index.html types; contact.html's name stays still.

### What it does

- **Arrival.** The line starts empty, with the caret blinking, for 0.6 s.
- **Typing.** "Shante Zhou" appears one character at a time (the space is a keystroke too),
  `TYPE_GAPS` apart: 120, 95, 110, 140, 90, 130, 160, 105, 85 and 115 ms. Uneven like a person,
  and the same every time (no randomness).
- **Three passes, for good.** From here on it goes through three passes in turn: back to "Shan",
  back to "Shante", and all the way to the empty line (`TYPE_STOPS`). In each pass:
  - **Hold.** The full name stays 5 s, the caret blinking.
  - **Deleting.** Like a held backspace: one character goes, then a 400 ms pause (the key-repeat
    delay), then one every 45 ms, down to the stop.
  - **Wait.** 1 s where the deleting stopped, the caret blinking.
  - **Typing.** The rest of the name comes back, `TYPE_GAPS` apart.

  The passes take 7.31 s, 7.00 s and 7.955 s: 22.27 s and 103 steps a round.
- **The caret** is Minecraft's chat caret at the end of the text: the font's own `_` (five font
  pixels wide, one below the baseline), white, drawn where the next character would start, so
  after the space it waits at the start of "Zhou" (on phones, the start of the second line). It
  stays on while the name types or deletes and blinks 0.3 s on, 0.3 s off while the line waits
  (Minecraft blinks every 6 ticks at 20 ticks a second).

### How it is built

- **Markup.** `<h1 class="name" aria-label="Shante Zhou">` holds `<span class="letters"
  aria-hidden="true">` with one `<span>` per character and no whitespace between the tags. The
  heading's accessible name is the label, so a screen reader reads "Shante Zhou" once, whatever
  is showing; the text content is still "Shante Zhou" for search. Title and description are
  unchanged.
- **One attribute per step.** `bg.js` sets `data-typed` on the h1: `"n"` shows the first n
  characters with the caret after them, `"n off"` the same with the caret off (only `"0 off"`,
  `"4 off"`, `"6 off"` and `"11 off"` happen). style.css does the rest with `visibility`: hidden characters keep their room,
  so the wrap and everything under the name never move (checked at every width from 300 to 1320px
  and every 10px from 1400 to 2600, in both engines: every character, the h1, each profile mark
  and each section link sit exactly where they do on a page without the typing, in six states
  from the empty line to the full name; the name takes two lines up to 605px wide).
- **The caret** is a `::before` on `.letters` (before the first character) and an `::after` on each
  character, `content: "_"`, all `visibility: hidden` but the one at the current position. Each
  has `letter-spacing: -6 font pixels`, so its box is 0 wide: it takes no room, never changes where
  a line breaks and never reaches past the window (a negative `margin-right` would: Chromium counts
  the advance before the margin and wraps "Zhou" early at 606–774px). The glyph is drawn as
  overflow, after the last character, at a whole font pixel like every letter.
- **Before the script.** With scripts on, the letters wait hidden until `bg.js` sets the first
  state (so the line starts empty, with no flash of the full name), for 2 s at most
  (`name-wait`, a 0 s animation 2 s late): if `bg.js` never runs, the name shows by itself.
  If `bg.js` starts after those 2 s (`TYPE_WAIT`), it starts at the full name and carries on from
  there, so the name never vanishes once seen. A page that loaded out of sight (a background tab,
  or a page Safari preloads while the address is typed) has shown nothing yet, so it starts on the
  empty line when it first comes on screen. Without scripts the markup's full name shows.
- **Reduced motion and print.** All of it sits in `@media screen and (prefers-reduced-motion:
  no-preference)`: under reduced motion and on paper the name is simply there, with no caret,
  even if the setting changes while the page is open.
- **One edge.** In a window 606–626px wide the name just fits one line, and the caret after the
  last "u" hangs partly past the window's edge. Its box is 0 wide, so the page never scrolls
  sideways; the wrap stays as it was everywhere else.

### The clock

A few lines in `bg.js` ("the name, typed out"). The schedule is built once, as two arrays (when,
which state). The clock runs while the sky's clock runs (so not in a hidden tab, under reduced
motion or with `?paused`) and while the h1 is in view (an `IntersectionObserver`); otherwise it
stops where it is and carries on from there. Between steps it does nothing.

The name and the sky's ticks share one sleep: a timer wakes just before whichever is due first and
asks for an animation frame. A step due within half a tick (33 ms) of a tick brings that tick with
it, so the two share one rendering update instead of costing two. Checked in real time for two
rounds (217 steps) at 1728×1000 in both engines: every step in order, within 26 ms of the schedule.

### Cost

The typed name has no separate figure here: it runs in every number under "Performance" below,
where the whole sky and the name together cost less than the predator/prey sky did. Each step is a
style recalculation and a repaint of two small rectangles of the name, about 4.6 a second. Without
the ring the name once carried below 1200px (it kept the old sky's sprites off the letters; the
stars are too small to need it), a step repaints only the glyphs at every width.

Cheaper, if that matters: fewer steps. The caret's blinking is about half of them. For a steady
caret during the hold, put `t += TYPE_HOLD;` in place of `idle(nameN, TYPE_HOLD);`.

## The sky (`bg.js`)

Shante's words, on 2026-11-06: "instead of our lokta volterra visualization, its just the black with
glowing white stars in the background, like the night sky. they should be of varying intennsity to
look like a dark night with bright stars". Then: "i think what would be cool if the stars were
transient and changes in intensity slightly just like real stars and maybe rotate around the screen
together. just as if you were sitting in the north pole and you were to do a timelapse of the sky,
you would see the stars rotate as our earth is rotating". And of this build: "this one is geniunely
perfect, lets make this the top runner out of all of them including the predator and prey one".

The predator/prey sky it took over from was never committed. It is kept, with its model, tuning
and docs, outside this repo, in `~/Desktop/Projects/shantezhou-site-options/predator-prey/`.

### What it shows

- **A field of stars.** About 700 per million CSS px, from a fixed seed (`SEED`), so the sky is the
  same on every visit and a window only shows more or less of it. Slow waves of density make them
  gather and thin out as a real sky does. The field reaches 2200px from the pole each way; a window
  more than about 4400px across its diagonal would show empty corners.
- **Very different brightness.** Each star has a magnitude from 0 to 6.2. Each step dimmer is about
  2.4x as many stars, so most are barely there and a few are brilliant, on black. On-screen
  brightness is `10^(-0.11 m)`: magnitude 0 is white, 6 about 22 %. Stars brighter than 3.4 glow,
  and the brighter the wider, up to about 66px across at its faintest edge.
- **Colour.** Shante: "i think it would be cool to have some of the stars be with a slight blueish and
  orangeish hues. since stars may be of not the same hues". 60 % are white, 22 % slightly blue and 18 %
  slightly orange, in three strengths each, after real stars' colours (hot stars are blue-white, cool
  ones orange), and the pole star is a little yellow, as Polaris is. On a bright star the colour shows
  mostly in its glow, and its centre is nearly white, as in a photograph. The colours come from a
  random stream of their own, so changing them moves no star: with `?white` the sky matches the build
  before them pixel for pixel, in both engines.
- **Turning.** All of them together, counterclockwise, as the sky turns seen from the North Pole
  looking straight up, one turn every 360 s (a degree a second). The pole is the middle of the
  window, and a bright pole star sits just off it, so it barely moves. Stars drift in and out at the
  window's edges. The angle comes from the clock, so the sky carries on across pages and reloads
  (two pages open together agree within 0.03°).
- **Shimmer.** The brightest stars (brighter than 1.8: about 40 in reach at 1728×1000, about 20 on a
  phone) each waver on two slow waves of their own, between full brightness and 66–84 % of it,
  depending on the star. The fainter stars dim 5–12 % at most as they cross the screen's pixels and the browser's
  filtering spreads their light (measured on 260 stars across a degree of turn, WebKit 5 %,
  Chromium 12 %).

### How it is built

- **One canvas, drawn once.** A square (`#bg`) big enough to cover the window at any angle: twice
  the distance from the pole to the far corner, plus 24px, plus room for a phone's URL bar on touch
  screens. At most 2 canvas px per CSS px and 4096 on a side. Drawn with `lighter`, so overlapping
  glows add up. It is not drawn again unless the window changes size.
- **Built round it.** `bg.js` wraps the canvas: `#sky-clip`, fixed and the size of the window, clips;
  `#sky-rot` inside it turns. So the oversized square can't make the page scroll sideways.
- **The shimmering stars** are small canvases of their own (`.tw`), children of `#sky-rot`, so they
  turn with the rest, each with `will-change: opacity`. Changing one never touches the big canvas.
- **A tick** (15 a second) sets `#sky-rot`'s transform and the opacity of a third of the `.tw`s, each
  only if its value changed. That is all the work there is once the sky is drawn.
- **Resizing** repaints, 180 ms after the last change. A phone's URL bar coming and going doesn't:
  the pole stays where it is and the canvas already reaches far enough.
- **Stopping.** A hidden tab stops everything: no ticks, timers or animation frames. Under reduced
  motion there is one still sky at the clock's angle and nothing runs, even if the setting changes
  while the page is open. On paper there is no sky. Without scripts the page is black, with no
  stars, and the name shows by itself.

### Performance

Measured on 2026-11-06 back to back (A B B A), 15 s windows after 3 s, with everything else on the
laptop using 44–107 % CPU. WebKit 26.4 is Safari's engine. Chromium ran with real GPU compositing
(perf.py `--chromium-gpu`):

| CPU %, 100 = one core; two runs each | WebKit, MacBook: 1728×1000 at 2x | WebKit, phone: 390×844 at 3x | Chromium with real GPU compositing, MacBook |
|---|---|---|---|
| the predator/prey sky, for comparison | 6.73 (6.82, 6.64) | 6.99 (6.79, 7.20) | 7.86 (7.95, 7.77) |
| **this sky, with the typed name** | 4.26 (4.35, 4.16) | 4.44 (4.46, 4.42) | 8.46 (9.04, 7.87) |

So the whole sky and the name cost about 2.5 points less than the old sky in WebKit on a MacBook,
2.6 less on a phone, and about the same in Chromium (+0.6). Absolute figures drift with the
rest of the laptop's load: compare within a set of runs.

**Read WebKit's figures with care.** Headless WebKit doesn't present to a real display, so it hardly
counts what compositing costs. That made one build look like a bargain (next table) that Chromium,
which does composite on the GPU though it has no real display either, showed to be three times the
old sky. Nothing has been measured in Safari itself or on an iPhone.

**Memory.** The canvas takes about 67 MB at 1728×1000 at 2x (4092 × 4092 × 4 bytes) and 23 MB on a
390×844 phone. That is GPU-side memory, which the browser processes' reported totals (371–372 MB against
376–377 MB for the old sky, in WebKit) don't show. Capping the canvas at 1.5 canvas px per CSS px would
bring the MacBook's to about 38 MB; its CPU figures were within noise of these. It hasn't been
done because Shante approved the sharper one.

The script is about 8 KB gzipped (the old sky's was 32 KB), and the page about 28 KB in all.

Other ways to draw it were built and measured the same way, in two sets, and set aside:

| how | WebKit, MacBook | WebKit, phone | Chromium, MacBook |
|---|---|---|---|
| *first set:* the predator/prey sky | 6.79 | 6.91 | 7.82 |
| the browser turns it (a CSS animation) and fades 75 star layers: no script at all per frame | 2.07 | 2.04 | **24.46** |
| the same with no star layers | 1.94 | 2.01 | 12.34 |
| turned from the script at 20 Hz, shimmer repainted on the big canvas | 7.34 | 5.93 | 9.45 |
| every star redrawn each tick at 20 Hz, on a canvas the size of the window | 10.59 | 8.73 | 10.76 |
| *second set:* the predator/prey sky | 7.30 | 6.72 | 7.14 |
| as built but 20 Hz | 5.41 | 4.65 | 8.61 |
| **as built: 15 Hz** | **5.58** | **4.13** | **7.07** |
| as built, no shimmer | 3.49 | 3.88 | 5.43 |
| as built, canvas at 1.5 per CSS px | 4.87 | 3.76 | 7.38 |
| the same sky on the 3px pixel grid, redrawn at 12 Hz | 5.61 | 5.23 | 5.17 |

The CSS animation runs at the display's full rate, so the compositor works every frame; setting the
transform from the script at 15 Hz means it works only 15 times a second.

Shante approved this sky at 20 Hz or above, and it now runs at 15. If the turning ever looks less
than smooth, `?hz=20` compares; going back to 20 costs about 1.5 points in Chromium.

### Tuning

All in the block at the top of `bg.js`:

| constant | now | what it does |
|---|---|---|
| `SEED` | 7 | which sky |
| `TURN_S` | 360 | seconds per turn |
| `HZ` | 15 | ticks a second |
| `DENSITY` | 700 | stars per million CSS px |
| `MAX_MAG`, `MAG_SLOPE` | 6.2, 0.38 | how faint the faintest are, and how many faint ones to each bright one |
| `ALPHA_SLOPE` | 0.11 | how much dimmer each magnitude looks |
| `HALO_MAG` | 3.4 | stars brighter than this glow |
| `LAYER_MAG` | 1.8 | stars brighter than this shimmer, each a layer of its own: more layers cost more |
| `TINT_RGB`, `TINT_SHARE` | 7 colours | the stars' colours, and what share of the stars has each |
| `SCALE_CAP`, `MAX_CANVAS` | 2, 4096 | the canvas's sharpness and size limit |

The size and strength of the glow are `haloR` and `haloA`; the pin-prick's size is `coreR`. Measure
anything new back to back, repeated, in WebKit and in Chromium with `--chromium-gpu`, against the
budget in PRODUCT.md.

### Debugging

`window.__bg`: `.stats()` (stars, layers, ticks, angle, the typed name's state), `.pause()`,
`.resume()`, `.angle(radians)` holds the sky at an angle and `.angle()` lets it follow the clock
again, `.typeAt(ms)` holds the name at that moment after arrival and `.typeAt()` lets it run on.

URL parameters, read once at load: `?seed=N` another sky, `?still` no shimmer, `?nospin` no
turning, `?white` no colours, `?turn=S` seconds per turn, `?hz=N` ticks a second, `?paused` wait for
`.resume()`.
