function loadImg(input) {
	if (input.files && input.files[0]) {
	  var reader = new FileReader();

	  reader.onload = function(e){
		$('#preview')
		  .attr('src', e.target.result)
		  .width(170)
		  .height(170);
	  };
		reader.readAsDataURL(input.files[0]);
	}
}
