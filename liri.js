var args = process.argv.slice(2);

var Spotify = require('node-spotify-api');
var request = require('request');
var moment = require('moment');
let fs = require("fs");
require("dotenv").config();

const keys = require('./keys');
var spotify = new Spotify(keys.spotify);

var posInputs = ["concert-this", "spotify-this-song", "movie-this", "do-what-it-says"];

function concertThis(){
    let artist = "";
    if(args[1]){
        artist = args[1];
    }
    else{
        artist = "Mac Demarco";
    }
    let url = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp";
    request(url, (error, response, body) => {
        outStr = JSON.parse(body);
        //console.log(outStr);
        console.log("Artist: " + artist);
        writeToFile("Artist: " + artist);
        for(let i = 0; i < outStr.length; i++){
            console.log("\nVenue: " + outStr[i].venue.name);
            writeToFile("Venue: " + outStr[i].venue.name);
            console.log("Location: " + outStr[i].venue.city + ", " + outStr[i].venue.region);
            writeToFile("Location: " + outStr[i].venue.city + ", " + outStr[i].venue.region);
            console.log("Date: " + outStr[i].datetime + "\n");
            writeToFile("Date: " + outStr[i].datetime);
        }
    });
}

function spotifyThis(){

    let found = true;
    if(args[1]){
        song = args[1];
    }
    else{
        song = "The Sign";
    }
    spotify.search({ type: 'track', query: song })
    .then(function(response) {
        if(response.tracks.items[0] !== undefined){
            console.log("Artist: " + response.tracks.items[0].artists[0].name + "\n");
            console.log("Track name: " + response.tracks.items[0].name + "\n");
            console.log("Preview: " + response.tracks.items[0].preview_url + "\n");
            console.log("Album: " + response.tracks.items[0].album.name + "\n"); 
            writeToFile(response.tracks.items[0].artists[0].name);
            writeToFile(response.tracks.items[0].name);
            writeToFile(response.tracks.items[0].preview_url);
            writeToFile(response.tracks.items[0].album.name);
        }
    })
    .catch(function(err) {
        console.log(err);
    });    
}

function movieThis(){
    let movie;
    if(args[1]){
        movie = args[1];
    }
    else{
        movie = "Mr. Nobody";
    }
    let url = "http://www.omdbapi.com/?apikey=trilogy&t=" + movie;
    request(url, (error, response, body) => {
        outStr = JSON.parse(body);

        //* Title of the movie.
        console.log("\nTitle: " + outStr.Title + "\n");
        //* Year the movie came out.
        console.log("Year: " + outStr.Year + "\n");
        //* IMDB Rating of the movie.
        console.log("IMDB Rating: " + outStr.imdbRating + "\n");
        //* Rotten Tomatoes Rating of the movie.
        console.log("Rotten Tomatoes: " + outStr.Ratings[1].Value + "\n");
        //* Country where the movie was produced.
        console.log("Country: " + outStr.Country + "\n");
        //* Language of the movie.
        console.log("Language: " + outStr.Language + "\n");
        //* Plot of the movie.
        console.log("Plot: " + outStr.Plot + "\n");
        //* Actors in the movie.
        console.log("Actors: " + outStr.Actors + "\n");
        writeToFile(outStr.Title);
        writeToFile(outStr.Year);
        writeToFile(outStr.imdbRating);
        writeToFile(outStr.Ratings[1].value);
        writeToFile(outStr.Country);
        writeToFile(outStr.Language);
        writeToFile(outStr.Plot);
        writeToFile(outStr.Actors);
    });
    
}

function doThis(){
    let fs = require("fs");
    fs.readFile("random.txt", (err, data) => {
        args = data.toString().split(',');
    
        if(args[0] === posInputs[0]){
            concertThis();
        }
        else if(args[0] === posInputs[1]){
            spotifyThis();
        }
        else if(args[0] === posInputs[2]){
            movieThis();
        }

        /*
        spotify.search({ type: 'track', query: readData[1] })
        .then(function(response) {
            if(response.tracks.items[0] !== undefined){
                console.log("Artist: " + response.tracks.items[0].artists[0].name + "\n");
                console.log("Track name: " + response.tracks.items[0].name + "\n");
                console.log("Preview: " + response.tracks.items[0].preview_url + "\n");
                console.log("Album: " + response.tracks.items[0].album.name + "\n"); 
            }
        })
        .catch(function(err) {
            console.log(err);
        });  
        */
    });
    
}

function writeToFile(str){
    fs.appendFile("log.txt", str + "\n", (err) => {
            return err;
        })
}

if(args[1]){
    writeToFile(args[0] + " " + args[1]);
}
else{
    writeToFile(args[0]);
}

if(args[0] === posInputs[0]){
    concertThis();
}
else if(args[0] === posInputs[1]){
    spotifyThis();
}
else if(args[0] === posInputs[2]){
    movieThis();
}
else if(args[0] === posInputs[3]){
    doThis();
}
else{
    console.log("Sorry, that input isn't recognized.")
}
