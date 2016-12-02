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

// Global variables for later use.
var username = "374a4ae1df4ba412cfb9f6485f426143";
var pass = "b6cb8aac2c4f558eeff122a4f2bdbe48";
var seasonsDict;
var episodesDict;
var songsDict;

/**
 * Takes in TuneFind's API response for a search on a TV show name
 * and parses it to extract how many seasons there are, and how many
 * songs and episodes are in each season. For each season, it will also 
 * extract the TuneFind API URL to search for that season. This will be useful
 * to list all the episodes once the user has selected a season. The resulting
 * dictionary has this format: {season number: [song count, episode count, season API URL]}
 * Nothing is returned, but the global variable `seasonsDict` gets populated
 * @param {Object} body - the body of the response in JSON format
 */
 function populateSeasonsDict(body) {
 	seasonsDict = {}
 	parsedBody = JSON.parse(body);
 	seasons = parsedBody["seasons"];
 	for (i = 0; i < seasons.length; i++) {
 		seasonNumber = seasons[i].number;
 		songCount = seasons[i].song_count;
 		episodeCount = seasons[i].episode_count;
 		seasonURL = seasons[i].tunefind_api_url;
 		seasonsDict[seasonNumber] = [songCount, episodeCount, seasonURL];
 	}
 };

/**
 * Takes in the global `seasonsDict` dictionary and creates a string of HTML 
 * to display the seasons and their corresponding data. 
 * @param {Object} seasonsDict - A dictionary where the key is the season number, & 
 * the value is a list with the song count, episode count, and season API URL
 * @return {String} HTML - The string of HTML to inject dynamically to display
 * 	season options.
 */
 function makeSeasonsHTML(seasonsDict) {
 	HTML = '<form class="input-field col s10" id="optionsForm" action="/tunefind_get_show_episodes" method="POST">'
 	for (seasonNumber in seasonsDict) {
 		seasonList = seasonsDict[seasonNumber];
 		HTML += '<button type="submit" class="validate" name="selectedSeason" value="';
 		HTML += seasonNumber;
 		HTML += '">Season ';
 		HTML += seasonNumber;
 		HTML += '<br/>';
 		HTML += 'Song Count: ';
 		HTML += seasonList[0];
 		HTML += '<br/>';
 		HTML += 'Episode Count: ';
 		HTML += seasonList[1];
	 	HTML += '</button>';
 	}
 	HTML += '</form>';
 	return HTML;
 };

/**
 * Takes in TuneFind's API response for a search on a season for a TV show
 * and parses it to extract how many episodes there are, the episode names, 
 * and how many songs are in each episode. For each episode, it will also 
 * extract the TuneFind API URL to search for that episode. This will be useful
 * to list all the songs & scenes once the user has selected an episode. The resulting
 * dictionary has this format: {episode number: [episode name, song count, episode API URL]}
 * Nothing is returned, but the global variable `episodesDict` gets populated
 * @param {Object} body - the body of the response in JSON format
 */
 function populateEpisodesDict(body) {
 	episodesDict = {}
 	parsedBody = JSON.parse(body);
 	episodes = parsedBody["episodes"];
 	for (i = 0; i < episodes.length; i++) {
 		episodeNumber = episodes[i].number;
 		episodeName = episodes[i].name;
 		songCount = episodes[i].song_count;
 		episodeURL = episodes[i].tunefind_api_url;
 		episodesDict[episodeNumber] = [episodeName, songCount, episodeURL];
 	}
 };

 /**
 * Takes in the global `episodesDict` dictionary and creates a string of HTML 
 * to display the episodes and their corresponding data. 
 * @param {Object} episodesDict - A dictionary where the key is the episode number, & 
 * the value is a list with the episode number, song count, and episode API URL
 * @return {String} HTML - The string of HTML to inject dynamically to display
 * 	episode options.
 */
 function makeEpisodesHTML(episodesDict) {
 	HTML = '<form class="input-field col s10" id="optionsForm" action="/tunefind_get_show_songs" method="POST">'
 	for (episodeNumber in episodesDict) {
 		episodeList = episodesDict[episodeNumber];
 		HTML += '<button type="submit" class="validate" name="selectedEpisode" value="';
 		HTML += episodeNumber;
 		HTML += '">Episode ';
 		HTML += episodeNumber;
 		HTML += '<br/>';
 		HTML += 'Episode Name: ';
 		HTML += episodeList[0]; 		
 		HTML += '<br/>';
 		HTML += 'Song Count: ';
 		HTML += episodeList[1];
 		HTML += '</button>'; 	 		
 	}
 	HTML += '</form>';
 	return HTML;
 };

/**
 * Takes in TuneFind's API response for a search on a episode within a season for a TV show
 * and parses it to extract song names, artist names, and the scene for each song if applicable. 
 * The resulting dictionary has this format: {song name: [artist name, scene]}
 * Nothing is returned, but the global variable `songsDict` gets populated
 * @param {Object} body - the body of the response in JSON format
 */
