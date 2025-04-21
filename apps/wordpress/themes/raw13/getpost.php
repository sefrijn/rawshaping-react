<?php header("Access-Control-Allow-Origin: *"); ?>

		<?php 
			$var_subitem = htmlentities($_GET['subitem']);
			include("../../../wp-blog-header.php"); 		
		?>

		<?php query_posts('p='.$var_subitem); if(have_posts()) : ?><?php while(have_posts()) : the_post(); ?>
			<div id="textscroll">
			<div id="post-<?php the_ID(); ?>">
			<div id="monoh2"><h2><?php the_title(); ?></h2></div>
				<div class="entry">
					<?php the_content(); ?>
					<p class="postmetadata">
						<?php edit_post_link('Edit', '', ''); ?>
					</p>
				</div>
			</div>
		<?php endwhile; ?>
			<div class="navigation">
				<?php posts_nav_link(); ?>
			</div>
		<?php else : ?>
			<div class="post">
				<h2>Not Found</h2>
				There is no such post
			</div>
			</div>
		<?php endif; ?>