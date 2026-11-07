# shantezhou.github.io

Shante Zhou's personal site, served by GitHub Pages at https://shantezhou.github.io. One page with
three sections (about me, projects, writings) in white pixel type, set in Minecraft's font, on a
black night sky. Behind the text, stars of very different brightness, some slightly blue or orange,
shimmer and turn together around the pole, like a timelapse taken at the North Pole. Plain static files: HTML, one
stylesheet, one script for the background, one font. There is no build step of our own: this folder
is both the source and the site (GitHub Pages runs Jekyll over it, which copies the files as they
are; `_config.yml` keeps the docs off the site).

## Files

| file | what it is |
|---|---|
| `index.html` | the page: first screen (name, profile marks, section links), the about me, projects and writings spreads, the footer. Commented templates for a project, a post and a paper |
| `contact.html` | email and discord, in the home page's shell. Not linked from `index.html` for now |
| `about.html`, `projects.html`, `writings.html` | redirect stubs to `./#about`, `./#projects`, `./#writings`, so links to the old pages still land |
| `style.css` | the only stylesheet |
| `bg.js` | the turning night sky, and the clock that types the name on index.html; the only script |
| `favicon.png` | a pixel star, white on black, 32×32 |
| `fonts/macs-minecraft-regular.woff2` | the only font file |
| `fonts/OFL.txt` | the font's licence; it ships with the font |
| `img/minecraft-cherry-lake.webp` | the about me picture, 1200×676 |
| `img/reactor-lab.webp` | the Pocket Reactors screenshot, 1200×638 (from when the app was called Reactor Lab) |
| `.gitignore` | ignores `.impeccable/` and `.DS_Store` |
| `tools/marks.py` | draws the four profile marks' svgs from their bitmaps into both pages (STYLE.md, Change a profile link); not part of the site |
| `_config.yml` | keeps the five docs and `tools/` out of GitHub Pages' Jekyll build, so they aren't published |

## Preview

From the repo root:

    python3 -m http.server 8000

Then open http://localhost:8000. Don't open `index.html` from Finder (`file://`): Safari then
doesn't load the pixel font at all (it refuses the font preload for a file page), and links such as
`./` and `./#about` show a folder listing.

## Publish

1. Edit locally (usually: tell Claude what to change).
2. Preview as above.
3. Check `git status` first: any other .md file in this folder would be published as a page. Check
   that `grep -n PLACEHOLDER index.html contact.html` finds nothing: the profile links must be
   Shante's real ones. Then `git add -A && git commit -m "..." && git push`
4. Pushing to `main` publishes: GitHub Pages redeploys https://shantezhou.github.io, usually within
   a minute. Nothing is public before the push.

The repo, github.com/shantezhou/shantezhou.github.io, has to stay public: on the free plan Pages
only serves public repos.

## Docs

Read the relevant one before changing anything.

| file | covers |
|---|---|
| `STYLE.md` | adding a project, post, paper or page; voice; allowed type sizes; the hard rules |
| `DESIGN.md` | the design as built: colours, type, layout, legibility, components, the typed name, and the sky |
| `PRODUCT.md` | what the site is for, who uses it, its constraints (with the measured resource budget), principles |
| `PUBLISHING.md` | how an Obsidian note becomes a post |

## Credits

Type: "mac's Minecraft" by macimas, under the SIL Open Font License 1.1 (`fonts/OFL.txt`). It is a
fan-made recreation of Minecraft's font, not Mojang's.

## State as of 2026-11-07

- New design: black sky, white pixel type. It replaces the old white-paper, JetBrains Mono,
  no-JavaScript design and its docs completely.
- The sky: since 2026-11-06 a turning night sky (DESIGN.md, The sky). The predator/prey sky it took
  over from, never committed, is kept outside this repo in
  `~/Desktop/Projects/shantezhou-site-options/`, with the other options that were tried.
- Writings: no posts or papers yet; the section says "loading...". Post pages (`posts/`) are not
  designed yet (see PUBLISHING.md).
- Projects: Pocket Reactors, whose code lives in a private repo (`shantezhou/PocketReactors`) and which
  runs on Vercel at https://pocketreactors.vercel.app/. Avalon Agents is commented out until it has
  an interface to screenshot.
- `contact.html` has been unlinked since 2026-10-25 ("delete the contact me part for now").
- First screen: since 2026-11-05 the tagline is gone (it stays the meta description) and four
  profile marks (Discord, LinkedIn, X, GitHub) sit under the name, on index.html and contact.html.
  They link to Shante's real profiles (STYLE.md, Change a profile link).
- Projects: since 2026-11-06 each stands on the page's centre line, title above screenshot ("the
  centered is fine for now we can optimize it later").
- The name on index.html's first screen types itself out behind Minecraft's chat caret, is deleted
  back to "Shan", to "Shante" or all the way in turn and types again (DESIGN.md, "The typed name");
  contact.html's name stays still.
- Tested headless in WebKit 26.4 (Safari's engine) and Chromium 148. Not yet tested in Safari
  itself, on an iPhone, or in Firefox.
- Known issues:
  - `contact.html` still scrolls in windows shorter than about 755px (1440 wide) and on landscape
    phones.
  - When a link is focused and hovered at once, its hover underline touches the focus frame.
