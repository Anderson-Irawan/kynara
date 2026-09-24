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
			<div class="product-list">
				<?php foreach ( kynara_get_products() as $kynara_p ) :
					$kynara_use      = kynara_product_use( $kynara_p->ID );
					$kynara_measures = kynara_product_measurements( $kynara_p->ID );
					$kynara_colours  = kynara_product_colours( $kynara_p->ID );
					?>
					<article class="product-card" id="<?php echo esc_attr( $kynara_p->post_name ); ?>">
						<div class="img-box"><?php echo kynara_product_image( $kynara_p, 'large' ); // phpcs:ignore WordPress.Security.EscapeOutput -- core-escaped img markup ?></div>
						<div class="product-card__body">
							<h2 class="product-card__name"><?php echo esc_html( get_the_title( $kynara_p ) ); ?></h2>
							<?php if ( $kynara_use ) : ?>
								<p class="product-card__use"><?php echo esc_html( $kynara_use ); ?></p>
							<?php endif; ?>
							<div class="product-card__specs">
								<div>
									<h3 data-i18n="product.measurements">Measurements</h3>
									<?php if ( $kynara_measures ) : ?>
										<dl class="product-card__measurements">
											<?php foreach ( $kynara_measures as $kynara_m ) : ?>
												<div>
													<dt><?php echo esc_html( $kynara_m['label'] ); ?></dt>
													<dd><?php echo esc_html( $kynara_m['value'] ); ?></dd>
												</div>
											<?php endforeach; ?>
										</dl>
									<?php endif; ?>
								</div>
								<div>
									<h3 data-i18n="product.colors">Color variants</h3>
									<div class="swatches">
										<?php if ( $kynara_colours ) : ?>
											<?php foreach ( $kynara_colours as $kynara_c ) : ?>
												<span class="swatch" style="background:<?php echo esc_attr( $kynara_c['colour'] ); ?>" title="<?php echo esc_attr( $kynara_c['name'] ); ?>" data-color="<?php echo esc_attr( $kynara_c['name'] ); ?>"><span class="visually-hidden"><?php echo esc_html( $kynara_c['name'] ); ?></span></span>
											<?php endforeach; ?>
										<?php else : ?>
											<?php // No colours entered yet: the grey placeholders from the design. ?>
											<?php for ( $kynara_i = 0; $kynara_i < 12; $kynara_i++ ) : ?>
												<span class="swatch" aria-hidden="true"></span>
											<?php endfor; ?>
										<?php endif; ?>
									</div>
								</div>
							</div>
						</div>
					</article>
				<?php endforeach; ?>
			</div>
		</div>
	</main>
<?php
get_footer();
