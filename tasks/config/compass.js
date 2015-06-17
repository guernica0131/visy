/**
 * Compiles Compass files into CSS.
 *
 * ---------------------------------------------------------------
 *
 * Only the `assets/styles/app.scss` is compiled.
 * This allows you to control the ordering yourself, i.e. import your
 * dependencies, mixins, variables, resets, etc. before other stylesheets)
 *
 * For usage docs see:
 * 		https://github.com/gruntjs/grunt-contrib-less
 */
module.exports = function(grunt) {

    grunt.config.set('compass', {
        dev: {
            options: {
                importPath: ["assets/bower_components/foundation/scss"],
                sassDir: 'assets/styles/',
                cssDir: '.tmp/public/styles/',
               // bundleExec:true, 
               // watch: true,
                quiet: true

            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-compass');
};