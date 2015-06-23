angular.module( 'services.config', ['lodash'])
// sets optional config for the sails provider
// .config(['$sailsProvider', function($sailsProvider) {
// 	 $sailsProvider.url = 'http://foo.bar';
// }])

.service('config',['lodash', function(lodash) {

	// private vars here if needed

	return {
		siteName: 'Template API',
		// no trailing slash!
		siteUrl: '/',
		apiUrl: '/api/v1',
		currentUser: false,
		brand: 'visy'
	};

}]);