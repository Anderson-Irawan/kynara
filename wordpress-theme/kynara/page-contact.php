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
			<form class="enquiry-form" method="post" enctype="multipart/form-data" novalidate>
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
				<label class="field">
					<span class="field__label" data-i18n="contact.message">Message*</span>
					<textarea name="message" required placeholder=" "></textarea>
				</label>
				<label class="field">
					<span class="field__label" data-i18n="contact.file">Attach File (if needed)</span>
					<input type="file" name="attachment" accept=".pdf,.jpg,.jpeg,.png,.dwg,.doc,.docx,.xls,.xlsx,.zip">
				</label>
				<div class="form-actions">
					<button type="submit" class="btn-bracket" data-i18n="contact.submit">Send Enquiry</button>
					<p class="form-status" aria-live="polite"></p>
				</div>
			</form>
		</div>
	</main>
<?php
get_footer();
