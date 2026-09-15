# Paneer Selvam — Portfolio (React)

> Title/role shown on the site: **Software Engineer** (matches SDE 1).
> Change it in `src/components/Header/Header.jsx` and `src/components/About/About.jsx`
> if your role framing changes — search for "Software Engineer" / "SDE 1".

A React + Vite rebuild of the original plain HTML/CSS/JS portfolio. Same
concept — a paginated one-page site with a home, about, portfolio and
contact view, switched by the side nav, with a dark/light toggle — rebuilt
as components, with a bold gradient name treatment, directional page
transitions (with mouse-wheel paging on desktop), and a cleaner layout,
while keeping the structure and content you started with.

## Run it

```bash
npm install
npm run dev       # start the dev server
npm run build     # production build → dist/
npm run preview   # preview the production build locally
```

Requires Node 18+.

## Project structure

```
src/
  components/
    Brand/           the "PANEER SELVAM" gradient wordmark (top-left, links home)
    Header/          hero section ("home")
    About/           bio, stats, skills, education
    Portfolio/       project cards
    Contact/         contact info + form
    SideNav/         the floating section-switcher
    ThemeToggle/     dark / light toggle
    SocialIcons/     the fixed social links (rendered once, shared)
    icons/           hand-drawn GitHub/LinkedIn/X SVGs (see note below)
  data/              plain JS content — edit these instead of the JSX
    sections.js      nav items (add/remove a page here)
    socials.js
    about.js         stats, skills, education
    projects.js      portfolio cards
    contact.js
  hooks/
    useTheme.js      theme state + localStorage persistence
  App.jsx            wires the pages, nav, toggle, transitions and
                     wheel-paging together
  index.css          design tokens (colors, spacing, shadows, the name
                     gradient) + resets
public/
  img/               the images carried over from the original site
  resume.pdf         placeholder — replace with your real CV
```

Each component owns a CSS Module (`Component.module.css`) so its styles
can't leak into anything else. Shared, cross-component classes
(`.section`, `.main-title`, `.btn-con`, `.main-btn`) live in `index.css`.

## The name treatment

`PANEER SELVAM` (both the small top-left wordmark and the big hero
headline) uses a bold display font (Archivo Black) with a five-stop
gradient text fill — accent color, the theme's text color, the other
accent color, back to text color, back to the first accent — that slowly
pans left-to-right (`nameShimmer` in `index.css`). It's defined as
`--name-gradient`, spelled out fully in both the dark (`:root`) and light
(`body.light-mode`) blocks rather than composed from smaller variables —
a composite value (a multi-stop gradient) built from a variable that
itself points to another variable doesn't reliably re-resolve per theme
in every browser, so it's written out directly in each theme instead.
If you want to retune the colors, edit `--name-gradient` in both places.

## Scrolling: one continuous page, not paginated snapping

Earlier drafts of this rebuild rendered one section at a time (swapped
via React state, with the mouse wheel hijacked to "page" between them).
After watching a recording of the reference site, that turned out to be
the wrong model — the reference is a normal, continuously scrollable
page with a fixed nav that highlights via scroll position. This version
now works the same way:

- All four sections render at once, stacked in normal document flow
  (`App.jsx`), not swapped in and out.
- The side nav (and the Brand link) highlight via scroll-spy — an
  `IntersectionObserver` watching a band through the middle of the
  viewport decides which section is "current" as you scroll.
- Clicking a nav item calls `scrollIntoView({ behavior: "smooth" })`
  rather than changing which page is mounted.
- The hero's "Scroll" hint is anchored to the hero section itself, so it
  scrolls away naturally once you've actually started scrolling, instead
  of staying fixed to the screen through every section.

One implementation note worth knowing if you touch `App.jsx`:
`IntersectionObserver` callbacks are incremental — each firing only
reports entries whose ratio crossed a threshold since the last check,
not the current state of every observed section. The scroll-spy code
keeps a persistent ratio map across callbacks and picks the most-visible
section from that full map, rather than from any single callback's
partial entries — comparing only within one callback's data caused the
nav to visibly get stuck on the previous section after a fast scroll to
the bottom of the page.

## A real bug worth knowing about: global `@keyframes` referenced from a CSS Module

`float`, `wave`, `nameShimmer`, and `spinSlow` used to live in the global
`index.css`, referenced by name from `Header.module.css`. That silently
doesn't work: a CSS Module reference to an animation name gets scoped/
hashed at build time, but a `@keyframes` rule defined in a plain (non-
module) file doesn't — so the final CSS ends up with a reference to a
hashed name that no `@keyframes` rule actually matches. The browser
still reports `animation-name`/`animation-duration`/etc. as "set", which
looks correct on a quick inspection, but `element.getAnimations()` on
the element returns an empty array — there's no real running animation
at all. This is how the hero photo's continuous float, the React/JS
badges' bounce, the waving emoji, the name's gradient shimmer, and the
ring's slow rotation all ended up doing nothing, invisibly, despite the
CSS looking entirely correct.

The fix: all four keyframes now live directly in `Header.module.css`
(the only file that uses them), alongside the two keyframes that were
already local there. If you add a new shared animation, either keep the
`@keyframes` definition and every reference to it in the same module
file, or reference it from plain global CSS (not from inside a
`.module.css` file) — don't split a keyframes definition and its usage
across a global file and a module file.

## Entrance animations

Every section now animates in — brick by brick rather than all at once:

