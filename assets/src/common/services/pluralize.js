angular.module('service.plural', []);
lodash.factory('Plural', function() {
	return window.pluralize; // assumes lodash has already been loaded on the page
});