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

app.get('/video/:video_hash', function(req, res) {
    // make sure you set the correct path to your video file storage
    client.get(req.params.video_hash, function (err, response) {
        if(err) {
            res.json({
                status: 500,
                message: err
            });
            res.end();
            return;
        }

        res.json({
            status: 200,
            path: response
        });
    });
});

app.listen(42069, function() {
    console.log('App running on port 42069');
});
