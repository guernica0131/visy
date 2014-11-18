angular.module( 'vissy.viewA', [ ])

    .config( ['$stateProvider',function config( $stateProvider ) {
        $stateProvider.state( 'viewA', {
		url: '/viewA',
		views: {
			"viewA": {
				controller: 'ViewACtrl',
				templateUrl: 'viewA/index.tpl.html'
			}
		}
	});
}])

.controller( 'ViewACtrl',['$scope', function AboutController( $scope ) {
	
}]);