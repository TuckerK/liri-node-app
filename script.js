var keys = require("./keys.js");
var inquire = require("inquirer");
var Spotify = require("node-spotify-api");
var request = require("request");
var Twitter = require("twitter");
var fs = require("fs");

var client = new Twitter(keys);

var spotify = new Spotify({
  id: "1e9bcea7fad041968677a36aae598bda",
  secret: "aeed6407f2934eab891f825209a7c461"
});

inquire
  .prompt([
    {
      type: "list",
      message: "Choose an action:",
      choices: [
        "Last 20 Tweets",
        "Spotify a Song",
        "Movie Search",
        "Do What It Says"
      ],
      name: "app",
      default: [0]
    }
  ])
  .then(function(usr) {
    if (usr.app === "Last 20 Tweets") {
      console.log("Tweets");
      getTweets();
    } else if (usr.app === "Spotify a Song") {
      console.log("Spotify");
      spotifySearch();
    } else if (usr.app === "Movie Search") {
      movieSearch();
    } else if (usr.app === "Do What It Says") {
      console.log("Do what it says");
      doWhatItSays();
    } else {
      console.log("something went wrong");
    }
  });

function getTweets() {
    client.get('statuses/user_timeline.json?screen_name=tuckerwking&count=20', function(error, tweets, response) {
        if(error) throw error;
        for (let i = 0; i < tweets.length; i++) {
            console.log(tweets[i].text);  // The favorites. 
            console.log(tweets[i].created_at);  // The favorites. 
            
        }
        
        // console.log(response);  // Raw response object. 
      });
}

function spotifySearch() {
  inquire
    .prompt([
      {
        type: "input",
        message: "What song would you like to search?",
        name: "spotifySearch"
      }
    ])
    .then(function(usr) {
      var spotifySearch = usr.spotifySearch;

      if (spotifySearch === "") {
        spotify
          .request(
            "https://api.spotify.com/v1/search?q=ace+of+base&type=track&limit=2"
          )
          .then(function(data) {
            console.log(data.tracks.items[0].artists[0].name);
            console.log(data.tracks.items[0].name);
            console.log(data.tracks.items[0].external_urls.spotify);
            console.log(data.tracks.items[0].album.name);
          })
          .catch(function(err) {
            console.error("Error occurred: " + err);
          });
      } else {
        spotify
          .request(
            "https://api.spotify.com/v1/search?q=" +
              spotifySearch +
              "&type=track&limit=1"
          )
          .then(function(data) {
            console.log(data.tracks.items[0].artists[0].name);
            console.log(data.tracks.items[0].name);
            console.log(data.tracks.items[0].external_urls.spotify);
            console.log(data.tracks.items[0].album.name);
          })
          .catch(function(err) {
            console.error("Error occurred: " + err);
          });
      }
    });
}

function movieSearch() {
  inquire
    .prompt([
      {
        type: "input",
        name: "movieSearch",
        message: "What movie would you like to search?"
      }
    ])
    .then(function(usr) {
      if (usr.movieSearch === "") {
        request(
          "http://www.omdbapi.com/?t=mr+nobody&plot=short&apikey=trilogy",
          function(error, response, body) {
            if (!error && response.statusCode === 200) {
              console.log("Title: " + JSON.parse(body).Title);
              console.log("Year: " + JSON.parse(body).Year);
              console.log("IMDB Rating: " + JSON.parse(body).imdbRating);
              console.log(
                "Rotten Tomatoes Rating: " + JSON.parse(body).Ratings[1].Value
              ); //May need to change obj formatting
              console.log("Country: " + JSON.parse(body).Country);
              console.log("Language: " + JSON.parse(body).Language);
              console.log("Plot: " + JSON.parse(body).Plot);
              console.log("Actors: " + JSON.parse(body).Actors);
            }
          }
        );
      } else {
        var movieArr = usr.movieSearch.split();
        var parsedTitle = movieArr.join("+");
        request(
          "http://www.omdbapi.com/?t=" +
            parsedTitle +
            "&plot=short&apikey=trilogy",
          function(error, response, body) {
            if (!error && response.statusCode === 200) {
              console.log("Title: " + JSON.parse(body).Title);
              console.log("Year: " + JSON.parse(body).Year);
              console.log("IMDB Rating: " + JSON.parse(body).imdbRating);
              console.log(
                "Rotten Tomatoes Rating: " + JSON.parse(body).Ratings[1].Value
              ); //May need to change obj formatting
              console.log("Country: " + JSON.parse(body).Country);
              console.log("Language: " + JSON.parse(body).Language);
              console.log("Plot: " + JSON.parse(body).Plot);
              console.log("Actors: " + JSON.parse(body).Actors);
            }
          }
        );
      }
    });
}

function doWhatItSays(){
    fs.readFile("./random.txt", 'utf8', (err, data) => {
        if (err) throw err;
        spotifySearch = data;
        spotify
          .request(
            "https://api.spotify.com/v1/search?q=" +
              spotifySearch +
              "&type=track&limit=1"
          )
          .then(function(data) {
            console.log(data.tracks.items[0].artists[0].name);
            console.log(data.tracks.items[0].name);
            console.log(data.tracks.items[0].external_urls.spotify);
            console.log(data.tracks.items[0].album.name);
          })
          .catch(function(err) {
            console.error("Error occurred: " + err);
          });

    })
}
