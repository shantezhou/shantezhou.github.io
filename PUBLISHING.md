# Publishing pipeline — Obsidian → blog · v0.1

How a note exported from Obsidian becomes a post on this site. STYLE.md owns
how things look; this file owns how markdown constructs are parsed into the
blog's HTML blocks. Update both when the process changes.

## The pipeline

1. **Export** — Shante exports the note from Obsidian as plain `.md` and
   hands it over (drop the file path in chat).
2. **Clean pass** — Claude tidies structure and prose *without changing
   meaning*: fixes typos, tightens headings, flags (never silently rewrites)
   anything that looks factually wrong or unverifiable.
3. **Convert** — apply the mapping table below to produce
   `posts/<slug>.html` from the post skeleton in STYLE.md (or
   `notes/<slug>.html` for a research note).
4. **List** — add the one-line entry to `index.html` (blog) or `notes.html`
   (notes), newest first.
5. **Review** — Shante reads the rendered page; adjustments loop until it's
   right. Anything the conversion had to decide unilaterally is called out.

## Mapping table: Obsidian markdown → blog HTML

| Obsidian construct | Becomes |
|---|---|
| YAML frontmatter | `title` → `<h1>` + `<title>`; `date` → `<time>`; everything else dropped unless we decide otherwise |
| `# Heading` (first one) | The post title (if frontmatter has none) |
| `##` / `###` | `<h2>` / `<h3>` — deeper levels flatten to `<h3>` |
| Paragraphs | `<p>` |
| `**bold**` / `*italic*` | `<strong>` / `<em>` |
| `==highlight==` | `<mark>` (inverts; use sparingly) |
| `` `inline code` `` | `<code>` |
| Fenced code blocks | `<pre><code>` — escape `<` `>` `&`; language tag dropped (no highlighting) |
| `$inline math$` | `<var>` + `<sup>`/`<sub>` + Unicode (∇ η θ λ ≈ ‖…‖), per STYLE.md; complex LaTeX gets hand-rewritten in this plain notation |
| `$$display math$$` | `<p class="math">…</p>` |
| `> quote` | `<blockquote>` — real quotes get attribution; unattributed = aside |
| `> [!note]` callouts | `<blockquote>` aside (callout type dropped) |
| `-` / `1.` lists | `<ul>` / `<ol>` (checkboxes become plain items) |
| Tables | `<table>` — must fit the 66ch measure |
| `[text](url)` | `<a href="url">text</a>` |
| `[[wikilink]]` | Link if the target is published here; otherwise unlinked plain text, flagged in review |
| `![[image]]` / images | **No images policy for now**: flagged back to Shante — redraw as ASCII (≤36ch), describe in text, or cut |
| `---` | `<hr>` |
| Footnotes `[^1]` | Folded into the text as a parenthetical or a blockquote aside — no footnote apparatus |
| `#tags`, `%%comments%%` | Dropped |

## Slug and metadata conventions

- Slug: lowercase, hyphenated, short (`gradient-descent`, not
  `gradient-descent-in-brief-2026`).
- Date: the day of publishing (ISO), not the note's creation date, unless
  Shante says otherwise.
- `<meta name="description">`: one honest sentence, written fresh.

## Open questions (settle when the first real export lands)

- Which frontmatter fields Shante's vault actually uses.
- Whether long derivations keep Unicode math or we revisit rendering.
- Whether notes (vs blog posts) get a lighter clean pass.
