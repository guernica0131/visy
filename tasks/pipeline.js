/**
 * grunt/pipeline.js
 *
 * The order in which your css, javascript, and template files should be
 * compiled and linked from your views and static HTML files.
 *
 * (Note that you can take advantage of Grunt-style wildcard/glob/splat expressions
 * for matching multiple files.)
 */



// CSS files to inject in order
//
// (if you're using LESS with the built-in default config, you'll want
//  to change `assets/styles/importer.less` instead.)
var cssFilesToInject = [
    'styles/**/*.css'
];

var fontFilesToInject = [
    'bower_components/fontawesome/fonts/*'
];

// Client-side javascript files to inject in order
// (uses Grunt-style wildcard/glob/splat expressions)
var jsFilesToInject = [

    'bower_components/angular/angular.js',
    'bower_components/angular-ui-router/release/angular-ui-router.js',
    'bower_components/angular-ui-utils/modules/route/route.js',
    // Load sails.io before everything else
    'js/dependencies/sails.io.js',
    'bower_components/angular-sails/dist/angular-sails.js',
    'bower_components/lodash/dist/lodash.js',
    'bower_components/moment/moment.js',
    'bower_components/angular-moment/angular-moment.js',
    'bower_components/angular-translate/angular-translate.js',
    'bower_components/angular-translate-loader-static-files/angular-translate-loader-static-files.js',
    'bower_components/ng-table/ng-table.js',
    'bower_components/jquery/dist/jquery.min.js',
    'bower_components/isotope/jquery.isotope.js',
    'bower_components/angular-isotope/dist/angular-isotope.js',
    'bower_components/angular-foundation/mm-foundation.js',
    //Load sails.io before everything else
    'js/dependencies/sails.io.js',

    // Dependencies like jQuery, or Angular are brought in here
    //'js/dependencies/**/*.js',

    // All of the rest of your client-side js files
    // will be injected here in no particular order.
    'js/**/*.js',

    // All of the rest of your app scripts
    'src/**/*.js'
];

var imagesFilesToInject = [
    'images/**/*'

];


// Client-side HTML templates are injected using the sources below
// The ordering of these templates shouldn't matter.
// (uses Grunt-style wildcard/glob/splat expressions)
//
// By default, Sails uses JST templates and precompiles them into
// functions for you.  If you want to use jade, handlebars, dust, etc.,
// with the linker, no problem-- you'll just want to make sure the precompiled
// templates get spit out to the same file.  Be sure and check out `tasks/README.md`
// for information on customizing and installing new tasks.
var templateFilesToInject = [
    'src/**/*.tpl.html'
];



// Prefix relative paths to source files so they point to the proper locations
// (i.e. where the other Grunt tasks spit them out, or in some cases, where
// they reside in the first place)
module.exports.cssFilesToInject = cssFilesToInject.map(function(path) {
    return '.tmp/public/' + path;
});
module.exports.jsFilesToInject = jsFilesToInject.map(function(path) {
    return '.tmp/public/' + path;
});
module.exports.templateFilesToInject = templateFilesToInject.map(function(path) {
    return 'assets/' + path;
});

// module.exports.imagesFilesToInject = imagesFilesToInject.map(function(path) {
//     return path;
// });

// module.exports.fontFilesToInject = fontFilesToInject.map(function(path) {
//     return path;
// });