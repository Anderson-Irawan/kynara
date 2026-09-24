/* ==========================================================================
   KYNARA translations
   - Every translatable element in the HTML has data-i18n="key" (text),
     data-i18n-html="key" (text containing <em>/<br>), data-i18n-placeholder="key",
     or data-i18n-aria="key" (aria-label).
   - The English text is ALSO written directly in the HTML so pages read fine
     without JavaScript and for search engines. Keep both in sync.
   - ID strings are a first pass: have a native speaker review before launch.
   - Lorem ipsum = placeholder copy still to be written; it is left identical in both languages.
   ========================================================================== */
(function () {
  var LOREM_LONG = 'Lorem ipsum dolor sit amet consectetur adipiscing elit. Et eos magna laborum fuga voluptas expedita expedita. Est reprehenderit quis et est ad minim amet laboris dolorem illum. Ipsum ut occaecat facere tempor aliqua nulla reprehenderit id excepteur maxime autem nam. Blanditiis nulla non id occaecat cum quidem. Excepteur occaecat cupidatat qui aliqua dolorem repellendus velit.';
  var LOREM_A = 'Lorem ipsum dolor sit amet consectetur adipiscing elit. Et similique quod eiusmod accusamus tempor do. Ut qui blanditiis dolorum aut dolores placeat do. Lorem sunt qui omnis illum enim dolor. Praesentium mollit adipiscing dolore similique ullamco laborum est in cupiditate.';
  var LOREM_B = 'Imperdiet possimus esse molestias deleniti sit tempore cumque sunt. Velit adipiscing quis eiusmod possimus laboris mollit aute in est laborum id lorem. Sint ea soluta est et possimus id consectetur.';

  window.KYNARA_I18N = {
    en: {
      /* Meta */
      'meta.title.home': 'KYNARA | Crafted for Harmonious Living',
      'meta.title.products': 'Products | KYNARA',
      'meta.title.brand': 'The Brand | KYNARA',
      'meta.title.contact': 'Contact | KYNARA',
      /* Page descriptions: also written into each page's <meta name="description">. Keep both in sync. */
      'meta.desc.home': 'KYNARA makes premium wood-plastic composite from rice husk and recycled plastic: decking, cladding, posts and beams crafted for harmonious living.',
      'meta.desc.products': 'Explore the KYNARA collection of sustainable wood-plastic composite: Grove, Ridge, Ledge, Sapling, Cedar, Aspen and Lattice, for floors, walls and structures.',
      'meta.desc.brand': 'KYNARA blends rice husk from local farms with post-consumer recycled plastic: a sustainable alternative to timber, built for limitless applications.',
      'meta.desc.contact': 'Enquire about KYNARA wood-plastic composite products. Tell us about your project and our team will be in touch.',

      /* Header */
      'nav.products': 'Products',
      'nav.brand': 'The Brand',
      'nav.contact': 'Contact',
      'nav.menu': 'MENU',
      'nav.search': 'SEARCH',
      'nav.home': 'KYNARA home',
      'nav.language': 'Change language',
      'fab.label': 'Request a quote or get in touch',
      'search.label': 'Search the site',
      'search.placeholder': 'Search products and pages',
      'search.none': 'No results',

      /* Hero (words themselves live in js/config.js).
         This is a brand line and is deliberately NOT translated - the ID entry matches. */
      'hero.static': 'Crafted for Harmonious Living',

      /* Home */
      'home.collection': 'Explore Our Collection',
      'home.seeAll': 'See all',
      'home.next': 'Next product',
      'home.craft.title': 'Layers of Craftsmanship',
      'home.craft.body': LOREM_LONG,
      'home.forest.title': 'Exploring Sustainable<br>Forest Alternatives',
      'home.forest.body': LOREM_LONG,
      'home.learn': 'Learn about<br>The Brand',

      /* Products */
      'product.grove.use': 'Decking',
      'product.ridge.use': 'Cladding | Wall Panels | Ceiling',
      'product.ledge.use': 'Posts | Beams',
      'product.sapling.use': 'Close corners',
      'product.measurements': 'Measurements',
      'product.colors': 'Color variants',
      'product.card.use': 'Use',

      /* The Brand */
      'brand.intro.title': 'Sustainable composites for<br>floors, walls and structures',
      'brand.craft.title': 'Layers of<br>Craftsmanship',
      'brand.craft.a': LOREM_A,
      'brand.craft.b': LOREM_B,
      'brand.sustain.title': 'The Sustainable<br>Alternatives',
      'brand.stat1': 'rice husk from local farms',
      'brand.stat2': 'recycled plastic post-consumer',
      'brand.stat3': 'plastic saved from production',
      'brand.stat4': 'deforestation for production of goods',
      'brand.sustain.a': LOREM_A,
      'brand.sustain.b': LOREM_B,
      'brand.apps.title': 'Limitless<br>Applications',
      'brand.apps.a': LOREM_A,
      'brand.apps.b': LOREM_B,

      /* Contact */
      'contact.title': 'Enquire Today',
      'contact.name': 'Name*',
      'contact.company': 'Company Name',
      'contact.email': 'Email*',
      'contact.message': 'Message*',
      'contact.file': 'Attach File (if needed)',
      'contact.submit': 'Send Enquiry',
      'contact.sending': 'Sending…',
      'contact.sent': 'Thank you. We will be in touch shortly.',
      'contact.mailto': 'Your email app has opened with your enquiry. Please attach any files there before sending.',
      'contact.error': 'Please fill in the required fields.',
      'contact.fail': 'Something went wrong. Please email enquiries@kynara.co.id directly.',

      /* Footer */
      'footer.subscribe': 'Subscribe for updates, product news and potential collaborations',
      'footer.emailLabel': 'Email',
      'footer.subscribeBtn': 'Subscribe',
      'footer.subscribed': 'Thank you for subscribing.',
      'footer.invalid': 'Please enter a valid email address.',
      'footer.product': 'Product',
      'footer.about': 'About',
      'footer.contact': 'Contact',
      'footer.allProducts': 'All Products',
      'footer.brand': 'The Brand',
      'footer.craft': 'Craftsmanship',
      'footer.sustain': 'Sustainability',
      'footer.apps': 'Applications',
      'footer.enquire': 'Enquire',
      'footer.terms': 'Terms of Use',
      'footer.privacy': 'Privacy'
    },

    id: {
      /* Tagline stays English here too, to match the hero brand line */
      'meta.title.home': 'KYNARA | Crafted for Harmonious Living',
      'meta.title.products': 'Produk | KYNARA',
      'meta.title.brand': 'Tentang Merek | KYNARA',
      'meta.title.contact': 'Kontak | KYNARA',
      'meta.desc.home': 'KYNARA memproduksi komposit kayu-plastik premium dari sekam padi dan plastik daur ulang: lantai dek, pelapis dinding, tiang, dan balok untuk hunian yang harmonis.',
      'meta.desc.products': 'Jelajahi koleksi komposit kayu-plastik berkelanjutan KYNARA: Grove, Ridge, Ledge, Sapling, Cedar, Aspen, dan Lattice, untuk lantai, dinding, dan struktur.',
      'meta.desc.brand': 'KYNARA memadukan sekam padi dari petani lokal dengan plastik daur ulang pascakonsumen: alternatif kayu yang berkelanjutan untuk penerapan tanpa batas.',
      'meta.desc.contact': 'Ajukan pertanyaan tentang produk komposit kayu-plastik KYNARA. Ceritakan proyek Anda dan tim kami akan segera menghubungi Anda.',

      'nav.products': 'Produk',
      'nav.brand': 'Tentang Merek',
      'nav.contact': 'Kontak',
      'nav.menu': 'MENU',
      'nav.search': 'CARI',
      'nav.home': 'Beranda KYNARA',
      'nav.language': 'Ganti bahasa',
      'fab.label': 'Minta penawaran atau hubungi kami',
      'search.label': 'Cari di situs',
      'search.placeholder': 'Cari produk dan halaman',
      'search.none': 'Tidak ada hasil',

      /* Brand line: intentionally identical to the English */
      'hero.static': 'Crafted for Harmonious Living',

      'home.collection': 'Jelajahi Koleksi Kami',
      'home.seeAll': 'Lihat semua',
      'home.next': 'Produk berikutnya',
      'home.craft.title': 'Lapisan Keahlian',
      'home.craft.body': LOREM_LONG,
      'home.forest.title': 'Menjelajahi Alternatif<br>Hutan yang Berkelanjutan',
      'home.forest.body': LOREM_LONG,
      'home.learn': 'Kenali<br>Merek Kami',

      'product.grove.use': 'Lantai Dek',
      'product.ridge.use': 'Pelapis Dinding | Panel Dinding | Plafon',
      'product.ledge.use': 'Tiang | Balok',
      'product.sapling.use': 'Penutup Sudut',
      'product.measurements': 'Ukuran',
      'product.colors': 'Varian Warna',
      'product.card.use': 'Kegunaan',

      'brand.intro.title': 'Komposit berkelanjutan untuk<br>lantai, dinding, dan struktur',
      'brand.craft.title': 'Lapisan<br>Keahlian',
      'brand.craft.a': LOREM_A,
      'brand.craft.b': LOREM_B,
      'brand.sustain.title': 'Alternatif yang<br>Berkelanjutan',
      'brand.stat1': 'sekam padi dari petani lokal',
      'brand.stat2': 'plastik daur ulang pascakonsumen',
      'brand.stat3': 'plastik terselamatkan dari produksi',
      'brand.stat4': 'deforestasi untuk produksi barang',
      'brand.sustain.a': LOREM_A,
      'brand.sustain.b': LOREM_B,
      'brand.apps.title': 'Penerapan<br>Tanpa Batas',
      'brand.apps.a': LOREM_A,
      'brand.apps.b': LOREM_B,

      'contact.title': 'Hubungi Kami',
      'contact.name': 'Nama*',
      'contact.company': 'Nama Perusahaan',
      'contact.email': 'Email*',
      'contact.message': 'Pesan*',
      'contact.file': 'Lampirkan Berkas (jika perlu)',
      'contact.submit': 'Kirim Pertanyaan',
      'contact.sending': 'Mengirim…',
      'contact.sent': 'Terima kasih. Kami akan segera menghubungi Anda.',
      'contact.mailto': 'Aplikasi email Anda telah terbuka berisi pertanyaan Anda. Silakan lampirkan berkas di sana sebelum mengirim.',
      'contact.error': 'Mohon lengkapi kolom yang wajib diisi.',
      'contact.fail': 'Terjadi kesalahan. Silakan kirim email langsung ke enquiries@kynara.co.id.',

      'footer.subscribe': 'Berlangganan untuk kabar terbaru, berita produk, dan peluang kolaborasi',
      'footer.emailLabel': 'Email',
      'footer.subscribeBtn': 'Daftar',
      'footer.subscribed': 'Terima kasih telah berlangganan.',
      'footer.invalid': 'Mohon masukkan alamat email yang valid.',
      'footer.product': 'Produk',
      'footer.about': 'Tentang',
      'footer.contact': 'Kontak',
      'footer.allProducts': 'Semua Produk',
      'footer.brand': 'Tentang Merek',
      'footer.craft': 'Keahlian',
      'footer.sustain': 'Keberlanjutan',
      'footer.apps': 'Penerapan',
      'footer.enquire': 'Kirim Pertanyaan',
      'footer.terms': 'Syarat Penggunaan',
      'footer.privacy': 'Privasi'
    }
  };
})();
