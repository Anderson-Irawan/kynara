# KYNARA website: handover notes for Claude (VS Code)

Read this before changing anything. It tells you how the site is built and which style rules to keep.

## ⚠️ The site is moving to WordPress (September 2026)
Anderson chose WordPress so the **KYNARA team can manage products themselves** in an admin. The theme is in
**`wordpress-theme/kynara/`** — read its `README.md` first. Decisions made:
- **Products** are a custom post type (`kynara_product`) with fields from the free *Secure Custom Fields*
  plugin, defined in code in `inc/products.php`. They feed the Products page, Home carousel, footer and search.
- **Languages:** Polylang, with Indonesian at its own `/id/` URLs (not yet built — replaces the JS switcher).
- **Enquiries inbox:** contact submissions emailed *and* stored in the admin (not yet built).
- **Page text is NOT editable** in the admin (Anderson's choice): it stays in the templates.
- **Hosting:** none chosen yet.

**The theme is now the source of truth.** Its `assets/` started as copies of this folder's css/js/fonts, and
the theme's copies have already diverged (search reads `window.KYNARA_SEARCH`; product names are uppercased by
CSS; measurements have styles). Make new changes in the theme. The static files in this folder remain as the
reference/prototype and still work on their own, but are no longer kept in step.

Testing without installing anything: WordPress Playground runs WordPress inside Node. From Git Bash:
`MSYS_NO_PATHCONV=1 npx @wp-playground/cli server --login --blueprint=<bp.json> --mount-dir "<theme path>" /wordpress/wp-content/themes/kynara`
(`MSYS_NO_PATHCONV=1` matters: without it Git Bash rewrites `/wordpress/...` into a Windows path and the mount
fails). The blueprint installs `secure-custom-fields` and activates `kynara`. For Anderson's own use, LocalWP.

Everything below describes the static site, and the design rules in it apply to the theme too.

## What this is
A static, hand-coded marketing site for **KYNARA** (premium, sustainable WPC products: rice husk + recycled plastic).
It is plain HTML, CSS and vanilla JavaScript. There is no framework and no build step. There is exactly **one**
dependency: Lenis (smooth scrolling), **vendored** as a single file in `js/vendor/` rather than loaded from a CDN,
so the site still works offline and when opened straight from disk. There is no npm/package.json in the project.
Open `index.html` in a browser (or use VS Code Live Server) to preview.

The designer is Anderson (Double Dash Creative). The source designs are in `drafts - pdf/`:
| Page | Draft | File |
|---|---|---|
| Home | `drafts - pdf/Home.pdf` | `index.html` |
| Products | `drafts - pdf/Product.pdf` | `products.html` |
| The Brand | `drafts - pdf/About.png` | `brand.html` |
| Contact | `drafts - pdf/Contact.png` | `contact.html` |

Anderson will send page-by-page revisions. Match each draft closely. Measurements were taken from a 1280px-wide artboard with 60px side margins.

**The built site no longer matches that artboard width.** It is full-bleed (no max-width) with 100px of room
left and right, so at a 1280px viewport the content is 1080px wide, not the draft's 1160px. Read the drafts for
proportion and hierarchy rather than absolute pixel widths.

## Folder map
```
index.html  products.html  brand.html  contact.html
css/styles.css        all styles; tokens are at the top in :root
js/config.js          EDITABLE SETTINGS: hero rolling words, form endpoints
js/i18n.js            EN + ID translation dictionary
js/main.js            language switch, rolling word, menu, search, carousel, forms, parallax,
                      hero glow, shrinking header, Lenis setup
js/vendor/            lenis.min.js (1.3.26, MIT) + its licence. Loaded before main.js on every page.
                      To upgrade: replace the file AND update the copied .lenis rules in styles.css.
images/               photography. Originals (.jpeg/.jpg) PLUS the .webp the pages actually load.
                      og-kynara.jpg is the 1200x630 social card and must stay JPEG.
icons/                favicon.svg + apple-touch-icon and PWA PNGs (generated from the logomark)
favicon.ico           legacy root fallback (16/32/48)
site.webmanifest      PWA manifest; theme colour is the brand green
logos/web/            web logos cropped tight, without background rectangles (made from /logos).
                      Pages don't load these directly: the logo is a mask embedded in styles.css,
                      generated from kynara-landscape-dark.svg (see "Header and footer are duplicated").
logos/                Anderson's master logo files. Do not edit these.
fonts/                Candara (display) + DM Sans (body), loaded with @font-face
```

