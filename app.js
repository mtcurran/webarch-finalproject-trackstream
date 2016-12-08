var express = require('express');
var mustacheExpress = require('mustache-express');
var request = require('request')  
var bodyParser = require('body-parser');
var app = express();

app.engine('html', mustacheExpress());
app.set('view engine', 'mustache');
app.set('views', __dirname + '/views');
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/static', express.static(__dirname + '/static'));

/**
 * Takes in the `seasonsDict` dictionary and creates a string of HTML 
 * to display the seasons and their corresponding data. 
 * @param {Object} seasonsDict - A dictionary where the key is the season number, & 
 * the value is a list with the episode count and season API URL
 * @return {String} - The string of HTML to inject dynamically to display
 * 	season options.
 */
 function makeSeasonsHTML(seasonsDict) {
 	HTML = '<form class="input-field col s10" id="optionsForm" action="/tunefind_get_show_episodes" method="POST">';
 	HTML += '<ul>';
 	for (seasonNumber in seasonsDict) {
 		seasonList = seasonsDict[seasonNumber];
 		HTML += '<li>';
 		HTML += '<button type="submit" id ="tvresult" class="validate btn waves-effect waves-light" name="selectedSeason" value="';
 		HTML += seasonList[1];
 		HTML += '">Season ';
 		HTML += seasonNumber;
 		HTML += '<br/>';
 		HTML += 'Episode Count: ';
 		HTML += seasonList[0];
	 	HTML += '</button>';
	 	HTML += '</li>';
	 	HTML += '</br>';
 	}
 	HTML += '</ul>';
 	HTML += '</form>';
 	return HTML;
 };

 /**
 * Takes in the `episodesDict` dictionary and creates a string of HTML 
 * to display the episodes and their corresponding data. 
 * @param {Object} episodesDict - A dictionary where the key is the episode number, & 
 * the value is a list with the episode number and episode API URL
 * @return {String} - The string of HTML to inject dynamically to display
 * 	episode options.
 */
 function makeEpisodesHTML(episodesDict) {
 	HTML = '<form class="input-field col s10" id="optionsForm" action="/tunefind_get_show_songs" method="POST">';
 	HTML += '<ul>'; 	
 	for (episodeNumber in episodesDict) {
 		episodeList = episodesDict[episodeNumber];
 		HTML += '<li>'; 		
 		HTML += '<button type="submit" id ="tvresult" class="validate btn waves-effect waves-light" name="selectedEpisode" value="';
 		HTML += episodeList[1];
 		HTML += '">Episode ';
 		HTML += episodeNumber;
 		HTML += '<br/>';
 		HTML += 'Episode Name: ';
 		HTML += episodeList[0]; 		
 		HTML += '</button>'; 	 		
	 	HTML += '</li>';
	 	HTML += '</br>';
 	}
 	HTML += '</ul>';
 	HTML += '</form>';
 	return HTML;
 };

 /**
 * Takes in the `songsDict` dictionary and creates a string of HTML 
 * to display the songs and their corresponding data for a movie. 
 * @param {Object} songsDict - A dictionary where the key is the song name, & 
 * the value is a list with the artist name, and scene if applicable
 * @return {String} - The string of HTML to inject dynamically to display
 * 	song options.
 */
 function makeSongsMovieHTML(songsDict) {
 	if (Object.keys(songsDict).length == 0) {
 		HTML = '<p>Woops! Sorry no songs found for this movie!';
 		return HTML;
 	}
 	HTML = '<form class="input-field col s10" id="optionsForm" action="/youtube_search_movie" method="POST">';
	HTML += '<ul>';
 	for (songName in songsDict) {
 		songList = songsDict[songName];
 		youtubeSearch = songList[0] + ' ' + songName;
 		HTML += '<li>'; 		
 		HTML += '<button id ="tvresult" class="validate btn waves-effect waves-light" type="submit" name="selectedSong" value="';
 		HTML += youtubeSearch;
 		HTML += '">Song: ';
 		HTML += songName;
 		HTML += '<br/>';
 		HTML += 'Artist: ';
 		HTML += songList[0]; 		
 		HTML += '<br/>';
 		HTML += 'Scene: ';
 		HTML += songList[1];
 		HTML += '</button>'; 	 		
	 	HTML += '</li>';
	 	HTML += '</br>';
 	}
 	HTML += '</ul>';
 	HTML += '</form>';
 	return HTML;
 };

  /**
 * Takes in the `songsDict` dictionary and creates a string of HTML 
 * to display the songs and their corresponding data for a TV show. 
 * @param {Object} songsDict - A dictionary where the key is the song name, & 
 * the value is a list with the artist name, and scene if applicable
 * @return {String} - The string of HTML to inject dynamically to display
 * 	song options.
 */
 function makeSongsShowHTML(songsDict) {
 	if (Object.keys(songsDict).length == 0) {
 		HTML = '<p>Woops! Sorry no songs found for this episode!';
 		return HTML;
 	} 	
 	HTML = '<form class="input-field col s10" id="optionsForm" action="/youtube_search_show" method="POST">';
	HTML += '<ul>';
 	for (songName in songsDict) {
 		songList = songsDict[songName];
 		youtubeSearch = songList[0] + ' ' + songName;
 		HTML += '<li>'; 		
 		HTML += '<button id ="tvresult" class="validate btn waves-effect waves-light" type="submit" name="selectedSong" value="';
 		HTML += youtubeSearch;
 		HTML += '">Song: ';
 		HTML += songName;
 		HTML += '<br/>';
 		HTML += 'Artist: ';
 		HTML += songList[0]; 		
 		HTML += '<br/>';
 		HTML += 'Scene: ';
 		HTML += songList[1];
 		HTML += '</button>'; 	 		
	 	HTML += '</li>';
	 	HTML += '</br>';
 	}
 	HTML += '</ul>';
 	HTML += '</form>';
 	return HTML;
 };

