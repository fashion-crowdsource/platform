$(document).ready(function(){

	var designId = window.location.match(/[0-9a-fA-F]{24}/)[0];
	console.log(designId);

	$('#acceptDesign').click(function(){
		$.ajax('/admin/'+ designId, {method: 'PUT'})
		.done(function(data){
			alert('Design Accepted');
		})
		.fail(function(){
			alert('Design Accept Failed');
		});

	});
});