## Style rules (do not break these)
1. **Still banned: drop shadows, fade-in-on-scroll, scroll-reveal, and hover *lifts* (translate/scale on hover).**
   The original brief said "no motion at all", but Anderson has since asked for specific effects. The permitted
   motion is now exactly this list. Don't add to it without asking, and **don't delete from it thinking you are
   restoring the original rule** — each item was requested:
   - the rolling word in the hero,
   - the carousel's native smooth scroll,
   - **the search panel opening**, in two beats — the bar changes colour (`--ui-color-ms`), *then* the panel
     slides down and fades in (`--ui-panel-ms`). Closing reverses the order. Each state carries its own
     `transition` with a delay on whichever beat should wait; that is why the rules look duplicated.
     **Animate only `transform` and `opacity` here** — see the Done notes for why a height animation stuttered.
   - **the Home hero video** — a muted, seamlessly looping background (`videos/hero.mp4`), started by main.js.
   - **parallax on the Home hero** — `.hero--parallax`, driven from main.js.
   - **the Home hero dissolving into the green section** — a static fade (`.hero__fade`) plus a green wash
     (`.hero__wash`) whose opacity rises with scroll. This is a scroll-linked *colour* change on the hero,
     not content revealing itself, so the ban on scroll-reveal still stands.
   - **an interactive glow on the Home hero** — `.hero__glow`, a soft rust light that eases after the pointer.
   - **the stats on The Brand counting** — once, when they come into view: up from 0, except deforestation,
     which counts *down* from 250 to 0. This is the one thing triggered by scrolling into view, and it was
     asked for; it animates numbers, it doesn't reveal content (the final values are in the HTML all along).
   - **the header shrinking on scroll** (`--shrink-ms`), with the wordmark retracting to the logomark — and
     **growing back out on the next page** when you navigate while it's shrunk (after vestre.com).
   - **the header sliding away at the footer** (`.is-hidden`) and back as you scroll up out of it.
   - **Lenis smooth scrolling** on wheel/trackpad, every page. Touch stays native.
   - **hover, eased** — every hover uses `--hover-ms` on the `--ui-enter` curve so the page moves with one
     rhythm. Links and text buttons: the underline fades in and rises into place (offset 7px → 3px). The logo
     changes colour (green on cream/white, rust over the hero). The circle buttons invert to a cream fill with
     green text/icon. Colour and underline only — still no lifts, scales or shadows.
2. **Every image — and video — goes inside a box:** `<div class="img-box"><img ...></div>`. The box sets the size and aspect ratio
   (for example `aspect-ratio: 422 / 402`), and the image fills it with `object-fit: cover`. Never size an `<img>` directly.
3. Flat colour only. Use the tokens in `:root`:
   `--cream #f9f8f2` (page background), `--green #0b4f37` (brand green), `--rust #a04033`, `--brown #8b5e3c`,
   `--ink #000`, `--swatch #d9d9d9` (placeholders). The footer is `--cream`, matching the nav — the drafts had it
   white, and the `--white` token was removed when that changed.
4. **Type is a six-tier scale.** Every size on the site comes from `--t1`…`--t6` in `:root`. **Do not add new sizes** —
   pick the closest tier, or change the tier if it is wrong everywhere.

   | Tier | At 1280px | Used for |
   |---|---|---|
   | `--t1` | 72px | contact title, product names |
   | `--t2` | 48px | feature headings (The Brand) |
   | `--t3` | 36px | section titles, story h2, subscribe heading, stat values |
   | `--t4` | 24px | product use line |
   | `--t5` | 16px | body copy, footer links, form fields |
   | `--t6` | 14px | labels, captions, and the whole header bar |

   **The hero headline is deliberately not on this scale.** It uses `--t-hero`, a *fitted* size that makes the
   longest entry in the word list ("Crafted for Harmonious Meetings") span 90% of the content box, so it grows
   with the page instead of capping. The `0.0718` coefficient is `0.9 / 12.526em`, where 12.526em is the
   measured advance width of that line in Candara at the -4% tracking.
   **Remeasure it if the wording, the word list or the display font changes** — swapping Candara out for
   licensing reasons would invalidate it. (`scratchpad/measure.js` in the September session read the advance
   widths straight out of the TTF; any font-metrics tool will do the same job.)

   T1–T4 are `clamp()`, so they shrink on narrow screens on their own. That is why the responsive blocks
   at the end of styles.css carry almost no font sizes — **don't add per-breakpoint font sizes back.**
   The one deliberate exception is `html[lang="id"] .hero__title`, held below T1 because the Indonesian
   headline is much longer and the hero is `white-space: nowrap` on desktop.

   **Candara** (`--font-display`) for headings, the hero and product names. Regular weight except product names
   and the subscribe heading, which are bold. Every Candara element is tracked in by 4%
   (`--tracking-display: -0.04em`) through one grouped rule in styles.css — **add any new Candara selector to that list.**
   **DM Sans** (`--font-body`) for nav, labels, body copy and the footer. The hero adjective and rolling word are Candara *italic*.
