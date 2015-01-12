(function() {

    'use strict';

    angular.module('visy', [
        'ui.router',
        'ngSails',
        'models',
        'angularMoment',
        'angularMoment',
        'mm.foundation',
        'templates-app',
        'services',
        'directives',
        'vissy.index',
        'vissy.viewA',
        'vissy.viewB',
        'vissy.admin'
        //'rxDataTable',
        //'ngTable',
    ]).config(['$locationProvider', "$urlRouterProvider",
        function($locationProvider, $urlRouterProvider) {

            $locationProvider.html5Mode(true).hashPrefix('!');
            // trailing slash issue https://github.com/angular-ui/ui-router/issues/50
            $urlRouterProvider.rule(function($injector, $location) {
                var re = /(.+)(\/+)(\?.*)?$/
                var path = $location.url();
                if (re.test(path)) {
                    return path.replace(re, '$1$3')
                }
                return false;
            });


        }
    ])

    .service('Visy', ['$rootScope', '$http', '$q', 'CAN', 'Authenticate', 'utils',
        function($rootScope, $http, $q, CAN, Authenticate, utils) {

            /*
            * Our constructor for our visy object
            */
            var Visy = function(params) {
                this.permits = [];
                this.all = CAN().all;
            };

            /*
            * init 
            * @description: used to bring in the user, domain, and
            * access control. 
            * @return {Promise} 
            */
            Visy.prototype.init = function() {
                var deferred = $q.defer();

                $rootScope.ready = false;
                $rootScope.$broadcast('ready', false);

                $rootScope.basePermits = {}; // @TDOD:: need to consider if this is needed in later versions
                $rootScope.permits = {}; 

                var self = this;

                $rootScope.adminOptions = this.all; // @TODO:: Simply

                // we are going to ask the api if the user has permission
                // to access these following permits
                self.all.forEach(function(can, i) {
                    self.permits.push(can.permit);
                });
                // @TODO:: consider
                var authenticate = function(domain) {

                    // we may need the domain parameter at some point
                    self.setAuthenticate(function(err, res) {

                        if (err) {
                            $rootScope.basePermits = {};
                            $rootScope.permits = {};

                            return deferred.resolve(err);
                        }

                        $rootScope.basePermits = res;
                        $rootScope.ready = true;
                        $rootScope.$broadcast('ready', true);
                        deferred.resolve();
                    });

                };

                self.setDomain().then(function(domain) {
                    console.log(domain);
                    authenticate(domain);
                }, function(why) {
                    console.error(why);
                });



                return deferred.promise;

            };

            /*
            * setAuthenticate
            *
            * @description : pulls the authentication data
            * @param {function} callback - calls back when complete
            * @todo ::: consider as a promise
            */
            Visy.prototype.setAuthenticate = function(callback) {

                var self = this;

                new Authenticate.User(true, function(user, space) {
                    // for permission testing
                    var user = new Authenticate.User();
                    //console.log("User auth boostrap", user.get('user'));
                    if (user.get('user') && user.get('user').id)
                        user.can(self.permits).then(function(res) {
                            callback(null, res);
                        }, function(why) {
                            callback(why);
                        });
                    else {
                        callback('User is unauthenticated.');
                    }

                });

            };

            /*
            * setDomain
            *
            * @description : pulls domain data from the api
            * @param {function} callback - calls back when complete
            * @todo ::: will need considerable testing
            */
            Visy.prototype.setDomain = function() {
                var deferred = $q.defer(),
                    url = utils.prepareUrl('domain') + '/set';


                $http.get(url, {
                    establish: true
                })
                    .success(deferred.resolve)
                    .error(deferred.reject);

                return deferred.promise;

            };


            return Visy;

        }
    ])


    .controller('AppCtrl', ['$scope', '$log', 'Visy', 'config',
        function AppCtrl($scope, $log, Visy, config) {


            $scope.brand = config.brand;
            // used for template debugging
            $scope.$log = $log.log;

            var visy = new Visy();

            visy.init();


        }
    ]);

})();