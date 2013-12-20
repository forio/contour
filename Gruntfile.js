module.exports = function (grunt) {
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-bumpup');
    grunt.loadNpmTasks('grunt-tagrelease');


    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        watch: {
            less: {
                files: ['src/styles/**/*.less'],
                tasks: ['less:dev']
            },
            js: {
                files: ['src/scripts/**/*.js'],
                tasks: ['concat', 'uglify']
            }
        },
        bumpup: {
            options: {
                updateProps: {
                    pkg: 'package.json'
                }
            },
            files: ['package.json']
        },
        tagrelease: '<%= pkg.version %>',
        ver: {
            files: ['src/scripts/core/version.js']
        },
        less: {
            dev: {
                files: {
                    'examples/css/narwhal.css': 'src/styles/narwhal.less'
                }
            },
            // to generate distribution uncompressed versions
            uncompressed: {
                options: {
                    compress: false,
                    ieCompat: true,
                    yuicompress: false // Off until calc() bug is addressed.  https://github.com/yui/yuicompressor/issues/59
                },
                files: {
                    'dist/narwhal.css': 'src/styles/narwhal.less',
                    'examples/css/narwhal.css': 'src/styles/narwhal.less'
                }
            },
            production: {
                options: {
                    compress: true,
                    ieCompat: true,
                    yuicompress: false // Off until calc() bug is addressed.  https://github.com/yui/yuicompressor/issues/59
                },
                files: {
                    'dist/narwhal.min.css': 'src/styles/narwhal.less',
                    'examples/css/narwhal.min.css': 'src/styles/narwhal.less'
                }
            }
        },
        scripts: {
            libs: [
            ],
            core: [
                'src/scripts/core/narwhal-utils.js',
                'src/scripts/core/narwhal.js',
                'src/scripts/core/axis/y-axis.js',
                'src/scripts/core/cartesian.js',
                'src/scripts/core/version.js',


                'src/scripts/core/**/*.js',
            ],
            vis: [
                'src/scripts/visualizations/**/*.js'
            ],
            connectors: [
                'src/scripts/connectors/**/*.js'
            ]

        },
        include: {
            core: {
                src: ['<%= scripts.core %>'],
                dest: 'web/include/login/scripts.html'
            }
        },
        concat: {
            all: {
                src: ['src/scripts/header.js', '<%= scripts.core %>', '<%= scripts.vis %>', '<%= scripts.connectors %>', 'src/scripts/footer.js'],
                dest: 'dist/narwhal.js'
            }
        },
        uglify: {
            options: {
                sourceMap: function (fileName) {
                    return fileName.replace(/\.js$/, '.map');
                },
                banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
                        '<%= grunt.template.today("yyyy-mm-dd") %> */\n'
            },
            production: {
                files: {
                    'dist/narwhal.min.js': ['dist/narwhal.js']
                }
            }
        }
    });

    // Default task.
    grunt.registerTask('default', ['less:dev', 'watch:less']);

    grunt.registerTask('production', function (type) {
        type = type ? type : 'patch';
        ['bumpup:' + type, 'ver', 'concat', 'uglify', 'less:production', 'tagrelease'].forEach(function (task) {
            grunt.task.run(task);
        });
    });

    grunt.registerTask('linked', ['concat', 'uglify', 'less:uncompressed', 'less:production', 'watch']);

    grunt.registerMultiTask('ver', 'Update version file with what\'s in package.json', function () {
        var pkg = require('./package.json');
        this.data.forEach(function (f) {
            console.log('Updating ' + f + ' to version ' + pkg.version);
            grunt.file.write(f, "Narwhal.version = '" + pkg.version + "';");
        });
    });

    grunt.registerMultiTask('templates', 'Compiles underscore templates', function () {
        var _ = require('lodash');
        var options = this.options({
            separator: grunt.util.linefeed,
            templateSettings: {},
            templateNamespace: 'tmpl'
        });

        function getNamespace(ns) {
            var output = [];
            var curPath = 'App';
            if (ns !== 'App') {
                var nsParts = ns.split('.');
                nsParts.forEach(function(curPart, index) {
                    if (curPart !== 'App') {
                        curPath += '[' + JSON.stringify(curPart) + ']';
                        output.push(curPath + ' = ' + curPath + ' || {};');
                    }
                });
            }

            return {
                namespace: curPath,
                declaration: output.join('\n')
            };
        }

        this.files.forEach(function (f) {
            var namespaces = [];
            var output = f.src.filter(function (path) {
                if (!grunt.file.exists(path)) {
                    grunt.log.warn('Source file "' + filepath + '" not found.');
                    return false;
                } else {
                    return true;
                }
            }).map(function (path) {
                var src = grunt.file.read(path);
                var parts = path.match(/.+\/(?:template|tmpl)(?:s)?\/(.+).html/i)[1].split('/');
                var ns = _.initial(parts).join('.').replace(/(-.)/g, function () {
                    return arguments[0].substring(1).toUpperCase();
                });
                var name = _.last(parts).replace(/(-.)/g, function () {
                    return arguments[0].substring(1).toUpperCase();
                });
                var nsInfo = getNamespace([options.templateNamespace, ns].join('.'));
                var compiled;

                try {
                    compiled = _.template(src, false, options.templateSettings).source;
                } catch (e) {
                    grunt.log.error(e);
                    grunt.fail.warn('_.template failed to compile in file "' + filepath + '"');
                }

                if (options.prettify) {
                    compiled = compiled.replace(new RegExp('\n', 'g'), '');
                }

                namespaces = [].concat(namespaces, nsInfo.declaration.split('\n'));

                return nsInfo.namespace + '["' + name + '"] = ' + compiled + ';';
            });

            if (output.length < 1) {
                grunt.log.warn('Destination not written because compiled files were empty.');
            } else {
                if (options.templateNamespace !== false) {
                    output.unshift(_.uniq(namespaces).join('\n'));
                }

                output.unshift('(function (App, undefined) {');
                output.push('})( this["' + options.namespace + '"]);');

                grunt.file.write(f.dest, output.join(grunt.util.normalizelf(options.separator)));
                grunt.log.writeln('File "' + f.dest + '" created.');
            }
        });

    });

    grunt.registerMultiTask('include', 'Inserts all required script tags into the html at a special marked insertion point', function () {
        var _ = require('lodash');
        var options = this.options({
            separator: grunt.util.linefeed,
            attributes: '',
            webRoot: 'web/'
        });
        var reRoot = new RegExp('^' + options.webRoot);

        this.files.forEach(function (f) {
            var output = f.src.filter(function (path) {
                if (!grunt.file.exists(path)) {
                    grunt.log.warn('Source file "' + filepath + '" not found.');
                    return false;
                } else {
                    return true;
                }
            }).map(function (path) {
                return _.compact(['<script', options.attributes, 'src="' + path.replace(reRoot, '') + '"></script>']).join(' ');
            });

            if (output.length < 1) {
                grunt.log.warn('Destination not written because compiled files were empty.');
            } else {
                grunt.file.write(f.dest, output.join(grunt.util.normalizelf(options.separator)));
                grunt.log.writeln('File "' + f.dest + '" created.');
            }
        });

    });


};
