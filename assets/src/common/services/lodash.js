var lodash = angular.module('lodash', []);
lodash.factory('lodash', function() {

    function capitalize(string) {
        return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
    }

    _.mixin({
        'capitalize': capitalize
    });
    

    return window._; // assumes lodash has already been loaded on the page
});