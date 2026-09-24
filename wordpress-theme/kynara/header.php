<?php
/**
 * Site header. One copy for every page: the variant (overlay over a hero, or the
 * light cream bar) and the current nav item are worked out here.
 */
$kynara_page    = kynara_current_page();
// Only Home has a hero for the header to sit over. The Brand lost its hero and uses the light bar.
$kynara_overlay = ( 'home' === $kynara_page );
$kynara_keys    = array(
	'home'     => array( 'meta.title.home', 'meta.desc.home' ),
	'products' => array( 'meta.title.products', 'meta.desc.products' ),
	'brand'    => array( 'meta.title.brand', 'meta.desc.brand' ),
	'contact'  => array( 'meta.title.contact', 'meta.desc.contact' ),
);
?><!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
	<meta charset="<?php bloginfo( 'charset' ); ?>">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<?php wp_head(); ?>
</head>
<body <?php body_class(); ?><?php if ( isset( $kynara_keys[ $kynara_page ] ) ) : ?> data-title-key="<?php echo esc_attr( $kynara_keys[ $kynara_page ][0] ); ?>" data-desc-key="<?php echo esc_attr( $kynara_keys[ $kynara_page ][1] ); ?>"<?php endif; ?>>
<?php wp_body_open(); ?>

	<!-- ===== Header: .site-header--overlay over a hero, --light elsewhere ===== -->
	<header class="site-header <?php echo $kynara_overlay ? 'site-header--overlay' : 'site-header--light'; ?>">
		<div class="wrap site-header__bar">
			<a class="brand-logo" href="<?php echo esc_url( home_url( '/' ) ); ?>" data-i18n-aria="nav.home" aria-label="KYNARA home">
				<span class="visually-hidden">KYNARA</span>
			</a>
			<nav class="main-nav" aria-label="Main">
				<ul>
					<li><a href="<?php echo esc_url( kynara_page_url( 'products' ) ); ?>"<?php echo kynara_aria_current( 'products' ); ?> data-i18n="nav.products">Products</a></li>
					<li><a href="<?php echo esc_url( kynara_page_url( 'brand' ) ); ?>"<?php echo kynara_aria_current( 'brand' ); ?> data-i18n="nav.brand">The Brand</a></li>
					<li><a href="<?php echo esc_url( kynara_page_url( 'contact' ) ); ?>"<?php echo kynara_aria_current( 'contact' ); ?> data-i18n="nav.contact">Contact</a></li>
				</ul>
			</nav>
			<div class="header-tools">
				<div class="lang-switch">
					<button type="button" class="lang-switch__toggle" aria-expanded="false" aria-haspopup="true"
					        aria-controls="lang-menu" data-i18n-aria="nav.language" aria-label="Change language">
						<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3" aria-hidden="true">
							<circle cx="12" cy="12" r="9"/>
							<path d="M3 12h18"/>
							<path d="M12 3c2.4 2.6 3.7 5.7 3.7 9S14.4 18.4 12 21c-2.4-2.6-3.7-5.7-3.7-9S9.6 5.6 12 3z"/>
						</svg>
						<span class="lang-switch__current">EN</span>
					</button>
					<ul class="lang-switch__menu" id="lang-menu">
						<li><button type="button" data-set-lang="en" aria-pressed="true">English</button></li>
						<li><button type="button" data-set-lang="id" aria-pressed="false">Bahasa Indonesia</button></li>
					</ul>
				</div>
				<button type="button" class="search-toggle" aria-expanded="false" aria-controls="search-panel">
					<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="M16.2 16.2 21 21"/></svg>
					<span data-i18n="nav.search">SEARCH</span>
				</button>
				<button type="button" class="menu-toggle" aria-expanded="false" data-i18n="nav.menu">MENU</button>
			</div>
		</div>
		<div class="search-panel" id="search-panel">
			<div class="wrap search-panel__inner">
				<label class="visually-hidden" for="site-search" data-i18n="search.label">Search the site</label>
				<div class="search-field">
					<svg class="search-field__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" aria-hidden="true">
						<circle cx="11" cy="11" r="7"/>
						<path d="M16.2 16.2 21 21"/>
					</svg>
					<input id="site-search" type="search" autocomplete="off" placeholder="Search products and pages" data-i18n-placeholder="search.placeholder">
				</div>
				<div class="search-results" aria-live="polite"></div>
			</div>
		</div>
	</header>
