
var glob = require('glob');
var fs = require('fs');
var confdox = require('./config-dox');
var markdox = require('markdox');
var async = require('async');
var path = require('path');
var _ = require('lodash');

var docFolder = __dirname + '/documentation';
var configDocFolder = docFolder + '/config/';
var propTemplatePath = docFolder + '/config/prop.template.md';

var options = {
    src: [
        'src/scripts/core/narwhal.js',
        'src/scripts/core/cartesian.js',
        'src/scripts/core/horizontal-frame.js',
        'src/scripts/core/**/*.js',
        'src/scripts/visualizations/**/*.js',
        'src/scripts/**/*.js'
    ],

    configTarget: 'config'
};

var allFiles = getSourceFileList(options.src);

// generatePerFileDoc(allFiles);
// generateAllFilesDoc(allFiles);
generateConfigObjectDoc(allFiles, options.configTarget);




function getSourceFileList(srcSpec) {
    var allFiles = [];
    srcSpec.forEach(function (spec) {
        glob(spec, { sync: true, nosort: true }, function (er, files) {
            allFiles = _.union(allFiles, files);
        });
    });

    return allFiles;
}

function generatePerFileDoc(allFiles) {
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
}

function generateAllFilesDoc(allFiles) {
    // One file for all Javascript files
    var output = docFolder + '/all.md';
    markdox.process(allFiles, {output:output}, function() {
        console.log('File `all.md` generated with success');
    });
}


function generateConfigObjectDoc(files, targetDir) {
    var configObject = {};
    files.forEach(function (file) {
        var js = fs.readFileSync(file).toString();
        var res = confdox.parseConfigObject(js);

        // the order of the files is from generic to specific
        // and we want to document through the global config file
        // the most generic version of the config property
        configObject = _.merge({}, res, configObject);
    });

    fs.readFile(propTemplatePath, 'utf8', function (err, template) {
        var compiled = _.template(template);

        bfs(configObject, 'config', function (k, isParent) {
            var fileName = configDocFolder + (k.ctx ? k.ctx + '.' + k.key : k.key);
            var md = compiled({
                name: k.key,
                type: typeof k.ref,
                description: '',
                defaultValue: k.ref === null ? 'null' : k.ref === undefined ? 'undefined' : k.ref.toString()
            });

            fs.writeFile(fileName, md, 'utf8');
        });

    });
}

function bfs(root, rootContext, visitor) {
    var queue = [];

    queue.push({key: rootContext, ref: root, ctx: '' });

    while(queue.length) {
        var cur = queue.shift();
        var parent = typeof cur.ref === 'object';
        visitor(cur, parent);
        // console.log('testing ' + cur.key + ' -> ' + typeof cur.ref);
        if (parent) {
            for(var key in cur.ref) {
                context = cur.ctx ? cur.ctx + '.' + cur.key : cur.key;
                queue.push({key: key, ref: cur.ref[key], ctx: context });
            }
        }
    }
}



