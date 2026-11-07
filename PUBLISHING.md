# Publishing: Obsidian → site

How a note exported from Obsidian becomes a post here. STYLE.md owns the templates and how things
look; this file owns how a note's markdown turns into the site's HTML. Update both when the process
changes.

## The pipeline

1. **Export.** Shante exports the note from Obsidian as plain `.md` and hands it over (the file
   path in chat).
2. **Clean pass.** Claude tidies structure and prose without changing meaning: fixes typos,
   tightens headings, and flags (never silently rewrites) anything that looks wrong or can't be
   checked. The voice stays Shante's, lowercase included.
3. **Convert.** Build `posts/<slug>.html` from the page shell in STYLE.md, using the mappings
   below.
4. **List.** In `index.html`, copy the post template from the comment in the writings
   `<div class="list">` to just below that comment, newest first. With the first post or paper,
   delete `<p>loading...</p>`. Papers are not posts: they get the paper template in the same list, and no
   page here.
5. **Review.** Shante reads the rendered page (`python3 -m http.server 8000`, see README.md), and
   adjustments loop until it's right. Anything the conversion decided alone is called out.
6. **Publish.** Commit and push to `main` (README.md, Publish). Keep the exported `.md` out of the
   repo: GitHub Pages would publish it as a page of its own (`_config.yml` excludes only the docs).

## Note → writings entry

| from the note | in `index.html` |
|---|---|
| title (frontmatter, else the first `#` heading) | `<h3><a href="posts/<slug>.html">...</a></h3>`, plus the post page's `<title>` and `<h1>` |
| nothing: written fresh | `<p>` with one or two honest lines, approved by Shante |
| publishing date | `<p class="meta"><time datetime="YYYY-MM-DD">YYYY-MM-DD</time></p>` |

## Note body → post page

Post pages are not designed yet. Today style.css covers links, `h3`, and paragraphs inside
`<div class="words">` (the measure, the gap between paragraphs, the moat). Everything else below
needs rules in style.css before its first use, within DESIGN.md's system: white on black with
no drop shadow, sizes on the 8px grid, the moat on small text. The first post settles them.

| Obsidian | becomes | watch out |
|---|---|---|
| YAML frontmatter | `title` → `<h1>` + `<title>`; `date` → `<time>`; everything else dropped unless we decide otherwise | |
| `# Heading` (the first) | the post title, if the frontmatter has none | |
| `##` / `###` | `<h2>` / `<h3>`; deeper levels flatten to `<h3>` | a bare `<h2>` gets the browser's 1.5em, off the grid: give it a token |
| paragraphs | `<p>` inside `<div class="words">` | |
| `**bold**` / `*italic*` | `<strong>` / `<em>` | only the regular face ships, so both look like plain text until bold and italic faces are added |
| `==highlight==` | `<mark>`, sparingly | the browser's default is a yellow box, an accent colour |
| `` `inline code` `` | `<code>` | the browser switches code to a system monospace font; it needs `font: inherit` |
| fenced code blocks | `<pre><code>`; escape `<` `>` `&`; the language tag is dropped (no highlighting) | as for inline code; and the pixel font is proportional, so columns won't line up |
| `$inline math$` | `<var>` + `<sup>`/`<sub>` + Unicode; complex LaTeX is hand-rewritten in this plain notation | `<sup>` and `<sub>` shrink text off the grid: prefer the font's ⁰–⁹ and ₀–₉ |
| `$$display math$$` | `<p class="math">...</p>` | |
| `> quote` | `<blockquote>`: real quotes get a real attribution; unattributed ones read as asides | |
| `> [!note]` callouts | `<blockquote>` aside (the callout type is dropped) | |
| `-` / `1.` lists | `<ul>` / `<ol>` (checkboxes become plain items) | |
| tables | `<table>`, narrow enough for the measure (36em) | |
| `[text](url)` | `<a href="url">text</a>` | |
| `[[wikilink]]` | a link if the target is published here; otherwise plain text, flagged in review | |
| `![[image]]` / images | flagged back to Shante: a WebP in `img/` (STYLE.md, Images), a description in the text, or cut | |
| `---` | dropped: the site draws no lines | |
| footnotes `[^1]` | folded into the text as a parenthetical or an aside; no footnote apparatus | |
| `#tags`, `%%comments%%` | dropped | |

The font has Greek and most maths (− ± × ÷ ≈ ≠ ≤ ≥ √ ∞ ∈ ∑ ∫ ∂, and superscript and subscript
digits). It lacks ∇, ‖, ∪, ∏, ℝ, ℕ, ℤ, ⟨ ⟩ and letter subscripts such as ᵢ and ₙ: those fall back
to a system font.

## Slugs and metadata

- Slug: lowercase, hyphenated, short (`gradient-descent`, not `gradient-descent-in-brief-2026`).
- Date: the day of publishing (ISO), not the note's creation date, unless Shante says otherwise.
- `<meta name="description">`: one honest sentence, written fresh.

## Open questions (settle when the first real export lands)

- Which frontmatter fields Shante's vault actually uses.
- Whether long derivations keep Unicode maths or we revisit rendering.
- Whether notes (as opposed to posts) get a lighter clean pass.
- What a post page looks like: the title block, headings, code, maths, quotes, tables, pictures.
- Whether to ship the font's bold and italic faces for `<strong>` and `<em>`.
