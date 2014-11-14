(function() {

	'use strict';

    angular.module('vissy', [
        'ui.router',
        'ngSails',
        'angularMoment',
        //'lodash',
        'angularMoment',
        'mm.foundation',
        'templates-app',
        //'services',
        //'models',
        //'rxDataTable',
        'ngTable',
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

    .controller('AppCtrl', ['$scope',
        function AppCtrl($scope) {
            console.log("Angular app ready");
        }
    ]);

})();