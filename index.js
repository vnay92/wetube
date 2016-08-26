var express = require('express');
var app = express();
var config = require(__dirname + '/config.json');

// Redis
var redis = require('redis');
var client = redis.createClient();

var BASE_DIR = config.BASE_DIR;

app.use(express.static(__dirname + '/static'));

app.get('/', function(req, res) {
    res.send('index.html');
});

var movies = express();

app.get('/find/:video_hash', function(req, res) {
    // make sure you set the correct path to your video file storage
    client.get(req.params.video_hash, function (err, response) {
        if(err) {
            res.json({
                status: 500,
                message: err
            });
            return;
        }

        if(response === null) {
            res.json({
                status: 404,
                message: 'Not Found!'
            });
            return;
        }

        var filename = response.split('/');
        res.json({
            status: 200,
            message: 'SUCCESS',
            name: filename[filename.length - 1].replace('.mp4', ''),
        });
    });
});

app.get('/video/:video_hash', function(req, res) {
    // make sure you set the correct path to your video file storage
    client.get(req.params.video_hash, function (err, response) {
        if(err) {
            res.json({
                status: 500,
                message: err
            });
            return;
        }

        if(response === null) {
            res.json({
                status: 404,
                message: 'Not Found!'
            });
            return;
        }

        res.contentType('mp4');
        res.sendFile(response, function (err, result) {
            if(err) {
                console.log('Error Sending File');
            } else {
                console.log('Sent!');
            }
        });
    });
});

app.listen(42069, function() {
    console.log('App running on port 42069');
});
