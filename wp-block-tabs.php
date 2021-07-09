<?php
/**
 * Plugin Name:       Tabs
 * Description:       Displays tabbed content
 * Requires at least: 5.7
 * Requires PHP:      7.0
 * Version:           0.1.0
 * Author:            Innocode
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       wp-block-tabs
 *
 * @package           innocode
 */

/**
 * Registers the block using the metadata loaded from the `block.json` file.
 * Behind the scenes, it registers also all assets so they can be enqueued
 * through the block editor in the corresponding context.
 *
 * @see https://developer.wordpress.org/block-editor/tutorials/block-tutorial/writing-your-first-block-type/
 */
function innocode_wp_block_tabs_block_init() {
	register_block_type_from_metadata( __DIR__ );
}
add_action( 'init', 'innocode_wp_block_tabs_block_init' );

function innocode_wp_block_tabs_block_script() {
	if( is_singular()
	    && has_block( 'innocode/wp-block-tabs', get_the_ID() ) ) {
		$script_js     = 'build/frontend/script.js';

		wp_enqueue_script(
			'innocode-wp-block-tabs-block',
			plugins_url( $script_js, __FILE__ ),
			[ 'jquery' ]
		);
	}
}

add_action( 'wp_enqueue_scripts', 'innocode_wp_block_tabs_block_script');
