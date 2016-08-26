var fs = require('fs');
var path = require('path');
var crypto = require('crypto');
var config = require(__dirname + '/config.json');
var argv = require('minimist')(process.argv.slice(2));

var redis = require('redis');
var client = redis.createClient();

var usage = function() {
    console.log('USAGE : node populate.js --type=[movies|series]');
};

if (argv.type === undefined) {
    usage();
    process.exit(1);
}

var getMediaFiles = function(directory_to_find_file, filter, callback) {

    console.log('Starting from dir ' + directory_to_find_file + '/');

    if (!fs.existsSync(directory_to_find_file)) {
        console.log("no dir ", directory_to_find_file);
        return;
    }

    var files = fs.readdirSync(directory_to_find_file);
    for (var i = 0; i < files.length; i++) {
        var filename = path.join(directory_to_find_file, files[i]);
        var stat = fs.lstatSync(filename);
        if (stat.isDirectory()) {
            getMediaFiles(filename, filter, callback); // recurse
        } else if (filter.test(filename)) {
            callback({
                directory: directory_to_find_file,
                file: filename,
                hash: crypto.createHash('md5').update(filename).digest('hex')
            });
        }
    }
};

var pushToRedis = function (data) {

    // push the file Hash for rendering
    client.set(data.hash, data.file, function(err, result) {
        if(err) {
            console.log(err);
            return;
        }
        console.log(result);
    });

    // Create the Directory Structure
    client.get(data.directory, function (err, result) {
        if(err) {
            console.log(error);
            return;
        }
        if(result === null) {
            data_to_push = [data.file];
        } else {
            data_to_push = JSON.parse(result);
            if(data_to_push.indexOf(data.file) == -1) {
                data_to_push.push(data.file);
            }
        }

        client.set(data.directory, JSON.stringify(data_to_push), function (err, response) {
            console.log(response);
        });
    });
};


var init = function(BASE_DIR) {
    var dir = '';
    // var files_regex = /\.mkv|\.mp4|\.avi/;
    var files_regex = /\.mp4/;
    switch (argv.type) {
        case 'movies':
            console.log('Movies it is!');
            dir = BASE_DIR + '';
            break;
        default:
            console.log('Wrong type bro!');
            return;
    }

    getMediaFiles(dir, files_regex, function(file) {
        pushToRedis(file);
    });

}(config.BASE_DIR);

client.on('error', function(err) {
    console.log('Error ' + err);
});

client.on('connect', function(err) {
    console.log('Connected To Redis');
});
