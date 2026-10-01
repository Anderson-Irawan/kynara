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

## Naming: "the About page"
Anderson calls **The Brand page "the About page"** from September 2026 on (its draft was always `About.png`).
They are the same page: `brand.html`, `page-brand.php`, nav label "The Brand". When he says "About", he means this.

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
index.html  products.html  brand.html  contact.html  terms.html  404.html
.htaccess             Apache: missing addresses show 404.html (the current host is Apache)
archive/              kept-for-later snippets (product-options.html). NOT part of the site - don't upload.
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
   - **the Home story cards landing** — once, when the story is a quarter on screen, the two cards are "laid down"
     like magazines on a desk (brown from the left, rust from the right a beat later). Anderson asked for this; it
     is the one deliberate exception to the scroll-reveal ban, so **don't extend it to other content** without asking.
   - **the Home story cards tilting toward the pointer** (2.5° at most) — Anderson asked for this; it is the one
     exception to "no hover lifts". Its arrow nudges 3px the way it points on hover.
   - **the layer breakdown on the About page closing up as you scroll** — it arrives exploded and the layers
     come together into one board (scroll-scrubbed and pinned; no layer is singled out) — `css/layers.css` + `js/layers.js`, see
     "Layer breakdown" below. Anderson asked for it. No shadows.
   - **in-frame parallax on every photo on the About page** — `.img-box--parallax`: the frame stays put and the
     photo drifts inside it (see Done).
   - **the Home hero dissolving into the green section** — a static fade (`.hero__fade`) plus a green wash
     (`.hero__wash`) whose opacity rises with scroll. This is a scroll-linked *colour* change on the hero,
     not content revealing itself, so the ban on scroll-reveal still stands.
   - **an interactive glow on the Home hero** — `.hero__glow`, a soft rust light that eases after the pointer.
   - **the stats on The Brand counting** — once, when they come into view: up from 0, except deforestation,
     which counts *down* from 250 to 0. This is the one thing triggered by scrolling into view, and it was
     asked for; it animates numbers, it doesn't reveal content (the final values are in the HTML all along).
   - **the header shrinking on scroll** (`--shrink-ms`), with the wordmark retracting to the logomark — and
     **growing back out on the next page** when you navigate while it's shrunk (after vestre.com).
   - **Lenis smooth scrolling** on wheel/trackpad, every page. Touch stays native.
   - **hover, eased** — every hover uses `--hover-ms` on the `--ui-enter` curve so the page moves with one
     rhythm. Links and text buttons: the underline **draws across** — in from the left, away to the right on
     leave. The globe and the search magnifier get a **filled rectangle** instead (green fill + cream on the
     cream bar; cream fill + green over the Home hero). The logo and the footer icons change colour (green;
     the logo goes rust over the hero). The circle buttons invert to a cream fill with green text/icon.
     Colour, underline and fill only — still no lifts, scales or shadows.
   - **the footer shapes drifting** — irregular outlines with softened corners (1px `--green`, no fill) sliding slowly sideways
     behind every footer, after vestre.com's footer (`.footer-shapes`, see Done). Still under reduced motion.
   - **the contact button extending on hover** — the rounded square opens leftwards into a rounded rectangle reading
     "Request a quote or get in touch", the chat bubble travelling with the left edge (`.chat-fab`, see Done).
     A width change on the button itself, not a scale.
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
   | `--t3` | 36px | section titles, story h2, subscribe heading, stat values, the name (and "View all products") on the Home carousel cards |
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
5. Borders are 1px solid black. Form fields have square corners. Only product cards are rounded — 46px, 32px on phones: the Products page cards and the Home carousel cards.
6. The active nav item is wrapped in square brackets: `[ Contact ]`. This is done in CSS through `aria-current="page"`, so don't type the brackets.
   The Send Enquiry button no longer does: it is a solid `.btn` (see Forms) — `.btn-bracket` was removed.
7. The header is **`position: fixed` on every page** and shrinks once the page scrolls past 40px (`.is-scrolled`,
   from main.js). There are two variants at the top of the page:
   - `site-header--overlay`: sits over the hero — **Home only** now. Transparent, cream text, no rule.
   - `site-header--light`: cream background with a 1px rule under it (Products, The Brand, Contact). Dark text.
   Once scrolled, both look the same: a short cream bar, dark text, logomark only, and **no rule**. The rule
   only reappears while the search panel is open. It stays on screen all the way down, footer included.
   Fixed rather than sticky on purpose — see the Done notes.
   Light-header pages reserve the full header height with `.site-header--light + main { margin-top }`, so
   `<main>` **must** stay the element directly after `</header>`.
8. Keep BEM-ish class names (`block__element--modifier`) and the existing section comments.
9. **The page is full-bleed.** `.wrap` has **no max-width** — it only sets `--page-pad` of padding left and right
   (100px, stepping down to 60px / 32px / 20px at the breakpoints). Never reintroduce a page max-width.
   Anything that has to line up with that edge should use `var(--page-pad)`, the way the hero circle and the
   carousel's off-edge bleed do. Avoid fixed-px grid columns at full width: they stretch badly on wide monitors,
   which is why `.feature` and `.footer-cols` are fractional.

