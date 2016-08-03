var express = require('express');
var ffmpeg = require('fluent-ffmpeg');

var app = express();

app.use(express.static(__dirname + '/static'));

app.get('/', function(req, res) {
    res.send('index.html');
});

app.get('/video/:filename', function(req, res) {
    res.contentType('mp4');
    // make sure you set the correct path to your video file storage
    var pathToMovie = '/home/vinay/Videos/' + req.params.filename;
    var proc = ffmpeg(pathToMovie)
        // use the 'flashvideo' preset (located in /lib/presets/flashvideo.js)
        .preset('flashvideo')
        // setup event handlers
        .on('end', function() {
            console.log('file has been converted succesfully');
        })
        .on('error', function(err) {
            console.log('an error happened: ' + err.message);
        })
        // save to stream
        .pipe(res, {
            end: true
        });
});

app.listen(42069, function() {
    console.log('App running on port 42069');
});
