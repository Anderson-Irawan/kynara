<?php
/**
 * Contact (the page with the slug "contact").
 * The form still uses the static site's JS handling for now; the next phase gives
 * it a proper handler that emails the team and stores each enquiry in the admin.
 */
get_header();
?>
	<main class="contact">
		<div class="wrap">
			<h1 class="contact__title" data-i18n="contact.title">Enquire Today</h1>
			<form class="enquiry-form" method="post" novalidate>
				<label class="field">
					<span class="field__label" data-i18n="contact.name">Name*</span>
					<input type="text" name="name" autocomplete="name" required placeholder=" ">
				</label>
				<label class="field">
					<span class="field__label" data-i18n="contact.company">Company Name</span>
					<input type="text" name="company" autocomplete="organization" placeholder=" ">
				</label>
				<label class="field">
					<span class="field__label" data-i18n="contact.email">Email*</span>
					<input type="email" name="email" autocomplete="email" required placeholder=" ">
				</label>
				<label class="field field--select">
					<span class="field__label" data-i18n="contact.product">Product of Interest</span>
					<select name="product">
						<option value="" data-i18n="contact.productNone">Select a product</option>
						<?php foreach ( kynara_get_products() as $kynara_p ) : ?>
							<option value="<?php echo esc_attr( get_the_title( $kynara_p ) ); ?>"><?php echo esc_html( strtoupper( get_the_title( $kynara_p ) ) ); ?></option>
						<?php endforeach; ?>
						<option value="Not sure yet" data-i18n="contact.productUnsure">Not sure yet</option>
					</select>
				</label>
				<label class="field">
					<span class="field__label" data-i18n="contact.message">Message*</span>
					<textarea name="message" required placeholder=" "></textarea>
				</label>
				<div class="form-actions">
					<button type="submit" class="btn" data-i18n="contact.submit">Send Enquiry</button>
					<p class="form-status" aria-live="polite"></p>
				</div>
			</form>
		</div>
	</main>
<?php
get_footer();