5. Borders are 1px solid black. Form fields have square corners. Only the product cards are rounded (46px).
6. The active nav item is wrapped in square brackets: `[ Contact ]`. This is done in CSS through `aria-current="page"`, so don't type the brackets.
   Buttons follow the same bracket style (`.btn-bracket`).
7. The header is **`position: fixed` on every page** and shrinks once the page scrolls past 40px (`.is-scrolled`,
   from main.js). There are two variants at the top of the page:
   - `site-header--overlay`: sits over the hero — **Home only** now. Transparent, cream text, no rule.
   - `site-header--light`: cream background with a 1px rule under it (Products, The Brand, Contact). Dark text.
   Once scrolled, both look the same: a short cream bar, dark text, logomark only, and **no rule**. The rule
   only reappears while the search panel is open. Once the footer is 30% of the way up the screen the header
   slides away entirely, and returns when you scroll back up. Fixed rather than sticky on purpose — see the Done notes.
   Light-header pages reserve the full header height with `.site-header--light + main { margin-top }`, so
   `<main>` **must** stay the element directly after `</header>`.
8. Keep BEM-ish class names (`block__element--modifier`) and the existing section comments.
9. **The page is full-bleed.** `.wrap` has **no max-width** — it only sets `--page-pad` of padding left and right
   (100px, stepping down to 60px / 32px / 20px at the breakpoints). Never reintroduce a page max-width.
   Anything that has to line up with that edge should use `var(--page-pad)`, the way the hero circle and the
   carousel's off-edge bleed do. Avoid fixed-px grid columns at full width: they stretch badly on wide monitors,
   which is why `.feature` and `.footer-cols` are fractional.

## Header and footer are duplicated
The header and footer markup is copied into all four HTML files so the pages work with no JS and no build step.
**When you change one, change all four.** Only two things differ per page: the header modifier class and which
nav link has `aria-current="page"`. The logo markup is now identical everywhere.

**The logo is not an `<img>`.** It is a CSS mask on `.brand-logo::before`, filled with `currentColor`, so it takes
the colour of the text around it: cream over the hero, black on cream, and it darkens with the bar when search
opens. The markup is just the link with a visually-hidden "KYNARA" (fallback if CSS fails; the link's
`aria-label` is what screen readers hear). Three details that are easy to break:
- The mask is an **embedded data URI**, generated from `logos/web/kynara-landscape-dark.svg`. A plain
  `url("../logos/...")` would fail when the site is opened from disk, because mask images are fetched with CORS
  and `file://` pages are refused — the logo would render as a solid rectangle. Regenerate the data URI if the
  artwork changes.
- It is on `::before`, **not** the `<a>`: a mask clips the element's focus outline too, which hid the keyboard
  focus ring.
- `forced-colors` (Windows high contrast) gets its own rule, because that mode replaces backgrounds and would
  otherwise erase the logo.

## Rolling hero word (Home only — The Brand's hero was replaced by a title + banner)
- **This headline is a brand line and is NOT translated.** It reads "Crafted for *Harmonious* ___" in both
  languages, so the hero never reflows when the language changes. `heroRoller` therefore has **one** word list,
  not one per language, and `hero.static` is deliberately identical in the `en` and `id` dictionaries.
  Don't "fix" that by adding an ID variant back — it was removed on purpose.
- Edit `js/config.js` → `heroRoller`: `words`, plus `interval` (how long each word stays, ms) and `duration`
  (how long the roll takes, ms — currently 490).
- The sentence is `prefix + rolling word + suffix`. The suffix is empty; it exists because an earlier
  translated version needed it.
- The word order is Living → Working → Dining → Playing → Meetings → Sleeping. Words roll **up**, and
  **only the word taking centre is visible** — the others still move through the stack, but at `opacity: 0`.
  (The PDF drew faded neighbours above and below; Anderson asked for them hidden instead.)
