(function() {

    'use strict';

    angular.module('visy', [
        'ui.router',
        'ngSails',
        'models',
        'angularMoment',
        'templates-app',
        'services',
        'views',
        'directives',
        //'rxDataTable',
        //'ngTable',
    ]).config(['$locationProvider', '$urlRouterProvider', '$stateProvider',
        function($locationProvider, $urlRouterProvider, $stateProvider) {

            // $locationProvider.html5Mode(true).hashPrefix('!');
            // // trailing slash issue https://github.com/angular-ui/ui-router/issues/50
            // $urlRouterProvider.rule(function($injector, $location) {
            //     var re = /(.+)(\/+)(\?.*)?$/
            //     var path = $location.url();
            //     if (re.test(path)) {
            //         return path.replace(re, '$1$3')
            //     }
            //     return false;
            // });
            $locationProvider.html5Mode(true).hashPrefix('!');

            $stateProvider.state('app', {
                resolve: {
                    init: ['Visy', function(Visy) {
                        var visy = new Visy();
                        return visy.init().then(function(res) {
                            return res;
                        }, function(why) {
                            return why;
                        });
                    }]

                },
                url: '',
                controller: 'AppCtrl',
                templateUrl: 'index.tpl.html'

            });


           // $urlRouterProvider.otherwise('/');

            // .config( ['$stateProvider', function config( $stateProvider ) {
            //         $stateProvider.state( 'Index', {
            //      url: '/',
            //      views: {
            //          "index": {
            //              controller: 'IndexCtrl',
            //              templateUrl: 'index/index.tpl.html'
            //          }
            //      }
            //  });
            // }])


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

                            return deferred.reject({
                                err:err,
                                domain: domain
                            });
                        }

                        $rootScope.basePermits = res;
                        $rootScope.ready = true;
                        $rootScope.$broadcast('ready', true);
                        deferred.resolve({
                            res: res,
                            domain: domain
                        });
                    });

                };

                self.setDomain().then(function(domain) {
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

                new Authenticate.User(true, function(u, space) {
                    // for permission testing
                    var user = new Authenticate.User();
                    //console.log("User auth boostrap", user.get('user'));
                    

                    if (user.get('user') && user.get('user').id) { 
                        user.can(self.permits).then(function(res) {
                            callback(null, res.data);
                        }, function(why) {
                            callback(why);
                        });
                    } else {
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

    /*
     * AppCtrl
     *
     * The entry controller for the application scope
     */
    .controller('AppCtrl', ['$scope', '$log', 'config', '$sce',
        function AppCtrl($scope, $log, config, $sce) {
            // this is dynamic and could be pulled from 
            // domain specific data. @TODO:: Consider
            $scope.brand = config.brand;
            // used for template debugging
            $scope.$log = $log.log;

            $scope.trust = function(content) {
              return $sce.trustAsHtml(content);
            };



        }
    ])


    .constant('CAN', function() {

        var all = [{
                permit: 'can_find_user',
                name: 'Users',
                model: 'user',
                route: 'users'
            }, {
                permit: 'can_find_role',
                name: 'Roles',
                model: 'role',
                route: 'roles'
            }, {
                permit: 'can_find_permission',
                name: 'Permissions',
                model: 'permission',
                route: 'permissions'
            },
            //  { // I a removing because a domain should be done at the site level
            //     permit: 'can_find_domain',
            //     name: 'Domains',
            //     model: 'domain',
            //     route: 'domains'
            // }, 
            {
                permit: 'can_find_portal',
                name: 'Portals',
                model: 'portal',
                route: 'portals'
            }, {
                permit: 'can_find_collection',
                name: 'Collections',
                model: 'collection',
                route: 'collections'
            }, {
                permit: 'can_find_document',
                name: 'Documents',
                model: 'document',
                route: 'documents'
            }, {
                permit: 'can_find_tag',
                name: 'Tags',
                model: 'tag',
                route: 'tags'
            }, {
                permit: 'can_find_category',
                name: 'Categories',
                model: 'category',
                route: 'categories'
            }
        ];

        return {
            all: all
        }
    })

    .directive('thinking', [function() {

        return {
            template: '<div><div class="thinker" ng-hide="ready"><i class="fa fa-spinner fa-spin fa-5x"></i><span> {{message}}</span></div><div ng-show="ready" ng-transclude></div></div>',
            restrict: 'E',
            scope: {
                ready: '=',
                message: '='
            },
            transclude: true,
            controller: function($scope) {
                console.log("Thinking", $scope.ready);
            }
        }


    }])

    ;


    angular.module('views', [ 
        'vissy.index',
        'vissy.admin',
        'vissy.login'
    ]);

}());