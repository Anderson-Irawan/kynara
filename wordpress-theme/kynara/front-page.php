<?php
/**
 * Home. The collection carousel is built from the Products in the admin.
 */
get_header();
?>
	<main>
		<!-- ===== Hero: rolling headline. Words are edited in assets/js/config.js ===== -->
		<section class="hero hero--parallax" data-parallax data-hero-glow>
			<div class="img-box hero__media hero__media--home"><img src="<?php echo esc_url( kynara_asset( 'images/hero-cosmos_1160439100.webp' ) ); ?>" alt="" fetchpriority="high"></div>
			<span class="hero__glow" aria-hidden="true"></span>
			<span class="hero__fade" aria-hidden="true"></span>
			<span class="hero__wash" aria-hidden="true"></span>
			<div class="wrap hero__content">
				<h1 class="hero__title" data-roller aria-label="Crafted for Harmonious Living">Crafted for <em>Harmonious</em> Living</h1>
			</div>
		</section>

		<section class="home-green">
			<div class="wrap">
				<!-- Explore Our Collection: horizontal carousel, third card bleeds off the edge -->
				<div class="collection" data-carousel>
					<h2 class="section-title" data-i18n="home.collection">Explore Our Collection</h2>
					<ul class="collection__track">
						<?php foreach ( kynara_get_products() as $kynara_p ) : ?>
							<li class="collection__item">
								<a href="<?php echo esc_url( kynara_product_url( $kynara_p ) ); ?>">
									<div class="img-box"><?php echo kynara_product_image( $kynara_p, 'large' ); // phpcs:ignore WordPress.Security.EscapeOutput -- core-escaped img markup ?></div>
									<h3><?php echo esc_html( get_the_title( $kynara_p ) ); ?></h3>
								</a>
							</li>
						<?php endforeach; ?>
					</ul>
					<div class="collection__controls">
						<button type="button" class="circle-btn" data-carousel-next data-i18n-aria="home.next" aria-label="Next product">
							<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2" aria-hidden="true"><path d="M4 12h15M13 6l6 6-6 6"/></svg>
						</button>
					</div>
				</div>

				<!-- Overlapping story cards -->
				<div class="story">
					<!-- Brown card is split into background / text / image so the red card can start exactly where the image does -->
					<div class="story__brown-bg" aria-hidden="true"></div>
					<div class="story__brown-head">
						<h2 data-i18n="home.craft.title">Layers of Craftsmanship</h2>
						<p data-i18n="home.craft.body">Lorem ipsum dolor sit amet consectetur adipiscing elit. Et eos magna laborum fuga voluptas expedita expedita. Est reprehenderit quis et est ad minim amet laboris dolorem illum. Ipsum ut occaecat facere tempor aliqua nulla reprehenderit id excepteur maxime autem nam. Blanditiis nulla non id occaecat cum quidem. Excepteur occaecat cupidatat qui aliqua dolorem repellendus velit.</p>
					</div>
					<div class="story__brown-media">
						<div class="img-box"><img src="<?php echo esc_url( kynara_asset( 'images/meeting-with-forest.webp' ) ); ?>" alt="Meeting table beneath an opening to the forest" loading="lazy"></div>
					</div>
					<article class="story__card story__card--red">
						<h2 data-i18n-html="home.forest.title">Exploring Sustainable<br>Forest Alternatives</h2>
						<p data-i18n="home.forest.body">Lorem ipsum dolor sit amet consectetur adipiscing elit. Et eos magna laborum fuga voluptas expedita expedita. Est reprehenderit quis et est ad minim amet laboris dolorem illum. Ipsum ut occaecat facere tempor aliqua nulla reprehenderit id excepteur maxime autem nam. Blanditiis nulla non id occaecat cum quidem. Excepteur occaecat cupidatat qui aliqua dolorem repellendus velit.</p>
						<div class="img-box"><img src="<?php echo esc_url( kynara_asset( 'images/cosmos_789092184.webp' ) ); ?>" alt="Person reading on a leather sofa surrounded by plants" loading="lazy"></div>
					</article>
					<a class="circle-btn story__link" href="<?php echo esc_url( kynara_page_url( 'brand' ) ); ?>" data-i18n-html="home.learn">Learn about<br>The Brand</a>
				</div>
			</div>
		</section>
	</main>
<?php
get_footer();