- Main.js builds the word stack. The `<h1>` keeps a readable `aria-label` taken from `hero.static` in i18n.js.
- On screens under 900px the rolling word drops onto its own line.

## Language switch (EN / ID)
- English is the default and is also written directly in the HTML, which keeps it readable for SEO and when JS is off.
- Translatable elements carry one of these attributes:
  `data-i18n="key"` (plain text), `data-i18n-html="key"` (text with `<br>`/`<em>`),
  `data-i18n-placeholder="key"`, `data-i18n-aria="key"`. The page title comes from `<body data-title-key>`
  and the meta description from `<body data-desc-key>`. Switching language also updates `og:title`,
  `og:description` and `og:locale` (see `setMeta` in main.js), so the `meta.desc.*` keys must exist in both dictionaries.
- All strings live in `js/i18n.js` under `en` and `id`. **When you add text, add the HTML English, the `data-i18n` key, and both dictionary entries.**
- The chosen language is saved in localStorage (inside try/catch) and also carried on links as `?lang=id`.
- Product names (FLOOR, BARK, HEARTWOOD, EDGE) are brand names. Do not translate them. Neither is the hero
  headline — see the rolling-word section above.
- **The switcher is a globe + dropdown** (`.lang-switch`), not the old `EN / ID` pair, which read as a label
  rather than a control. The globe shows the current code, and the menu lists both languages explicitly.
  The option labels are endonyms — "English" and "Bahasa Indonesia" each stay in their own language, so they
  carry no `data-i18n`. Menu logic (open, close on Escape, close on outside click) is in main.js; the existing
  `[data-set-lang]` handler still does the actual switching.

### Translating to Indonesian (next task)
- The `id` dictionary already has a **first-pass translation** of every real string: nav, headings, product uses, stats, form labels and footer. Anderson reads Indonesian, so ask him to review the wording, especially "Hubungi Kami" for "Enquire Today". (The hero is no longer part of this — it stays English.)
- Lorem ipsum is placeholder copy and is the same in both languages. When Anderson supplies real copy, add proper EN and ID versions.
- Register: formal but warm (use *Anda*, not *kamu*). Keep premium, concise phrasing. Keep the product names and "KYNARA" in capitals.
- Where ID text runs longer, check the layout at 1280px and 390px. There is no longer an ID hero size override: the hero is English in both languages, so it cannot overflow its `white-space: nowrap`.

## Forms
- **Contact** (`contact.html`): Name*, Company Name, Email*, Message*, Attach File. Validation uses the browser's built-in checks.
  Submission is set in `js/config.js → contact.endpoint`. While that is empty, the form opens the visitor's email app pre-filled to `enquiries@kynara.co.id`, and attachments can't travel that way.
  To finish this, connect a form service (Formspree, Netlify Forms, Basin, or a PHP mailer on the host) and put its URL in `endpoint`. The form already posts `multipart/form-data` including the file.
- **Subscribe** (footer, all pages): set `subscribe.endpoint` in config.js (Mailchimp or Brevo). For now it only shows a thank-you message.
- The designs had no submit buttons, so "[ Send Enquiry ]" and a small "SUBSCRIBE" text button were added in the same style.

## Placeholders still to fill
- Product images: all use `images/product-placeholder.jpg` (the building photo from the PDF). Replace each product's image separately.
- Product **Measurements** are empty in the design. Put them under the Measurements `<h3>` in each `.product-card`.
- **Colour swatches** are 12 grey circles per product. Set `style="background:#hex"` and `data-color="Name"` on each `.swatch`.
- **Social icons** are grey 24px squares in the design. Swap in icons and real URLs (the aria-labels are already set).
- The phone numbers are the placeholder `+62 82 123 1234` from the design. The Terms of Use and Privacy links point to `#`.

## Decisions already made
- The nav item is **"Products"** and opens `products.html`. The Product draft labels it "[ Projects ]"; Anderson asked for "Products" instead. If a separate Projects (portfolio) page arrives, create `projects.html` and add it as its own nav item — don't rename this one back.
- Two typos from the drafts were corrected: "Craftsmenship" → "Craftsmanship" and "post-customer" → "post-consumer".
- Image mapping: Home hero = **video** `videos/hero.mp4` with poster `images/hero-poster.webp` (see Done; the old hero photo `hero-cosmos_1160439100.webp` is no longer used on Home), The Brand banner = `images/brand-banner.webp` (see Done; `kids in forest` is no longer used); Craftsmanship = `meeting ith forest.jpeg`; Sustainable = `cosmos_789092184.jpeg`; Limitless Applications = `cosmos_969656075.jpeg`.
- The file names contain spaces, so they are URL-encoded in the HTML (`%20`). If you rename images, update the paths.
- SEARCH opens a simple panel that filters a small index in main.js (`SEARCH_INDEX`). Add new pages or products to that index.
- Breakpoints: 1180px (tightens the grids) and 900px (mobile: MENU toggle, everything stacks), plus 520px.

