module.exports = function (grunt) {
	grunt.registerTask('default', ['compileAssets', 'html2js:dev' ,'linkAssets',  'watch']);
};
