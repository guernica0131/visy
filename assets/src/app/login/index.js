(function() {
    'use strict';

    angular.module('vissy.login', [])

    .config(['$stateProvider', function($stateProvider) {
        $stateProvider.state('app.login', {
            url: '/login',
            views: {
                'main@app': {
                    controller: 'LoginCtrl',
                    templateUrl: 'login/index.tpl.html'
                }
            }
        });
    }])

    .controller('LoginForm', ['$scope', 'config', '$state', 'Authenticate',
        function($scope, config, $state, Authenticate) {

            $scope.provider = 'local';

            var user = new Authenticate.User();

            $scope.$parent.$parent.ready = true;

            $scope.authenticate = function(e) {

                $scope.serverResponse = '';
                // if (e.keyCode !== 13 && e.keyCode !== 0)
                //     return;
                //if we are already authenticated, we logout
                if (user.get('authenticated'))
                    return user.logout().then(function(res) {});
                // we make sure the values are poplated.
                // @TODO::  Replace with a proper forms library
                // ===
                $scope.identError = false;
                $scope.passError = false;
                // we set the errors
                $scope.identError = !$scope.identifier;
                $scope.passError = !$scope.password;


                if ($scope.identError || $scope.passError)
                    return;

                $scope.$parent.$parent.ready = false; //'Processing <i class="fa fa-spinner fa-spin"></i>';
                //====
                // build the creds
                var creds = {
                    identifier: $scope.identifier,
                    password: $scope.password,
                    provider: $scope.provider
                };



                // now we login
                user.login(creds).then(function(res) {

                    // console.log("MY RESPONSE", res);

                    $scope.$parent.$parent.ready = true;
                    
                    var data = res;
                    
                    if (!res.user) 
                        return $scope.badCredentials = true;
                    
                    $scope.badCredentials = false;
                    $scope.identifier = ''; // clear the form variables
                    $scope.password = ''; // clear

                    $state.go('app.admin');

                }, function(why) {
                    console.error(why);
                    $scope.serverResponse = why.error;
                    $scope.$parent.$parent.ready = true;
                });
            };



        }
    ])

    .controller('LoginCtrl', ['$scope', 
        function($scope) {

        }
    ])

    ;

})();