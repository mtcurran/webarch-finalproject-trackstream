Q1. URL where application can be accessed:

App: http://trackstream.herokuapp.com/

API: http://trackstream-api.herokuapp.com/
	Must include one of the following paths in API post request: 
		tunefind_get_movie_songs
		tunefind_get_show_seasons
		tunefind_get_show_episodes
		tunefind_get_show_songs
		youtube_search


Q2. A description of what your project does and the functionality that it provides.

TrackStream is a website where a user who wants to access songs from TV shows and movies they like can stream YouTube videos from specific episodes and films that are listed in the TuneFind API. A user would first choose either TV show or movie, then enter the title and hit the search bar. In the case of a movie, the full list of songs on the soundtrack (that are contained in the TuneFind API) would appear along with a description of the scene the song played during if available upon hovering over the button. The user can click on a specific song, and then the corresponding YouTube video for that song would appear on TrackStream for the user to view. In the case of a TV show, after hitting 'search' the user would be given a list of season numbers to choose from. After choosing a season number, the user is given a list of episodes by number and title, and once they choose an episode they're given the list of songs to choose from for streaming, again a description of the scene each song played during is available upon hovering over the button..

The underlying functionality of our app does the following: the client on a browser makes a get request to the root page of our web server where the basic home page "main.html" is returned. On that page if the user chooses to first interact by searching for a TV show, they can hit the "TV Show" button which will dynamically adjust the action of the form to make a request to the web server once the user hits search. Hitting this search sends the post request to the web server, which in turn, extracts the show name from the body using JSON (if the search is not blank) and sends that in a post request to the TrackStream API. From here, our API will take the show name by parsing the body, clean it using regular expressions, and query TuneFind's API for that show. Then, if TuneFind returns a valid response the API creates a JSON object with the show's season numbers as the keys and the values as lists containing the episode count and the season's TuneFind API URL.

Our API sends this JSON object back to our webserver where we have a helper function that constucts the HTML using the JSON object to populate a list of season buttons with values of the TuneFind API URL for each season. Using these URLs, the same process continues and repeats to retrieve and display the list of episodes for a given season, and the songs for a given episode. Finally, when the user selects a particular song from an episode, our web server concatenates the artist and song name and sends it to the TrackStream API which cleanses the query using regular expressions and sends a request to YouTube's API to query for the video ID of the top search result using these parameters. This video ID is sent back in a JSON object to the web server which constructs the HTML for an embedded YouTube link which is displayed as a video on the browser to the user.


Q3. A list of at least ten different web technologies that you used in your web application and where they are used.
Suggestions based on past assignments: JSON, NodeJS/Express, JavaScript, GET requests, POST requests, Heroku.

i. CSS, or Cascading Style Sheets, is used to style the look and feel of our web application. Our web application's CSS styling includes the colors of the buttons and text, the hover effects for our buttons, and the buttons' colors changing to indicate that they are pressed. We have also styled the cards that contain the search results, making all of the buttons the same size and expandable when the cursor hovers over them. We used the Bootstrap framework to organize the layout of the page.

ii. An API, or Application Programming Interface, abstracts the methods to process data for a service from the client. Along with our own API, we make use of two external API's: TuneFind, Youtube. TrackStream utilizes the TuneFind API to identify the relevant movie or TV show titles associated with our users' searches, as well as the seasons, episodes (by name and number), and songs that are played within the movie or TV episode. We then use the YouTube API to play the video associated with the song the user wants to hear. Similarly, our API abstracts methods that are useful to our webserver in particular. 

iii. TCP
The Transmission Control Protocol (TCP) is one of the main protocols of the Internet protocol suite utilised by Trackstream. TCP provides reliable, ordered, and error-checked delivery of a stream of octets between applications running on hosts communicating by an IP network. Our application is also using TCP to exchange the stream of data packets over the network.

iv. Web Server
A Web server is a program that uses HTTP (Hypertext Transfer Protocol) to serve the files that form Web pages to users, in response to their requests, which are forwarded by their computers' HTTP clients. In our project, web server takes the request from the browser eg the Trackstream's page HTTP request and serves the corresponding HTML page for that request after doing the necessary processing.

v. JSON
Javascript Object Notation is a data-format that's easy for humans to read and write, and easy for computers to parse and generate. It essentially composes a Javascript object with key:value pairs. This was used in the project when we handled data with our own API, and with TuneFind and Youtube's API's. POST requests were made from our webserver to our API with parameters in the body as JSON. The requests were parsed as JSON on our API side and were either used in GET requests to Tunefind to Youtube. Tunefind and Youtube both sent back responses in JSON, where we again parsed what we needed on our API and then constructed a JSON object to send back to our webserver. JSON was crucial to this project as it was the main format of transmitting data between our webserver, API, Tunefind, and Youtube.

vi. POST Requests
POST requests are used to send data to a server, usually for the server to do something with it and return an appropriate response. With POST requests, the data is sent back and forth in the body of the request, and is thus hidden from the client. With our application, we used many POST requests. These POST requests first occur with the form on our webpage, which sends the request to our webserver. Our webserver appropriate routes the POST request from the form and makes POST requests to our API with different data. One request asks for a search on a Movie or TV Show title. Another does so for the season of a TV Show. Another does so for the episode of a season. Another does so for the songs in a movie or episode. 

vii. GET Requests
GET requests are defining what occurs when a viewer accesses a given URL on our web server, for example our homepage is defined by the get request '/' which renders the 'main.html' file to the browser. GET requests are also the way our API interacts with the external APIs of TuneFind and Youtube. These requests contain the URL to be requested, any authentication information, and the required parameters like show/movie name or YouTube search terms.

viii. Heroku
Heroku is a cloud-based hosting service that allows our web application and API to be accessed by anyone on the Internet. TrackStream uses two Heroku hosted projects, one for the web server and one for the API. These projects are linked via remotes to their corresponding GitHub repositories which include package.json containing information about dependencies, as well as the correct way to run the code for the project project (in the case of our web server, the command 'node app.js').

ix. 

x. 
