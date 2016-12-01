$("#tv_show").click(function(){
    $("#mainform").attr("action", "/tunefind_get_show_seasons");
});

$("#movie").click(function(){
    $("#mainform").attr("action", "/tunefind_get_movie_songs");
});