<?php
/**
 * Products: the one place product data lives.
 *
 * Each product is a post of type `kynara_product`:
 *   - Title            -> the product name ("Grove"). Store it in title case; the
 *                         Products page shows it in capitals with CSS.
 *   - Slug             -> the #anchor on the Products page (/products/#grove).
 *   - Featured image   -> the product photo (placeholder until one is set).
 *   - Order            -> display order everywhere (the "Order" box in the sidebar).
 *   - Use              -> the line under the name ("Cladding | Wall Panels").
 *   - Measurements     -> a list of label + value rows.
 *   - Colours          -> a list of name + colour rows (the swatches).
 *
 * The last three are custom fields from the Secure Custom Fields plugin (free, by
 * WordPress.org). They are defined here in code, so they travel with the theme and
 * nobody has to set them up by hand in the admin.
 *
 * Everything that shows products reads from here: the Products page, the Home
 * carousel, the footer list and the search panel. Add a product once, it appears
 * in all four.
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/* ---------------------------------------------------------------------------
 * The post type
 * ------------------------------------------------------------------------ */

add_action( 'init', function () {
	register_post_type( 'kynara_product', array(
		'labels' => array(
			'name'               => 'Products',
			'singular_name'      => 'Product',
			'add_new'            => 'Add product',
			'add_new_item'       => 'Add new product',
			'edit_item'          => 'Edit product',
			'new_item'           => 'New product',
			'view_item'          => 'View product',
			'search_items'       => 'Search products',
			'not_found'          => 'No products yet',
			'not_found_in_trash' => 'No products in the bin',
			'all_items'          => 'All products',
			'menu_name'          => 'Products',
		),
		// Products appear on the Products page, not on pages of their own.
		'public'              => false,
		'show_ui'             => true,
		'show_in_menu'        => true,
		'show_in_rest'        => true,
		'menu_position'       => 5,
		'menu_icon'           => 'dashicons-screenoptions',
		'supports'            => array( 'title', 'thumbnail', 'page-attributes' ),
		'exclude_from_search' => true,
		'has_archive'         => false,
		'rewrite'             => false,
	) );
} );

/* Custom fields, registered in code (Secure Custom Fields / ACF API). */
add_action( 'acf/include_fields', function () {
	if ( ! function_exists( 'acf_add_local_field_group' ) ) {
		return;
	}
	acf_add_local_field_group( array(
		'key'      => 'group_kynara_product',
		'title'    => 'Product details',
		'position' => 'acf_after_title',
		'style'    => 'seamless',
		'location' => array( array( array(
			'param'    => 'post_type',
			'operator' => '==',
			'value'    => 'kynara_product',
		) ) ),
		'fields'   => array(
			array(
				'key'          => 'field_kynara_use',
				'name'         => 'kynara_use',
				'label'        => 'Use',
				'type'         => 'text',
				'instructions' => 'The line under the product name, e.g. "Cladding | Wall Panels | Ceiling".',
			),
			array(
				'key'          => 'field_kynara_measurements',
				'name'         => 'kynara_measurements',
				'label'        => 'Measurements',
				'type'         => 'repeater',
				'layout'       => 'table',
				'button_label' => 'Add measurement',
				'instructions' => 'One row per measurement, e.g. "Width" / "140 mm".',
				'sub_fields'   => array(
					array( 'key' => 'field_kynara_m_label', 'name' => 'label', 'label' => 'Label', 'type' => 'text' ),
					array( 'key' => 'field_kynara_m_value', 'name' => 'value', 'label' => 'Value', 'type' => 'text' ),
				),
			),
			array(
				'key'          => 'field_kynara_colours',
				'name'         => 'kynara_colours',
				'label'        => 'Colour variants',
				'type'         => 'repeater',
				'layout'       => 'table',
				'button_label' => 'Add colour',
				'instructions' => 'Each colour shows as a swatch. Until any are added, the page shows grey placeholders.',
				'sub_fields'   => array(
					array( 'key' => 'field_kynara_c_name', 'name' => 'name', 'label' => 'Name', 'type' => 'text' ),
					array( 'key' => 'field_kynara_c_colour', 'name' => 'colour', 'label' => 'Colour', 'type' => 'color_picker' ),
				),
			),
		),
	) );
} );

