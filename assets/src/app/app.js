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


    .controller('AppCtrl', ['$scope', '$window', "Authenticate", 'config', 'CAN', '$log' ,
        function AppCtrl($scope, $window, Authenticate, config, CAN, $log) {

            $scope.brand = config.brand;
            $scope.adminOptions = CAN().all;

            $scope.$log = $log.log;

            $scope.findPermits = {};

            $scope.permits = {};


            $scope.ready = false;
            $scope.$broadcast('ready', false);

            var permits = [];


            CAN().all.forEach(function(can, i) {
                permits.push(can.permit);
            });

            // we set the authenticated user
            new Authenticate.User(true, function(user, space) {
                // for permission testing
                var user = new Authenticate.User();
                //console.log("User auth boostrap", user.get('user'));
                if (user.get('user') && user.get('user').id)
                    user.can(permits).then(function(res) {
                        //console.log("My respinse" , res);
                        $scope.findPermits = res;
                        $scope.ready = true;
                        $scope.$broadcast('ready', true);

                    }, function(why) {
                        $scope.findPermits = {};
                        $scope.permits = {};
                        console.error(why);
                    });
                else {
                    $scope.permits = {};
                    $scope.findPermits = {};
                }



            });


        }
    ]);

})();