<?php
/**
 * @package Sefrijn
 * @subpackage Rawshaping
 * @since Rawshaping 2.0.0
 */
?>
 <?php
 header("Access-Control-Allow-Origin: *");
 
 ?>

<!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
	<title><?php wp_title( '|', true, 'right' ); ?> Rawshaping Technology</title>
	<link rel="stylesheet" href="<?php echo get_stylesheet_uri(); ?>" type="text/css" media="screen" />
	<?php wp_head(); ?>
	<script src="<?php echo get_bloginfo('template_url'); ?>/js/jquery-1.9.1.min.js"></script>
	<script src="<?php echo get_bloginfo('template_url'); ?>/js/jquery.isotope.min.js"></script>
	<script src="<?php echo get_bloginfo('template_url'); ?>/js/jquery.infinitescroll.min.js"></script>
	<script src="<?php echo get_bloginfo('template_url'); ?>/js/jquery.mousewheel.min.js"></script>
	<script src="<?php echo get_bloginfo('template_url'); ?>/js/jquery.jscrollpane.min.js"></script>

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

   		function recalculateLayout(){
   		/*
		*	Resort new loaded items
		*
		*	Is called:
		*	- when isotope adds elements
		*	- on document ready
		*	- on window resize
   		*/
   			$('#content').isotope('reLayout');
   			// console.log('recalculateLayout()');
		    $('.container').width($('#content').width()+content_margin_left+2*content_padding); 
		    // DIRTY BUGFIX BECUASE JAVASCRIPT IS PARALLEL AND NOT SERIAL
   		}


		function setPositions(){
		/*
		*	Function sets:
		*	- the top position of #view
		*	- the left position of #content
		*	- isotopes sets position of content to relative, this gets fixed
		*
		*	Is called:
		*	- when isotope adds elements
		*	- on document ready
		*	- on window scroll
		*/
		    var $win = $(window);
		    $('#view').css('top', view_margin_top -$win.scrollTop());
		    $('#content').css('position','fixed');
		    $('#content').css('left', content_margin_left -$win.scrollLeft());
   			// console.log('setPositions()');
		}

		function startIsotope(){
		/*
		*	Isotope sets the position of elements
		*
		*	Is called:
		*	- On document ready
		*/
			$('#content').isotope({
				itemSelector : '.post',
			    layoutMode: 'masonryHorizontal',
			    masonryHorizontal: {
			        rowHeight: 50
			    },
			});
   			// console.log('startIsotope()');
		}
		function startInfiniteScroll(){
		/*
		*	InfiniteScroll removes the pagination links and adds new content dynamically
		*
		*	Is called:
		*	- On document ready
		*/
			$('#content').infinitescroll({
				navSelector  : '#pagination',    // selector for the paged navigation 
				nextSelector : '#pagination .nav-previous a',  // selector for the NEXT link (to page 2)
				itemSelector : '.post',     // selector for all items you'll retrieve
				loading: {
				    finishedMsg: 'No more pages to load.',
				    img: 'http://i.imgur.com/qkKy8.gif'
				  }
				},
				// call Isotope as a callback
				function( newElements ) {
				  $('#content').isotope( 'appended', $( newElements ) );
				  setDimensions();
				  setPositions();
				  recalculateLayout();
				  init();
				  // console.log('Isotope callback method executed, nieuwe elementen toegevoegd');
				}
			);
			// console.log('startInfiniteScroll()');
		}

		function init(){
		/*
		*	Sets image positions within their container
		*	Adds hover action to images
		*	Adds post click action to view posts with jquery load
		*
		*	Is called
		*	- when isotope adds elements
		*	- on document ready
		*/
			$('.post').unbind();
			// positioning of images
			$('.post img').each(function(){
				$(this).load(function(){
					var ratio;
					var move;
					if($(this).height()/$(this).parent().parent().height() < $(this).width()/$(this).parent().parent().width()){
						ratio = $(this).width()/$(this).height();
						move = ((ratio*$(this).parent().height())-$(this).parent().width())*-0.5;
						$(this).css({ height: '100%', width:'auto', left:move});
					}else{
						ratio = $(this).height()/$(this).width();
						move = ((ratio*$(this).parent().width())-$(this).parent().height())*-0.5;
						$(this).css({ width: '100%', height: 'auto', top:move });
					}
				})
			})
			// On hover change size of image
			// var h;
			// var w;
			$('.post').mouseenter(function(){
				// h = $(this).height();
				// w = $(this).width();
				// var new_height = h+50;
				// var new_width = w+50;
				$(this).css({'z-index':11});
				$(this).find('.info').animate({ top: '0'},100);
				$(this).stop().animate({ scale: '1.1'}, 100, function(){
					$(this).css({'z-index':10});
				});
			}).mouseleave(function(){
				$(this).stop().animate({ scale: '1'}, 100, function(){
					$(this).find('.info').animate({ top: '100%'},100);
					$(this).css({'z-index':0});
				});
			});
			// jQuery loading of posts
			$('.post').click(function(){
				var id = $(this).attr('data-id');
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
			})
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
		function scrollRight(){
			console.log('methode scrollLeft aangeroepen');
        	$('body').animate(
        		{scrollLeft: $(window).scrollLeft()+20}, 
        		20, 
        		function(){
        			if(scrolling == true){
        				console.log('nog een keer uitvoeren');
	        			scrollRight();
        			}
        		}
        	);
		}
		function scrollLeft(){
			console.log('methode scrollLeft aangeroepen');
        	$('body').animate(
        		{scrollLeft: $(window).scrollLeft()-20}, 
        		20, 
        		function(){
        			if(scrolling == true){
        				console.log('nog een keer uitvoeren');
	        			scrollLeft();
        			}
        		}
        	);
		}

		var scrolling = false;
		$('#scrollRight').mouseenter(function(){
			if(scrolling == false){
	        	scrollRight();
				scrolling = true;
			}
		}).mouseleave(function(){
	        	$('body').stop();
				scrolling = false;
		}); 

		$('#scrollLeft').mouseenter(function(){
			if(scrolling == false){
	        	scrollLeft();
				scrolling = true;
			}
		}).mouseleave(function(){
	        	$('body').stop();
				scrolling = false;
		}); 



		$(window).scroll(function(){
			setPositions();
		    setDimensions();
		    // recalculateLayout();
		});
		$(window).resize(function(){
			setDimensions();
			recalculateLayout();
		});

		$('#sidebar a').click(function(e){
			var id = $(this).attr('data-id');
			$('#view_line').hide("fast");
			$("#view").fadeTo("fast",0, function(){
				if(id != 0){
					e.preventDefault();
					$("#view").load('wp-content/themes/raw13/getpost.php?subitem='+id, function(){
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
				}			
			});				
		});

		// CALL INIT FUNCTIONS
		startIsotope();
		startInfiniteScroll();
		init();
		setPositions();	
		setDimensions();
		recalculateLayout();

		// console.log('dit wordt nog uitgevoerd');
		// If window is very large load one more set of posts
		if($('#content').width() < $(window).width()){
			$('#content').infinitescroll('retrieve');
			setDimensions();
			// console.log('scherm is te groot, nog meer elementen geladen');
		}	

	});
	</script>
</head>

<body>
	<div id="lightbox"></div>
<!--	<div id="scrollLeft"></div>
	<div id="scrollRight"></div>-->
	<header>
		<a href="<?php echo home_url(); ?>"><img src="<?php echo get_bloginfo('template_url'); ?>/img/header.png" alt=""></a>
		<div id="tagcloud">
			<p><?php wp_tag_cloud( "smallest=8&largest=18&unit=px&number=15" ); ?></p>
		</div>
	</header>
	<div id="view_line"></div>
	<div id="loading"><img src="http://i.imgur.com/qkKy8.gif" alt=""></div>



	<?php // code om afbeeldingsformaat aan te passen
// $dir = "D:/programs/portable/xampp/htdocs/rawshaping/wp-content/uploads/2013/03";
// if (!is_readable($dir))
// {
// 	echo("Incorrect permissions: ".$dir." is not readable.<br /><br />");
// }else{
// 	$dh  = opendir($dir);
// 	while (false !== ($filename = readdir($dh))) {
// 	    $files[] = $filename;
// 	}
// 	sort($files);
// 	foreach ($files as $file) {
// 		echo $file.'<br />';
// 	}
	
// }
// 	$ImageURL = 'http://localhost/rawshaping/wp-content/uploads/2013/03/P5250140.jpg';
// $thepost = $wpdb->get_row( $wpdb->prepare( "SELECT *
// FROM $wpdb->posts WHERE post_type = 'attachment' AND guid = '$ImageURL'" ) );
// $theID = $thepost->ID;
// echo 'zoekhier: '.$theID;


?>