function populateSongsDict(body) {
	songsDict = {}
	parsedBody = JSON.parse(body);
	songs = parsedBody["songs"];
	for (i = 0; i < songs.length; i++) {
		artistName = songs[i].artist.name
		songName = songs[i].name;
		scene = songs[i].scene;
		if (!scene) {
			scene = "Song isn't used in a particular scene.";
		}
		songsDict[songName] = [artistName, scene];
	}
	return songsDict;
};

 /**
 * Takes in the global `songsDict` dictionary and creates a string of HTML 
 * to display the songs and their corresponding data. 
 * @param {Object} songsDict - A dictionary where the key is the song name, & 
 * the value is a list with the artist name, and scene if applicable
 * @return {String} HTML - The string of HTML to inject dynamically to display
 * 	song options.
 */
 function makeSongsHTML(songsDict) {
 	HTML = '<form class="input-field col s10" id="optionsForm" action="/youtube_search" method="POST">'
 	for (songName in songsDict) {
 		songList = songsDict[songName];
 		youtubeSearch = songList[0] + ' ' + songName;
 		HTML += '<button type="submit" class="validate" name="selectedSong" value="';
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
 	}
 	HTML += '</form>';
 	return HTML;
 };

// Define your routes here

app.get('/', function (req, res, next) {
  res.render('main.html');
});

app.post('/tunefind_get_show_seasons', function (req, res, next) {
	showName = req.body.show_or_movie_name;
	showName = showName.replace(/ /g, "-").toLowerCase();
	url = 'https://'+ username + ':' + pass + '@www.tunefind.com/api/v1/show/' + showName;

	request(
		{
			url: url
		},
		function(error, response, body) {
			populateSeasonsDict(body);
			seasonsHTML = makeSeasonsHTML(seasonsDict);
			res.render('main.html', {'optionsForm' : seasonsHTML, 'searchAction' : '"tunefind_get_show_seasons"'});
		}
	)
});

app.post('/tunefind_get_show_episodes', function (req, res, next) {
	selectedSeason = req.body.selectedSeason;
	seasonURL = seasonsDict[selectedSeason][2]
	url = 'https://' + username + ':' + pass + '@' + seasonURL.substring(8);

	request(
		{
			url: url
		},
		function(error, response, body) {
			populateEpisodesDict(body);
			episodesHTML = makeEpisodesHTML(episodesDict);
			res.render('main.html', {'optionsForm' : episodesHTML, 'searchAction' : '"tunefind_get_show_seasons"'});
		}
	)
});

app.post('/tunefind_get_show_songs', function (req, res, next) {
	selectedEpisode = req.body.selectedEpisode;
	episodeURL = episodesDict[selectedEpisode][2]
	url = 'https://' + username + ':' + pass + '@' + episodeURL.substring(8);
	console.log("The url for the selected season is: " + url);

	request(
		{
			url: url
		},
		function(error, response, body) {
			console.log(body);
			populateSongsDict(body);
			songsHTML = makeSongsHTML(songsDict);
			res.render('main.html', {'optionsForm' : songsHTML, 'searchAction' : '"tunefind_get_show_seasons"'});
		}
	)
});

app.post('/youtube_search', function (req, res, next) {
	youtubeSearch = req.body.selectedSong;
	youtubeSearch = youtubeSearch.replace(/(\||-)/g, " "); 
	youtubeSearch = encodeURI(youtubeSearch);
	url = 'https://www.googleapis.com/youtube/v3/search?key=AIzaSyCqzpPsxZBRhNB2UwO4TWpHANu0PXtxyT4&part=snippet&type=video&maxResults=1&q=' + youtubeSearch;

	request(
		{
			url: url
		},
		function(error, response, body) {
			body = JSON.parse(body);
			videoID = body["items"][0]["id"]["videoId"];
			youtubeHTML = '<iframe width="560" height="315" src="https://www.youtube.com/embed/';
			youtubeHTML += videoID;
			youtubeHTML += '" frameborder="0" allowfullscreen></iframe>';
			res.render('main.html', {'optionsForm' : youtubeHTML});
		}
	)
});

app.get('/tunefind_show', function(req, res) {
	console.log("TuneFind API request sending...");
	show_name = "arrow";
	season_n = "1";
	episode_n = "12612";
	username = "374a4ae1df4ba412cfb9f6485f426143";
	pass = "b6cb8aac2c4f558eeff122a4f2bdbe48";
	url = 'https://'+ username + ':' + pass + '@www.tunefind.com/api/v1/show/' + show_name + '/season-' + season_n + '/' + episode_n;

	request(
		{
			url: url
		},
		function(error, response, body) {
			songDict = makeSongDict(body);
			console.log(songDict);
			songSceneHTML = makeSongSceneHTML(songDict);
			res.render('main.html', {'tunefind_results': songSceneHTML});
		}
	)
});

app.get('/tunefind_movie', function(req, res) {
	console.log("TuneFind API request sending...");
	movie_name = "ghosts-of-girlfriends-past";
	username = "374a4ae1df4ba412cfb9f6485f426143";
	pass = "b6cb8aac2c4f558eeff122a4f2bdbe48";
	url = 'https://'+ username + ':' + pass + '@www.tunefind.com/api/v1/movie/' + movie_name;

	request(
		{
			url: url
		},
		function(error, response, body) {
			songDict = makeSongDict(body)
			console.log(songDict);
			songSceneHTML = makeSongSceneHTML(songDict);			
			res.render('main.html', {'tunefind_results': songSceneHTML});
		}
	)
});


// Start up server on port 3000 on host localhost
var server = app.listen(process.env.PORT || 3000, function () {
  var port = server.address().port;
  console.log('Trackstream server on localhost listening on port ' + port + '!');
  //console.log('Open up your browser (within your VM) and enter the URL "http://localhost:' + port + '" to view your website!');
});