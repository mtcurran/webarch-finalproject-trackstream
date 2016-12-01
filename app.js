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
 * @param {String} body - the body of the response in JSON format
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
 }

/**
 * Takes in the global `seasonsDict` dictionary and creates a string of HTML 
 * to display the seasons and their corresponding data. 
 * @param {Object} seasonsDict - A dictionary where the key is the season name, & 
 * the value is a list with the song count, episode count, and season API URL
 * @return {String} HTML - The string of HTML to inject dynamically to display
 * 	season options.
 */
 function makeSeasonsHTML(seasonsDict) {
 	HTML = '<form class="input-field col s10 white-text" id="optionsForm" action="/tunefind_get_show_episodes" method="POST">'
 	for (seasonNumber in seasonsDict) {
 		seasonList = seasonsDict[seasonNumber];
 		HTML += '<input placeholder="Season ';
 		HTML += seasonNumber;
 		HTML += '" value="';
 		HTML += seasonNumber;
 		HTML += '" type="submit" class="validate" name="selectedSeason">';
 	}
 	HTML += '</form>';
 	return HTML;
 }

/**
 * Takes in TuneFind's API response for a tv show or movie search and parses 
 * it to extract the artist, song name, & scene (if applicable) for all songs.
 * The resulting dictionary has this format: {song name : [artist name, scene]}
 * @param {String} body - the body of the response, will contain JSON 
 * 	structured data in a string
 * @return {Object} - A dictionary where the key is the song name, & 
 *  the value is a list with the artist name and the scene (if applicable)
 */
function makeSongDict(body) {
	songDict = {}
	parsedBody = JSON.parse(body);
	songs = parsedBody.songs;
	for (i = 0; i < songs.length; i++) {
		artistName = songs[i].artist.name
		songName = songs[i].name;
		scene = songs[i].scene;
		if (!scene) {
			scene = "Song isn't used in a particular scene.";
		}
		songDict[songName] = [artistName, scene];
	}
	return songDict;
}

/**
 * Takes in the dictionary outputted from the makeSongDict function above, 
 * and creates a string of HTML to display the songs and their corresponding
 * data. The generated HTML will create an unordered list with this data.
 * @param {Object} songDict - A dictionary where the key is the song name, & 
 * the value is a list with the artist name and the scene (if applicable)
 * @return {String} HTML - The string of HTML to inject dynamically to display
 * 	song, artist, & scene options.
 */
 function makeSongSceneHTML(songDict) {
 	HTML = "<ul>";
 	for (song in songDict) {
 		HTML += "<hr>";
 		HTML += "<li>Artist: " + songDict[song][0] + "</li>";
 		HTML += "<li>Song: " + song + "</li>";
 		HTML += "<li>Scene: " + songDict[song][1] + "</li>";
 	}
 	HTML += "</ul>";
 	return HTML;
 }

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
			console.log(body);
			populateSeasonsDict(body);
			console.log(seasonsDict);
			seasonsHTML = makeSeasonsHTML(seasonsDict);
			console.log(seasonsHTML);
			res.render('main.html', {'optionsForm' : seasonsHTML});
		}
	)
});

app.post('/tunefind_get_show_episodes', function (req, res, next) {
	selectedSeason = req.body.selectedSeason;
	console.log("The url for the selected season is: " + seasonsDict[selectedSeason][2]);
	res.render('main.html', {'selectedSeasonURL' : seasonsDict[selectedSeason][2], 'optionsForm' : seasonsHTML})
})

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
var server = app.listen(3000, function () {
  var port = server.address().port;
  console.log('Trackstream server on localhost listening on port ' + port + '!');
  console.log('Open up your browser (within your VM) and enter the URL "http://localhost:' + port + '" to view your website!');
});