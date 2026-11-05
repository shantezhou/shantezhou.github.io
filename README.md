# shantezhou.github.io

Shante Zhou's personal blog — "my notes about AI, chem, trading, and other
whimsicals." Plain HTML + CSS. No JavaScript, no build step, no framework,
ever. This folder is both the source and the site.

## How this repo works

- **This folder = the draft space.** Edit files, open `index.html` in a
  browser to preview. Nothing is public until pushed.
- **Push = publish.** `git push` → GitHub Pages redeploys
  https://shantezhou.github.io automatically in ~1 minute.
- Repo: `github.com/shantezhou/shantezhou.github.io` (user site — Pages
  publishes from the default branch automatically; repo must be public for
  the site to be live on the free plan).

## The rulebooks (read before changing anything)

| File | What it owns |
|---|---|
| `STYLE.md` | How everything looks + the new-post checklist. Versioned; update it when the style changes. |
| `PUBLISHING.md` | How an Obsidian `.md` export becomes a post (mapping table, slug/date conventions). |
| `PRODUCT.md` / `DESIGN.md` | Design-process records from the initial build (impeccable skill). Reference, rarely touched. |

## Site map

- `index.html` — home: name, category line (about me · projects ·
  writings), tagline, then the post list (Lilian-Weng-style entries: bold
  title, 1–2 line summary, date, 1px rule between — no boxes).
- `about.html` — bio (Shante's verbatim voice, lowercase), Minecraft
  picture underneath, unframed.
- `projects.html` — projects, each a title, a screenshot (`img/`) and a
  date line. Reactor Lab for now; Avalon Agents is commented out until it
  has an interface to screenshot.
- `writings.html` — papers. Says "loading..." for now; commented-out
  entry template inside.
- Reactor Lab is not in this repo: it lives in a private repo
  (`shantezhou/PocketReactors`) and runs on Vercel at
  https://pocketreactors.vercel.app.
- `contact.html` — email + `discord: @unlikelihood`, right under the
  heading. Unlinked from the category line for now (2026-10-25).
- `posts/*.html` — one file per post. `img/` — compressed pictures (≤1200px
  WebP).

## State as of 2026-10-25

- **Font**: TRIAL — Verdana for text, JetBrains Mono for code/ASCII (see
  the note atop `style.css`). Not yet blessed as final; STYLE.md still
  names JetBrains Mono as the face pending Shante's verdict.
- **No posts or papers yet**: the index and `writings.html` carry
  commented-out entry templates. The post-page skeleton lives in STYLE.md.
- **Live**: the repo is public and Pages serves https://shantezhou.github.io.
- **Next planned**: first real post via the Obsidian pipeline — Shante
  exports a note, it gets converted per PUBLISHING.md, reviewed, pushed.

## Publishing a change (the whole ceremony)

1. Edit locally (usually: tell Claude what to change).
2. Preview in the browser.
3. `git add -A && git commit -m "..." && git push`
4. Live in about a minute.
