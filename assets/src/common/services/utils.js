angular.module('services.utils', ['lodash', 'ngSails'])

.service('utils', ['lodash', 'config', '$sails', '$q', function(lodash, config, $sails, $q) {

    var self = this;

    this.connected = function(callback) {

        if ($sails._raw.connected)
            return callback();

        $sails.on('connect', function() {
            callback();
        });

    };

    this.connect = function(method, url, params) {

            var deferred = $q.defer();


            this.connected(function() {
                $sails[method](url, params)
                    .success(deferred.resolve)
                    .error(deferred.reject);
            });

            return deferred.promise;

    };

    this.register = function(listen, callback) {
    	$sails.on(listen, callback);
    };

    this.prepareUrl = function(uriSegments) {

        if (lodash.isNull(config.apiUrl)) {
            apiUrl = 'https://api.test';
        } else {
            apiUrl = config.apiUrl;
        }

        return apiUrl + "/" + uriSegments;
    };

    this.showDatetime = function(string, format) {
        return moment(string).fromNow();
    };

    this.snakeCase = function(str) {
    	return str.replace(/([A-Z])/g, '_$1').toLowerCase();
    };

}]);