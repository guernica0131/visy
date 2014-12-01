angular.module('directive.navbar', [])

.directive('navBar', ["Authenticate",
    function(Authenticate) {
        return {
            restrict: 'E',
            transclude: true,
            scope: true,
            controller: ["$scope", "$element", 'config', 'lodash',
                function($scope, $element, config, lodash) {

                    var user = new Authenticate.User();
                    $scope.brand = config.brand;

                    // we send the authentication data
                    $scope.authenticate = function(e) {

                        if (e.keyCode !== 13 && e.keyCode !== 0)
                            return;

                        //if we are already authenticated, we logout
                        if (user.get('authenticated'))
                            return user.logout().then(function(res) {});

                        // we make sure the values are poplated.
                        // @TODO::  Replace with a proper forms library
                        // ===
                        $scope.identError = false;
                        $scope.passError = false;
                        // we set the errors
                        if (!$scope.identifier)
                            $scope.identError = true;
                        if (!$scope.password)
                            $scope.passError = true;

                        if ($scope.identError || $scope.passError)
                            return;
                        //====
                        // build the creds
                        var creds = {
                            identifier: $scope.identifier,
                            password: $scope.password,
                            provider: 'local'
                        };
                        // now we login
                        user.login(creds).then(function(res) {
                            if (!res.user)
                                return $scope.badCredentials = true;
                            $scope.badCredentials = false;
                            $scope.identifier = ''; // clear the form variables
                            $scope.password = ''; // clear

                        });
                    };

                }
            ],
            link: function(scope, element, attrs) {
                // incase we need the linking funciton
            },
            templateUrl: '../common/directives/navbar/index.tpl.html',
            replace: true
        };
    }
]);