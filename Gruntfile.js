module.exports = function (grunt) {
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-bumpup');
    grunt.loadNpmTasks('grunt-contrib-jasmine');
    grunt.loadNpmTasks('grunt-tagrelease');
    grunt.loadNpmTasks('grunt-contrib-jshint');

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        watch: {
            less: {
                files: ['src/styles/**/*.less'],
                tasks: ['less:dev']
            },
            js: {
                files: ['src/scripts/**/*.js', 'test/specs/**/*.js'],
                tasks: ['uglify', 'jshint', 'jasmine']
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
            files: ['src/scripts/version.js']
        },
        releaseNotes: {
            files: [],
            options: {
                dest: 'dist/contour-release-notes.txt'
            }
        },
        less: {
            dev: {
                files: {
                    'examples/css/contour.css': 'src/styles/contour.less',
                    'dist/contour.css': 'src/styles/contour.less'
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
                    'dist/contour.css': 'src/styles/contour.less',
                    'examples/css/contour.css': 'src/styles/contour.less'
                }
            },
            production: {
                options: {
                    compress: true,
                    ieCompat: true,
                    yuicompress: false // Off until calc() bug is addressed.  https://github.com/yui/yuicompressor/issues/59
                },
                files: {
                    'dist/contour.min.css': 'src/styles/contour.less',
                    'examples/css/contour.min.css': 'src/styles/contour.less'
                }
            }
        },
        scripts: {
            libs: [
            ],
            core: [
                'src/scripts/core/contour-utils.js',
                'src/scripts/core/contour.js',
                'src/scripts/core/axis/y-axis.js',
                'src/scripts/core/cartesian.js',
                'src/scripts/core/exportable.js',
                'src/scripts/version.js',


                'src/scripts/core/**/*.js',
            ],
            vis: [
                'src/scripts/visualizations/**/*.js'
            ]
        },
        copy: {
            webcomponents: {
                files: [{
                    expand: true,
                    cwd: 'src/',
                    src: 'webcomponents/**',
                    dest: 'dist'
                }]
            }
        },
        include: {
            core: {
                src: ['<%= scripts.core %>'],
                dest: 'web/include/login/scripts.html'
            }
        },
        concat: {
            all: {
                src: ['src/scripts/header.js', '<%= scripts.core %>', '<%= scripts.vis %>'],
                dest: 'dist/contour.js'
            }
        },
        uglify: {
            options: {
                wrap: true,
                banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
                        '<%= grunt.template.today("yyyy-mm-dd") %> */\n'
            },
            minify: {
                options: {
                    sourceMapIncludeSources: true,
                    sourceMap: true,
                    mangle: true,
                    compress: true,
                    preserveComments: false
                },
                files: [{
                    src: ['src/scripts/header.js', '<%= scripts.core %>', '<%= scripts.vis %>', 'src/scripts/footer.js'],
                    dest: 'dist/contour.min.js'
                }]
            },

            concatenate: {
                options: {
                    sourceMapIncludeSources: true,
                    sourceMap: false,
                    mangle: false,
                    compress: false,
                    preserveComments: 'all',
                    beautify: true
                },

                files: [{
                    src: ['src/scripts/header.js', '<%= scripts.core %>', '<%= scripts.vis %>', 'src/scripts/footer.js'],
                    dest: 'dist/contour.js'
                }]

            },

            dev: {
                options: {
                    sourceMapIncludeSources: true,
                    sourceMap: true,
                    mangle: false,
                    compress: false,
                    preserveComments: 'all',
                    // beautify: true
                },

                files: [{
                    src: ['src/scripts/header.js', '<%= scripts.core %>', '<%= scripts.vis %>', 'src/scripts/footer.js'],
                    dest: 'dist/contour.min.js'
                }]
            }
        },

        jshint: {
            options: {
                jshintrc: true,
            },

            files: {
                src: ['src/scripts/**/*.js']
            }
        },

        jasmine: {
            contour: {
                src: [
                    'src/scripts/core/contour-utils.js',
                    'src/scripts/core/contour.js',
                    'src/scripts/core/axis/y-axis.js',
                    'src/scripts/core/cartesian.js',
                    'src/scripts/version.js',

                    'src/scripts/core/**/*.js',
                    'src/scripts/visualizations/null.js',
                    'src/scripts/visualizations/**/*.js',
                ],
                options: {
                    vendor: [
                        'examples/js/vendor/d3.min.js',
                        'examples/js/vendor/jquery.js',
                        'examples/js/vendor/lodash.js'
                    ],
                    specs: [
                        'tests/specs/**/*-spec.js'
                    ]
                }
            }
        }
    });

    // Default task.
    grunt.registerTask('default', ['uglify:concatenate', 'uglify:dev', 'less:dev', 'copy', 'watch', 'jshint', 'jasmine']);

    grunt.registerTask('test', ['jasmine']);

    grunt.registerTask('lint', ['jshint']);

    grunt.registerTask('production', ['ver', 'uglify:concatenate', 'uglify:minify',  'less:production', 'less:uncompressed', 'copy', 'releaseNotes']);

    grunt.registerTask('release', function (type) {
        type = type ? type : 'patch';
        ['jshint','jasmine', 'bumpup:' + type, 'ver', 'uglify:concatenate', 'uglify:minify', 'less:production', 'less:uncompressed', 'copy', 'releaseNotes', 'tagrelease'].forEach(function (task) {
            grunt.task.run(task);
        });
    });

    grunt.registerTask('linked', ['uglify:concatenate', 'uglify:dev', 'less:uncompressed', 'less:production','copy','watch',  'jshint', 'jasmine']);


    grunt.registerMultiTask('releaseNotes', 'Generate a release notes file with changes in git log since last tag', function () {
        var options = this.options({
            dest: 'dist/release-notes.txt'
        });

        var cmd = 'git log --pretty="format:  * %s"  `git describe --tags --abbrev=0`..HEAD > ' + options.dest;
        grunt.log.verbose.writeln('executing', cmd);
        var log = require('shelljs').exec(cmd).output;
        grunt.file.write(options.dest, log);
    });

    grunt.registerMultiTask('ver', 'Update version file with what\'s in package.json', function () {
        var pkg = require('./package.json');
        this.data.forEach(function (f) {
            console.log('Updating ' + f + ' to version ' + pkg.version);
            grunt.file.write(f, "Contour.version = '" + pkg.version + "';");
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
