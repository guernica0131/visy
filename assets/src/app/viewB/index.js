angular.module( 'vissy.viewB', [ ])

    .config( ['$stateProvider',function config( $stateProvider ) {
        $stateProvider.state( 'viewB', {
		url: '/viewB',
		views: {
			"viewB": {
				controller: 'ViewBCtrl',
				templateUrl: 'viewB/index.tpl.html'
			}
		}
	});
}])

.controller( 'ViewBCtrl',['$scope', function AboutController( $scope ) {
	
}]);