/*
 * This directive manages the navbar including the user auth login logout functions.
 * The user auth function functionality should be moved to any other directive.
 */
angular.module('directive.navbar', [])

.directive('navBar', ["Authenticate",
    function(Authenticate) {
        return {
            restrict: 'E',
            transclude: true,
            scope: true,
            controller: ["$scope", "$element", 'config', '$window', '$state',
                function($scope, $element, config, $window, $state) {



                    var user = new Authenticate.User();

                    user.permitted('domain').then(function(permitted) {
                        $scope.permitted = permitted;
                    });
                    /*
                     * Listen to the sockets in order to react to changes in the
                     * user authentication.
                     */
                    user.register(function(authenticate) {
                        $scope.permitted = {};
                        if (authenticate.verb === 'login') {
                            user.permitted('domain').then(function(permitted) {
                                $scope.permitted = permitted;
                            });
                        }

                    });


                    // we send the authentication data
                    $scope.authenticate = function(e) {
                        //if we are already authenticated, we logout
                        if (user.get('authenticated'))
                            return user.logout().then(function(res) {
                                // $scope.permitted = {}; 
                                $state.go('app.index')
                            });

                    };

                }
            ],
            link: function(scope, element, attrs) {
                // in case we need the linking function for future functionality
            },
            templateUrl: '../common/directives/navbar/index.tpl.html',
            replace: true
        };
    }
]);