// Define your routes here

app.get('/', function (req, res, next) {
  res.render('main.html', {'searchAction' : '"/no_button_selected"', 'searchPlaceHolder' : '"Select Movie or TV Show"'});
});

app.post('/no_button_selected', function (req, res, next) {
	noSearchHTML = '<p>Woops! Please select either Movie or TV Show!</p>';	
	res.render('main.html', {'search_error' : noSearchHTML, 'searchAction' : '"/no_button_selected"', 'searchPlaceHolder' : '"Select Movie or TV Show"'});
});

app.post('/tunefind_get_movie_songs', function(req, res) {
	movieName = req.body.show_or_movie_name;
	if (!movieName) {
		noSearchHTML = '<p>Woops! Please enter a Movie title!</p>';	
		res.render('main.html', {'search_error' : noSearchHTML, 'searchAction' : '"/tunefind_get_movie_songs"', 'searchPlaceHolder' : '"Select by Movie Title"'});
	} else { 
		// url = 'http://localhost:3001/tunefind_get_movie_songs';
		url = 'https://trackstream-api.herokuapp.com/tunefind_get_movie_songs';

		request(
			{
				url: url,
				method: 'POST',
				json: {'movieName' : movieName}
			},
			function(error, response, body) {
				if (error || response.statusCode == 404) {
					invalidSearchHTML = '<p>Woops! No results found! Try another search term!</p>';
					res.render('main.html', {'search_error' : invalidSearchHTML, 'searchAction' : '"/tunefind_get_movie_songs"', 'searchPlaceHolder' : '"Select by Movie Title"'});
				} else {
					var songDict = body;
					songsHTML = makeSongsMovieHTML(songDict);
					res.render('main.html', {'optionsForm' : songsHTML, 'searchAction' : '"/tunefind_get_movie_songs"', 'searchPlaceHolder' : '"Select by Movie Title"'});
				}
			}
		)
	};
});

app.post('/tunefind_get_show_seasons', function (req, res, next) {
	showName = req.body.show_or_movie_name;
	if (!showName) {
		noSearchHTML = '<p>Woops! Please enter a TV Show title!</p>';			
		res.render('main.html', {'search_error' : noSearchHTML, 'searchAction' : '"/tunefind_get_show_seasons"', 'searchPlaceHolder' : '"Select by TV Show Title"'});
	} else { 
		// url = 'http://localhost:3001/tunefind_get_show_seasons';
		url = 'https://trackstream-api.herokuapp.com/tunefind_get_show_seasons';

		request(
			{
				url: url,
				method: 'POST',
				json: {'showName' : showName}
			},
			function(error, response, body) {
				if (error ||  response.statusCode == 404) {
					invalidSearchHTML = '<p>Woops! No results found! Try another search term!</p>';
					res.render('main.html', {'search_error' : invalidSearchHTML, 'searchAction' : '"/tunefind_get_show_seasons"', 'searchPlaceHolder' : '"Select by TV Show Title"'});
				} else {
					var seasonsDict = body;
					seasonsHTML = makeSeasonsHTML(seasonsDict);
					res.render('main.html', {'optionsForm' : seasonsHTML, 'searchAction' : '"/tunefind_get_show_seasons"', 'searchPlaceHolder' : '"Select by TV Show Title"'});
				}
			}
		)
	};
});

