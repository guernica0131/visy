module.exports = function (grunt) {
	grunt.registerTask('syncAssets', [
		'jst:dev',
		'html2js:dev',
		'less:dev',
		'sync:dev',
		'coffee:dev'
	]);
};
