# KYNARA WordPress theme

The KYNARA website as a WordPress theme. The design, animation and layout are the hand-built
static site (one folder up from `wordpress-theme/`), ported into templates. What WordPress adds
is an admin where the KYNARA team manages **Products** without touching code.

## Install

1. WordPress 6.4+ on PHP 7.4+ (any standard WordPress host).
2. **Plugins → Add New**, search for **Secure Custom Fields** (by WordPress.org), install and activate.
   It provides the product fields (use, measurements, colours). The theme defines those fields in
   code, so there is nothing to set up in the plugin itself.
3. **Appearance → Themes → Add New → Upload** the `kynara` folder as a zip, then **Activate**.

On first activation the theme:
- creates the pages **Home**, **Products**, **The Brand** (`/brand/`) and **Contact**, and sets Home
  as the front page;
- switches to pretty URLs (`/products/` rather than `?page_id=2`) if none are set;
- adds the seven launch products (Grove, Ridge, Ledge, Sapling, Cedar, Aspen, Lattice) if there are no products yet.

It never overwrites pages or products that already exist.

## Managing products (for the KYNARA team)

**Products** in the left-hand admin menu.

| Field | Where it shows |
|---|---|
| **Title** — the name, in normal capitalisation ("Grove") | Products page (shown in capitals), Home carousel, footer, search |
| **Use** — e.g. "Cladding \| Wall Panels \| Ceiling" | The line under the name on the Products page; search |
| **Measurements** — rows of Label + Value | Products page |
| **Colour variants** — rows of Name + Colour | The swatches on the Products page (grey placeholders until any are added) |
| **Featured image** (right-hand sidebar) | Products page and Home carousel |
| **Order** (right-hand sidebar, "Page Attributes") | Display order everywhere — 1 first |

Add, edit, reorder or delete a product and all four places update together.
To hide a product without deleting it, set it back to **Draft**.

The product's **slug** (under the title) is its link: `/products/#grove`. Changing it breaks any
link someone has saved to that product.

## Where things live

```
functions.php        setup, assets, page titles/meta, first-activation setup
inc/products.php     the Products type, its fields, and the helpers templates use
header.php           one header for every page (picks the overlay or light variant)
footer.php           one footer; its Product column comes from the Products
front-page.php       Home (the carousel comes from the Products)
page-products.php    Products page (every card comes from the Products)
page-brand.php       The Brand
page-contact.php     Contact
index.php            fallback for any other page and 404s
assets/              the static site's CSS, JS, fonts, icons and images
```

`page-{slug}.php` is matched by the page's slug, so keep the slugs `products`, `brand` and
`contact`.

## Still to come

- **Languages (Polylang):** English and Indonesian as separate pages at their own URLs
  (`/id/...`), translated in the admin. Until then, the globe switcher works as it did on the
  static site, and product text shows as entered.
- **Enquiries inbox:** contact-form submissions emailed to the team *and* stored in the admin,
  with attachments.
- The Brand hero photo is too small for a full-screen hero and needs replacing.
- Candara font licensing must be confirmed before launch (see the main CLAUDE.md).
