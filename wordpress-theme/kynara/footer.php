<?php
/**
 * Site footer. The Product column is built from the Products in the admin.
 */
$kynara_brand = kynara_page_url( 'brand' );
?>
	<!-- ===== Footer ===== -->
	<footer class="site-footer">
		<div class="wrap">
			<form class="subscribe" novalidate>
				<h2 data-i18n="footer.subscribe">Subscribe for updates, product news and potential collaborations</h2>
				<label class="subscribe__field">
					<span data-i18n="footer.emailLabel">Email</span>
					<input type="email" name="email" placeholder="name@email.com" autocomplete="email" required>
					<button type="submit" data-i18n="footer.subscribeBtn">Subscribe</button>
				</label>
				<p class="subscribe__status" aria-live="polite"></p>
			</form>

			<div class="footer-cols">
				<div>
					<h3 data-i18n="footer.product">Product</h3>
					<ul>
						<?php foreach ( kynara_get_products() as $kynara_p ) : ?>
							<li><a href="<?php echo esc_url( kynara_product_url( $kynara_p ) ); ?>"><?php echo esc_html( get_the_title( $kynara_p ) ); ?></a></li>
						<?php endforeach; ?>
						<li><a href="<?php echo esc_url( kynara_page_url( 'products' ) ); ?>" data-i18n="footer.allProducts">All Products</a></li>
					</ul>
				</div>
				<div>
					<h3 data-i18n="footer.about">About</h3>
					<ul>
						<li><a href="<?php echo esc_url( $kynara_brand ); ?>" data-i18n="footer.brand">The Brand</a></li>
						<li><a href="<?php echo esc_url( $kynara_brand . '#craftsmanship' ); ?>" data-i18n="footer.craft">Craftsmanship</a></li>
						<li><a href="<?php echo esc_url( $kynara_brand . '#sustainability' ); ?>" data-i18n="footer.sustain">Sustainability</a></li>
						<li><a href="<?php echo esc_url( $kynara_brand . '#applications' ); ?>" data-i18n="footer.apps">Applications</a></li>
						<li><a href="<?php echo esc_url( kynara_page_url( 'contact' ) ); ?>" data-i18n="footer.enquire">Enquire</a></li>
					</ul>
				</div>
				<div>
					<h3 data-i18n="footer.contact">Contact</h3>
					<ul>
						<li><a href="tel:+62821231234">+62 82 123 1234</a></li>
						<li><a href="tel:+62821231234">+62 82 123 1234</a></li>
						<li><a href="mailto:enquiries@kynara.co.id">enquiries@kynara.co.id</a></li>
					</ul>
					<!-- Social placeholders (grey squares in the design): swap in icons + real URLs -->
					<div class="socials">
						<a href="#" aria-label="Instagram"></a>
						<a href="#" aria-label="Facebook"></a>
						<a href="#" aria-label="LinkedIn"></a>
						<a href="#" aria-label="WhatsApp"></a>
					</div>
				</div>
			</div>

			<div class="footer-bottom">
				<a class="brand-logo" href="<?php echo esc_url( home_url( '/' ) ); ?>" data-i18n-aria="nav.home" aria-label="KYNARA home">
					<span class="visually-hidden">KYNARA</span>
				</a>
				<nav aria-label="Legal">
					<a href="#" data-i18n="footer.terms">Terms of Use</a>
					<a href="#" data-i18n="footer.privacy">Privacy</a>
				</nav>
			</div>
		</div>
	</footer>

	<?php if ( 'contact' !== kynara_current_page() ) : // not on the page it points to ?>
	<!-- ===== Contact button: fixed bottom-right on every page except Contact ===== -->
	<a class="chat-fab" href="<?php echo esc_url( kynara_page_url( 'contact' ) ); ?>" data-i18n-aria="fab.contact" aria-label="Contact us">
		<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round" aria-hidden="true">
			<path d="M5 4.5h14A1.5 1.5 0 0 1 20.5 6v9a1.5 1.5 0 0 1-1.5 1.5h-8.5L6 20v-3.5H5A1.5 1.5 0 0 1 3.5 15V6A1.5 1.5 0 0 1 5 4.5z"/>
		</svg>
	</a>
	<?php endif; ?>

<?php wp_footer(); ?>
</body>
</html>
