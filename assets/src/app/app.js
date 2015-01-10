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


            var Visy = function(params) {
                this.permits = [];
                this.all = CAN().all;
            };

            Visy.prototype.init = function() {
                var deferred = $q.defer();

                $rootScope.ready = false;
                $rootScope.basePermits = {};

                $rootScope.permits = {};

                $rootScope.$broadcast('ready', false);

                var self = this;

                $rootScope.adminOptions = this.all;

                self.all.forEach(function(can, i) {
                    self.permits.push(can.permit);
                });

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