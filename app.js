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
 * Takes in TuneFind's API response for a tv show or movie search and parses 
 * it to extract the artist, song name, & scene (if applicable) for all songs.
 * The resulting dictionary has this format: {song name : [artist name, scene]}
 * @param {String} body - the body of the response, will contain JSON 
 * 	structured data in a string
 * @return {Object} songDict - A dictionary where the key is the song name, & 
 * the value is a list with the artist name and the scene (if applicable)
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