## Before launch
- **Font licensing:** Candara is a Microsoft font, and its standard licence may not allow web embedding. Confirm a webfont licence or pick a licensed alternative. DM Sans is open source (OFL). **Still open — this is the real blocker.**
- **Confirm the domain.** The canonical and `og:` URLs are hardcoded to `https://kynara.co.id` (inferred from the enquiries address). If the live domain differs, update `<link rel="canonical">` and `og:url` in all four pages.
- ~~The Brand hero image is too small~~ — resolved: The Brand no longer has a hero (see Done). The banner that
  replaced it is 1440px wide; on very large screens (container over ~1440px) it will soften slightly.

### Done (September 2026)
- **Meta + social:** every page now has its own real `<meta name="description">`, plus Open Graph, `twitter:card` and `rel="canonical"`. The social card is `images/og-kynara.jpg` (1200x630: the placeholder building photo under the hero's green-to-rust scrim, with the light logotype).
- **Type scale:** the site had **20 different font sizes**; it now has six (`--t1`…`--t6`, see style rule 4).
  Nav, the language switch, SEARCH and MENU all dropped from 20px to T6 and the header reads as one row.
  T6 was 12px at first and Anderson raised it to 14px — change the token, never an individual selector.
  All nine Candara selectors are tracked in by 4%, replacing the old one-off `-0.01em` / `-0.015em` values.
  Because T1–T4 are `clamp()`, fourteen per-breakpoint font-size overrides were deleted rather than rewritten.
  In the stacked mobile menu the nav links go back up to T5 (16px) — 12px is too small to tap comfortably.
- **Full-bleed container:** `--page-max: 1280px` is gone (style rule 9). `.feature`, `.feature--reverse` and
  `.footer-cols` were converted from fixed-px to fractional columns so they don't stretch oddly on wide monitors.
- **Header rule inset:** the line under the bar used to run the full width of the viewport. It is now drawn
  as a pseudo-element inset by `var(--page-pad)`, so it stops at the page margins. It shows on Products/Contact
  at the top of the page, disappears once the bar shrinks, and only comes back while the search panel is open.
- **Sticky, shrinking header (after vestre.com).** Fixed on every page; past 40px of scroll it goes from 146px
  to `--header-h-small` (68px; 88 → 60 on mobile), takes the cream surface on the hero pages, and the logo
  retracts to the logomark. **Why fixed, not sticky:** a sticky header that shrinks changes its own height in the
  flow, which moves the page and shifts the scroll position — enough to flip the 40px threshold back and forth.
  **The logomark** is not a separate file: the logo is two layers of the same mask. `::before` is the whole
  logotype; `::after` is the same mask cropped to the left `--logo-mark` (0.3537 — measured from the artwork,
  cut in the gap before the K). Both draw the mark in the same place, so it stays solid while "KYNARA" fades and
  the link narrows behind it. **Remeasure `--logo-mark` if the logo artwork changes.** The data URI now lives
  once, in `--logo-mask` on `:root`.
  **Two JS-set helper classes:** `.is-instant` (first two frames only, so a page opened mid-scroll starts small
  instead of animating into it) and `.is-search-closing` (the ~800ms after closing search, so the bar's colour and
  rule wait for the panel to leave — without it, scrolling back to the top would also be held up by that delay).
  `html { scroll-padding-top }` keeps `#anchor` targets clear of the fixed bar.
- **Header hides at the footer.** In the same scroll frame as `.is-scrolled`, main.js sets `.is-hidden` once the
  footer's top is above 70% of the viewport height; the header slides up (`translateY(-100%)` + fade, exit curve)
  and eases back when you scroll up out of the footer. Three guards, all deliberate:
  only after scrolling past 40px (the footer is already visible at the top of short pages like Contact),
  never while the search panel is open, and `:not(:focus-within)` in the CSS so tabbing into the nav always
  brings it back.
- **Footer is cream**, the nav's colour, instead of white. On Products, The Brand and Contact the page is cream
  too, so the footer now reads as a continuation of the page rather than a separate white band; the subscribe
  block and its rule do the separating. The unused `.site-footer--cream` modifier and `--white` were removed.
- **Lenis smooth scrolling** on all four pages, vendored at `js/vendor/lenis.min.js`. Lenis animates the real
  window scroll, so everything listening to native `scroll` events (parallax, glow, header) works unchanged.
  Options in main.js: `anchors: true` (Lenis itself reads `scroll-padding-top`/`scroll-margin`, so **don't** add an
  anchor offset — it would double up), `allowNestedScroll: true` (the carousel still scrolls sideways natively),
  and it honours `prefers-reduced-motion` by default. Touch scrolling is left native. If the file fails to
  load, the site scrolls normally.
  A plain `border-bottom` cannot do this, because the bar itself carries the padding.
- **Mobile header padding bug fixed:** at ≤900px `.site-header__bar` used the shorthand `padding: 20px 0`,
  which silently zeroed the side padding `.wrap` had set and pushed the logo and MENU against the screen edges.
  It is now `padding: 20px var(--page-pad)`.
- **Hero:** the rolling word moves 30% faster (`duration` 700 → 490ms) and the off-centre words are hidden
  rather than faded. The headline is no longer translated — see the rolling-word section.
- **Language switcher:** replaced the `EN / ID` pair with a globe + dropdown, because the old control looked
  like a label and people did not realise it was clickable.
- **Hero headline fitted to 90%:** moved off `--t1` onto `--t-hero` (see style rule 4). At 1280px it is ~78px
  rather than 72px, and it keeps growing with the viewport since the page is full-bleed.
- **Burgundy circle removed** from the Home hero, markup and CSS both (it only ever appeared on `index.html`).
  If it is ever wanted back it was a 184px `--rust` circle, 578px down, inset by the page padding.
- **Search panel animates open** in two beats, and the overlay header fades to cream with it, logo
  cross-fading — see style rule 1. The panel is `position: absolute` under the bar and animates **only
  `transform` and `opacity`**; a delayed `visibility` keeps the closed panel out of the tab order. The bar is
  opaque with a higher z-index, so the panel is hidden while tucked up behind it. All of it is off under
  `prefers-reduced-motion`.
  **Why not a height animation:** an earlier version animated `grid-template-rows: 0fr -> 1fr` so the page was
  pushed down. Track sizing is a layout property, so every frame reflowed the panel and — on the light-header
  pages — the whole document below it. It visibly stuttered, worst on close. The open panel now **overlays**
  the top of the page instead of pushing it, which is normal for a search drawer and removes the layout shift.
  **Entering and leaving use different curves, deliberately.** `--ui-enter` is an expo-out; `--ui-exit`
  accelerates away. A shared ease-in-out sat still for the first third of the close and then lurched.
  **No rule under the panel.** The original design had one; as an overlay it read as a stray black line.
- **Home hero image** is now `hero-cosmos_1160439100.webp` — the couple dancing on the forest path. It is a
  **crop** of `cosmos_1160439100.jpeg` (1440×1421 from the 1440×1920 original, keeping canopy to path and
  trimming dead grass), q74, 412KB — the uncropped WebP was 731KB, and the hero only ever shows a landscape
  band of a portrait photo anyway. `.hero__media--home` sets `object-position: center 70%` to keep the couple
  above the headline. **The Brand hero still uses `kids in forest.webp`**, which is too small (see Before launch).
- **Home hero flows into the green section** instead of stopping on a hard edge. Two layers sit above the photo
  and glow and under the headline, in `index.html` only:
  - `.hero__fade` — static. The bottom of the hero eases into exactly `--green`, so there's no seam against
    `.home-green`. The gradient stops are spaced as an ease; a straight ramp shows a line where it starts.
  - `.hero__wash` — solid `--green`, opacity set in the parallax frame in main.js: `(scroll / heroHeight)^1.4 × 0.92`.
    Eased so the photo holds at first and gives way as it leaves; capped below 1 so a trace survives until it's
    off-screen. Opacity only, so it's composited. Under reduced motion it stays at 0 and only the fade shows.
  **Keep the headline after these two in the markup** — it relies on source order to stay on top. If the colour of
  `.home-green` ever changes, the fade must change with it or the seam comes back.
- **Interactive glow on the Home hero** (`.hero__glow`, `data-hero-glow`): a soft rust radial light, moved with
  `transform` so following the pointer costs no repaint, eased toward the cursor at 8% per frame. The rAF loop
  stops once it has caught up. Touch, reduced motion and JS-off all get the static off-centre glow.
- **Home hero is a video.** `videos/hero-vid.mp4` is Anderson's original (untouched). `videos/hero.mp4` is the web
  version: the 10s clip made into a **seamless 9s loop** by dissolving its last second into its first (the raw
  clip's end and start don't match, so a plain loop jumped), re-encoded H.264 CRF 26, no audio, the editor's
  timecode track dropped, index at the front (faststart) — 1.8MB vs 6.4MB, visually identical at full size.
  `images/hero-poster.webp` is the loop's first frame, so still → moving has no jump.
  The `<video>` has **no `autoplay`** and `preload="none"` on purpose: main.js starts it only when motion is
  welcome, so reduced-motion and data-saver visitors see the poster and never download the file. It pauses
  while the hero is off screen. Parallax, glow, fade and wash all still apply (the video sits in the same
  `.img-box`). To swap the clip: re-encode the same way and regenerate the poster from frame 0. With ffmpeg:
  `trim=start=1` and `trim=end=1` fed into `xfade=transition=fade:duration=1:offset=<length − 2>`, then
  `-crf 26 -an -movflags +faststart`. Same files in the theme under `assets/videos/` and `assets/images/`.
- **The Brand: hero replaced by a title and a banner.** The full-height hero (photo + rolling headline) is gone.
  In its place, `.brand-intro`: a two-line T1 title, "Sustainable composites for / floors, walls and structures"
  (`brand.intro.title`, ID "Komposit berkelanjutan untuk / lantai, dinding, dan struktur" — review), then a banner
  across the container (`.brand-intro__media`, 21:9 on desktop, 4:3 on phones). The banner is a 4:3 crop of
  `cosmos_1160439100.jpeg` centred on the dancing couple (`images/brand-banner.webp`, 1440×1080, 301KB) —
  chosen because it's the only unused photo wide enough (1440px) for a full-container image.
  Because there's no hero to sit over, **The Brand now uses the light header** (static `brand.html` and
  `header.php`, where only Home is an overlay page). `.brand-intro__title` joined the Candara tracking group.
