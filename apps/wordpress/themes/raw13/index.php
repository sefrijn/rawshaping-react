<?php
/**
 * @package Rawshaping
 * @subpackage Rawshaping WordPress Theme
 * @since Rawshaping 3.0.0
 * @version 3.0.0
 * @author Sefrijn
 */
?>

<!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
	<title><?php echo get_the_title(); ?></title>
	<link rel="stylesheet" href="<?php echo get_stylesheet_uri(); ?>" type="text/css" media="screen" />
	<?php wp_head(); ?>
</head>
<body>
	<h2><?php echo get_the_title(); ?></h2>
	<?php
	// Get the current post slug
	$current_slug = '';
	if (is_singular()) {
		$current_slug = basename(get_permalink());
	} elseif (is_archive() || is_home()) {
		global $wp;
		$current_url = home_url(add_query_arg(array(), $wp->request));
		$current_slug = basename($current_url);
	}
	
	// Build the React frontend URL
	$react_url = "https://rawshaping-react.vercel.app/posts/{$current_slug}/";
	?>

		<a href="<?php echo esc_url($react_url); ?>" 
		   rel="noopener noreferrer" 
		   target="_blank" 
		   class="react-button" >
			View on Rawshaping.com
		</a>
	
	<?php wp_footer(); ?>
</body>
</html>