/* If the fields plugin is missing, say so on the product screens instead of failing quietly. */
add_action( 'admin_notices', function () {
	if ( function_exists( 'acf_add_local_field_group' ) ) {
		return;
	}
	$screen = function_exists( 'get_current_screen' ) ? get_current_screen() : null;
	if ( ! $screen || 'kynara_product' !== $screen->post_type ) {
		return;
	}
	echo '<div class="notice notice-warning"><p><strong>KYNARA:</strong> install and activate the free '
		. '<em>Secure Custom Fields</em> plugin (Plugins &rarr; Add New) to edit product use, measurements and colours.</p></div>';
} );

/* The product list in the admin: show the photo and the order, sorted by order. */
add_filter( 'manage_kynara_product_posts_columns', function ( $cols ) {
	return array(
		'cb'            => $cols['cb'],
		'kynara_image'  => '',
		'title'         => 'Product',
		'kynara_use'    => 'Use',
		'kynara_order'  => 'Order',
		'date'          => $cols['date'],
	);
} );
add_action( 'manage_kynara_product_posts_custom_column', function ( $col, $post_id ) {
	if ( 'kynara_image' === $col ) {
		echo get_the_post_thumbnail( $post_id, array( 48, 48 ) ) ?: '&mdash;';
	} elseif ( 'kynara_use' === $col ) {
		echo esc_html( kynara_product_use( $post_id ) );
	} elseif ( 'kynara_order' === $col ) {
		echo (int) get_post_field( 'menu_order', $post_id );
	}
}, 10, 2 );
add_action( 'pre_get_posts', function ( $q ) {
	if ( is_admin() && $q->is_main_query() && 'kynara_product' === $q->get( 'post_type' ) && ! $q->get( 'orderby' ) ) {
		$q->set( 'orderby', array( 'menu_order' => 'ASC', 'title' => 'ASC' ) );
	}
} );
add_action( 'admin_head', function () {
	echo '<style>.column-kynara_image{width:56px}.column-kynara_image img{width:48px;height:48px;object-fit:cover}.column-kynara_order{width:70px}</style>';
} );

/* ---------------------------------------------------------------------------
 * Reading products (used by the templates)
 * ------------------------------------------------------------------------ */

/** All published products, in display order. */
function kynara_get_products() {
	return get_posts( array(
		'post_type'      => 'kynara_product',
		'post_status'    => 'publish',
		'posts_per_page' => -1,
		'orderby'        => array( 'menu_order' => 'ASC', 'title' => 'ASC' ),
		'no_found_rows'  => true,
	) );
}

/** A custom field value; works with or without the fields plugin for plain text. */
function kynara_field( $name, $post_id ) {
	if ( function_exists( 'get_field' ) ) {
		return get_field( $name, $post_id );
	}
	return get_post_meta( $post_id, $name, true );
}

function kynara_product_use( $post_id ) {
	return (string) kynara_field( 'kynara_use', $post_id );
}

/** Rows of array( 'label' => ..., 'value' => ... ), empty ones dropped. */
function kynara_product_measurements( $post_id ) {
	$rows = kynara_field( 'kynara_measurements', $post_id );
	if ( ! is_array( $rows ) ) {
		return array();
	}
	return array_values( array_filter( $rows, function ( $r ) {
		return ! empty( $r['label'] ) || ! empty( $r['value'] );
	} ) );
}

/** Rows of array( 'name' => ..., 'colour' => '#hex' ), invalid colours dropped. */
function kynara_product_colours( $post_id ) {
	$rows = kynara_field( 'kynara_colours', $post_id );
	if ( ! is_array( $rows ) ) {
		return array();
	}
	$out = array();
	foreach ( $rows as $r ) {
		$hex = isset( $r['colour'] ) ? sanitize_hex_color( $r['colour'] ) : '';
		if ( $hex ) {
			$out[] = array( 'name' => isset( $r['name'] ) ? $r['name'] : '', 'colour' => $hex );
		}
	}
	return $out;
}

