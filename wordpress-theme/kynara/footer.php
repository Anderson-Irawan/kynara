<?php
/**
 * Site footer. The Product column is built from the Products in the admin.
 */
$kynara_brand = kynara_page_url( 'brand' );
?>
	<!-- ===== Footer ===== -->
	<footer class="site-footer">
		<!-- Drifting shapes behind the footer: irregular shapes with softened corners, green 1px strokes, no fill. Two identical tiles; CSS slides the track by one tile, so it loops. -->
		<div class="footer-shapes" aria-hidden="true"><div class="footer-shapes__track"><svg viewBox="0 0 2400 800" preserveAspectRatio="xMinYMid meet" focusable="false"><path d="M65.4 492.4L54.6 427.6Q50 400 73.7 385.2L186.3 314.8Q210 300 237.2 306.8L304 323.5Q330 330 318 354L312 366Q300 390 324.5 400.9L364.4 418.6Q390 430 381.8 456.8L358.2 533.2Q350 560 322.2 563.3L207.8 576.7Q180 580 155.4 566.6L94.6 533.4Q70 520 65.4 492.4Z"/><path d="M485.1 226.4L544.9 133.6Q560 110 587.8 106.5L692.2 93.5Q720 90 735.5 113.3L744.5 126.7Q760 150 733.1 157.7L716.9 162.3Q690 170 681.1 196.6L658.9 263.4Q650 290 622.1 292.1L547.9 297.9Q520 300 500.2 280.2L489.8 269.8Q470 250 485.1 226.4Z"/><path d="M843.3 665.3L886.7 584.7Q900 560 927.6 564.6L1053.5 585.6Q1080 590 1092 614L1098 626Q1110 650 1091 669L1059.8 700.2Q1040 720 1012.3 716L857.7 694Q830 690 843.3 665.3Z"/><path d="M1194.9 317.1L1435.1 192.9Q1460 180 1481.5 197.9L1498.5 212.1Q1520 230 1495.9 244.2L1324.1 345.8Q1300 360 1272.3 364L1257.7 366Q1230 370 1206.7 354.5L1193.3 345.5Q1170 330 1194.9 317.1Z"/><path d="M1342.5 675L1387.5 585Q1400 560 1424.3 573.9L1445.7 586.1Q1470 600 1489.8 580.2L1510.2 559.8Q1530 540 1547.5 561.9L1592.5 618.1Q1610 640 1597.5 665L1572.5 715Q1560 740 1532.3 744L1447.7 756Q1420 760 1396.7 744.5L1353.3 715.5Q1330 700 1342.5 675Z"/><path d="M1679.8 400.2L1730.2 349.8Q1750 330 1777.3 336.3L1852.7 353.7Q1880 360 1870.2 386.2L1859.8 413.8Q1850 440 1864.8 463.7L1885.2 496.3Q1900 520 1874.3 531L1785.7 569Q1760 580 1737.6 563.2L1702.4 536.8Q1680 520 1674.5 492.5L1665.5 447.5Q1660 420 1679.8 400.2Z"/><path d="M1974 195.6L2076 134.4Q2100 120 2125.4 131.7L2204.6 168.3Q2230 180 2236.8 207.2L2253.2 272.8Q2260 300 2232.8 306.8L2207.2 313.2Q2180 320 2186.8 347.2L2203.2 412.8Q2210 440 2182.5 445.2L2077.5 464.8Q2050 470 2030.2 450.2L1979.8 399.8Q1960 380 1958.4 352L1951.6 238Q1950 210 1974 195.6Z"/><path d="M2301.3 621.8L2328.7 598.2Q2350 580 2359.8 606.2L2370.2 633.8Q2380 660 2356.7 675.5L2343.3 684.5Q2320 700 2304.5 676.7L2295.5 663.3Q2280 640 2301.3 621.8Z"/></svg><svg viewBox="0 0 2400 800" preserveAspectRatio="xMinYMid meet" focusable="false"><path d="M65.4 492.4L54.6 427.6Q50 400 73.7 385.2L186.3 314.8Q210 300 237.2 306.8L304 323.5Q330 330 318 354L312 366Q300 390 324.5 400.9L364.4 418.6Q390 430 381.8 456.8L358.2 533.2Q350 560 322.2 563.3L207.8 576.7Q180 580 155.4 566.6L94.6 533.4Q70 520 65.4 492.4Z"/><path d="M485.1 226.4L544.9 133.6Q560 110 587.8 106.5L692.2 93.5Q720 90 735.5 113.3L744.5 126.7Q760 150 733.1 157.7L716.9 162.3Q690 170 681.1 196.6L658.9 263.4Q650 290 622.1 292.1L547.9 297.9Q520 300 500.2 280.2L489.8 269.8Q470 250 485.1 226.4Z"/><path d="M843.3 665.3L886.7 584.7Q900 560 927.6 564.6L1053.5 585.6Q1080 590 1092 614L1098 626Q1110 650 1091 669L1059.8 700.2Q1040 720 1012.3 716L857.7 694Q830 690 843.3 665.3Z"/><path d="M1194.9 317.1L1435.1 192.9Q1460 180 1481.5 197.9L1498.5 212.1Q1520 230 1495.9 244.2L1324.1 345.8Q1300 360 1272.3 364L1257.7 366Q1230 370 1206.7 354.5L1193.3 345.5Q1170 330 1194.9 317.1Z"/><path d="M1342.5 675L1387.5 585Q1400 560 1424.3 573.9L1445.7 586.1Q1470 600 1489.8 580.2L1510.2 559.8Q1530 540 1547.5 561.9L1592.5 618.1Q1610 640 1597.5 665L1572.5 715Q1560 740 1532.3 744L1447.7 756Q1420 760 1396.7 744.5L1353.3 715.5Q1330 700 1342.5 675Z"/><path d="M1679.8 400.2L1730.2 349.8Q1750 330 1777.3 336.3L1852.7 353.7Q1880 360 1870.2 386.2L1859.8 413.8Q1850 440 1864.8 463.7L1885.2 496.3Q1900 520 1874.3 531L1785.7 569Q1760 580 1737.6 563.2L1702.4 536.8Q1680 520 1674.5 492.5L1665.5 447.5Q1660 420 1679.8 400.2Z"/><path d="M1974 195.6L2076 134.4Q2100 120 2125.4 131.7L2204.6 168.3Q2230 180 2236.8 207.2L2253.2 272.8Q2260 300 2232.8 306.8L2207.2 313.2Q2180 320 2186.8 347.2L2203.2 412.8Q2210 440 2182.5 445.2L2077.5 464.8Q2050 470 2030.2 450.2L1979.8 399.8Q1960 380 1958.4 352L1951.6 238Q1950 210 1974 195.6Z"/><path d="M2301.3 621.8L2328.7 598.2Q2350 580 2359.8 606.2L2370.2 633.8Q2380 660 2356.7 675.5L2343.3 684.5Q2320 700 2304.5 676.7L2295.5 663.3Q2280 640 2301.3 621.8Z"/></svg></div></div>
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
						<!-- These open WhatsApp. To change a number, see "WhatsApp numbers" in CLAUDE.md -->
						<li><a href="https://wa.me/6285233386088" target="_blank" rel="noopener">+62 852 3338 6088</a></li>
						<li><a href="https://wa.me/6288223252525" target="_blank" rel="noopener">+62 882 2325 2525</a></li>
						<li><a href="mailto:enquiries@kynara.id">enquiries@kynara.id</a></li>
					</ul>
					<!-- Instagram (@kynara.wpc) + Email. Facebook was removed for now (5 Oct). -->
					<div class="socials">
						<a href="https://www.instagram.com/kynara.wpc/" aria-label="Instagram" target="_blank" rel="noopener"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg></a>
						<a href="mailto:enquiries@kynara.id" data-i18n-aria="footer.email" aria-label="Email us"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="2" y="4" width="20" height="16" rx="2"/><polyline points="2,4 12,13 22,4"/></svg></a>
					</div>
				</div>
			</div>

			<div class="footer-bottom">
				<a class="brand-logo" href="<?php echo esc_url( home_url( '/' ) ); ?>" data-i18n-aria="nav.home" aria-label="KYNARA home">
					<span class="visually-hidden">KYNARA</span>
				</a>
				<nav aria-label="Legal">
					<a href="<?php echo esc_url( kynara_page_url( 'terms' ) ); ?>" data-i18n="footer.terms">Terms of Use</a>
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
