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
						<li><a href="mailto:enquiries@kynara.id">enquiries@kynara.id</a></li>
					</ul>
					<!-- Instagram + Facebook: replace "#" with the real profile URLs -->
					<div class="socials">
						<a href="#" aria-label="Instagram" target="_blank" rel="noopener"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg></a>
						<a href="#" aria-label="Facebook" target="_blank" rel="noopener"><svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg></a>
						<a href="mailto:enquiries@kynara.id" data-i18n-aria="footer.email" aria-label="Email us"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="2" y="4" width="20" height="16" rx="2"/><polyline points="2,4 12,13 22,4"/></svg></a>
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
	<a class="chat-fab" href="<?php echo esc_url( kynara_page_url( 'contact' ) ); ?>">
		<span class="chat-fab__label"><span class="chat-fab__text" data-i18n="fab.label">Request a quote or get in touch</span></span>
		<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
			<path d="M5 4.5h14A1.5 1.5 0 0 1 20.5 6v9a1.5 1.5 0 0 1-1.5 1.5h-8.5L6 20v-3.5H5A1.5 1.5 0 0 1 3.5 15V6A1.5 1.5 0 0 1 5 4.5z"/>
		</svg>
	</a>
	<?php endif; ?>

<?php wp_footer(); ?>
</body>
</html>