/** The product's anchor on the Products page. */
function kynara_product_url( $post ) {
	return kynara_page_url( 'products' ) . '#' . $post->post_name;
}

/**
 * The product photo as a bare <img> (callers wrap it in .img-box, style rule 2).
 * Uses the featured image with WordPress's responsive srcset, or the placeholder.
 */
function kynara_product_image( $post, $size = 'large' ) {
	$alt = 'KYNARA ' . get_the_title( $post );
	if ( has_post_thumbnail( $post ) ) {
		return get_the_post_thumbnail( $post, $size, array( 'alt' => $alt, 'loading' => 'lazy' ) );
	}
	return sprintf(
		'<img src="%s" alt="%s" loading="lazy">',
		esc_url( kynara_asset( 'images/product-placeholder.webp' ) ),
		esc_attr( $alt )
	);
}

/** Entries for the search panel: every product, then the site's pages and sections. */
function kynara_search_index() {
	$items = array();
	foreach ( kynara_get_products() as $p ) {
		$items[] = array(
			'href'  => kynara_product_url( $p ),
			'title' => function_exists( 'mb_strtoupper' ) ? mb_strtoupper( get_the_title( $p ) ) : strtoupper( get_the_title( $p ) ),
			'text'  => kynara_product_use( $p->ID ),
		);
	}
	$brand = kynara_page_url( 'brand' );
	return array_merge( $items, array(
		array( 'href' => kynara_page_url( 'products' ), 'key' => 'nav.products' ),
		array( 'href' => $brand, 'key' => 'nav.brand' ),
		array( 'href' => $brand . '#craftsmanship', 'key' => 'footer.craft' ),
		array( 'href' => $brand . '#sustainability', 'key' => 'footer.sustain' ),
		array( 'href' => $brand . '#applications', 'key' => 'footer.apps' ),
		array( 'href' => kynara_page_url( 'contact' ), 'key' => 'nav.contact' ),
	) );
}

/* ---------------------------------------------------------------------------
 * Starter products (first activation only)
 * ------------------------------------------------------------------------ */

/**
 * Creates the seven launch products if there are none yet, so the site is never
 * empty on a fresh install. Never touches existing products.
 */
function kynara_seed_products() {
	$existing = get_posts( array( 'post_type' => 'kynara_product', 'post_status' => 'any', 'posts_per_page' => 1, 'fields' => 'ids' ) );
	if ( $existing ) {
		return;
	}
	// Use lines: the first four carried over from the products they replaced
	// (Bark, Heartwood, Edge) - to be confirmed. The last three have none yet.
	$starters = array(
		array( 'Grove',   'grove',   'Cladding' ),
		array( 'Ridge',   'ridge',   'Cladding | Wall Panels | Ceiling' ),
		array( 'Ledge',   'ledge',   'Posts | Beams' ),
		array( 'Sapling', 'sapling', 'Close corners' ),
		array( 'Cedar',   'cedar',   '' ),
		array( 'Aspen',   'aspen',   '' ),
		array( 'Lattice', 'lattice', '' ),
	);
	foreach ( $starters as $i => $s ) {
		$id = wp_insert_post( array(
			'post_type'   => 'kynara_product',
			'post_status' => 'publish',
			'post_title'  => $s[0],
			'post_name'   => $s[1],
			'menu_order'  => $i + 1,
		) );
		if ( $id && ! is_wp_error( $id ) && '' !== $s[2] ) {
			// Value plus the field-key reference, which is what update_field() writes
			// for a text field - so get_field() finds it with or without the plugin.
			update_post_meta( $id, 'kynara_use', $s[2] );
			update_post_meta( $id, '_kynara_use', 'field_kynara_use' );
		}
	}
}
