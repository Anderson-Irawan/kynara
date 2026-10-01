<?php
/**
 * Home. The collection carousel is built from the Products in the admin.
 */
get_header();
?>
	<main>
		<!-- ===== Hero: rolling headline. Words are edited in assets/js/config.js ===== -->
		<section class="hero hero--parallax" data-parallax data-hero-glow>
			<!-- Background video: muted, looping, started by main.js (not `autoplay`) so reduced-motion and
			     data-saver visitors get the still poster and never download the video. -->
			<div class="img-box hero__media hero__media--home">
				<video muted loop playsinline preload="none" poster="<?php echo esc_url( kynara_asset( 'images/hero-poster.webp' ) ); ?>" aria-hidden="true" data-hero-video>
					<source src="<?php echo esc_url( kynara_asset( 'videos/hero.mp4' ) ); ?>" type="video/mp4">
				</video>
			</div>
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
					<div class="collection__head">
						<h2 class="section-title" data-i18n="home.collection">Explore Our Collection</h2>
					</div>
					<ul class="collection__track">
						<?php foreach ( kynara_get_products() as $kynara_p ) : ?>
							<?php $kynara_use = kynara_product_use( $kynara_p->ID ); ?>
							<li class="collection__item">
								<!-- Spec-sheet card: name, photo, Use row, arrow. The whole card is the link. -->
								<a class="product-tile" href="<?php echo esc_url( kynara_product_url( $kynara_p ) ); ?>">
									<div class="product-tile__head">
										<h3 class="product-tile__name"><?php echo esc_html( get_the_title( $kynara_p ) ); ?></h3>
									</div>
									<div class="img-box"><?php echo kynara_product_image( $kynara_p, 'large' ); // phpcs:ignore WordPress.Security.EscapeOutput -- core-escaped img markup ?></div>
									<?php if ( $kynara_use ) : ?>
										<dl class="product-tile__specs">
											<div><dt data-i18n="product.card.use">Use</dt><dd><?php echo esc_html( $kynara_use ); ?></dd></div>
										</dl>
									<?php endif; ?>
									<div class="product-tile__foot">
										<svg class="product-tile__arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="square" aria-hidden="true"><path d="M6 18 18 6M8 6h10v10"/></svg>
									</div>
								</a>
							</li>
						<?php endforeach; ?>
						<li class="collection__item">
							<!-- Last card: the way to the whole range (replaced the "See all" link beside the title) -->
							<a class="product-tile product-tile--all" href="<?php echo esc_url( kynara_page_url( 'products' ) ); ?>">
								<span class="product-tile__all" data-i18n="home.viewAll">View all products</span>
								<div class="product-tile__foot">
									<svg class="product-tile__arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="square" aria-hidden="true"><path d="M6 18 18 6M8 6h10v10"/></svg>
								</div>
							</a>
						</li>
					</ul>
					<div class="collection__controls">
						<button type="button" class="circle-btn" data-carousel-next data-i18n-aria="home.next" aria-label="Next product">
							<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2" aria-hidden="true"><path d="M4 12h15M13 6l6 6-6 6"/></svg>
						</button>
					</div>
				</div>

				<!-- Overlapping story cards -->
				<div class="story">
					<!-- Each card links to its chapter on the About page: the heading is the link, stretched over the whole card.
					     The arrow is decorative; main.js adds the landing and the tilt (section 14).
					     The brown card is a subgrid (head / media rows) so the red card can start exactly where its image does. -->
					<article class="story__card story__card--brown">
						<svg class="story__arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="square" aria-hidden="true"><path d="M6 18 18 6M8 6h10v10"/></svg>
						<div class="story__brown-head">
							<h2><a class="story__hit" href="<?php echo esc_url( kynara_page_url( 'brand' ) . '#craftsmanship' ); ?>" data-i18n="home.craft.title">Layers of Craftsmanship</a></h2>
							<p data-i18n="home.craft.body">Every KYNARA panel is engineered with intention. A mineral composite core gives it strength; a wood composite face gives it warmth. Our own NanoWood™ finish then builds up around seven layers of pigment and coating, for a lifelike wood grain and texture, without any deforestation.</p>
						</div>
						<div class="story__brown-media">
							<div class="img-box"><img src="<?php echo esc_url( kynara_asset( 'images/meeting-with-forest.webp' ) ); ?>" alt="Meeting table beneath an opening to the forest" loading="lazy"></div>
						</div>
					</article>
					<article class="story__card story__card--red">
						<svg class="story__arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="square" aria-hidden="true"><path d="M6 18 18 6M8 6h10v10"/></svg>
						<h2><a class="story__hit" href="<?php echo esc_url( kynara_page_url( 'brand' ) . '#sustainability' ); ?>" data-i18n-html="home.forest.title">Exploring Sustainable<br>Forest Alternatives</a></h2>
						<p data-i18n="home.forest.body">Born from rice fields and recycled oceans. KYNARA blends rice husk from local farmers with post-consumer plastics, such as shampoo bottles and bottle caps, into a material that looks and feels like wood. Zero deforestation, 100% recyclable, and made so people can live close to nature without destroying it.</p>
						<div class="img-box"><img src="<?php echo esc_url( kynara_asset( 'images/cosmos_789092184.webp' ) ); ?>" alt="Person reading on a leather sofa surrounded by plants" loading="lazy"></div>
					</article>
					<a class="circle-btn story__link" href="<?php echo esc_url( kynara_page_url( 'brand' ) ); ?>" data-i18n-html="home.learn">Learn about<br>The Brand</a>
				</div>
			</div>
		</section>
	</main>
<?php
get_footer();
