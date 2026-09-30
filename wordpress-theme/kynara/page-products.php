<?php
/**
 * Products page (the page with the slug "products"). Every card comes from the
 * Products in the admin, in their Order.
 */
get_header();
?>
	<main class="products">
		<div class="wrap">
			<h1 class="visually-hidden">Products</h1>
			<!-- One materials note for the whole range (every product shares the same four-layer build), not one per card -->
			<details class="pick__more">
				<summary><span data-i18n="products.materials.more">Read more about the materials</span> <span class="pick__plus" aria-hidden="true"></span></summary>
				<p data-i18n="products.materials.body">Every KYNARA board is four layers: a PU clear coating, Nanowood pigment, a teak-grain composite face and a mineral composite core.</p>
				<a href="<?php echo esc_url( kynara_page_url( 'brand' ) . '#our-product' ); ?>" data-i18n="products.materials.link">See how it's built</a>
			</details>
			<div class="product-list">
				<?php foreach ( kynara_get_products() as $kynara_p ) :
					$kynara_use      = kynara_product_use( $kynara_p->ID );
					$kynara_size     = kynara_product_size( $kynara_p->ID );
					$kynara_measures = kynara_product_measurements( $kynara_p->ID );
					$kynara_colours  = kynara_product_colours( $kynara_p->ID );
					$kynara_finishes = kynara_product_finishing( $kynara_p->ID );
					?>
					<article class="product-card" id="<?php echo esc_attr( $kynara_p->post_name ); ?>">
						<div class="img-box"><?php echo kynara_product_image( $kynara_p, 'large' ); // phpcs:ignore WordPress.Security.EscapeOutput -- core-escaped img markup ?></div>
						<div class="product-card__body">
							<h2 class="product-card__name"><?php echo esc_html( get_the_title( $kynara_p ) ); ?></h2>
							<?php if ( $kynara_use ) : ?>
								<p class="product-card__use"><?php echo esc_html( $kynara_use ); ?></p>
							<?php endif; ?>
							<?php // Key facts | Colour | Finishing (after vestre.com's product pages). ?>
							<div class="product-card__specs">
								<section class="facts" data-i18n-aria="product.facts" aria-label="Key facts">
									<h3 class="pick__title" data-i18n="product.facts">Key facts</h3>
									<dl class="facts__list">
										<div><dt data-i18n="product.card.use">Use</dt><dd><?php echo $kynara_use ? esc_html( $kynara_use ) : '&mdash;'; ?></dd></div>
										<?php if ( '' !== $kynara_size ) : ?>
											<div><dt data-i18n="product.size">Size</dt><dd><?php echo esc_html( $kynara_size ); ?></dd></div>
										<?php endif; ?>
										<?php foreach ( $kynara_measures as $kynara_m ) : ?>
											<div><dt><?php echo esc_html( $kynara_m['label'] ); ?></dt><dd><?php echo esc_html( $kynara_m['value'] ); ?></dd></div>
										<?php endforeach; ?>
									</dl>
								</section>
								<?php if ( $kynara_colours || $kynara_finishes ) : ?>
									<section class="pick" data-i18n-aria="product.options" aria-label="Colour and finishing">
										<?php if ( $kynara_colours ) : ?>
											<div class="pick__group">
												<h3 class="pick__title" data-i18n="product.colour">Colour</h3>
												<ul class="pick__list" role="radiogroup" data-i18n-aria="product.colour" aria-label="Colour">
													<?php foreach ( $kynara_colours as $kynara_i => $kynara_c ) : ?>
														<li><button type="button" class="pick__row<?php echo 0 === $kynara_i ? ' is-selected' : ''; ?>" role="radio" aria-checked="<?php echo 0 === $kynara_i ? 'true' : 'false'; ?>" data-value="<?php echo esc_attr( $kynara_c['name'] ); ?>">
															<span class="pick__swatch" style="background:<?php echo esc_attr( $kynara_c['colour'] ); ?>"></span><span class="pick__name"><?php echo esc_html( $kynara_c['name'] ); ?></span><span class="pick__check" aria-hidden="true"></span>
														</button></li>
													<?php endforeach; ?>
												</ul>
											</div>
										<?php endif; ?>
										<?php if ( $kynara_finishes ) : ?>
											<div class="pick__group">
												<h3 class="pick__title" data-i18n="product.finishing">Finishing</h3>
												<ul class="pick__list" role="radiogroup" data-i18n-aria="product.finishing" aria-label="Finishing">
													<?php foreach ( $kynara_finishes as $kynara_i => $kynara_f ) : ?>
														<li><button type="button" class="pick__row pick__row--plain<?php echo 0 === $kynara_i ? ' is-selected' : ''; ?>" role="radio" aria-checked="<?php echo 0 === $kynara_i ? 'true' : 'false'; ?>" data-value="<?php echo esc_attr( $kynara_f['key'] ); ?>">
															<span class="pick__name" data-i18n="product.finish.<?php echo esc_attr( $kynara_f['key'] ); ?>"><?php echo esc_html( $kynara_f['label'] ); ?></span><span class="pick__check" aria-hidden="true"></span>
														</button></li>
													<?php endforeach; ?>
												</ul>
											</div>
										<?php endif; ?>
									</section>
								<?php endif; ?>
							</div>
						</div>
					</article>
				<?php endforeach; ?>
			</div>
		</div>
	</main>
<?php
get_footer();
