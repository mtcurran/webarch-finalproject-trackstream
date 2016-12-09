$("#tv_show").click(function(){
    $("#mainform").attr("action", "/tunefind_get_show_seasons");
	$(this).css('background-color', '#ff6f00');
	$("#movie").css('background-color', '#e57373');
	$(".searchfiled").css('display', 'block');
	$("#wrap").css('display', 'block');
});

$("#movie").click(function(){
    $("#mainform").attr("action", "/tunefind_get_movie_songs");
    $(this).css('background-color', '#ff5252');
    $("#tv_show").css('background-color', '#ffa000');
    $(".searchfiled").css('display', 'block');
    $("#wrap").css('display', 'block');
});

