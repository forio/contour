
var glob = require('glob');
var fs = require('fs');
// var confox = require('./confox');
var markdox = require('markdox');
var async = require('async');
var path = require('path');
var _ = require('underscore');

var docFolder = __dirname + '/documentation';


var options = {
    src: [
        'src/scripts/core/narwhal.js',
        'src/scripts/core/cartesian.js',
        'src/scripts/core/horizontal-frame.js',
        'src/scripts/core/**/*.js',
        'src/scripts/visualizations/**/*.js',
        'src/scripts/**/*.js'
    ]
};


var allFiles = [];
options.src.forEach(function (spec) {
    glob(spec, { sync: true, nosort: true }, function (er, files) {
        allFiles = _.union(allFiles, files);
    });
});

// One file per Javascript file
async.forEach(allFiles, function(file, next) {
    var output = docFolder + '/' + path.basename(file) + '.md';
    markdox.process(file, output, next);
}, function(err) {
    if (err) {
        throw err;
    }

    console.log('Documents generated with success');
});


// One file for all Javascript files
var output = docFolder + '/all.md';
markdox.process(allFiles, {output:output}, function() {
    console.log('File `all.md` generated with success');
});


// files.forEach(function (file) {
//     var js = fs.readFileSync(file).toString();
//     var res = confox.parseConfigObject(js);
//     console.log(res);
// });


