# Waffle Story · Drawn Fresh Daily

The marketing site for **Waffle Story**, a waffle shop drawn by hand. Every piece of art on the site is the real brand art from the
_Brand Concept Book_ and _Concept Deck_. It is shown the way it was made: a black line drawn first, then crayon and watercolour scribbled in.

Built with Next.js 16 (App Router, TypeScript), Tailwind CSS 4, CSS keyframes for most motion, GSAP + ScrollTrigger and Lenis (lazy-loaded, for the scroll-scrubbed scene and smooth scroll), rough.js, perfect-freehand and html-to-image.

---

## Run it

```bash
npm install
npm run dev        # http://localhost:3000
npm run build && npm start   # production
```

Set `NEXT_PUBLIC_SITE_URL` in production so Open Graph and schema.org URLs are absolute.

## The pages

| Route | What it is |
| --- | --- |
| `/` | The scroll story: hero logo draws itself → the kid's drawing whose sun becomes a waffle (pinned, scrubbed) → manifesto in pen → The Page / The Moon flip into packaging → the chapters notebook (drag to turn) → tear-off Today's Page with share image → the Unfinished Store colour-in → Fridge Wall → notebook footer |
| `/menu` | Chapters, Footnotes and Bonus chapters as sticky notes, with notebook-edge tabs and an order slip |
| `/todays-page` | Code redemption. Auto-formats `WS-XXXX-XXX`; the stamp submits. Handles valid, golden (confetti), blank (draw your own fortune) and invalid (Pip shrugs) |
| `/storybook` | 365-slot album (localStorage demo). "N of 10 pages to your free chapter" |
| `/fridge-wall` | Masonry gallery, filters, moderated upload form |
| `/stores` | Napkin map with waffle pins, colouring progress per store, schema.org `Restaurant` JSON-LD |
| `/our-story` | Long-form story, Pip's origin, pillars, manifesto, a visit page by page |
| 404 | "This page got coloured outside the lines." |
| `POST /api/redeem` | **Mock** code check. See the TODOs in `src/app/api/redeem/route.ts` |

**Demo codes:** `WS-0427-K7M` everyday · `WS-0365-GLD` golden · `WS-0109-BLK` blank · `WS-9999-ZZZ` not in the book.

## How it is built

```
src/
  app/                 routes, layout (fonts, boil filter, cursor, smooth scroll), template.tsx (page turn)
  components/draw/     the drawing kit
    BoilFilter         3 feTurbulence/feDisplacement states; `.boil` swaps them at ~9fps with steps()
    Boil               wrapper that boils its child and pauses when off-screen
    ArtReveal          real art, line layer first, then a crayon zig-zag mask wipes the colour in
    RoughFrame         rough.js outline + offset crayon fill that stretches to its parent
    RoughButton        drawn button: stepped wobble on hover, crayon scribble burst on click
    HandTitle          ALL CAPS hand lettering, seeded per-letter tilt/baseline, writes on letter by letter
    SquiggleLink       squiggle underline that draws on hover
    Paper              StickyNote, NotebookPage, TapedScrap, TapedImage
    TodaysPageCard     the tear-off page (also used at 1080×1920 for share images)
    TearStrip          drag-down perforation that rips, with paper scraps
    ColourInScene      the Unfinished Store colouring book
    FridgeWall, KidDoodle, ChapterWaffle, Pip, Doodles
  components/home/     the home scenes
  data/                fortunes.json, chapters.json, stores.json, fridge.json, art.json (art sizes)
  lib/                 seeded random, code formatting, Storybook (localStorage), motion helpers
public/art/{logo,pip,waffles,packaging,store,doodles}/   brand art as transparent WebP (+ `-line.webp` pencil-only layers)
```

**Motion rules in code:** entrances use `steps()`. Outlines draw with `stroke-dashoffset`. Fills arrive as zig-zag mask wipes or a watercolour bloom. Only transform, opacity, clip-path and dash offsets are animated. Under `prefers-reduced-motion` the `js-motion` class is never set, so everything renders in its final drawn state, and boil, cursor trail, pinning and Lenis are all off.

**Hydration:** every "random" wobble comes from a seeded PRNG keyed on the content, and rough.js paths are rounded (`roundPath`), so the server and the browser draw the exact same lines.

## Add fortunes

Add lines to `src/data/fortunes.json`. One string per fortune. Keep the voice: a note passed in class. Short, specific, warm, a little absurd, never mean. No "indulge", "decadent" or emoji. The home tear-off picks from this list at random. The mock API maps page number → fortune (`page % length`). With a real backend, fortunes come from the pages table.

