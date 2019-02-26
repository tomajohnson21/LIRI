require("dotenv").config();
var keys = require("./keys.js");
var Spotify = require("node-spotify-api");
var spotify = new Spotify(keys.spotify);
var axios = require("axios");
var moment = require("moment");
var fs = require("fs");

var userInput = process.argv;
var search = userInput[2];
var term = userInput.slice(3).join(" ");

var findMovie = function(movie){

    var url = "http://www.omdbapi.com/?t=" + movie + "&y=&plot=short&apikey=trilogy"
    axios.get(url).then(function(results){

        var data = results.data;
        console.log(data);


        console.log("\n___________________________")
        console.log("\nHere is the top result for '" + movie + "':");
        // * Title of the movie.
        console.log("Title: " + data.Title);
        // * Year the movie came out.
        console.log("Year of Release: " + data.Released);
        // * IMDB Rating of the movie.
        console.log("IMDB Rating: " + data.Ratings[0].Value);
        // * Rotten Tomatoes Rating of the movie.
        console.log("Rotten Tomatoes Rating: " + data.Ratings[1].Value);
        // * Country where the movie was produced.
        console.log("Country of Origin: " + data.Country);
        // * Language of the movie.
        console.log("Language" + data.Language);
        // * Plot of the movie.
        console.log("Plot Summary: " + data.Plot);
        // * Actors in the movie.
        console.log("Cast: " + data.Actors);

    });
}

var findConcert = function(artist){

    var url = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp";
    axios.get(url).then(function(results){

        var data = results.data;
        //console.log(data);

        console.log("\n___________________________")
        console.log("\nHere are the next five shows for '" + artist + "':");
        for(var i = 0; i < 5; i++){

            var date = moment(data[i].datetime).format("MM/DD/YYYY");
            var location;

            if(!data[i].venue.region){
                location = data[i].venue.city + ", " + data[i].venue.country;
            } else {
                location = data[i].venue.city + ", " + data[i].venue.region + ", "  + data[i].venue.country
            }

            console.log("\nVenue: " + data[i].venue.name);
            console.log("Location: " + location);
            console.log("Date: " + date);
            console.log("___________________________")

        }
    });
}

var spotifySong = function(song){
    
    spotify.search({ type: 'track', query: song }, function(err, data) {
        if (err) {
          return console.log('Error occurred: ' + err);
    }

    console.log("___________________________")
    console.log("\nHere is the top result for '" + song + "':");
    console.log("\nArtist: " + data.tracks.items[0].artists[0].name) 
    console.log("Title: " + data.tracks.items[0].name);
    console.log("Link: " + data.tracks.items[0].preview_url) 
    console.log("Album: " + data.tracks.items[0].album.name);
    });
}

var doWhatItSays = function(){

    fs.readFile("random.txt", "utf8", function(error, data) {

        // If the code experiences any errors it will log the error to the console.
        if (error) {
          return console.log(error);
        }
      
        // We will then print the contents of data
        console.log(data);
      
        // Then split it by commas (to make it more readable)
        var dataArr = data.split(",");
      
        // We will then re-display the content as an array for later use.
        console.log(dataArr);

        var search = dataArr[0];
        var term = dataArr[1];

        runCommand(search, term);
      });
}

var runCommand = function (search, term){

    if(search){
        fs.appendFile("log.txt", search + "," + term + ";", function(err){
            if(err) throw err;
        }); 
    }

    switch(search){
        
        case "concert-this":
            console.log("\nYou are searching for a concert");
            if(!term){
                console.log("\nYou must enter a search term");
            } else {
                findConcert(term);
            }
            break;

        case "spotify-this-song":
            console.log("\nYou are trying to Spotify a song")
            if(!term){
                console.log("\nYou must enter a search term");
            } else {
                spotifySong(term);
            }
            break;
        
        case "movie-this":
            console.log("\nYou are searching for a movie")
            if(!term){
                console.log("\nYou must enter a search term");
            } else {
                findMovie(term);
            }
            break;

        case "do-what-it-says":
            console.log("\nYou want to do what 'random.txt' says")
            doWhatItSays();
            break;

        default:
            console.log("\nPlease enter a proper command");
            break;
    }
}

runCommand(search, term);