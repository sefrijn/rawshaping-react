<?php
/**
 * @package Rawshaping
 * @subpackage Rawshaping WordPress Theme
 * @since Rawshaping 3.0.0
 */

/**
 * Register a custom REST API endpoint to fetch posts by slug.
 */
add_action('rest_api_init', function () {
    register_rest_route('wp/v2', '/posts/(?P<slug>[a-zA-Z0-9-]+)', array(
        'methods' => 'GET',
        'callback' => 'get_post_by_slug',
        'permission_callback' => '__return_true', // Public access; adjust if authentication is needed
        'args' => array(
            'slug' => array(
                'required' => true,
                'validate_callback' => function($param, $request, $key) {
                    return is_string($param) && !empty($param);
                },
            ),
        ),
    ));
});

/**
 * Callback function to handle the custom endpoint.
 *
 * @param WP_REST_Request $request The REST API request object.
 * @return WP_REST_Response|WP_Error The post data or an error response.
 */
function get_post_by_slug($request) {
    $slug = $request['slug'];

    // Query for the post by slug
    $posts = get_posts(array(
        'name' => $slug,
        'post_type' => 'post',
        'post_status' => 'publish',
        'numberposts' => 1,
    ));

    // Check if a post was found
    if (empty($posts)) {
        return new WP_Error(
            'no_post_found',
            __('No post found with the specified slug.', 'text-domain'),
            array('status' => 404)
        );
    }

    // Get the post object
    $post = $posts[0];

    // Prepare the post data using the REST API controller
    $post_controller = new WP_REST_Posts_Controller('post');
    $post_data = $post_controller->prepare_item_for_response($post, $request);

    // Return the response
    return rest_ensure_response($post_data);
}


 add_action( 'rest_api_init', function () {
    // Register a custom field for the 'post' post type
    register_rest_field(
        'post', // Post type(s) to apply this to (e.g., 'post', 'page', or array of types)
        'post_size', // Name of the field in the REST API response
        array(
            'get_callback'    => function ( $post ) {
                // Retrieve the custom field value
                return get_post_meta( $post['id'], 'post_size', true );
            },
            'update_callback' => function ( $value, $post ) {
                // Update the custom field value
                update_post_meta( $post->ID, 'post_size', sanitize_text_field( $value ) );
            },
            'schema'          => array(
                'description' => 'Post size',
                'type'        => 'string', // Adjust type as needed (e.g., 'integer', 'array')
                'context'     => array( 'view', 'edit' ),
            ),
        )
    );
});

if ( function_exists( 'add_theme_support' ) ) {
	add_theme_support( 'post-thumbnails' );
}
if ( function_exists( 'add_image_size' ) ) { 
	add_image_size( 'medium', 350, 350, true );
	add_image_size( 'small', 200, 200, true ); //(cropped)
}

?>