## Header and footer are duplicated
The header and footer markup is copied into all six HTML files (the four pages, terms.html and 404.html) so the pages work with no JS and no build step.
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
- **English lives in the HTML only (1 Oct).** main.js (`localized()` in applyLang) shows each element's own
  English, read from the page the first time it's translated, so **editing English = editing the page** (or the
  WordPress template). It used to fill English from the `en` dictionary too, which silently undid HTML edits —
  Anderson hit that on the Terms page. The `en` entries now only cover text JS creates (form messages, search,
  language switch) and elements whose HTML is empty; editing an `en` entry does NOT change text written in a page.
  Indonesian still comes from the `id` dictionary (falling back to the page's English for a missing key).
  Tested: EN → ID → EN on all pages, a page opened with `?lang=id` then switched to English, and with the `en`
  entries deliberately changed (the page's English still wins).
- Translatable elements carry one of these attributes:
  `data-i18n="key"` (plain text), `data-i18n-html="key"` (text with `<br>`/`<em>`),
  `data-i18n-placeholder="key"`, `data-i18n-aria="key"`. The page title comes from `<body data-title-key>`
  and the meta description from `<body data-desc-key>`. Switching language also updates `og:title`,
  `og:description` and `og:locale` (see `setMeta` in main.js), so the `meta.desc.*` keys must exist in both dictionaries.
- Strings live in `js/i18n.js` under `en` and `id`. **When you add text: write the English in the HTML, give the
  element a `data-i18n` key, and add the `id` entry** (an `en` entry too, by convention — it keeps the two
  dictionaries in parity — but it is only a fallback). **When you change English text, edit the HTML only.**
- The chosen language is saved in localStorage (inside try/catch) and also carried on links as `?lang=id`.
- Product names (GROVE, RIDGE, LEDGE, SAPLING, CEDAR, ASPEN, LATTICE) are brand names. Do not translate them. Neither is the hero
  headline — see the rolling-word section above.
- **The switcher is a globe + dropdown** (`.lang-switch`), not the old `EN / ID` pair, which read as a label
  rather than a control. The globe shows the current code, and the menu lists both languages explicitly.
  The option labels are endonyms — "English" and "Bahasa Indonesia" each stay in their own language, so they
  carry no `data-i18n`. Menu logic (open, close on Escape, close on outside click) is in main.js; the existing
  `[data-set-lang]` handler still does the actual switching.

### Translating to Indonesian (next task)
- The `id` dictionary already has a **first-pass translation** of every real string: nav, headings, product uses, stats, form labels and footer. Anderson reads Indonesian, so ask him to review the wording, especially "Hubungi Kami" for "Enquire Today". (The hero is no longer part of this — it stays English.)
- **No lorem ipsum is left (1 Oct).** The eight body paragraphs (Home story cards `home.craft.body` / `home.forest.body`;
  About `brand.craft.a/b`, `brand.sustain.a/b`, `brand.apps.a/b`) were written from Anderson's **KYNARA teaser / brand
  guidelines PDF**, in EN and ID, in the static pages, the theme templates and both dictionaries. **Every claim comes
  from that document** (mineral + wood composite layers, NanoWood™ ~7 layers, rice husk + post-consumer plastics,
  zero deforestation, 100% recyclable, the advantages list, ASTM / third-party testing incl. 5,000h QUV/QSUN) — keep
  new copy inside it; don't invent performance claims. The `LOREM_*` constants in i18n.js were removed.
  One addition from Anderson himself (1 Oct): **KYNARA also uses recycled wood**, which is why production needs zero
  deforestation — said in `brand.sustain.b`.
  Not from the document and still unverified: the About stats (60% / 30% / ~600kg).
- Register: formal but warm (use *Anda*, not *kamu*). Keep premium, concise phrasing. Keep the product names and "KYNARA" in capitals.
- Where ID text runs longer, check the layout at 1280px and 390px. There is no longer an ID hero size override: the hero is English in both languages, so it cannot overflow its `white-space: nowrap`.

## Forms
- **Contact** (`contact.html`): Name*, Company Name, Email*, Message*, Attach File. Validation uses the browser's built-in checks.
  Submission is set in `js/config.js → contact.endpoint`. While that is empty, the form opens the visitor's email app pre-filled to `enquiries@kynara.id`, and attachments can't travel that way.
  To finish this, connect a form service (Formspree, Netlify Forms, Basin, or a PHP mailer on the host) and put its URL in `endpoint`. The form already posts `multipart/form-data` including the file.
- **Subscribe** (footer, all pages): set `subscribe.endpoint` in config.js (Mailchimp or Brevo). For now it only shows a thank-you message.
- The designs had no submit buttons, so "[ Send Enquiry ]" and a small "SUBSCRIBE" text button were added in the
  bracket style. **Send Enquiry is now a solid button** (`.btn`, 28 Sep — Anderson said it read as a link): green fill,
  cream text, 1px border, square corners like the fields, hover inverts to cream/green, ink focus ring. No brackets.
  SUBSCRIBE stays a small text button with the drawn underline.

## Placeholders still to fill
- **Product images are real (30 Sep):** Anderson's "hf" photos, `images/products/<slug> hf.png` (1792×2400, the
  masters, ~6MB each — never load these), served as `images/products/<slug>.webp` (q80, 900px wide, 20–50KB), on the
  Products page and the Home carousel (where the squarer frame crops them top and bottom, centred). They replaced a
  first set of `<slug>.jpeg` photos the same day. **To swap a photo:** re-export the WebP to the same path; no HTML
  changes. The old stand-ins `images/product 1/2` (one had another company's "MATTER HUB" label) are no longer used.
  **WordPress:** set each product's featured image in the admin (the hf PNGs are the ones to upload).
- **Use lines are Anderson's (30 Sep)** — every product has one now: Grove **Cladding**; Lattice **Decking**; Ridge
  and Ledge **Cladding | Siding | Wallpanel | Plafond**; Sapling, Cedar and Aspen **Furniture**. They appear in the
  use line under the name, the Key facts Use row, the Home carousel's Use row and search (keys `product.<slug>.use`).
  ID: Pelapis Dinding / Lantai Dek / Pelapis Dinding | Siding | Panel Dinding | Plafon / Furnitur — review.
  **"Sledding" was Anderson's typo for "Siding"** (corrected 1 Oct, EN and ID). The theme's i18n copy used to say Grove = "Decking" / "Lantai Dek"; that was wrong and
  is now in line with the static one. WordPress: the seed carries these, but an existing site keeps whatever its Use
  fields say — update them in the admin.
- **Colour + Finishing are a PLAIN LIST (1 Oct)** — shown, **not selectable** (Anderson: "don't make them selectable").
  Each row is an `<li class="pick__row">` (swatch + name; Finishing has no swatch): no buttons, no selected row,
  no tick, no hover, not in the tab order. main.js section 15 now only wires lists with `role="radiogroup"`, so these
  stay inert. (Earlier that day the lists were hidden altogether, then brought back like this.) The **selectable**
  version is kept in `archive/product-options.html`; its CSS (button rows, `.is-selected`, the tick) is still in
  styles.css. WordPress: `KYNARA_PRODUCT_OPTIONS` (now true) shows/hides them; page-products.php prints plain rows.
  Where the description below talks about choosing, ticks and arrow keys, that is the archived selectable version.
- **Product cards are Vestre-style (30 Sep, live)** — after vestre.com's product pages ("Choose materials").
  Each card body: name + use line, then **Key facts | Colour | Finishing** (`.product-card__specs`: 1fr / 2fr, the 2fr
  split 1.25 : .75 by `.pick`). Stacks under 1180px; on phones (≤520px) Finishing drops under Colour.
  - **Key facts** (`.facts__list`): **Use** and **Size** (3m on every product) — label left, value right, 1px rule
    under each. Length, Width and Thickness were **removed at Anderson's request** (30 Sep) in favour of Size.
    The Use value carries the product's `product.<slug>.use` key so it translates with the use line.
  - **Colour** and **Finishing** (`.pick__list`): flat square rows with 1px ink rules; each list is its own radio
    group (main.js **section 15**: click to choose, arrow keys move, only the chosen row is tabbable). The chosen row
    fills **green** with a tick. Colour rows have a 28px square swatch; Finishing rows (**Sanding**, **Wirebrush**) don't.
    The heading is just "Colour" — no chosen name after it.
  - **"Read more about the materials"** appears **once, above the product list** (`.pick__more`), linking to the
    About page's layer breakdown at `#our-product` (lands with the board exploded). **Always open (1 Oct,
    Anderson)**: a plain `<div>` with a `.pick__more-title`, no longer a collapsible `<details>` with a "+".
  - Photo vertically centred in the card. **Removed at Anderson's request — don't add back:** a "Request a quote"
    button on each card, a finish column on the colour rows (Brushed/Embossed/Matte), and the chosen colour's name
    after the "Colour" heading. "Shorten the columns" meant narrower, not shorter rows.
  - **The colour range is KYNARA's (Anderson, 30 Sep):** Natural Teak, Royal Walnut, Warm Cherry, Weather Oak, Ebony,
    Graphite — the same six on every product, in that order. Names are product names, so they carry no `data-i18n`.
  - **WordPress:** `page-products.php` builds the same card from the admin. Key facts = Use, then **Size** (a text field,
    default "3m"; products never saved since it was added also show 3m — `kynara_product_size()`; empty hides the
    row), then any **Measurements** repeater rows, now optional extras. Colour = the **Colour variants** repeater (the list
    is hidden until at least one colour exists). `kynara_seed_products()` gives each starter product the six colours
    (written as SCF repeater meta), so **only a fresh install gets them** — on an existing site, add them in the admin.
    Finishing = a new
    **Finishing** checkbox field (Sanding / Wirebrush; both ticked by default, and products never saved get both —
    `kynara_product_finishing()`).
  - Keys: `product.facts`, `product.options`, `product.colour`, `product.finishing`, `product.finish.sanding` /
    `.wirebrush` (ID "Amplas" / "Sikat kawat"), `product.size` (Size / Ukuran), `products.materials.more` /
    `.body` / `.link` — ID wording is a first pass, review. `product.measurements`, `product.colors` and `product.length` / `.width` / `.thickness` were removed.
- Product **size**: every product shows Size 3m. If one differs, change its `<dd>` in products.html and its Size field
  in the admin.
- **Colour swatches are approximations** of the names (Natural Teak `#a8703f`, Royal Walnut `#5a3824`, Warm Cherry
  `#8e4630`, Weather Oak `#9c8c77`, Ebony `#2e2521`, Graphite `#55575a`). Match them to KYNARA's physical samples:
  the `.pick__swatch` backgrounds in products.html, the seed list in `inc/products.php`, and the admin.
  If a product doesn't come in every colour, remove its rows.
- **Social links:** the footer has Instagram, Facebook and Email icons (see Done). **Instagram and Facebook still
  point to `#`** — put the real profile URLs in all four static footers and `footer.php`.
- **WhatsApp numbers.** The two footer phone numbers open WhatsApp (1 Oct) — `https://wa.me/<number>`, new tab.
  The real numbers since 1 Oct: **+62 852 3338 6088** (`wa.me/6285233386088`) and **+62 882 2325 2525**
  (`wa.me/6288223252525`). Each number is written two ways: the **link** (country code + number, digits only —
  no `+`, spaces or leading 0) and the **text** people see. To change one, edit both, in **all six static pages** (index,
  products, brand, contact, terms, 404) **and** `wordpress-theme/kynara/footer.php`. In VS Code: Ctrl+Shift+H
  (replace in files), replace the old link digits (e.g. `wa.me/6285233386088`) with the new ones, then the old
  visible text with the new — the two numbers differ, so each can be replaced on its own. An Indonesian
  mobile written locally as 0812-3456-7890 becomes link `wa.me/6281234567890` and text `+62 812 3456 7890`.
  To pre-fill a message: `https://wa.me/6281234567890?text=Hello%20KYNARA`.
- Terms of Use now goes to its own page (see Done); **Privacy still points to `#`** — a privacy policy page is still to be written.

## Decisions already made
- The nav item is **"Products"** and opens `products.html`. The Product draft labels it "[ Projects ]"; Anderson asked for "Products" instead. If a separate Projects (portfolio) page arrives, create `projects.html` and add it as its own nav item — don't rename this one back.
- Two typos from the drafts were corrected: "Craftsmenship" → "Craftsmanship" and "post-customer" → "post-consumer".
- Image mapping: Home hero = **video** `videos/hero.mp4` with poster `images/hero-poster.webp` (see Done; the old hero photo `hero-cosmos_1160439100.webp` is no longer used on Home), The Brand banner = `images/brand-banner.webp` (see Done; `kids in forest` is no longer used); Craftsmanship = `meeting ith forest.jpeg`; Sustainable = `cosmos_789092184.jpeg`; Limitless Applications = `cosmos_969656075.jpeg`.
- The file names contain spaces, so they are URL-encoded in the HTML (`%20`). If you rename images, update the paths.
- SEARCH opens a simple panel that filters a small index in main.js (`SEARCH_INDEX`). Add new pages or products to that index.
- Breakpoints: 1180px (tightens the grids) and 900px (mobile: MENU toggle, everything stacks), plus 520px.

## Before launch
- **Font licensing:** Candara is a Microsoft font, and its standard licence may not allow web embedding. Confirm a webfont licence or pick a licensed alternative. DM Sans is open source (OFL). **Still open — this is the real blocker.**
- **Domain: `kynara.id`** (Anderson, 28 Sep 2026 — it replaced the earlier guess `kynara.co.id` everywhere: canonical
  and `og:` URLs, the enquiries email `enquiries@kynara.id`, config, dictionaries, the theme). The canonical and
  `og:url` are hardcoded in the static pages; if the domain ever changes again, search the project for it.
- ~~The Brand hero image is too small~~ — resolved: The Brand no longer has a hero (see Done). The banner that
  replaced it is 1440px wide; on very large screens (container over ~1440px) it will soften slightly.

### Done (October 2026)
- **Footer shapes (after vestre.com's footer).** Behind every footer, a band of shapes drifts slowly left
  (`.footer-shapes`, 140s per loop): **irregular polygons — notches, odd angles — with every corner rounded off (radius 28 in
  tile units), as 1px `--green` strokes with no fill**. One 2400×800 SVG tile is drawn twice in `.footer-shapes__track`, which slides
  by -50% (exactly one tile), so the loop never shows a seam; shapes must stay inside the tile. Each SVG is as tall
  as the footer. Behind the content (`z-index`), `aria-hidden`, not clickable, still under reduced motion.
  **Tried and rejected by Anderson:** pieces of the logomark (leaf-hands, dome); soft round forms ("too
  circular"); sharp-cornered polygons ("too similar to Vestre"). The corners are rounded in the path data
  itself (scratchpad `footershapes4.js` in the October session: each vertex becomes a curve starting R before it). Note for edits: a CSS rule does not reliably style paths inside a `<symbol>` drawn through `<use>`
  (that first version came out filled black) — the shapes are now plain `<polygon>`s styled by CSS.
- **Terms of Use page** — `terms.html` / `page-terms.php` (slug `terms`), after vestre.com/terms-of-use: T1 title,
  T4 lead, "Last updated", then eight numbered sections (T4 Candara headings, T5 body, 640px column). Every footer's
  "Terms of Use" link points to it. Copy and keys `terms.*`, `meta.*.terms` (EN + ID). **It's a sensible template,
  not legal advice — have KYNARA's lawyer review it**, especially section 8 (Indonesian law was assumed) and 6 (privacy).
  In WordPress the page is created automatically, also on sites set up before it existed (`kynara_ensure_pages()`,
  remembered in the `kynara_pages_list` option).
- **404 page** — `404.html` / `404.php`: "Error 404" label, T1 "This path leads nowhere.", a line of copy, a solid
  `.btn` "Back to home" and an underlined "Explore our products" link, beside the forest-path photo
  (`brand-banner.webp`); light header, footer, contact button. Keys `notfound.*`, `meta.*.notfound`. The static
  page carries `<base href="/">` (it is served at any missing address, so relative links must resolve from the root
  — it therefore doesn't work opened straight from disk) and `noindex`. `.htaccess` points Apache at it.

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
- **Header no longer hides at the footer.** It used to slide away (`.is-hidden`) once the footer was 30% of the
  way up the screen; Anderson asked for it to stay. The class, its CSS and the `.site-header` transform/opacity
  transition that only served it were removed from both copies. Don't bring it back without asking.
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
- **Carousel end stop fixed.** The track used to stop as soon as the last card was fully visible, leaving Lattice
  stranded on the right (at 1280px its left edge sat at ~821px). A spacer (`.collection__track::after`, width = track −
  one card − gap) sets where the last stop leaves the last card: in slot `--end-slot` from the left. Anderson tried slot 1 (Lattice
  where Grove starts, 6 clicks) and found it "too much", so desktop is **slot 2** (one card before it, 5 clicks); phones
  stay at slot 1 because slot 2 would hang off a phone screen. Verified at 1280, 1920 and phone widths. The card width
  lives in `--card-w` on the track (422px; 78% on phones) because the spacer needs it. The old 200px bleed-past-the-edge margin and padding were dropped; the track
  now runs to the screen edge. The Next button still wraps back to the first card from the end.
- **Home carousel items are spec-sheet cards** (`.product-tile`, after Anderson's "001. stack" reference), replacing the
  bare photo + name. Each card, cream on the green section: a head row with the name (Candara bold, T3, **in capitals**
  via `text-transform`, 1 Oct — the HTML/admin keep "Grove") over a 1px ink rule. **The "01." numbers were removed at
  Anderson's request (1 Oct)** — don't add them back; the photo edge to edge with a rule under it; a **Use** row
  (T6, label left, value right, rule under) only when the product has a use line; then the squared 45° arrow, bottom
  right. **The whole card is the link, with no underline**; hover nudges the arrow 3px the way it points. Cards stretch
  to the tallest (`.collection__item` is flex), so the arrows line up — a card with no Use row shows a blank band there
  until its use line is supplied. A Material row and a small KYNARA logo in the foot were tried and **removed at
  Anderson's request** — don't add them back. Rounded like the Products page cards (46px / 32px on phones, at Anderson's request), with
  30px/34px padding in the head and foot to keep the text and arrow clear of the corners. The photo's `alt` is empty because the card already names the product. In the theme Use comes from the admin field; the whole Use list is skipped when it's empty. Key:
  `product.card.use` ("Use" / "Kegunaan" — review).
  **The last card is "View all products"** (`.product-tile--all`, 1 Oct): the same card shell, so the same width and —
  stretched like the others — the same height, holding only the words (`.product-tile__all`, Candara bold T3, in the
  tracking group) and the arrow; it links to Products. It replaced the "See all" link beside the title. Being the last
  card, it's where the carousel's end stop lands (slot 2 on desktop). Key `home.viewAll` ("View all products" /
  "Lihat semua produk" — review). In the theme it follows the product loop in front-page.php.
- **Floating contact button** (`.chat-fab`): a 64px **rounded square** (16px corners; 56px and closer in on phones)
  fixed bottom-right with a **filled** chat-bubble icon (`fill="currentColor"`, so it inverts with the button), linking to Contact, on **every page except Contact**. Solid `--green`
  with a cream icon and a 1px cream border — the border is what keeps it visible over the green Home section.
  **On hover (and keyboard focus) it grows to the left** into a rounded rectangle with the visible label `fab.label`
  ("Request a quote or get in touch" / "Minta penawaran atau hubungi kami" — review), inverting to cream. The bubble
  rides out with the left edge and finishes to the left of the text; the text is pinned to the right, so it stays
  still while the bubble slides off it. How: `.chat-fab__label` animates `width` from 0 to `--fab-label-w`, which
  main.js (section 12) measures from `.chat-fab__text` and re-measures with a ResizeObserver (language switch, font
  arriving). Without JS the var falls back to `auto`: it opens to the right size without animating. The icon is
  first in the row via `order: -1`.
  **History, so it isn't repeated:** it began as a circle with a pill revealed by `clip-path`, but the clipped pill
  couldn't draw the circle's left edge, so a separate ring showed through mid-animation — Anderson disliked it. A
  `grid-template-columns: 0fr → 1fr` version was also tried: it only fits the text at the two end states and leaves
  a gap in between (the fr track takes a fraction of an already-fractional box), so it was replaced by the measured
  width. Animating `width` is fine here because the button is fixed and reflows nothing else.
  Hover sits inside `@media (hover: hover)` so a tap on a phone just goes to Contact. The focus ring is drawn in ink,
  because the site's default `currentColor` ring would be cream and vanish on cream pages. `z-index: 15`, under the
  header. The visible label is the accessible name (the old `aria-label` / `fab.contact` was removed).
  In the static site it's pasted after `</footer>` in index, products and brand (**not** contact); in the theme,
  `footer.php` shows it unless `kynara_current_page()` is `'contact'`.
- **In-frame parallax on the About page** (all four photos: the banner and the three feature images). Each
  `.img-box` gets the `img-box--parallax` modifier; the CSS makes the photo 120% of the frame's height, starting 10%
  above it, and main.js (section 13) moves it by `-p × 10%` of the frame's height, where `p` runs 1 → -1 as the frame
  crosses the screen — exactly the slack, so no edge ever shows (swept in headless Chrome: smallest gap 0.6px). Only
  `transform` is written, reads are batched before writes, and off-screen frames are skipped. Off under reduced
  motion (CSS and JS); with JS off the photo just sits 10% cropped. **To use it elsewhere**, add `img-box--parallax`
  to any `.img-box` whose child is an `<img>` — nothing else is needed. (Testing note: headless Chrome with
  `--virtual-time-budget` produces no frames, so real scroll events, rAF and IntersectionObserver never fire; a test
  has to shim rAF and dispatch `scroll` itself. An IntersectionObserver version was dropped partly for that reason.)
- **Home story collage ("Layers of Craftsmanship" / "Exploring Sustainable Forest Alternatives") is 15% smaller**:
  `.story` is 85% of the container, centred, with its paddings scaled by 0.85 (55 → 47px etc.); photos follow
  through their aspect-ratio boxes. The type stays on its tiers and the "Learn about The Brand" circle keeps its
  size and 42px gap, as asked. Phones (≤900px) go back to full width.
- **Products renamed and extended to seven** (Anderson's list, in this order): **Grove, Ridge, Ledge, Sapling, Cedar,
  Aspen, Lattice**, slugs/anchors in lower case (`products.html#ridge`). The first four took over the old four slots —
  Floor/Grove → Grove, Bark → Ridge, Heartwood → Ledge, Edge → Sapling — and kept those products' use lines until
  Anderson supplied real ones for all seven (see "Use lines are Anderson's"). The theme still hides the line when the
  field is empty, and a search entry with no `key` is still handled (main.js doesn't print "undefined"). Dictionary keys follow the slugs (`product.ridge.use`…). Updated: static
  Products cards (names typed in capitals, as the static CSS doesn't uppercase), Home carousel, all four footers, the
  static search index, both dictionaries, the Products meta/og description, and the theme's starter list + README.
  **An existing WordPress database is not changed** — `kynara_seed_products()` only seeds an empty site, by design, so
  the team's edits are never overwritten. A preview database made before this (`wordpress-theme/.preview-data/`) still
  has the old four: rename/add them in Products in the admin, or delete that folder to start fresh.
  **Order since 30 Sep: Grove, Lattice, Ridge, Ledge, Sapling, Cedar, Aspen** — Lattice moved up under Grove because
  **Grove and Lattice are the flagship products**; keep them first and second. Changed in the same places as above
(the carousel numbers were renumbered then; they've since been removed). WordPress orders products by **Order** (`menu_order`, in each
  product's Page Attributes box): the seed now gives Lattice 2, but an existing site needs Lattice set between Grove
  and Ridge by hand (e.g. Grove 1, Lattice 2, Ridge 3 … Aspen 7).
- **Home story cards link to About chapters** (Anderson chose **two** groups for now). The whole card is the link:
  "Layers of Craftsmanship" (brown) → `brand.html#craftsmanship`, "Exploring Sustainable Forest Alternatives" (rust) →
  `brand.html#sustainability`; the circle button still goes to the top of About. The heading's `<a class="story__hit">`
  is stretched over its card with `::after` (so the heading underlines on hover, and keyboard focus rings the whole
  card). **The `data-i18n` key sits on the `<a>`, not the `<h2>`** — applyLang replaces the element's content, which
  would delete a link nested inside it. The brown card used to be three loose grid pieces (`.story__brown-bg`, head,
  media) and couldn't be wrapped in a link; it's now one `<article class="story__card--brown">` using
  `grid-template-rows: subgrid`, so its image row is still the row the red card starts on. `z-index: 0` on brown vs
  1 on red keeps clicks in the overlap going to the red card (checked with elementFromPoint). The About page itself
  was not reordered — it keeps the drafted feature / reverse / feature rhythm.

  **Then (same day) the cards got an arrow, a tilt and a landing**, after a draft page Anderson approved (deleted since):
  - **No title underline**; the whole card is the link. A squared 45° arrow (`.story__arrow`, 32px; the head's arms
    about as long as the tail) sits top-right of each card and nudges 3px up-right on hover. Titles have 48px of
    right padding to clear it. The arrow is inline SVG in both cards (index.html and front-page.php).
  - **Tilt** (main.js section 14): up to 2.5°, eased 7% per frame, through `--rx` / `--ry` in a `perspective(1600px)`
    transform. The first draft (4°, 12%, measuring the card on every move) was "too shakey": a tilted card's outline
    changes as it tilts, so re-measuring fed the tilt back into itself. **Measure once on pointerenter** (and again
    after a scroll) — keep it that way.
  - **Landing**: `.is-armed` (opacity 0, offset ~70–110px, rotated ±6–7°, scale 1.06) → `.is-in`, 720ms on
    `--ui-enter`, rust 130ms after brown, at 25% visibility, once. It uses the individual `translate` / `rotate` /
    `scale` properties so it composes with the tilt's `transform` instead of overwriting it. JS arms it, so with JS
    off the cards just show; reduced motion skips both effects (JS and CSS). `.home-green`'s `overflow: hidden` keeps
    the off-side starting positions from causing a sideways scrollbar.

  **Ready if Anderson switches to three groups** (he said he might). The agreed plan:
  - About becomes three numbered chapters, each opening with a small T6 label ("01 — Craft") above its headline:
    **01 Craft** `#craftsmanship` = *Why KYNARA* (new: the problem and the idea, 3–4 sentences) + *The Material*
    (husk → blend → shape → finish); **02 Sustainability** `#sustainability` = the counting stats (+ certifications and
    partner farms later); **03 Applications** `#applications` = *Performance* (new: weather, termites, rot, upkeep)
    + where it's used, linking to Products. Close the page with a "Request samples or a quote" call to action → Contact.
  - Home gets a third card: "Built for Limitless Applications", teaser "Floors, walls and structures, made to last
    outdoors.", → `#applications`, in **cream** (the only palette colour besides brown and rust that reads on the green
    section; it needs ink text). Collage: brown top-left, rust overlapping right, cream below-left overlapping the rust;
    the circle button moves under the cream card or beside it. Phones just stack.
  - The footer's About column already lists exactly these three anchors, so it needs no change.
  - Building it: copy the rust card's markup (it's a plain `<article>` with a stretched `.story__hit`), give it
    `story__card--cream`, add a third row to `.story`'s grid, and add EN + ID keys.
- ~~"See all" beside "Explore Our Collection"~~ — **removed 1 Oct** at Anderson's request (link, `.collection__all` styles
  and `home.seeAll`), replaced by the "View all products" card at the end of the carousel.
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
- **Search in the nav is the magnifier alone** (Anderson removed the SEARCH label, 28 Sep). Its accessible name is
  `aria-label` via `data-i18n-aria="search.label"` ("Search the site" / "Cari di situs"); the `nav.search` key was
  deleted. General rule that still stands: `applyLang()` sets `textContent`, so **never put `data-i18n` on an
  element that also contains an icon or other markup** — put it on an inner `<span>` (as the nav links now do).
- **Hero is full height** (`100svh`, with a `100vh` fallback line above it). The headline is now anchored to
  the bottom of the hero with a viewport-relative padding instead of the old fixed 468px from the top, and the
  620px mobile override is gone. `.hero--brand` no longer has a height rule — the class is inert but left in
  the markup.
- **Parallax on the Home hero.** `.hero--parallax` + `data-parallax` on `index.html` only; adding the same two
  attributes to `brand.html` would switch it on there. The CSS makes the photo 130% of the hero height and
  shifts it up by the overflow; main.js translates it at 30% of scroll speed, which exactly consumes the slack
  so no edge is ever exposed. Guarded by `prefers-reduced-motion: no-preference` in CSS *and* a matchMedia
  check in JS, and it degrades to a still photo with JS off.
- **Nav sits beside the logo (1 Oct)**, no longer centred. The bar's grid is `var(--logo-w) auto 1fr` (48px gap; 36px
  under 1180px): the first column is the **full** logo width, so when the header shrinks and the logo narrows to the
  logomark inside it, **the nav doesn't move** (measured: the first link at the same x before and after, at 1280 and
  1000px). `--logo-w` (195px) now lives on `:root` so the logo and the column share it; the footer and phone
  overrides on `.brand-logo` still work. Phones (≤900px) keep their own grid with the MENU.
- **Nav no longer reflows when the language changes.** `.main-nav a` has a fixed width — `140px` (130px under 1180px),
  left-aligned text with the spacing on the right — which clears the widest label in either language — "[ Tentang
  Merek ]", measured at 112.7px in DM Sans at T6. (It was 170/150px, centred, while the nav was centred.) (The search button used to need a `min-width` too, for SEARCH → "CARI"; it's icon-only now.)
  **If you change a nav label or T6, re-measure.**
- **One eased hover language everywhere** (`--hover-ms` 280ms, `--ui-enter`). History: opacity fade → instant
  underline → underline fading in and rising 7px → 3px → **now (28 Sep) an underline that draws across**, from the
  left on hover and away to the right on leave. **It's a 1px border on `::after`, scaled 0 → 1 along x** (`transform-origin`
  flips right → left on hover without transitioning, which gives in-from-left / out-to-right). **Keep it a border:** a
  first version used a 1px `background-image`, which lands wherever the text box ends — often between device pixels,
  especially at Windows 125%/150% scaling — and got smeared across two pixels, looking thicker than the crisp line
  Anderson happened to see in the full-height nav. He asked for that thin line everywhere; borders are snapped to
  whole device pixels, so it now is (checked at 1.25× scale). The line spans its element, so **it must sit on
  something as wide as the words**: nav links (fixed 140px boxes) and language options (full-width buttons) wrap their
  text in a `<span>`, and the nav's `data-i18n` lives on that span. Applies to: nav, MENU, language options, the
  subscribe button, footer column links, the Terms/Privacy links (`.footer-bottom nav a` — not the footer logo,
  which is a link too).
  **The globe and search** (28 Sep) use a fill instead: a `::before` rectangle 9px/10px larger than the button (so
  nothing moves; `isolation: isolate` keeps it behind the text/icon), fading in with the text colour inverting —
  green fill + cream text on the cream bar, cream fill + green text over the Home hero
  (`.site-header--overlay:not(.is-search-open):not(.is-scrolled)`). The globe stays filled while its menu is open.
  The 10px sides leave a 6px gap between the two fills at the header's 26px gap.
- **Footer social icons** (28 Sep): Instagram, Facebook and Email (`mailto:enquiries@kynara.id`) replaced the four
  grey placeholder squares (the LinkedIn and WhatsApp placeholders went with them). The SVGs are copied from
  atapku.com's footer, which Anderson pointed to: 24px line icons (Facebook is a filled "f"). A 48px bordered box was
  tried and **removed at Anderson's request** — they're bare icons now, with 6px padding for a 36px tap area and the
  row pulled 6px left so the first icon lines up with the column. Hover turns them green. Instagram/Facebook open in
  a new tab and still point to `#`. Email's label is `footer.email` ("Email us" / "Kirim email").
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

## Layer breakdown / exploded view (added 28 Sep 2026, placed on the About page the same day)
Anderson asked for an interactive version of his layered-board render (PU clear coating, Nanowood pigment,
teak wood composite, mineral composite). It is a **self-contained component**, now **on the About page between The Sustainable Alternatives and
Limitless Applications** — static `brand.html` and the theme's `page-brand.php`. It sits outside the features' `.wrap`
(the About page's `.brand-body > .wrap` is **closed before it and reopened after it**, from when the drawing ran to the
screen edge); its own `.layers__frame` carries `.wrap`, so the drawing now stays inside the page margins. `.brand-body > .layers { margin-bottom: 55px }` in styles.css spaces
it like a feature. `layers-demo.html` (a copy of Products with the section at the end) and the standalone
`kynara-layers-preview.html` (everything inlined, fonts included) are earlier drafts — **`kynara-layers-preview.html`
embeds Candara, so never publish it**; delete both once the placement is settled.
**Two things Anderson removed — don't bring them back without asking:** the label underline, and the whole
"singling out" of layers (the step-through that highlighted each layer in turn, click-to-select on labels and
slabs, the dimming of the other layers, and the description panel top right with its `01 / 04` count). The labels
are now plain `<span>`s, not buttons. The draft `.body` descriptions are still in layers.js's strings, unused.

**Files:** `css/layers.css`, `js/layers.js`, plus the `<section class="layers" data-layers>` markup in layers-demo.html.

**How it works**
- The board is drawn in code as flat SVG slabs, one `<g>` per layer, from the `LAYERS` list in layers.js
  (thickness, face colours, teak grain, and the core's rounded, grooved profile). It is not an image, so every
  layer can move on its own. The label order in the HTML must match `LAYERS` (top layer first).
- **Scroll-scrubbed, in reverse:** the section is 160vh tall (150vh on phones) with a sticky frame — cut from
  220/200vh on 29 Sep because Anderson found it "too much scrolling": the pinned stretch went from ~1.3 screens
  (1028px at 1280×800) to ~0.7 (548px). The board
  **arrives exploded and closes up** over the first 80% of the pinned scroll (`EXPLODE_END`), then holds assembled;
  scrolling back up opens it again. (It first came apart on scroll; Anderson asked for it reversed.)
- Under `prefers-reduced-motion`, or with `layers: { scrub: false }` in `KYNARA_CONFIG`, it doesn't pin. The
  board simply sits exploded. `layers: { gap: 118 }` sets the exploded spacing.
  `layers: { length: 900 }` sets the board length.
- **Link to it with `#our-product`** (the id is on the `<section>`, in brand.html and page-brand.php). Landing there
  puts the section top just under the header (`scroll-padding-top`), i.e. at scroll progress 0 with the board
  **fully exploded**, so the visitor scrolls through the whole assembly. Don't link to `#layers-title`: the heading is
  inside the pinned frame, so that anchor can land part-way into the scroll with the board already closed.
- **No fade, whole board visible (29 Sep).** The board used to be 1500 long, run off the right edge to the screen
  edge, and fade out to the right and at the top (an SVG mask), as in the render. Anderson had the fade removed and
  the board shortened: he picked **Medium, length 900**, from a draft of 700 / 900 / 1100 (draft deleted). The art
  now stays inside the page margins, and `fitView()` includes the whole board's width (`VB.w`) so nothing is ever
  clipped — checked at 390, 768, 1280 and 1920px wide. Green leader lines
  with dots run from each label to its layer's cut end. Labels are pushed apart so they never overlap.
  **The dot sits on the middle of the cut end** (the anchor). It used to sit 16px left of it, straight across,
  which dropped it below the slanted edge and off the thin coating and pigment layers. If a dot must move
  right to clear its label, it slides along the slanted edge (`AX.y` slope), never straight across.
- **Labels are T6** (name and sub alike; name bold, sub rust), at every width.
- Below 900px the labels sit in a 2 x 2 grid under the drawing, and the leader lines are hidden.
- Strings (EN + ID) live at the top of layers.js and are merged into `window.KYNARA_I18N`. **So layers.js must
  load after i18n.js and before main.js.** Move them into i18n.js if you prefer one dictionary.
- Uses the existing tokens (`--t2`, `--t3`, `--t5`, `--t6`, `--green`, `--rust`, `--page-pad`,
  `--header-h-small`, `--hover-ms`, `--ui-enter`, `--tracking-display`). Add `.layers__title` to the
  grouped Candara tracking rule if you fold this CSS into styles.css.

**Motion:** on the permitted motion list in the style rules (added when it was placed).

**Still to decide or supply**
- ~~Where it goes~~ — decided: the About page, after Sustainability.
- **Layer descriptions are DRAFT copy** (currently unused) written from the layer names. Confirm the real claims with KYNARA
  (for example water, stain or UV resistance, and what the mineral composite actually is) before launch.
- The colours are flat approximations of the render. The pigment layer's colour could be tied to the swatch a
  visitor picks on a product card later.
- **WordPress:** done. Both files are copied into `wordpress-theme/kynara/assets/` (**keep the two copies identical**);
  `functions.php` enqueues them **on the About page only** (`kynara_current_page() === 'brand'`): `kynara-layers` CSS after
  `kynara`, and `kynara-layers` JS after `kynara-config` + `kynara-i18n`, with `kynara-main` depending on it.
