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

var getDirectories = function(dir_path) {
    return fs.readdirSync(dir_path).filter(function(file) {
        return fs.statSync(path.join(dir_path, file)).isDirectory();
    });
};

var getMediaFiles = function(directory_to_find_file, filter, callback) {

    // console.log('Starting from dir ' + directory_to_find_file + '/');

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


var init = function(BASE_DIR) {
    var dir = '';
    switch (argv.type) {
        case 'movies':
            console.log('Movies it is!');
            dir = BASE_DIR + '';
            break;
        default:
            console.log('Wrong type bro!');
            return;
    }

    // var entries = getDirectories(dir);
    // for (var i = 0; i < entries.length; i++) {
    //     folder = entries[i];
    getMediaFiles(dir /*+ entries[i]*/ , /\.mkv|\.mp4|\.avi/, function(filename) {
        console.log(filename);
    });
    // }

}(config.BASE_DIR);

client.on('error', function(err) {
    console.log('Error ' + err);
});

client.on('connect', function(err) {
    console.log('Connected To Redis');
});