- **Floating contact button** (`.chat-fab`): a 64px circle fixed bottom-right (56px and closer in on phones) with a
  chat-bubble icon, linking to Contact, on **every page except Contact**. Solid `--green` with a cream icon and a
  1px cream ring — the ring is what keeps it visible over the green Home section. Hover inverts it on the standard
  eased hover. Its focus ring is drawn in ink, because the site's default `currentColor` ring would be cream and
  vanish on cream pages. `z-index: 15`, under the header. Label: `fab.contact` ("Contact us" / "Hubungi kami").
  In the static site it's pasted after `</footer>` in index, products and brand (**not** contact); in the theme,
  `footer.php` shows it unless `kynara_current_page()` is `'contact'`.
- **The header carries its state across pages** (main.js section 8, both copies). On `pagehide`, if the bar is
  shrunk, a timestamp goes into `sessionStorage` (`kynara-header-carry`). The next page, *if it opens at the top*
  and the note is under 5s old, paints the bar shrunk with `.is-instant` (no transition), re-enables transitions
  two frames later, then calls `placeHeader()` one frame after that — so the normal grow animation plays: height,
  wordmark sliding back out, and on Home the cream bar fading to transparent. **Keep that frame order**: dropping
  `.is-instant` and `.is-scrolled` in the same frame makes the grow skip. Pages opened mid-scroll stay shrunk;
  reduced motion skips it; a stale note (left the site and came back) is ignored. View Transitions were considered
  and rejected: no Firefox support, and they animate snapshots of the header rather than the header itself.
  (Verified frame by frame in jsdom — see the September session.)
