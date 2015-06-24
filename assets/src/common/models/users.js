angular.module('models.user', ['lodash', 'services'])

.factory('UserModel', ['$q', 'lodash', "Model",
    function($q, lodash, Model) {


        var User = function($scope, modelName) {        	
        	Model.object.call(this, 'user', modelName, $scope);
        };

        User.prototype = Object.create(Model.object.prototype);

        return User;

    }
]);