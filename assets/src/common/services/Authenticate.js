angular.module('service.Authenticate', ['lodash', 'services', 'ngSails'])

.factory('Authenticate', ['$q', 'lodash', 'utils', '$sails', 'config', "$rootScope",
    function($q, lodash, utils, $sails, config, $rootScope) {


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

        User.prototype.get = function(key) {
            var variables = {
                authenticated: $rootScope.authenticated,
                user: $rootScope.user,
                init: $rootScope.authInit
            }

            if (!key)
                return variables;

            return variables[key];

        };

        User.prototype.manageAuth = function(message) {

            if (message.verb == 'login' && !message.error && message.user)
                this.setScope(message.user);
            else if (message.verb == 'logout')
                this.setScope({});
        };

        User.prototype.register = function(callback) {
            $sails.on('auth', callback);
        };

        User.prototype.login = function(params) {

            var self = this,
                deferred = $q.defer();
            $sails.post('/auth/local', params, function(res) {
                return deferred.resolve(res);
            });
            return deferred.promise;
        };

        User.prototype.logout = function() {
            var self = this,
                deferred = $q.defer();
            $sails.get(this.url + '/logout', function(res) {
                //self.current.set({});
                return deferred.resolve(res);
            });

            return deferred.promise;
        };

        User.prototype.init = function() {

            var self = this,
                deferred = $q.defer();

            $sails.on('connect', function() {
                $sails.get(self.url + '/user', function(user) {
                    $rootScope.authInit = true;
                    return deferred.resolve(user);
                });
            });

            return deferred.promise;

        };

        var on = function(callback) {
            $sails.on('auth', callback);
        };


        return {
            User: User,
            on: on
        }

    }
]);