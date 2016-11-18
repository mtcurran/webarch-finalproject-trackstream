/******NO NEED TO MODIFY ****/
var express = require('express'); // Adding the express library 
var mustacheExpress = require('mustache-express'); // Adding mustache templating system and connecting it to 
var request = require('request')  // Adding the request library (to make HTTP reqeusts from the server)

var bodyParser = require('body-parser');

var app = express(); // initializing applicaiton
app.engine('html', mustacheExpress());
app.set('view engine', 'mustache');
app.set('views', __dirname + '/views');

app.use(bodyParser.urlencoded({ extended: false }));

// For each request to this server, run the function "logger" in tools.js 
//app.use(tools.logger);

// Set up /static path to host css/js/image files directly
app.use('/static', express.static(__dirname + '/static'));
/****END OF NO NEED TO MODIFY SECTION ******/




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

	url = 'https://'+ username + ':' + pass + '@www.tunefind.com/api/v1/show/'
	+ show_name + '/season-' + season_n + '/' + episode_n;

	console.log(url);

	request(
		{
			url: url
		},
		function(error, response, body) {
			console.log(body);
			res.render('main.html', {'tunefind_results': body});
		}
	)
});

app.get('/tunefind_movie', function(req, res) {
	console.log("TuneFind API request sending...");

	movie_name = "ghosts-of-girlfriends-past";
	username = "374a4ae1df4ba412cfb9f6485f426143";
	pass = "b6cb8aac2c4f558eeff122a4f2bdbe48";

	url = 'https://'+ username + ':' + pass + '@www.tunefind.com/api/v1/movie/'
	+ movie_name + '?debug=json';

	console.log(url);

	request(
		{
			url: url
		},
		function(error, response, body) {
			console.log(body);
			res.render('main.html', {'tunefind_results': body});
		}
	)
});


// Start up server on port 3000 on host localhost
var server = app.listen(3000, function () {
  var port = server.address().port;

  console.log('Trackstream server on localhost listening on port ' + port + '!');
  console.log('Open up your browser (within your VM) and enter the URL "http://localhost:' + port + '" to view your website!');
});