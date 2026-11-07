#!/usr/bin/env python3
"""The profile marks under the name (Discord, LinkedIn, X, GitHub), drawn from the bitmaps below.

    python3 tools/marks.py          rewrite each mark's <svg> in index.html and contact.html
    python3 tools/marks.py --check  only report whether both pages match the bitmaps (exit 1 if not)

It changes nothing but the <svg> inside each link: the href, rel and aria-label stay as they are.
Standard library only; it finds the pages in the folder above its own.

How a mark is drawn (DESIGN.md, "Profile marks"): '#' is one font pixel of white ink on the lead's
font-pixel grid. Each link's box is 16 font pixels tall and as wide as its drawing; a shorter mark
is centred, so its height must leave whole pixels above and below. The moat is the mark's
silhouette with everything it encloses filled (for GitHub, the whole disc: the cat opens at its
bottom, so filling holes alone would leave sky inside it), widened by --moat's reach: three pixels
to the left, four to the right, two above and below. Both are written as paths of whole-pixel
rectangles, the moat first, in a viewBox that reaches past the box by the moat's reach. The svg's
width, height and fill attributes are only what it falls back to without style.css, which sets
the size and the paint.
"""
import os
import re
import sys

ROW_H = 16                    # each link's box, in font pixels of the lead (two lines of it)
ML, MR, MU, MD = 3, 4, 2, 2   # the moat's reach, as --moat: left, right, up, down

# (aria-label of the link, bitmap, the silhouette is a disc the size of the mark)
MARKS = [
    # Discord's controller face ("Clyde"), 18 x 14: the two ears, round eyes, the two feet
    ("Discord", """
.....##....##.....
..##############..
..##############..
.################.
.################.
##################
#####..####..#####
####....##....####
####....##....####
#####..####..#####
##################
##################
.####........####.
...##........##...
""", False),
    # LinkedIn's "in" knocked out of a rounded square, 14 x 14 (two-pixel stems and margins)
    ("LinkedIn", """
.############.
##############
##..##########
##..##########
##############
##..#..#...###
##..#.......##
##..#..###..##
##..#..###..##
##..#..###..##
##..#..###..##
##..#..###..##
##############
.############.
""", False),
    # X, 16 x 16: the wide stroke as an outline round a hollow (capped top left and bottom
    # right), the thin stroke broken where it meets it
    ("X", """
####..........#.
.#..#........#..
..#..#......#...
..#..#.....#....
...#..#...#.....
....#..#.#......
.....#..#.......
......#..#......
......#..#......
......##..#.....
.....#..#..#....
....#....#..#...
...#......#..#..
..#.......#..#..
.#.........#..#.
#...........####
""", False),
    # GitHub's Invertocat, 16 x 16: the cat (ears, head, body, the tail at lower left) knocked
    # out of a disc
    ("GitHub", """
.....######.....
...##########...
..##.######.##..
.###..####..###.
.###........###.
####........####
###..........###
###..........###
###..........###
###..........###
####........####
.#.###....#####.
.##.##....#####.
..##......####..
...###....###...
.....#....#.....
""", True),
]


def blank(h, w):
    return [[False] * w for _ in range(h)]


def parse(label, src):
    rows = src.strip("\n").split("\n")
    w = len(rows[0])
    if any(len(r) != w for r in rows):
        sys.exit("%s: every row of the bitmap must be %d characters wide" % (label, w))
    if len(rows) > ROW_H or (ROW_H - len(rows)) % 2:
        sys.exit("%s: the bitmap must be at most %d rows, leaving whole pixels above and below"
                 % (label, ROW_H))
    return [[c == "#" for c in r] for r in rows]


def silhouette(ink):
    """Every cell that can't be reached from outside the frame without crossing ink."""
    h, w = len(ink), len(ink[0])
    seen = blank(h + 2, w + 2)       # padded by one cell, so the flood starts outside the frame
    seen[0][0] = True
    stack = [(0, 0)]
    while stack:
        y, x = stack.pop()
        for yy, xx in ((y + 1, x), (y - 1, x), (y, x + 1), (y, x - 1)):
            if (0 <= yy < h + 2 and 0 <= xx < w + 2 and not seen[yy][xx]
                    and not (1 <= yy <= h and 1 <= xx <= w and ink[yy - 1][xx - 1])):
                seen[yy][xx] = True
                stack.append((yy, xx))
    return [[not seen[y + 1][x + 1] for x in range(w)] for y in range(h)]


