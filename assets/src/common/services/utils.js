angular.module('services.utils', ['lodash', 'ngSails', 'angularMoment'])

.service('utils', ['lodash', 'config', '$sails', '$q', function(lodash, config, $sails, $q) {

    var self = this;
    /*
     * connected
     *
     * ensures that the sockets are connected before
     * attempting to send data. Calls back when ready
     * @param {function} callback
     */
    this.connected = function(callback) {

        if ($sails._raw.connected)
            return callback();

        $sails.on('connect', function() {
            callback();
        });

    };

    /* connect
     *
     * @description : generic function for connecting to the we socket
     * @param {string} method - get post put delete
     * @param {string} url - the url we are connecting to
     * @param {object} params - any parameters we want to include
     * @return {promise} resolved once we get a valid response from the web server
     */
    this.connect = function(method, url, params) {

        var deferred = $q.defer();


        this.connected(function() {
            $sails[method](url, params)
                .success(deferred.resolve)
                .error(deferred.reject);
        });

        return deferred.promise;

    };

    /*
     * register
     *
     * @description : registers a function to the socket callback for changes.
     * @param {function} callback : calback that will be registered
     */

    this.register = function(listen, callback) {
        $sails.on(listen, callback);
    };
    
    /*
    * prepareUrl
    *
    * preps the url for connecting to the api
    * @param {string} uriSegments - appends to the url
    */
    this.prepareUrl = function(uriSegments) {

        if (lodash.isNull(config.apiUrl)) {
            apiUrl = 'https://api.test';
        } else {
            apiUrl = config.apiUrl;
        }

        return apiUrl + "/" + uriSegments;
    };

    /*
    * showDatetime
    *
    * shows time and date
    * @param {string} str - the string to be converted
    */
    this.showDatetime = function(string, format) {
        return moment(string).fromNow();
    };

    /*
    * snakeCase
    *
    * converts camelcase into snakeCase
    * @param {string} str - the string to be converted
    */
    this.snakeCase = function(str) {
        return str.replace(/([A-Z])/g, '_$1').toLowerCase();
    };

}]);