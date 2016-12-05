/**
===================================
============= BUTTONS =============
===================================
**/
// pre-define all the buttons needed for this assignment, including
// play, add to playlist, delete, move up, and move down
var play_btn = '\
<button class="btn-floating btn-small play orange darken-4"> \
<i class="small material-icons">play_arrow</i> \
</button>'

var addToPlaylist_btn = '\
<button class="btn-floating btn-small addToPlaylist orange accent-4"> \
<i class="material-icons">playlist_add</i> \
</button>'

var delete_btn = '\
<button class="btn-floating btn-small delete blue-grey darken-1"> \
<i class="small material-icons">delete</i> \
</button>'

var up_btn = '\
<button class="btn-floating btn-small up orange accent-2"> \
<i class="material-icons">arrow_upward</i> \
</button>'

var down_btn = '\
<button class="btn-floating btn-small down orange accent-2"> \
<i class="material-icons">arrow_downward</i>\
</button>'

// [EXTRA CREDIT]
// extra variables used for extra credit for infinite scrolling
var lastID;
var lastQuery;

/**
=============================================
============= LOADING NEW SONGS =============
=============================================
**/

// when a user enters a search, call SoundCloud API to retrieve songs
$(document).ready(
	$("#search_btn").on('click', function() {
		var query = $('#new_search').val();
		lastQuery = query;

		if (query != ""){
			$('#results').empty();
			lastID = 0;
			callAPI(query);
			$('#new_search').val('');
		}
	})
);

// Event hander for calling the SoundCloud API using the user's search query
function callAPI(query) {
	$.get("https://api.soundcloud.com/tracks?client_id=b3179c0738764e846066975c2571aebb",
	{'q': query,
	'limit': '200'},
	function(data) {
		// PUT IN YOUR CODE HERE TO PROCESS THE SOUNDCLOUD API'S RESPONSE OBJECT
		createSongs(data);
	},'json'
);
}

// create songs object from SoundCloud response and
// append to the search result section
function createSongs(data){
	var output="";
	nextID = lastID + 20;

	// extra if logic for infinite scrolling, only load and create more songs
	// if we haven't exhausted the response from SoundCloud yet
	if (nextID < data.length){
		for (i = lastID; i < nextID; i++){
			console.log("ID: " + i);
			output += createSong(data[i]);
		}
		lastID = nextID;
		$('#results').append(output);
	}
}

// helper function
// create a song object from the SoundCloud data
// when it was first added to the search results section
function createSong(data){
	console.log(data);

	// use a default SoundCloud icon img if the song image fail to load
	if (data.artwork_url == null){
		console.log("null artwork img");
		art_img = "./_css/default.png";
	}else{
		art_img = data.artwork_url;
	}

	var song_object =
	'<div class="row">' +
	'<div class="col s1">' + play_btn + '</div>' +
	'<div class="col s1">' + addToPlaylist_btn + '</div>' +
	'<div class="content">\
	<div class="col s2">\
	<img class="responsive-img" src=' + art_img + '>\
	</div>\
	\
	<div class="col s7">\
	<b>' + data.title + '</b><br> ' + data.user.username + '<br>\
	<a class="play_link" href=' + data.permalink_url + '>link</a>\
	</div>\
	</div>\
	\
	</div>';
	return song_object;
}

/**
========================================================
============= PLAY SONGS & ADD TO PLAYLIST =============
========================================================
**/
// when user clicks on a button, figure out which button is clicked
// (play or add to playlist) and perform the corresponding actions
$("#results").on('click', ".btn-floating", function() {
	var song_object = $(this).parent().parent();
	var btnClass = $(this).attr("class");

	// if user clicks 'play'
	if (btnClass.indexOf("play") >= 0){
		var playLink = song_object.find(".play_link").attr('href');
		changeTrack(playLink);
	}

	// if user clicks 'add to playlist'
	else if (btnClass.indexOf("addToPlaylist") >= 0) {
		var songToAdd = song_object.clone();
		songToAdd = updateSong(songToAdd.find(".content").html());
		$('#favorites').prepend(songToAdd);

	}
});

// when user clicks on a button, figure out which button is clicked
// (play or delete or move up/down) and perform the corresponding actions
$("#favorites").on('click', ".btn-floating", function() {
	var song_object = $(this).parent().parent();
	var btnClass = $(this).attr("class");

	// if user clicks 'play'
	if (btnClass.indexOf("play") >= 0){
		var playLink = song_object.find(".play_link").attr('href');
		changeTrack(playLink);
	}

	// if user clicks 'delete'
	else if (btnClass.indexOf("delete") >= 0) {
		song_object.remove();
	}

	// if user clicks 'move up'
	else if (btnClass.indexOf("up") >= 0) {
		console.log("moving up");
		song_object.insertBefore(song_object.prev());
	}

	// if user clicks 'move down'
	else if (btnClass.indexOf("down") >= 0) {
		console.log("moving down");
		song_object.insertAfter(song_object.next());
	}
});

// update the button options for a song when it's moved from
// search results section to playlist section
function updateSong(data){
	var song_object =
	'<div class="row"> ' +
	'<div class="col s1">' + play_btn + '</div>' +
	'<div class="col s1">' + delete_btn + '</div>' +
	data +
	'<div class="col s1">' +  up_btn + down_btn + '</div>'
	'</div>';
	// console.log(song_object);
	return song_object;
}

// 'Play' button event handler - play the track in the Stratus player
function changeTrack(url) {
	// Remove any existing instances of the Stratus player
	$('#stratus').remove();

	// Create a new Stratus player using the clicked song's permalink URL
	$.stratus({
		key: "b3179c0738764e846066975c2571aebb",
		auto_play: true,
		align: "bottom",
		links: url
	});
}

/**
========================================
============= EXTRA CREDIT =============
========================================
**/
// infinite scrolling - unfortunately, right now it only works
// when one scrolls to the top of the page instead of the bottom...
// I have looked up various places online and couldn't figure it out.
// Thoughts?
$(window).scroll(function(){
      if($(window).scrollTop() == $(document).height() - $(window).height()){
           callAPI(lastQuery);
      }
 });