## Swap in final artwork

1. Export each piece as a **transparent PNG or WebP**, and, where you can, a **pencil-line-only** version. The site draws the line layer first.
2. Drop them into `public/art/<folder>/<name>.webp` and `<name>-line.webp`, keeping the names below.
3. Update the pixel size in `src/data/art.json` (`"folder/name": [width, height]`). Components read sizes from there, so nothing else changes.
4. If a new logo has different letter positions, update the `LETTERS` boxes and the `O` circle at the top of `src/components/home/Hero.tsx`. If the storefront changes, update the polygons in `ColourInScene.tsx`.

The current art was cut from the concept book with a colour-to-alpha pass (white paper → transparent), and the line layers were extracted from the dark pencil pixels.

### Art still needed from you

| File | Why |
| --- | --- |
| `fonts/StoryHand.woff2` (or an SVG alphabet in `public/art/lettering/`) | The custom "Story Hand" lettering. Headlines use a self-hosted Latin-only Gaegu Bold (`src/app/fonts/`) with seeded per-letter jitter until then. |
| `fonts/TeXGyreSchola-{Regular,Italic,Bold}.woff2` | Self-hosted body serif (free from GUST). Add them with `next/font/local` in `layout.tsx`. Gelasio is the fallback until then. |
| `logo/wordmark.svg` (single-stroke outline paths) | A true vector stroke-by-stroke draw-on for the logo. The current one masks the raster line layer. |
| `pip/shrug.webp`, `pip/erase.webp` | Pip shrugging (invalid code) and holding an eraser (404). The "draw" pose stands in for now. |
| `waffles/chapter-1.webp` … `chapter-6.webp` (+ `-line`) | Final chapter illustrations. Placeholders are drawn live with rough.js in the same style (`ChapterWaffle.tsx`). |
| `drinks/footnote-1.webp` … `footnote-5.webp` | Footnote (drink) illustrations for `/menu`. |
| `store/storefront-regions.svg` | Exact region shapes (awning stripes, walls, door, plant, board) for the colour-in. They are hand-mapped polygons today. |
| `doodles/pip-draws.json` (Lottie) or a 6–10 frame PNG sequence | The short doodle loop that plays when a valid page flips. |
| Real Fridge Wall drawings (JPG/PNG) | Replace the rough.js placeholder doodles. Add `src` to items in `fridge.json`. |
| Store photos and real addresses/phones | `stores.json` has placeholder phone numbers and approximate coordinates. |

## Before launch (backend TODOs)

Search the code for `TODO(backend)`:
- `/api/redeem`: real code lookup, one code per Storybook, rate limiting, golden voucher issuing.
- Blank-page drawings and Fridge Wall uploads go to a storage bucket and a **human moderation queue**. Nothing goes live unreviewed.
- Storybook: accounts and a server-side store (it lives in localStorage for the demo).
- Newsletter, orders/payments, the live community colour-in counter.
- Real social URLs in `SiteFooter.tsx`.

## Quality notes

- Lighthouse (mobile, simulated slow 4G, local production build): Performance `/` 90 · `/our-story` 91 · `/menu` 96 · `/todays-page`, `/fridge-wall`, `/stores`, `/storybook` 97. Accessibility, Best Practices and SEO score 100 everywhere except `/storybook` SEO, which is deliberately `noindex`. CLS is 0.
- How it stays fast:
  - The hero, the titles and the art reveals draw on with **CSS keyframes from the first paint**. No JS sits on the critical path.
  - GSAP and Lenis are **lazy-loaded**: GSAP only when the scroll-scrubbed scene comes near, Lenis when the page is idle.
  - Rough.js illustrations (chapter waffles, fridge doodles, the map, the colour-in fills) are **drawn on the client just before they scroll in**, which keeps the HTML small.
  - Art is WebP with lossy alpha, capped at display size. Art below the fold loads ~600px before it is needed, and only the wordmark's pencil layer is preloaded.
  - Gaegu is self-hosted Latin-only. Google serves it as ~100 Korean unicode-range chunks, which used to pull in 6+ font files.
- Keep it fast when you swap art: export at roughly 2× its displayed size (the wordmark is 700px wide) and keep big hero pieces under ~80KB.
- Every drawing has alt text (or is marked decorative). The colour-in regions, tear strip, page turner and drawing canvas all work by keyboard and touch. Focus is a dashed blue-pen ring.
