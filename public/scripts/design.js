$(document).ready(function(){
	var path = window.location.pathname;
	$('#acceptDesign').click(function(){
		$.ajax('/admin'+ path, {method: 'PUT'});
	});
});
