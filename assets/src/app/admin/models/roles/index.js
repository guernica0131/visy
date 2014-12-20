angular.module('admin.roles', [])



// .config(['$routeProvider',
//     function($routeProvider) {
//         $routeProvider.when('/roles', { // need to worry
//             templateUrl: 'admin/roles/index.tpl.html', //'views/service/service.html',
//             controller: 'RoleControl',
//             reloadOnSearch: false
//         })

//     }
// ])

.controller('RolesController', ['$scope', 'RoleModel', '$timeout', 'lodash', '$modal', 'ModelEditor',
    function RolesController($scope, RoleModel, $timeout, lodash, $modal, ModelEditor) {




    }
])


.controller('RolesPermissionController', ['$scope', 'RoleModel', '$timeout', 'lodash', '$modal', 'ModelEditor',
    function RolesPermissionController($scope, RoleModel, $timeout, lodash, $modal, ModelEditor) {
        console.log("Permission controller");



    }
])



;