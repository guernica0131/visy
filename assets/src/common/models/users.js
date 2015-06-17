angular.module('models.user', ['lodash', 'services', 'ngSails'])

.service('UserModel', ['$q', 'lodash', "Model",
    function($q, lodash, Model) {


        var User = function($scope, modelName) {        	
        	Model.object.call(this, 'user', modelName, $scope);
        	//this.strip = ['createdAt', 'updatedAt', 'id', '$$hashKey', 'key'];
        	//this.$scope = $scope;
        };

        User.prototype = Object.create(Model.object.prototype);

    	    	
        return User;

    }
]);