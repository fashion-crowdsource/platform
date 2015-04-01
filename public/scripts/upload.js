function loadImg(input) {
	if (input.files && input.files[0]) {
	  var reader = new FileReader();

	  reader.onload = function(e){
		$('#preview')
		  .attr('src', e.target.result)
		  .width(200)
		  .height(200);
	  };
		reader.readAsDataURL(input.files[0]);
	}
}


 // $('a.delete').on('click',function(e){
 //        e.preventDefault();
 //        imageID = $(this).closest('input')[0].id;
 //        // alert('Now deleting "'+imageID+'"');
 //        $(this).closest('input')
 //            // .fadeTo(300,0,function(){
 //            //     $(this)
 //            //         .animate({width:0},200,function(){
 //            //             $(this)
 //                            .remove();
 //                    });
 //            // });
 //    // });


$("bin").click(function() {
  $("#").remove();
});