app.post('/tunefind_get_show_episodes', function (req, res, next) {
	selectedSeasonURL = req.body.selectedSeason;
	if (!selectedSeasonURL) {
		noSearchHTML = '<p>Woops! Please enter a Season!</p>';			
		res.render('main.html', {'search_error' : noSearchHTML, 'searchAction' : '"/tunefind_get_show_seasons"', 'searchPlaceHolder' : '"Select by TV Show Title"'});
	} else { 
		// url = 'http://localhost:3001/tunefind_get_show_episodes';
		url = 'https://trackstream-api.herokuapp.com/tunefind_get_show_episodes';

		request(
			{
				url: url,
				method: 'POST',
				json: {'selectedSeason' : selectedSeasonURL}
			},
			function(error, response, body) {
				var episodesDict = body;
				episodesHTML = makeEpisodesHTML(episodesDict);
				res.render('main.html', {'optionsForm' : episodesHTML, 'searchAction' : '"/tunefind_get_show_seasons"', 'searchPlaceHolder' : '"Select by TV Show Title"'});
			}
		)
	};
});

app.post('/tunefind_get_show_songs', function (req, res, next) {
	selectedEpisodeURL = req.body.selectedEpisode;
	if (!selectedEpisodeURL) {
		noSearchHTML = '<p>Woops! Please enter an Episode number!</p>';			
		res.render('main.html', {'search_error' : noSearchHTML, 'searchAction' : '"/tunefind_get_show_seasons"', 'searchPlaceHolder' : '"Select by TV Show Title"'});
	} else { 
		// url = 'http://localhost:3001/tunefind_get_show_songs';
		url = 'https://trackstream-api.herokuapp.com/tunefind_get_show_songs';

		request(
			{
				url: url,
				method: 'POST',
				json: {'selectedEpisode' : selectedEpisodeURL}
			},
			function(error, response, body) {
				var songsDict = body;
				songsHTML = makeSongsShowHTML(songsDict);
				res.render('main.html', {'optionsForm' : songsHTML, 'searchAction' : '"/tunefind_get_show_seasons"', 'searchPlaceHolder' : '"Select by TV Show Title"'});
			}
		)
	};
});

app.post('/youtube_search_movie', function (req, res, next) {
	youtubeSearch = req.body.selectedSong;
	// url = 'http://localhost:3001/youtube_search';
	url = 'https://trackstream-api.herokuapp.com/youtube_search';

	request(
		{
			url: url,
			method: 'POST',
			json: {'youtubeSearch' : youtubeSearch}
		},
		function(error, response, body) {
			youtubeURL = body.youtubeURL;
			youtubeHTML = '<iframe width="560" height="315" src="' + youtubeURL;
			youtubeHTML += '" frameborder="0" allowfullscreen></iframe>';
			res.render('main.html', {'optionsForm' : youtubeHTML, 'searchAction' : '"/tunefind_get_movie_songs"', 'searchPlaceHolder' : '"Select by Movie Title"'});
		}
	)
});

app.post('/youtube_search_show', function (req, res, next) {
	youtubeSearch = req.body.selectedSong;
	// url = 'http://localhost:3001/youtube_search';
	url = 'https://trackstream-api.herokuapp.com/youtube_search';

	request(
		{
			url: url,
			method: 'POST',
			json: {'youtubeSearch' : youtubeSearch}
		},
		function(error, response, body) {
			youtubeURL = body.youtubeURL;
			youtubeHTML = '<iframe width="560" height="315" src="' + youtubeURL;
			youtubeHTML += '" frameborder="0" allowfullscreen></iframe>';
			res.render('main.html', {'optionsForm' : youtubeHTML, 'searchAction' : '"/tunefind_get_show_seasons"', 'searchPlaceHolder' : '"Select by TV Show Title"'});
		}
	)
});

app.get('*', function(req, res){
	res.status(404).send('So sorry, not found, idk love u lots - trackstream team');
});

// Start up server on port 3000 on host localhost
var server = app.listen(process.env.PORT || 3000, function () {
  var port = server.address().port;
  console.log('Trackstream server on localhost listening on port ' + port + '!');
  //console.log('Open up your browser (within your VM) and enter the URL "http://localhost:' + port + '" to view your website!');
});