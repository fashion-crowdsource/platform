// $(document).ready(function(){
// 	$('img.lazy').lazyload();
// });

$(window).load(function() {
	$('img.caption').captionjs({
		'class_name'      : 'captionjs', // Class name for each <figure>
		'schema'          :  false,        // Use schema.org markup (i.e., itemtype, itemprop)
		'mode'            : 'animated',   // default | stacked | animated | hide
		'debug_mode'      : true,       // Output debug info to the JS console
		'force_dimensions': false,        // Force the dimensions in case they cannot be detected (e.g., image is not yet painted to viewport)
		'is_responsive'   : true,       // Ensure the figure and image change size when in responsive layout. Requires a container to control responsiveness!
		'inherit_styles'  : true        // Have the caption.js container inherit box-model properties from the original image
	});
});
