<?php
/**
 * KYNARA theme setup.
 *
 * The front end is the hand-built static site ported into templates: same CSS,
 * same JS, same markup. What WordPress adds is the admin: products (inc/products.php)
 * and, later, languages (Polylang) and an enquiries inbox.
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

define( 'KYNARA_VERSION', '1.0.0' );

require get_template_directory() . '/inc/products.php';

/* ---------------------------------------------------------------------------
 * Helpers
 * ------------------------------------------------------------------------ */

/** URL of a file in the theme's assets/ folder. */
function kynara_asset( $path ) {
	return get_template_directory_uri() . '/assets/' . ltrim( $path, '/' );
}

/** Cache-busting version for an asset: its modified time, so edits show at once. */
function kynara_asset_ver( $path ) {
	$file = get_template_directory() . '/assets/' . ltrim( $path, '/' );
	return file_exists( $file ) ? (string) filemtime( $file ) : KYNARA_VERSION;
}

/**
 * URL of one of the site's pages by slug ('products', 'brand', 'contact').
 * Falls back to /slug/ so links never break if a page is missing.
 */
function kynara_page_url( $slug ) {
	$page = get_page_by_path( $slug );
	return $page ? get_permalink( $page ) : home_url( '/' . $slug . '/' );
}

/** Which of the site's pages is being viewed: home, products, brand, contact or ''. */
function kynara_current_page() {
	if ( is_front_page() ) {
		return 'home';
	}
	foreach ( array( 'products', 'brand', 'contact' ) as $slug ) {
		if ( is_page( $slug ) ) {
			return $slug;
		}
	}
	return '';
}

/** aria-current for the nav link that matches the current page. */
function kynara_aria_current( $slug ) {
	return kynara_current_page() === $slug ? ' aria-current="page"' : '';
}

/* ---------------------------------------------------------------------------
 * Theme support + assets
 * ------------------------------------------------------------------------ */

add_action( 'after_setup_theme', function () {
	add_theme_support( 'title-tag' );
	add_theme_support( 'post-thumbnails' );
	add_theme_support( 'html5', array( 'script', 'style' ) );
} );

add_action( 'wp_enqueue_scripts', function () {
	wp_enqueue_style( 'kynara', kynara_asset( 'css/styles.css' ), array(), kynara_asset_ver( 'css/styles.css' ) );

	// Same order as the static site. All in the footer.
	wp_enqueue_script( 'kynara-config', kynara_asset( 'js/config.js' ), array(), kynara_asset_ver( 'js/config.js' ), true );
	wp_enqueue_script( 'kynara-i18n', kynara_asset( 'js/i18n.js' ), array(), kynara_asset_ver( 'js/i18n.js' ), true );
	wp_enqueue_script( 'lenis', kynara_asset( 'js/vendor/lenis.min.js' ), array(), '1.3.26', true );
	wp_enqueue_script( 'kynara-main', kynara_asset( 'js/main.js' ), array( 'kynara-config', 'kynara-i18n', 'lenis' ), kynara_asset_ver( 'js/main.js' ), true );

	// The search panel's index, built from the live products and pages.
	wp_add_inline_script( 'kynara-main', 'window.KYNARA_SEARCH = ' . wp_json_encode( kynara_search_index() ) . ';', 'before' );
} );

/* Titles: the same per-page titles the static site used. */
add_filter( 'pre_get_document_title', function ( $title ) {
	$titles = array(
		'home'     => 'KYNARA | Crafted for Harmonious Living',
		'products' => 'Products | KYNARA',
		'brand'    => 'The Brand | KYNARA',
		'contact'  => 'Contact | KYNARA',
	);
	$page = kynara_current_page();
	return isset( $titles[ $page ] ) ? $titles[ $page ] : $title;
} );

/** Per-page description (also used for Open Graph). */
function kynara_description() {
	$d = array(
		'home'     => 'KYNARA makes premium wood-plastic composite from rice husk and recycled plastic: decking, cladding, posts and beams crafted for harmonious living.',
		'products' => 'Explore the KYNARA collection of sustainable wood-plastic composite: decking, cladding and wall panels, posts and beams, and corner trims.',
		'brand'    => 'KYNARA blends rice husk from local farms with post-consumer recycled plastic: a sustainable alternative to timber, built for limitless applications.',
		'contact'  => 'Enquire about KYNARA wood-plastic composite products. Tell us about your project and our team will be in touch.',
	);
	$page = kynara_current_page();
	return isset( $d[ $page ] ) ? $d[ $page ] : get_bloginfo( 'description' );
}

