<?php
/**
 * Plugin Name: Duplicate Widgets
 * Version: 1.1
 * Plugin URI: https://github.com/aleksandargubecka
 * Description: Easily duplicate or clone a widget with all of its settings in just one click.
 * Author: aleksandargubecka
 * Author URI: https://github.com/aleksandargubecka/
 * Text Domain: duplicate-widget
 * Domain Path: /languages/
 * License: GPL v3
 */

add_filter( 'admin_head', 'ag_enqueue_duplicate_widgets_script' );

function ag_enqueue_duplicate_widgets_script() {
    global $pagenow;

    if( $pagenow != 'widgets.php' )
        return;

    wp_enqueue_script('ag_duplicate_widgets_script', plugin_dir_url(__FILE__) . '/admin-widgets.js', array('jquery'), false, true);

    wp_localize_script('ag_duplicate_widgets_script', 'ag_duplicate_widgets', array(
        'clone_text' => __('Clone'),
        'clone_title' => __('Clone this Widget')
    ));
}