- **Hero**: the photo and the Code/React/JS/TS badges zoom-and-bounce in
  as one coordinated group (spring physics on scale, a plain fade on
  opacity — see the note below on why those are split) — and unlike the
  name/text beside them, this group is `whileInView`-triggered with
  `once: false`, so it replays every time it scrolls into view: scroll
  down away from the hero and the whole cluster zooms back out, scroll
  back up and it zooms back in, picture and icons together. Once
  settled, React, JS, and TS keep floating gently in sync with the
  photo's own idle motion (same duration/easing/phase) — JS and TS sit
  as a stacked pair (`.badgeJs` / `.badgeTs` in `Header.module.css`)
  rather than scattered separately. There's no official TypeScript logo
  asset in this project — the badge is a small hand-made SVG
  (`public/img/TypeScript.svg`), styled after the well-known blue-square
  convention rather than tracing the real logo file.

  One implementation note: the photo/badge `show` transitions split
  `opacity` from `scale` into separate transition configs
  (`transition: { opacity: {...}, scale: { type: "spring", ... } }`)
  instead of one shared `type: "spring"` transition covering both.
  Letting a single spring drive both looked fine on the very first
  visit, but on a *replay* (scrolling away and back) opacity stayed
  stuck at 0 for the entire bounce and only snapped to 1 once the scale
  spring fully settled — confirmed by sampling the actual inline styles
  frame-by-frame, not just eyeballing it. Splitting them so opacity
  fades in with a plain quick tween while scale does the springy
  overshoot on its own fixed it.
- **About**: the heading, then the bio text block (heading → paragraph →
  button, each its own beat), then the stat cards, then the skill icons,
  then the education card — each one waits its turn.
- **Portfolio**: heading, then the subtitle, then the project cards
  stagger in.
- **Contact**: heading, then "Get In Touch" and its info cards, then the
  form itself builds field by field (name → email → message → send).

All of it is `whileInView`-triggered (Framer Motion) with
`once: false`, so it replays every time a section scrolls into view —
scrolling down and scrolling back up both trigger it, not just the
first visit. The Skills & Graduation content (the skill icons and the
education card) uses a `slideRight` variant instead of the plain rise
used elsewhere — a slight left-to-right drift, so that block reads a
little differently from the stat cards above it. If you add new content
to a section, wrap it in the existing `motion.div`/`variants` pattern in
that component rather than leaving it unanimated — that's what the
`titleReveal`, `textStack`/`textItem` (or equivalent per-file) variants
at the top of each component are there for.

## Fonts & icons are self-hosted, not CDN-loaded

The original used a Google Fonts `<link>` and a Font Awesome CDN link.
This version bundles fonts and icons instead, via `@fontsource/outfit`,
`@fontsource/poppins`, `@fontsource/archivo-black`, and `lucide-react`
(imported in `main.jsx` and throughout the components). Practically this
means:

- The site works with no external network requests at runtime.
- Icons and fonts render immediately — no flash of missing icons if a
  CDN is slow, blocked, or down.
- `lucide-react` doesn't ship trademarked brand logos, so GitHub,
  LinkedIn, and X are small hand-written SVGs in
  `src/components/icons/BrandIcons.jsx`.

## What changed vs. the original

**Structure & content** — unchanged in spirit: same four ideas (home,
about, portfolio, contact), same copy, same stats, same skill icons, same
education entry. The **blog section was removed**, since it was an empty
placeholder in the original with no content or nav functionality lost.

**Bugs fixed along the way:**
- The contact form's submit button said "Download Cv" (copy-pasted from
  the hero button) — it's now "Send Message" with a paper-plane icon.
- The `.hover-items h3` project-title style existed in the original CSS
  but no `<h3>` was ever in the markup, so project cards never showed a
  title on hover — titles are back now (edit them in `data/projects.js`).
- The `.bg-text` ghost heading behind each section title existed in the
  original CSS but was always an empty `<span>` — it's now filled in
  ("About", "Work", "Talk") so the effect actually shows.
- The name gradient silently rendered with the wrong theme's colors in
  light mode (see "The name treatment" above) — fixed.

**Visual refresh:**
- A design-token system in `index.css` (colors, spacing, radii, shadows)
  instead of one-off values — dark mode is a deep indigo-black surface
  with a violet gradient accent; light mode is a warm paper surface with
  a rose/amber gradient accent.
- The hero photo sits inside a soft blurred gradient "aura" with a slow
  rotating dashed ring and a small code-icon badge, replacing the flat
  diagonal shape from the original.
- Staggered entrance for the hero text; scroll-reveal for the about
  stats, skill icons and project cards.
- Small motion details: a slow float on the profile photo, a wave
  animation on the emoji, image zoom on project-card hover, a bouncing
  "Scroll" hint on the hero.
- Responsive down to mobile (the original was fixed-width for desktop
  only) — the side nav collapses to a solid bottom pill bar under ~860px
  (solid rather than translucent on mobile, since real page content
  scrolls behind it there).
- Visible keyboard focus states and `aria-label`s on every icon-only
  button, plus `prefers-reduced-motion` support.

## Things to personalize before deploying

- `public/resume.pdf` — swap in your real CV.
- `src/data/socials.js` — the X/Twitter link is still a placeholder (`#`).
- `src/data/projects.js` — two of the three projects (Gemini, AI chat)
  still use placeholder GitHub/live links and best-guess titles.
- `Contact.jsx`'s `handleSubmit` — currently just confirms the form
  works client-side. Wire it to a real email service (e.g. Formspree,
  EmailJS, or your own API route) when you're ready to receive messages.
