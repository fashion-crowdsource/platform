function loadImg(input) {
	if (input.files && input.files[0]) {
	  var reader = new FileReader();

	  reader.onload = function(e){
		$('#mainPreview')
		  .attr('src', e.target.result)
		  .width(300)
		  .height(300);
	  };
		reader.readAsDataURL(input.files[0]);
	}
}

function binIt(ele) {
	ele.wrap("<form>").parent("form").trigger("reset");
	ele.unwrap();
}


$(document).ready(function() {
	$("#bin").on("click", function(e) {
		binIt($("#myfile"));
		$('#minPreview')
			.attr('src', e.target.result);
	});
});
