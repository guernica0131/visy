/*
 * This directive manages the navbar including the user auth login logout functions.
 * The user auth function functionality should be moved to any other directive.
 */
angular.module('directive.sidenav', [])

.directive('sideNav', ['Authenticate', 'CAN',
    function(Authenticate, CAN) {
        return {
            restrict: 'E',
            transclude: true,
            scope: true,
            controller: ["$scope", "$element", 'config', 'lodash', '$stateParams',
                function($scope, $element, config, lodash, $stateParams) {

                    var user = new Authenticate.User(),
                        permits = [];

                    $scope.adminOptions = CAN().all;
                    // @TODO::: we will need to trigger the space. SUCH AS DOMAIN 1, 
                    // console.log("My state params", $stateParams);
                    $scope.adminOptions.forEach(function(can, i) {
                        permits.push(can.permit);
                    });
                    // this needs to be
                    user.can(permits).then(function(res) {
                        $scope.basePermits = res;
                    }, function(why) {
                        
                    });


                }
            ],
            link: function(scope, element, attrs) {
                // in case we need the linking function for future functionality
            },
            templateUrl: '../common/directives/sidenav/index.tpl.html',
            replace: true
        };
    }
])

.constant('CAN', function() {

    var all = [{
            permit: 'can_find_user',
            name: 'Users',
            model: 'user',
            route: 'users'
        }, {
            permit: 'can_find_role',
            name: 'Roles',
            model: 'role',
            route: 'roles'
        }, {
            permit: 'can_find_permission',
            name: 'Permissions',
            model: 'permission',
            route: 'permissions'
        },
        //  { // I a removing because a domain should be done at the site level
        //     permit: 'can_find_domain',
        //     name: 'Domains',
        //     model: 'domain',
        //     route: 'domains'
        // }, 
        {
            permit: 'can_find_portal',
            name: 'Portals',
            model: 'portal',
            route: 'portals'
        }, {
            permit: 'can_find_collection',
            name: 'Collections',
            model: 'collection',
            route: 'collections'
        }, {
            permit: 'can_find_document',
            name: 'Documents',
            model: 'document',
            route: 'documents'
        }, {
            permit: 'can_find_tag',
            name: 'Tags',
            model: 'tag',
            route: 'tags'
        }, {
            permit: 'can_find_category',
            name: 'Categories',
            model: 'category',
            route: 'categories'
        }
    ];

    return {
        all: all
    }
})

;