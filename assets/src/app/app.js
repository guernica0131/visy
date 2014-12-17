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
        'vissy.viewB'
        //'rxDataTable',
        //'ngTable',
    ])

    .constant('CAN', function() {

        var all = [{
                permit: 'can_find_user',
                name: 'Users',
                model: 'user'
            }, {
                permit: 'can_find_role',
                name: 'Roles',
                model: 'role'
            }, 
            // {
            //     permit: 'can_create_role',
            //     name: 'Create Role',
            //     model: 'role'
            // },

            // {
            //     permit: 'can_edit_role',
            //     name: 'Edit Role',
            //     model: 'role'
            // },

            // {
            //     permit: 'can_destroy_role',
            //     name: 'Delete Role',
            //     model: 'role'
            // },

            {
                permit: 'can_find_permission',
                name: 'Permissions',
                model: 'permission'
            }, {
                permit: 'can_find_domain',
                name: 'Domains',
                model: 'domain'
            }, {
                permit: 'can_find_portal',
                name: 'Portals',
                model: 'portal'
            }, {
                permit: 'can_find_collection',
                name: 'Collections',
                model: 'collection'
            }, {
                permit: 'can_find_document',
                name: 'Documents',
                model: 'document'
            }, {
                permit: 'can_find_tag',
                name: 'Tags',
                model: 'tag'
            }, {
                permit: 'can_find_category',
                name: 'Categories',
                model: 'category'
            }
        ];

        return {
            all: all
        }
    })




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

    .controller('AppCtrl', ['$scope', '$window', "Authenticate", 'config', 'CAN',
        function AppCtrl($scope, $window, Authenticate, config, CAN) {
            //console.log("Angular app ready", document.getElementsByClassName('.inner-wrap'));
            $scope.brand = config.brand;
            $scope.adminOptions = CAN().all;

            $scope.findPermits = {};

            $scope.permits = {};


            $scope.ready = false;
            $scope.$broadcast('ready', false);



            var permits = [];


            CAN().all.forEach(function(can, i) {
                permits.push(can.permit);
            });

            //console.log(permits);

            // var timer;

            // angular.element($window).on('resize', function() {
            //     console.log("Resize" , document.getElementsByClassName('.inner-wrap'));
            //     clearTimeout(timer);
            //     timer = setTimeout(function() {
            //     angular.element(document.getElementsByClassName('.inner-wrap')).css("min-height", $(window).height() + "px" );
            //     }, 40);
            // });


            //             $(function() {
            //     var timer;

            //     $(window).resize(function() {
            //         clearTimeout(timer);
            //         timer = setTimeout(function() {
            //             $('.inner-wrap').css("min-height", $(window).height() + "px" );
            //         }, 40);
            //     }).resize();
            // });


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

                    }, function(reason) {
                        $scope.findPermits = {};
                        $scope.permits = {};
                        //console.log("Rejected", reason);
                    });
                else {
                    $scope.permits = {};
                    $scope.findPermits = {};
                }


                
            });


        }
    ]);

})();