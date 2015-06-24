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

    ]).config(['$locationProvider', '$urlRouterProvider', '$stateProvider',
        function($locationProvider, $urlRouterProvider, $stateProvider) {

            $locationProvider.html5Mode(true).hashPrefix('!');

            $stateProvider.state('app', {
                resolve: {
                    init: ['Visy', function(Visy) {

                        return Visy.init().then(function(res) {
                            return res;
                        }, function(why) {
                            return why;
                        });
                    }]

                },
                url: '',
                controller: 'AppCtrl',
                templateUrl: 'index.tpl.html'

            })


            ;
        }
    ])

    .service('Visy', ['$rootScope', '$http', '$q', 'Authenticate', 'utils',
        function($rootScope, $http, $q, Authenticate, utils) {
            /*
             * init 
             * @description: used to bring in the user, domain, and
             * access control. 
             * @return {Promise} 
             */
            this.init = function() {
                var deferred = $q.defer();
                var self = this;
                // @TODO:: consider
                var authenticate = function(domain) {

                    new Authenticate.User(true, function(u, space) {
                        // it's simply pulling the user for a
                        // page load event
                        if (!u.verb)
                            return deferred.resolve(u);

                        // this means we have a socket event and can do site-level cleanup
                        // @TODO
                        switch (u.verb) {
                            case 'login':
                                break;
                            case 'logout':
                                break;
                            default:
                        }

                    });

                };

                this.setDomain().then(authenticate, console.error);

                return deferred.promise;

            };

            /*
             * setDomain
             *
             * @description : pulls domain data from the api
             * @param {function} callback - calls back when complete
             * @todo ::: will need considerable testing
             */
            this.setDomain = function() {
                var deferred = $q.defer(),
                    url = utils.prepareUrl('domain') + '/set';
                // cannot pull using sockets
                $http.get(url, {
                        establish: true
                    })
                    .success(deferred.resolve)
                    .error(deferred.reject);

                return deferred.promise;
            };

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
                //  console.log("Thinking", $scope.ready);
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