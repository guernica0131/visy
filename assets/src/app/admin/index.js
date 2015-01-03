(function() {

    angular.module('vissy.admin', [
        'admin.models'
    ])

    .config(['$routeProvider', '$stateProvider',
            function($routeProvider, $stateProvider) {


                


     $stateProvider.state('admin', {
                url: '/admin',
                controller: 'AdminController',
                templateUrl: 'admin/index.tpl.html', //'views/service/service.html',
                // views: {
                //     "admin.models": {
                //         controller: 'GenModel',
                //         templateUrl: 'admin/models/roles/index.tpl.html'
                //     }
                // }
            });






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
    }];

    return {
        all: all
    }
})



.controller('AdminController', ['$scope',
function($scope) {
    console.log("Admin controllers");
}
]);


})();