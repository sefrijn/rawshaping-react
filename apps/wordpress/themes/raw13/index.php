<?php
/**
 * @package Sefrijn
 * @subpackage Rawshaping
 * @since Rawshaping 2.0.0
 */
?>

<?php get_header(); ?>
<?php 
	function get_attachment_id_from_src ($image_src) {
		global $wpdb;
		$query = "SELECT ID FROM {$wpdb->posts} WHERE guid=\"".$image_src.'"';
		$id = $wpdb->get_var($query);
		return $id;
	}
?>

<div class="container">
	<?php get_sidebar(); ?>	
	<div id="content" class="content_container">
		<?php $first = true; ?>
		<?php if ( have_posts() ) : while ( have_posts() ) : the_post(); ?>
			<?php if ( $first ): ?>
				<script>
			$(document).ready(function(){
		var content_margin_top = 120; // should be sidebar topmargin
		var content_margin_bottom = 120;
		var view_h;
		var content_w;
		var content_h;
		var content_margin_left = 600; // should be sidebar+view width
		var content_padding = 20; // set dynamically from css?
		var view_margin_top = 120; // should be sidebar top margin
		var view_margin_bottom = 200;


		function setDimensions(){
		/*  
		*	Sets dimensions of #content, #view and .container dynamically
		*	
		*	Function sets:
		*	- the height of #content
		*	- the height of the .container
		*	- the widht of the .container
		*	- the minimum height of #view
		*	Is called:
		*	- when isotope adds elements
		*	- on document ready
		*	- on window resize
		*	- on window scroll
		*	- on .post clicked, post with variable height is viewed
		*/			
			content_h = $(window).height()-(content_margin_top+content_margin_bottom); //
			$('#content').height(content_h);
		    $('#view').css('min-height',$('#content').height()+20);
		    view_h = $('#view').height();
		    content_w = $('#content').width();
		    $('.container').width(content_w+content_margin_left+2*content_padding);
		    $('.container').height(view_h+view_margin_top);
   			// console.log('setDimensions(), content breedte: '+$('#content').width());
   		}

		// enable lightbox
		function lightbox(){
			$('#view img').unbind();
			$('#view img').click(function(e){
				e.preventDefault();
				if($(this).hasClass('vimeo')){
					var ratio_screen = $('#lightbox').height()/$('#lightbox').width();
					var ratio_video = $(this).height()/$(this).width();
					if(ratio_screen>ratio_video){
						var w = 0.8*$('#lightbox').width();
						var h = w*ratio_video;
					}else{
						var h = 0.8*$('#lightbox').height();
						var w = h/ratio_video;
					}
					// console.log(w + ' en '+ h);
					var link = $(this).parent().attr('href');
					$('#lightbox').html('<iframe src="'+link+'" style="width:'+w+'px;height:'+h+'px;" frameborder="0" webkitAllowFullScreen mozallowfullscreen allowFullScreen></iframe>',$('#lightbox').slideDown('slow'));
					
				}else if($(this).hasClass('pdf')){

				}else if($(this).hasClass('youtube')){

				}else{
					var link = $(this).parent().attr('href');
					$('#lightbox').html('<img src="'+link+'">');
					$('#lightbox').slideDown('slow');
				}
		        $(document).keyup(function(e) {
		            if($('#lightbox').is(":visible")){
		                if (e.keyCode == 27) {
		                	$('#lightbox').html('');
		                    $('#lightbox').slideUp();
		                }
		            }
		        });


			})
		}



				var id = <?php echo get_the_ID(); ?>;
				$('#view_line').hide("fast");
				$("#view").fadeTo("fast",0, function(){
					$("#view").load('<?php bloginfo('template_directory'); ?>/getpost.php?subitem='+id, function(){
						$(window).scrollTop(0);
						$("#view").fadeTo("slow",1);
						$('#view_line').show("slow");
					    setDimensions();
						$('img').load(function() {
						    setDimensions();
						    lightbox();
						    // console.log('image loaded');
						});
	 				});
				});
			});

				</script>
				<?php $first = false; ?>
		    <?php endif; ?>


			<div class="post size<?php echo get_post_meta(get_the_ID(), 'post_size', true); ?>" data-id="<?php echo get_the_ID(); ?>">
				<div class="img-container">
					<?php
						$postsize = get_post_meta(get_the_ID(), 'post_size', true);
						if(has_post_thumbnail()){
							if($postsize <= 3){ 
								// backup to catch smaller sizes
								$thumb = wp_get_attachment_image_src( get_post_thumbnail_id($post->ID), 'thumbnail' );
								$image = $thumb['0'];
								// the_post_thumbnail('thumbnail');
							}elseif($postsize == 4){
								$thumb = wp_get_attachment_image_src( get_post_thumbnail_id($post->ID), 'small' );
								$image = $thumb['0'];
								// the_post_thumbnail('small');
							}elseif($postsize >= 5){
								$thumb = wp_get_attachment_image_src( get_post_thumbnail_id($post->ID), 'medium' );
								$image = $thumb['0'];
								// the_post_thumbnail('medium');
							}
						}else{
							$image = get_post_meta(get_the_ID(), 'post_image', true);
						}
						echo'<img src="'.$image.'" />';

					?>
					<div class="info">
						<div class="title"><?php the_title(); ?></div>
						<span class="date"><?php the_time('j M y') ?></span>
						<span class="tags"><?php the_tags('Tags: ',' • ','<br />'); ?></span>
					</div>
				</div>
			</div>
		<?php endwhile; else: ?>
			<p>Sorry, no posts matched your criteria.</p>
		<?php endif; ?>
	</div>
	<?php rawshaping_pagination( 'pagination' ); ?>
	<div id="view">
		Dit is de post
	</div>	
</div>


<?php get_footer(); ?>