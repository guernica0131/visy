angular.module('vissy.index', ['ngRoute'])

//     .config( ['$stateProvider', function config( $stateProvider ) {
//         $stateProvider.state( 'Index', {
// 		url: '/',
// 		views: {
// 			"index": {
// 				controller: 'IndexCtrl',
// 				templateUrl: 'index/index.tpl.html'
// 			}
// 		}
// 	});
// }])

.config(['$routeProvider',
    function($routeProvider) {
        $routeProvider.when('/', {
            templateUrl: 'index/index.tpl.html', //'views/service/service.html',
            controller: 'IndexCtrl',
            reloadOnSearch: false
        })

    }
])


.controller('IndexCtrl', ['$scope',
    function IndexController($scope) {
       
    	console.log("Index controller");

   

    }
]);