/* <head>: description, social sharing and icons. WordPress prints the canonical itself. */
add_action( 'wp_head', function () {
	$desc  = kynara_description();
	$title = wp_get_document_title();
	$url   = is_singular() ? get_permalink() : home_url( '/' );
	?>
	<meta name="description" content="<?php echo esc_attr( $desc ); ?>">
	<meta property="og:type" content="website">
	<meta property="og:site_name" content="KYNARA">
	<meta property="og:locale" content="en_GB">
	<meta property="og:locale:alternate" content="id_ID">
	<meta property="og:url" content="<?php echo esc_url( $url ); ?>">
	<meta property="og:title" content="<?php echo esc_attr( $title ); ?>">
	<meta property="og:description" content="<?php echo esc_attr( $desc ); ?>">
	<meta property="og:image" content="<?php echo esc_url( kynara_asset( 'images/og-kynara.jpg' ) ); ?>">
	<meta property="og:image:width" content="1200">
	<meta property="og:image:height" content="630">
	<meta property="og:image:alt" content="KYNARA: a timber-framed structure built with wood-plastic composite">
	<meta name="twitter:card" content="summary_large_image">
	<link rel="icon" href="<?php echo esc_url( kynara_asset( 'icons/favicon.svg' ) ); ?>" type="image/svg+xml">
	<link rel="icon" href="<?php echo esc_url( kynara_asset( 'favicon.ico' ) ); ?>" sizes="32x32">
	<link rel="apple-touch-icon" href="<?php echo esc_url( kynara_asset( 'icons/apple-touch-icon.png' ) ); ?>">
	<link rel="manifest" href="<?php echo esc_url( kynara_asset( 'site.webmanifest' ) ); ?>">
	<meta name="theme-color" content="#0b4f37">
	<?php
}, 1 );

/*
 * When logged in, WordPress shows its admin bar across the top. The site header is
 * position:fixed at top:0, so it would slide underneath it - push it down instead.
 */
add_action( 'wp_head', function () {
	if ( ! is_admin_bar_showing() ) {
		return;
	}
	echo '<style>.admin-bar .site-header{top:32px}@media (max-width:782px){.admin-bar .site-header{top:46px}}</style>' . "\n";
}, 20 );

/* Trim WordPress's emoji script and style: the site doesn't use them. */
remove_action( 'wp_head', 'print_emoji_detection_script', 7 );
remove_action( 'wp_print_styles', 'print_emoji_styles' );

/* ---------------------------------------------------------------------------
 * First run: create the site's pages so it works out of the box
 *
 * Runs on theme activation, and ALSO once on the first page load if it has never
 * run. Relying on after_switch_theme alone is fragile: it only fires when someone
 * clicks Activate in the admin, and a theme switched on by a host's script, by FTP
 * or by WordPress Playground never triggers it - leaving a site with no pages,
 * where every URL falls back to the home listing.
 * The lock (add_option fails if the option already exists) stops two visitors
 * arriving at once from both creating the pages.
 * ------------------------------------------------------------------------ */

add_action( 'after_switch_theme', 'kynara_first_run' );
add_action( 'init', function () {
	if ( ! get_option( 'kynara_setup_done' ) ) {
		kynara_first_run();
	}
}, 20 );

function kynara_first_run() {
	if ( get_option( 'kynara_setup_done' ) || ! add_option( 'kynara_setup_lock', time(), '', false ) ) {
		return;
	}
	$pages = array(
		'home'     => 'Home',
		'products' => 'Products',
		'brand'    => 'The Brand',
		'contact'  => 'Contact',
	);
	$ids = array();
	foreach ( $pages as $slug => $title ) {
		$existing = get_page_by_path( $slug );
		$ids[ $slug ] = $existing ? $existing->ID : wp_insert_post( array(
			'post_type'   => 'page',
			'post_status' => 'publish',
			'post_title'  => $title,
			'post_name'   => $slug,
		) );
	}

	// Home is the front page; pretty URLs (/products/ rather than ?page_id=2).
	if ( ! empty( $ids['home'] ) && ! is_wp_error( $ids['home'] ) ) {
		update_option( 'show_on_front', 'page' );
		update_option( 'page_on_front', $ids['home'] );
	}
	if ( ! get_option( 'permalink_structure' ) ) {
		update_option( 'permalink_structure', '/%postname%/' );
	}

	kynara_seed_products();
	flush_rewrite_rules();

	update_option( 'kynara_setup_done', KYNARA_VERSION );
	delete_option( 'kynara_setup_lock' );
}
