
var glob = require('glob');
var fs = require('fs');
var confdox = require('./config-dox');
var markdox = require('markdox');
var async = require('async');
var path = require('path');
var _ = require('lodash');

var docFolder = __dirname + '/documentation/';
var configDocFolder = docFolder + 'config/';

var docSrcFolder = __dirname + '/src/documentation/';
var configTemplateDocFolder = docSrcFolder + '/config/';

var propTemplatePath = docSrcFolder + 'prop-template.md';

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
var filesToCopy = ['index.html', 'docs.css', 'markdown.js', 'overview.md', 'quickstart.md', 'key_concepts.md', 'supported_data_formats.md'];

generatePerFileDoc(allFiles);
generateAllFilesDoc(allFiles);
generateConfigObjectDoc(allFiles);

copyDocViewer(filesToCopy);


function copyDocViewer(srcFiles) {
    srcFiles.forEach(function (file) {
        var src = docSrcFolder + file;
        var dst = docFolder + file;
        if(fs.existsSync(docSrcFolder + file)) {
            console.log('copying file ' + src + ' -> ' + dst);
            copyFile(src, dst, function(err) { if(err) console.log(err); });
        } else {
            console.log('file ' + src + ' does not exists!');
        }
    });
}

function copyFile(source, target, cb) {
    var cbCalled = false;

    var rd = fs.createReadStream(source);
    rd.on("error", function(err) {
        done(err);
    });
    var wr = fs.createWriteStream(target);
    wr.on("error", function(err) {
        done(err);
    });
    wr.on("close", function(ex) {
        done();
    });
    rd.pipe(wr);

    function done(err) {
        if (!cbCalled) {
            cb(err);
            cbCalled = true;
        }
    }
}

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
        var output = docFolder + path.basename(file) + '.md';
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
    var output = docFolder + 'all.md';
    markdox.process(allFiles, {output:output}, function() {
        console.log('File `all.md` generated with success');
    });
}


function generateConfigObjectDoc(files) {
    var configObject = {};
    files.forEach(function (file) {
        var js = fs.readFileSync(file).toString();
        var res = confdox.parseConfigObject(js);

        // the order of the files is from generic to specific
        // and we want to document through the global config file
        // the most generic version of the config property
        configObject = _.merge({}, res, configObject);
    });

    fs.readFile(propTemplatePath, 'utf8', function (err, propTemplate) {

        var menu = {};
        var namespace = function (obj, path) {
            var parts = path.split('.');
            while(parts.length) {
                var sub = parts.shift();
                if(!obj[sub]) obj[sub] = {};
                obj = obj[sub];
            }

            return obj;
        };

        // we want to traverse the config file
        bfs(configObject, 'config', function (k) {
            var fileName = (k.ctx ? k.ctx + '.' + k.key : k.key) + '.md';
            var fullPath = configDocFolder + fileName;
            var templateFileName = configTemplateDocFolder + (k.ctx ? k.ctx + '.' + k.key : k.key) + '.md';
            var template;

            if(fs.existsSync(templateFileName)) {
                template = fs.readFileSync(templateFileName, 'utf8');
            } else {
                var compiled = _.template(propTemplate);
                template = compiled({
                    name: k.key,
                    type: '<%= type %>',
                    notes: '<% if(notes) { %><%= notes %><% } %>',
                    defaultValue: '<% if(defaultValue !== "[object Object]") { %>*default: <%= defaultValue %>* <% }%>'
                });

                fs.writeFileSync(templateFileName, template, 'utf8');
            }

            // bake and write out the template into an .md file
            var cooked = _.template(template)({
                type: typeof k.ref,
                notes: '',
                defaultValue: k.ref === null ? 'null' : k.ref === undefined ? 'undefined' : k.ref.toString()
            });

            fs.writeFile(fullPath, cooked, 'utf8');

            // update the menu object
            namespace(menu, [k.ctx, k.key].join('.')).path = fileName;
        });

        // write out the menu object
        fs.writeFileSync(configDocFolder + 'menu.json', JSON.stringify(menu), 'utf8');

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



