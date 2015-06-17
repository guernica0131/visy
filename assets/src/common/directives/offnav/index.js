/*
* This directive manages the navbar including the user auth login logout functions.
* The user auth function functionality should be moved to any other directive.
*/
angular.module('directive.offnav', [])

.directive('offNav', ["Authenticate",
    function(Authenticate) {
        return {
            restrict: 'E',
            transclude: true,
            scope: true,
            controller: ["$scope", "$element", 'config', 'lodash',
                function($scope, $element, config, lodash) {

                    var user = new Authenticate.User();
                    


                }
            ],
            link: function(scope, element, attrs) {
                // in case we need the linking function for future functionality
            },
            templateUrl: '../common/directives/offnav/index.tpl.html',
            replace: true
        };
    }
]);