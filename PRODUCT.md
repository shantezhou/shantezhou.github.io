# Product

## Platform

The web: the GitHub Pages user site https://shantezhou.github.io, published from the `main` branch
of `shantezhou/shantezhou.github.io`. The main screen is Shante's 16" MacBook Pro in Safari:
1728×1117 CSS px at 2x in full screen, about 1728×1000 in a window. The site also has to work on
13" and 14" MacBooks, large monitors and phones.

## Stack

Static HTML and CSS, plus one script, `bg.js`, for the background (plain ES2017, no libraries). One
self-hosted font file. No build step of our own, no framework, package manager or dependencies,
and nothing is loaded from other sites. This folder is the site: GitHub Pages runs Jekyll over it,
which copies the files as they are, and `_config.yml` keeps the docs off the site.

## Users

- Readers who arrive from a shared link: peers, students and others curious about the subjects in
  the site's description (AI, chem, trading). They see the first screen, then read a section, open
  a project, or follow Shante to Discord, LinkedIn, X or GitHub.
- Shante, who adds projects and writings. Adding one must stay simple: copy a template, fill it in,
  push.
- AI agents that edit the site for Shante. They read these docs first.

## Purpose

Shante Zhou's personal site: "my notes about AI, chem, trading, and other whimsicals" (the
description search results and link previews show; since 2026-11-05 it is no longer on the first
screen). One page
with three sections: about me, projects, and writings (posts and papers). More pages can come
later ("1 page for now and we can add more later"). Its identity is the background: a black night
sky whose stars, most of them white, shimmer and turn together around the pole, like a timelapse taken at the North
Pole, under white text in Minecraft's font. (It began as stars hunting circles, "modeled exactly by
the Lotka–Volterra ODEs"; on 2026-11-06 Shante chose the night sky: DESIGN.md, The sky.)

## Constraints

- **Low resource use.** "MAKE SURE that the background is low resource consumption. i dont want my
  whole website to lag due to the background lol." Measured on 2026-11-06 back to back, with CPU %
  where 100 = one core, the sky and the typed name together:
  - 4.3 in WebKit 26.4 (Safari's engine) in a 1728×1000 window at 2x, 4.4 on a 390×844 phone, and
    8.5 in Chromium with real GPU compositing, against 6.7, 7.0 and 7.9 for the predator/prey
    sky in the same runs;
  - 15 ticks a second, nothing at all while the tab is hidden, and one still sky under reduced
    motion;
  - about 67 MB of GPU memory for the canvas on a MacBook, 23 MB on a phone;
  - the page loads about 28 KB gzipped, plus 189 KB of lazy-loaded pictures.

  That is the budget. Anything new is measured before and after (how: DESIGN.md, Tuning), back to
  back and repeated (the laptop's noise is about ±1 point), in WebKit and in Chromium with real GPU
  compositing, and must not raise these numbers measurably. Details are in DESIGN.md, under The sky.
- **Full screen on MacBooks**: "full resolution, covering the whole screen for macbooks". The
  layout spans the whole width; nothing sits in a narrow centred column.
- **Spaced out**: "nice and spaced out (not compact)". Large type, wide margins, a screen per
  section.
- **Type**: "i like minecraft's font so lets do that. make the font white." mac's Minecraft, white,
  at sizes that keep every letter pixel sharp. On 2026-11-05: "im not a big fan of the shadows
  underneath the text, just straight up the minecraft font without the shadows (it should be
  white)". No drop shadow, and every piece of text is white, the dates and the footer included.
- **The sky**: "just the black with glowing white stars in the background, like the night sky. they
  should be of varying intennsity to look like a dark night with bright stars", "transient and
  changes in intensity slightly just like real stars and maybe rotate around the screen together.
  just as if you were sitting in the north pole and you were to do a timelapse of the sky". Of this
  build: "this one is geniunely perfect, lets make this the top runner out of all of them including
  the predator and prey one". And: "it would be cool to have some of the stars be with a slight
  blueish and orangeish hues. since stars may be of not the same hues". The stars-and-circles legend
  went with the old sky, as there is nothing left for it to count.
- **Typed name**: "have it so that my name on the landing page when the user joins is being typed
  out. then it gets deleted letter by letter, then typed out again. like minecraft style too". And:
  "for the name i want it to be like Shante Zhou --> Shan --> Shante Zhou", "like 3 perpetual patterns
  where it doesnt delete fully, sometimes it does and sometimes it doesn't." On index.html the name
  types itself out a character at a time behind Minecraft's chat caret (`_`), holds, is deleted like
  a held backspace, back to "Shan", to "Shante" or all the way in turn, and types again, for good.
  `bg.js` drives it. Under reduced motion, on paper and without scripts the name is simply there. It
  costs nothing in a hidden tab, while the name is out of view or under reduced motion (DESIGN.md,
  "The typed name").
- **Screenshots**: "the reactor lab project snippet should also have rounded corners". Project
  screenshots have rounded corners. And: "im wondering what it would look like for the image to be
  centered and then the title be above it, centered as well". Each project stands on the page's
  centre line: "the centered is fine for now we can optimize it later".
- **Profiles**: "i think we should delete the "my notes" part. let's replace it with a icon for
  discord, linkedin, X, and github" (2026-11-05). The tagline left the first screen (it stays the
  meta description), and four marks link to Shante's profiles in that order: each brand's own mark,
  redrawn in white in the font's pixels, the one exception to "no icons". Static SVG, no script,
  and measured to cost nothing.
- **Content**: Shante's own words, verbatim. Nothing is invented.
- **No generic AI-site habits**: see the hard rules in STYLE.md.
- **Static hosting**: GitHub Pages serves files only, so there is no server code.
- **Browsers**: Safari (WebKit) first, on macOS and iOS, then Chrome. Tested headless in WebKit 26.4
  and Chromium 148. Firefox is untested.

## Principles

1. The sky leads: few words, large and well spaced, set into it.
2. Cheap by construction: only the background moves (and, at Shante's request, the typed name),
   and every change to it is measured.
3. Shante's words, verbatim.
4. Every pixel of every letter lands on whole device pixels.
5. Editable by hand for good: one page, one stylesheet, one script, no build step
   (`tools/marks.py` only redraws the profile marks' svgs; the site never needs it to build or
   run).
