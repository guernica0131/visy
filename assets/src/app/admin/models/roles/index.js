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

.controller('RolesController', ['$scope', 
    function RolesController($scope) {





    }
])


.controller('RolesPermissionController', ['$scope', 'lodash', 'CAN', 'Plural',
    function RolesPermissionController($scope, _, CAN, Plural) {
       // console.log("Permission controller", $scope.roles);

        //$scope.role = $scope.$parent.roles;

        //$scope.permissions = $scope.$parent.permissions;

        

        $scope.$parent.$parent.predicates = _.map(CAN().all, function(c) {
            return {name:  _.capitalize(c.model), value: c.model };
        });

        $scope.$watch('predicate', function(newOne, old) {

            if (newOne && newOne.value)
                $scope.Associated.get(null, {controller: newOne.value});

        });

// //$scope.$parent.$parent.predicates = [{name: 'Test', value: 'model'}];

       // console.log("I can!" , $scope.$parent.predicates);





    }
])



;