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
        'vissy.viewA',
        'vissy.viewB'
        //'rxDataTable',
        //'ngTable',
    ])




    // .config(['$stateProvider', '$urlRouterProvider', '$locationProvider',
    //     function myAppConfig($stateProvider, $urlRouterProvider, $locationProvider) {
    //         // $urlRouterProvider.otherwise( '/home' );
    //         $urlRouterProvider.otherwise(function($injector, $location) {

    //             // if ($location.$$url === '/') {
    //             // 	window.location = '/home';
    //             // }
    //             // else {
    //             // 	// pass through to let the web server handle this request

    //             // 	window.location = $location.$$absUrl;
    //             // }
    //         });
    //         $locationProvider.html5Mode(true);
    //     }
    // ])


    // .run(function run() {
    //     moment.lang('en');
    // })

    .controller('AppCtrl', ['$scope', "Authenticate",
        function AppCtrl($scope, Authenticate) {
            console.log("Angular app ready");
            // we set the authenticated user
            new Authenticate.User(true, function(user) {
                console.log("User auth boostrap");
                // for permission testing
                 var user = new Authenticate.User();
                 user.can('can_test_auth').then(function(res) {
                    console.log("What'd he say", res);
                 }, function(reason) {
                    console.log("Rejected",reason);
                 });
            });
          

        }
    ]);

})();