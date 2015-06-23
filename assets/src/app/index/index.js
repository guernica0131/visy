angular.module('vissy.index', [])

.config(['$stateProvider', function config($stateProvider) {

    $stateProvider.state('app.index', {
        url: '/',
        views: {
            'main@app': {
                controller: 'IndexCtrl',
                templateUrl: 'index/index.tpl.html'
            }
        }
    });
}])

.controller('IndexCtrl', ['$scope',
    function IndexController($scope) {

        console.log("Index controller");

    }
]);