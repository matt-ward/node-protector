module.exports = function(grunt) {

    // Add the grunt-mocha-test tasks.
    grunt.loadNpmTasks('grunt-mocha-test');
    grunt.loadNpmTasks('grunt-contrib-jshint');

    grunt.initConfig({
        // Configure a mochaTest task
        mochaTest: {
            test: {
                options: {
                    reporter: 'spec'
                },
                src: ['test/**/*.js']
            }
        },
        jshint: {
            options: {
                curly: true,
                eqeqeq: true,
                eqnull: true,
                browser: true,
                node: true,
                globals: {
                    jQuery: true
                }
            },
            uses_defaults: ['lib/**/*.js'],
            with_overrides: {
                options: {
                    curly: false,
                    undef: true

                },
                files: {
                    src: ['lib/**/*.js']
                }
            }
        }
    });

    grunt.registerTask('default', ['jshint', 'mochaTest']);

};