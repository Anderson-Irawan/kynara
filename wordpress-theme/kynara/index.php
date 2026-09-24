<?php
/**
 * Fallback for anything without a template of its own (any other page, 404s).
 * The site's real pages use front-page.php and page-{slug}.php.
 */
get_header();
?>
	<main class="contact">
		<div class="wrap">
			<?php if ( have_posts() ) : ?>
				<?php while ( have_posts() ) : the_post(); ?>
					<h1 class="contact__title"><?php the_title(); ?></h1>
					<div class="page-content"><?php the_content(); ?></div>
				<?php endwhile; ?>
			<?php else : ?>
				<h1 class="contact__title">Page not found</h1>
				<p style="text-align:center"><a href="<?php echo esc_url( home_url( '/' ) ); ?>">Back to KYNARA</a></p>
			<?php endif; ?>
		</div>
	</main>
<?php
get_footer();
