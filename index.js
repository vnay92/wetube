var express = require('express');
var app = express();
var config = require('config.json');

var BASE_DIR = config.BASE_DIR;

app.use(express.static('/home/vinay/Videos'));

app.get('/', function(req, res) {
    res.send('index.html');
});

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