- **Stats count when they come into view** (The Brand, `main.js` section 11). Each `.stat__value` has
  `data-count-from` / `data-count-to` and optional `data-count-prefix` / `data-count-suffix` (so "~600kg" is
  prefix `~`, to `600`, suffix `kg`). **The HTML keeps the final value**, so search engines, JS-off and
  reduced-motion visitors see the real numbers; JS resets them to their start value and counts once when the
  `.stats` list is half on screen — 1.8s, ease-out, each stat 150ms after the last. Deforestation runs 250 → 0
  so the zero lands as the point. `font-variant-numeric: tabular-nums` stops the figures wobbling as they change.
  **If a stat's number changes, update both the text and `data-count-to`** — the text is what non-animated
  visitors see, the attribute is where the count ends.
- **Footer Projects column removed** (it only ever held the placeholder "Item 1–5"). The footer grid is now three
  columns — `1fr 1fr 3.9fr`, so Product and About keep their old width and Contact takes the rest — and the
  `footer.projects` / `footer.item` dictionary keys went with it. Done in the static pages and the theme.
- **Nav "Projects" renamed "Products"** (and the key `nav.projects` → `nav.products`, ID "Proyek" → "Produk").
  The footer's Projects column was later **removed altogether** at Anderson's request (see above).
- **Search field has a magnifier** (`.search-field__icon`) sitting inside the input on the left; the input is
  padded to clear it. Present on all four pages.
