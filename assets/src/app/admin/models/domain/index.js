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
                resolve: {}
            })

            ;

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