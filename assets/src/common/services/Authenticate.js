/*
 * Our Authticate service manages client-side user authentication
 */
angular.module('service.Authenticate', ['lodash', 'services', 'ngSails'])

.factory('Authenticate', ['$q', 'lodash', 'utils', '$sails', 'config', "$rootScope",
    function($q, lodash, utils, $sails, config, $rootScope) {
        /*
         * Our user object manages the authenticated user and roles
         * @param {boolean} root
         * @param {function} callback funtion
         */
        var User = function(root, init) {
            this.url = utils.prepareUrl('auth');
            this.setScope = function(user) {
                if (!user || !lodash.isEmpty(user) || user.none) {
                    $rootScope.user = user;
                    $rootScope.authenticated = true;
                } else {
                    $rootScope.user = {};
                    $rootScope.authenticated = false;
                }

            };
            // if this is the root instance (meaning only on instance, we instantiate )
            if (root) {
                var self = this;
                this.init().then(function(user) {
                    // we can bootstap user auth
                    if (init && lodash.isFunction(init))
                        init(user);
                });
                // we register the instance the the socket listener. That way we can 
                // register any changes made throughout the application
                this.register(this.manageAuth.bind(this));
            }
        };
        /*
         * Getter function for user and autheticated variables
         * @param {string} key for accessing the variables. If empty, object return
         * @return {string}, {Object}
         */
        User.prototype.get = function(key) {
            var variables = {
                authenticated: $rootScope.authenticated,
                user: $rootScope.user,
                init: $rootScope.authInit
            }

            if (!key) // if we don't have a key return them all
                return variables;

            return variables[key];

        };
        /*
         * We user manauge auth for the registration function. It sets the user
         * once we recieve the update from the socket.
         * @param {Object} socket message.
         */
        User.prototype.manageAuth = function(message) {
            // if we have a user and there is no error, we set the scope 
            if (message.verb == 'login' && !message.error && message.user)
                this.setScope(message.user); // we set the user
            else if (message.verb == 'logout')
                this.setScope({}); // we set no user
        };
        /*
         * Register assigns a callback to the auth socket
         * @param {User~requestCallback} callback
         */
        User.prototype.register = function(callback) {
            $sails.on('auth', callback);
        };
        /*
         * This function the the actual logging in the user
         * @param {object} params - the form credentials of the user
         */
        User.prototype.login = function(params) {

            var self = this,
                deferred = $q.defer();
            $sails.post('/auth/local', params, function(res) {
                return deferred.resolve(res); // resolve the response
            });
            return deferred.promise;
        };

        /*
         * Logs the user out of the system
         */
        User.prototype.logout = function() {
            var self = this,
                deferred = $q.defer();
            $sails.get(this.url + '/logout', function(res) {
                return deferred.resolve(res); // respove the response
            });

            return deferred.promise;
        };
        /*
         * Asks the api if the user can perform some action
         * @param {array|string} can - can a user perform a certain task
         * @param {number} user - id of the user we want to find
         * @param {string} space - the space we would like to search
         * @return {promise} - A promise object for if a user can perform said task
         */
        User.prototype.can = function(can, user, space) {
            var self = this,
                deferred = $q.defer(),
                params = {};

            if (!can) {
                deferred.reject("I need to a string or an array of strings to find if a user has permission");
                return deferred.promise;
            }

            params.can = can;

            if (user)
                params.user = user;

            if (space)
                params.space = space;

            $sails.get('/api/user/can', params, function(res) {
                return deferred.resolve(res);
            });


            return deferred.promise;
        };

        /*
         * When the site first loads or on refresh, we check the web server to
         * see if the user is logged in.
         */
        User.prototype.init = function() {

            var self = this,
                deferred = $q.defer();

            $sails.on('connect', function() {
                $sails.get(self.url + '/user', function(user) {
                    $rootScope.authInit = true; // we set authinti to trigger
                    return deferred.resolve(user); // those areas of the app waiting on authentication
                });
            });

            return deferred.promise;

        };

        return {
            User: User
        }

    }
]);