def build(label, src, disc):
    """The mark's ink and moat, in a frame that reaches past its box by the moat's reach."""
    ink0 = parse(label, src)
    h, w = len(ink0), len(ink0[0])
    top = (ROW_H - h) // 2
    H, W = ROW_H + MU + MD, w + ML + MR
    ink = blank(H, W)
    for y in range(h):
        for x in range(w):
            ink[MU + top + y][ML + x] = ink0[y][x]
    body = silhouette(ink)
    if disc:
        c = (h - 1) / 2
        for y in range(h):
            for x in range(w):
                if (x - c) ** 2 + (y - c) ** 2 <= (h / 2) ** 2:
                    body[MU + top + y][ML + x] = True
    moat = blank(H, W)
    for y in range(H):
        for x in range(W):
            if body[y][x]:
                for yy in range(max(0, y - MU), min(H, y + MD + 1)):
                    for xx in range(max(0, x - ML), min(W, x + MR + 1)):
                        moat[yy][xx] = True
    return {"label": label, "w": w, "ink": ink, "moat": moat}


def rects(mask):
    """Cover the mask with rectangles: each row's runs left to right, each grown down while the
    rows below are filled under the whole run."""
    m = [row[:] for row in mask]
    H, W = len(m), len(m[0])
    out = []
    for y in range(H):
        x = 0
        while x < W:
            if not m[y][x]:
                x += 1
                continue
            x2 = x
            while x2 < W and m[y][x2]:
                x2 += 1
            y2 = y + 1
            while y2 < H and all(m[y2][x:x2]):
                y2 += 1
            for yy in range(y, y2):
                for xx in range(x, x2):
                    m[yy][xx] = False
            out.append((x, y, x2 - x, y2 - y))
            x = x2
    return out


def path(mask):
    """One 'M x y h w v h h -w z' per rectangle, in font pixels (the viewBox starts at -ML, -MU)."""
    return "".join("M%d %dh%dv%dh-%dz" % (x - ML, y - MU, w, h, w) for x, y, w, h in rects(mask))


def em(n):
    """n font pixels in ems of the lead, eight to the em."""
    return ("%.3f" % (n / 8)).rstrip("0").rstrip(".") + "em"


def svg(m):
    W, H = m["w"] + ML + MR, ROW_H + MU + MD
    return ('<svg viewBox="%d %d %d %d" width="%s" height="%s" fill="currentColor" aria-hidden="true">'
            '<path class="moat" fill="none" d="%s"/><path d="%s"/></svg>'
            % (-ML, -MU, W, H, em(W), em(H), path(m["moat"]), path(m["ink"])))


def redraw(page, text, marks):
    for m in marks:
        link = re.compile(r'(<a [^>]*aria-label="%s"[^>]*>)<svg\b.*?</svg>' % re.escape(m["label"]),
                          re.S)
        text, n = link.subn(lambda mo: mo.group(1) + svg(m), text)
        if n != 1:
            sys.exit("%s: expected one link labelled %s with an <svg>, found %d"
                     % (page, m["label"], n))
    return text


def main():
    check = sys.argv[1:] == ["--check"]
    if sys.argv[1:] and not check:
        sys.exit(__doc__)
    root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    marks = [build(*m) for m in MARKS]
    stale = False
    for page in ("index.html", "contact.html"):
        f = os.path.join(root, page)
        with open(f, encoding="utf-8", newline="") as fh:
            old = fh.read()
        new = redraw(page, old, marks)
        if new == old:
            print(page + ": the marks match the bitmaps")
        elif check:
            print(page + ": the marks differ from the bitmaps (run without --check to redraw)")
            stale = True
        else:
            with open(f, "w", encoding="utf-8", newline="") as fh:
                fh.write(new)
            print(page + ": marks redrawn")
    sys.exit(1 if stale else 0)


if __name__ == "__main__":
    main()
