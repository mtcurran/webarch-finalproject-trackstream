$("#tv_show").click(function(){
    $("#mainform").attr("action", "/tunefind_get_show_seasons");
    $("#tv_show").css('color','red !important');
	$("#tv_show").css('background-color','blue !important');
});

$("#movie").click(function(){
    $("#mainform").attr("action", "/tunefind_get_movie_songs");
});

