(function() {

    angular.module('vissy.admin', [
        'admin.models'
    ])

    .config(['$stateProvider',
        function($stateProvider) {


            $stateProvider.state('app.admin', {
                url: '/admin',                
                views: {
                    'main@app': {
                        controller: 'AdminController',
                        templateUrl: 'admin/index.tpl.html' //'views/service/service.html',
                    }
                },
                resolve: {
                    domains: ['DomainModel', '$rootScope', function(DomainModel, $rootScope) {
                        var domain = new DomainModel($rootScope, 'domains');
                        return domain.get().then(function(domains) {
                            return domain;
                        });
                    }]
                }
            })

            .state('app.admin.new', {
                url: '/new',                
                views: {
                    'main@app': {
                        controller: 'NewDomainController'
                    }
                },
                resolve: {
                 
                }
            })

            ;






            // $routeProvider.when('/', {
            //     templateUrl: 'admin/index.tpl.html', //'views/service/service.html',
            //     controller: 'AdminController',
            //     reloadOnSearch: false
            // });

            // $stateProvider
            //     .state('roles', {
            //         url: "/roles",
            //         //templateUrl: "partials/state1.html",
            //         controller: 'RolesController',
            //         view: 'models'
            //     })
            // .state('state1.list', {
            //     url: "/list",
            //     templateUrl: "partials/state1.list.html",
            //     controller: function($scope) {
            //         $scope.items = ["A", "List", "Of", "Items"];
            //     }
            // })
            // .state('state2', {
            //     url: "/state2",
            //     templateUrl: "partials/state2.html"
            // })
            // .state('state2.list', {
            //     url: "/list",
            //     templateUrl: "partials/state2.list.html",
            //     controller: function($scope) {
            //         $scope.things = ["A", "Set", "Of", "Things"];
            //     }
            // });
            //});

        }


    ])






    .controller('AdminController', ['$scope', 'Authenticate', 'lodash',
        function($scope, Authenticate, _) {

            var user = new Authenticate.User();

            $scope.user = user.get('user');

            $scope.randomizeColor = function(domain) {

                if (domain.color) {
                    return domain.color;
                }

                
                var colors = ['black', 'primary', 'danger', 'warning', 'info', 'success', 'default'],
                    randomColor = _.random(0, colors.length - 1);

                return domain.color = colors[randomColor];

            };

        }
    ]);


})();