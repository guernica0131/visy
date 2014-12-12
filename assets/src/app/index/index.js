angular.module( 'vissy.index', ['ngRoute'])

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

.controller( 'IndexCtrl', ['$scope', 'RoleModel' , '$timeout', function IndexController( $scope, RoleModel, $timeout ) {
		console.log("I am in a state");

		$scope.roles = [];
		var role = new RoleModel($scope, 'roles');

		role.listen();
		// //System Administrator
		var done = function() {
			console.log("Setting timer");
			$timeout(function() {
				
				var scoped = role.getScoped();

				var r = {
					name: "they're multiplying",
					key: 'delete_me_role_313',
					description: 'This describes me',
					presedence: 13
				};

				//role.create(r, null);

				role.define().then(function(res) {
					console.log(res);
				});
				//role.update(scoped[1], {name: 'I\'ve got lickles' , permissions: [3] }, 'merge');
				 //role.delete(scoped[3]);

			}, 2000);

		 };

		//console.log(RoleModel.get());
		role.get().then(function() {
			done();
		});

		// role.register(function(message) {
		// 	console.log("Socket messge", message);
		// });

		// role.get().then(function(roles) {
		// 	console.log(roles);
		// 	//$scope.roles = roles;
		// 	done();
		// }, function(why) {
		// 	console.error(why);
		// });



}]);