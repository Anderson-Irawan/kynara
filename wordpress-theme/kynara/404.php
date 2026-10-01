<?php
/**
 * Page not found.
 */
get_header();
?>
	<main class="notfound">
		<div class="wrap notfound__grid">
			<div class="notfound__text">
				<p class="notfound__label" data-i18n="notfound.label">Error 404</p>
				<h1 class="notfound__title" data-i18n="notfound.title">This path leads nowhere.</h1>
				<p class="notfound__body" data-i18n="notfound.body">The page you're looking for has moved or never existed. Let's get you back on solid ground.</p>
				<div class="notfound__actions">
					<a class="btn" href="<?php echo esc_url( home_url( '/' ) ); ?>" data-i18n="notfound.home">Back to home</a>
					<a class="notfound__link" href="<?php echo esc_url( kynara_page_url( 'products' ) ); ?>" data-i18n="notfound.products">Explore our products</a>
				</div>
			</div>
			<div class="img-box notfound__media"><img src="<?php echo esc_url( kynara_asset( 'images/brand-banner.webp' ) ); ?>" alt="A couple dancing on a sunlit forest path beside a bicycle"></div>
		</div>
	</main>
<?php
get_footer();
