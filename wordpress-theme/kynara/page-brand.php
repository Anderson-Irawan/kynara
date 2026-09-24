<?php
/**
 * The Brand (the page with the slug "brand").
 */
get_header();
?>
	<main>
		<!-- ===== Hero: rolling headline. Words are edited in assets/js/config.js ===== -->
		<section class="hero hero--brand">
			<div class="img-box hero__media"><img src="<?php echo esc_url( kynara_asset( 'images/kids-in-forest.webp' ) ); ?>" alt="" fetchpriority="high"></div>
			<div class="wrap hero__content">
				<h1 class="hero__title" data-roller aria-label="Crafted for Harmonious Living">Crafted for <em>Harmonious</em> Living</h1>
			</div>
		</section>

		<div class="brand-body">
			<div class="wrap">
				<section class="feature" id="craftsmanship">
					<div class="feature__text">
						<h2 class="feature__title" data-i18n-html="brand.craft.title">Layers of<br>Craftsmanship</h2>
						<div class="two-col">
							<p data-i18n="brand.craft.a">Lorem ipsum dolor sit amet consectetur adipiscing elit. Et similique quod eiusmod accusamus tempor do. Ut qui blanditiis dolorum aut dolores placeat do. Lorem sunt qui omnis illum enim dolor. Praesentium mollit adipiscing dolore similique ullamco laborum est in cupiditate.</p>
							<p data-i18n="brand.craft.b">Imperdiet possimus esse molestias deleniti sit tempore cumque sunt. Velit adipiscing quis eiusmod possimus laboris mollit aute in est laborum id lorem. Sint ea soluta est et possimus id consectetur.</p>
						</div>
					</div>
					<div class="img-box"><img src="<?php echo esc_url( kynara_asset( 'images/meeting-with-forest.webp' ) ); ?>" alt="Meeting table beneath an opening to the forest" loading="lazy"></div>
				</section>

				<section class="feature feature--reverse" id="sustainability">
					<div class="img-box"><img src="<?php echo esc_url( kynara_asset( 'images/cosmos_789092184.webp' ) ); ?>" alt="Person reading on a leather sofa surrounded by plants" loading="lazy"></div>
					<div class="feature__text">
						<div>
							<h2 class="feature__title" data-i18n-html="brand.sustain.title">The Sustainable<br>Alternatives</h2>
							<ul class="stats">
								<li class="stat"><span class="stat__value">60%</span><span class="stat__label" data-i18n="brand.stat1">rice husk from local farms</span></li>
								<li class="stat"><span class="stat__value">30%</span><span class="stat__label" data-i18n="brand.stat2">recycled plastic post-consumer</span></li>
								<li class="stat"><span class="stat__value">~600kg</span><span class="stat__label" data-i18n="brand.stat3">plastic saved from production</span></li>
								<li class="stat"><span class="stat__value">0</span><span class="stat__label" data-i18n="brand.stat4">deforestation for production of goods</span></li>
							</ul>
						</div>
						<div class="two-col">
							<p data-i18n="brand.sustain.a">Lorem ipsum dolor sit amet consectetur adipiscing elit. Et similique quod eiusmod accusamus tempor do. Ut qui blanditiis dolorum aut dolores placeat do. Lorem sunt qui omnis illum enim dolor. Praesentium mollit adipiscing dolore similique ullamco laborum est in cupiditate.</p>
							<p data-i18n="brand.sustain.b">Imperdiet possimus esse molestias deleniti sit tempore cumque sunt. Velit adipiscing quis eiusmod possimus laboris mollit aute in est laborum id lorem. Sint ea soluta est et possimus id consectetur.</p>
						</div>
					</div>
				</section>

				<section class="feature feature--last" id="applications">
					<div class="feature__text">
						<h2 class="feature__title" data-i18n-html="brand.apps.title">Limitless<br>Applications</h2>
						<div class="two-col">
							<p data-i18n="brand.apps.a">Lorem ipsum dolor sit amet consectetur adipiscing elit. Et similique quod eiusmod accusamus tempor do. Ut qui blanditiis dolorum aut dolores placeat do. Lorem sunt qui omnis illum enim dolor. Praesentium mollit adipiscing dolore similique ullamco laborum est in cupiditate.</p>
							<p data-i18n="brand.apps.b">Imperdiet possimus esse molestias deleniti sit tempore cumque sunt. Velit adipiscing quis eiusmod possimus laboris mollit aute in est laborum id lorem. Sint ea soluta est et possimus id consectetur.</p>
						</div>
					</div>
					<div class="img-box"><img src="<?php echo esc_url( kynara_asset( 'images/cosmos_969656075.webp' ) ); ?>" alt="Person resting beneath a moss-covered tree sculpture" loading="lazy"></div>
				</section>
			</div>
		</div>
	</main>
<?php
get_footer();
