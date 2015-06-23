(function() {

    angular.module('admin.domain', [
      //  'admin.models'
    ])

    .config(['$stateProvider',
        function($stateProvider) {


            $stateProvider.state('app.admin.domain', {
                url: '/domain/:domain',                
                views: {
                    'main@app': {
                        controller: 'DomainController',
                        templateUrl: 'admin/models/domain/index.tpl.html' //'views/service/service.html',
                    }
                },
                resolve: {
                    currentDomain: ['DomainModel', '$rootScope', '$stateParams',  function(DomainModel, $rootScope, $stateParams) {
                        var domain = new DomainModel($rootScope, 'currentDomain');
                        return domain.get($stateParams.domain).then(function(domain) {
                            //console.log("My domin", domain);
                            return domain;
                        });
                    }]
                }
            })

            .state('app.admin.new.domain', {
                url: '/domain',                
                views: {
                    'main@app': {
                        controller: 'NewDomainController',
                        templateUrl: 'admin/models/domain/index.tpl.html' //'views/service/service.html',
                    }
                },
                resolve: {
                    // domains: ['DomainModel', '$rootScope', '$state',  function(DomainModel, $rootScope, $state) {

                    //     console.log("my state" , $state);

                    //     var domain = new DomainModel($rootScope, 'domains');
                    //     return domain.get().then(function(domains) {
                    //         return domains;
                    //     });
                    // }]
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






    .controller('DomainController', ['$scope', 'Authenticate', 'lodash', 'currentDomain',
        function($scope, Authenticate, _, currentDomain) {

            var user = new Authenticate.User();

            $scope.user = user.get('user');

            $scope.currentDomain = currentDomain;

           

        }
    ])

      .controller('NewDomainController', ['$scope', 'Authenticate', 'lodash',
        function($scope, Authenticate, _) {

            var user = new Authenticate.User();

            $scope.user = user.get('user');

           

        }
    ])





      ;


})();