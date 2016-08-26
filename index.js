var express = require('express');
var app = express();
var config = require(__dirname + '/config.json');

var BASE_DIR = config.BASE_DIR;

app.use(express.static(__dirname + '/static'));

app.get('/', function(req, res) {
    res.send('index.html');
});

var movies = express();

app.get('/video/:filename', function(req, res) {
    res.contentType('mp4');
    // make sure you set the correct path to your video file storage
    var pathToMovie = BASE_DIR + req.params.filename;
    res.sendFile(pathToMovie, function (err) {
        if(err) {
            console.log('Error Occured', err);
        } else {
            console.log('Sent!');
        }
    });
});

app.listen(42069, function() {
    console.log('App running on port 42069');
});
