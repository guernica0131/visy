/*
* This directive manages the navbar including the user auth login logout functions.
* The user auth function functionality should be moved to any other directive.
*/
angular.module('directive.sidenav', [])

.directive('sideNav', ["Authenticate",
    function(Authenticate) {
        return {
            restrict: 'E',
            transclude: true,
            scope: true,
            controller: ["$scope", "$element", 'config', 'lodash', 
                function($scope, $element, config, lodash) {

                    var user = new Authenticate.User();



                    //console.log("What can I do" ,);
                   

                }
            ],
            link: function(scope, element, attrs) {
                // in case we need the linking function for future functionality
            },
            templateUrl: '../common/directives/sidenav/index.tpl.html',
            replace: true
        };
    }
]);