angular.module('models.permission', ['lodash'])

.factory('PermissionModel', ['$q', 'lodash', "Model",
    function($q, lodash, Model) {


        var Permission = function($scope, modelName) {        	
        	Model.object.call(this, 'permission', modelName, $scope);
        };

        Permission.prototype = Object.create(Model.object.prototype);

    	    	
        return Permission;

    }
]);