- **The SEARCH button in the nav has a magnifier too**, beside the label. The label is a separate
  `<span data-i18n="nav.search">`: `applyLang()` sets `textContent`, so **never put `data-i18n` on an element
  that also contains an icon** — the first language switch would wipe the icon.
- **Hero is full height** (`100svh`, with a `100vh` fallback line above it). The headline is now anchored to
  the bottom of the hero with a viewport-relative padding instead of the old fixed 468px from the top, and the
  620px mobile override is gone. `.hero--brand` no longer has a height rule — the class is inert but left in
  the markup.
- **Parallax on the Home hero.** `.hero--parallax` + `data-parallax` on `index.html` only; adding the same two
  attributes to `brand.html` would switch it on there. The CSS makes the photo 130% of the hero height and
  shifts it up by the overflow; main.js translates it at 30% of scroll speed, which exactly consumes the slack
  so no edge is ever exposed. Guarded by `prefers-reduced-motion: no-preference` in CSS *and* a matchMedia
  check in JS, and it degrades to a still photo with JS off.
- **Nav no longer reflows when the language changes.** `.main-nav a` has a fixed `width: 170px` (150px under
  1180px), which clears the widest label in either language — "[ Tentang Merek ]", measured at 112.7px in
  DM Sans at T6. `.search-toggle` has a `min-width` for the same reason, because SEARCH becomes the much
  shorter "CARI". **If you change a nav label or T6, re-measure.**
- **One eased hover language everywhere** (`--hover-ms` 280ms, `--ui-enter`). Nav, SEARCH, the globe, the
  language options, text buttons, footer links and the product names in the Home carousel all get an underline
  that fades in and rises from 7px to 3px below the text. The underline is always present but transparent, which
  is what makes it animatable; a `background-image` underline was avoided because it would span the fixed 170px
  nav boxes rather than the words. The logo changes colour instead; the circle buttons invert to cream with green
  text/icon. This went through an opacity fade, then an instant underline, before landing here.
- **Language switching bug fixed.** `applyLang` rewrote internal links with the selector `a[href$=".html"]`,
  which stopped matching the moment `?lang=id` had been appended. Switching back to EN therefore left the
  stale param on every link, and the next click silently reverted the site to Indonesian. The rewrite now
  matches on the **path** and rebuilds the query from scratch. On load, whichever source wins (URL, then
  storage, then EN) is also written back to storage, so the choice is the same on every page.
- **Favicons:** `icons/favicon.svg` is the **white (cream `#f9f8f2`) logomark on a transparent background**, as asked —
  no green tile, no background rect. Same for `favicon.ico` and `icon-192/512.png`.
  ⚠️ **A white mark on transparent is invisible on a light browser tab.** If that turns out to be a problem, either
  give the SVG a `prefers-color-scheme: light` rule that switches the fill to `--green`, or put the green tile back.
  `apple-touch-icon.png` and the maskable 512 **keep the green tile on purpose**: iOS composites transparency to
  black and Android plates maskable icons, so those two have to be opaque.
- **Images:** the five photos the pages actually load are served as `.webp` (quality 80, never upscaled): 1283KB -> 866KB, about a third lighter. **The original .jpeg/.jpg files are kept in place, untouched** — the `.webp` sits beside each one. The other ten photos in `images/` are unreferenced and were left alone, so don't upload the whole folder to the host.
  No `<picture>` element was used: WebP support is universal now, and a `<picture>` would have put the `<img>` one level deeper and broken the `.img-box > img` rule in the CSS.
- **C2PA metadata:** the three `logos/web/*.svg` files carry Anthropic Content Credentials (64-81% of each file, ~7.6KB each) from when they were generated. Anderson deliberately chose to leave these in place, and the files on disk still have them. **Note:** since the logo became a CSS mask, the pages no longer load those files at all — the path is embedded in styles.css *without* the metadata (a mask only needs the shape). So the credentials are preserved in the source files but no longer shipped to visitors.
