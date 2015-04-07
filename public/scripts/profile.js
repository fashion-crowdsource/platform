$(document).ready(function () {
    $('.glyphicon-pencil').toggleClass('hide');
    $('span').click(function () {
        if ($(this).parents().siblings('input').is('[readonly]')) {
            $(this).parents().siblings('input').prop('readonly', false); //turns the readonly off
            $(this).toggleClass('hide'); //hide one glyphicon
            $(this).siblings('.glyphicon-ok').toggleClass('hide');
        } else {
            $(this).toggleClass('hide'); //hide one glyphicon
            $(this).siblings('.glyphicon-pencil').toggleClass('hide');
            $(this).parents().siblings('input').prop('readonly', true); //turns the readonly off
        }
    });

});
