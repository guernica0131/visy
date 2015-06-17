angular.module('models.role', ['lodash', 'services', 'ngSails'])

.service('RoleModel', ['$q', 'lodash', 'utils', '$sails', "Model",
    function($q, lodash, utils, $sails, Model) {


        var Role = function($scope, modelName) {        	
        	Model.object.call(this, 'role', modelName, $scope);
        	//this.strip = ['createdAt', 'updatedAt', 'id', '$$hashKey', 'key'];
        	//this.$scope = $scope;
        };

        Role.prototype = Object.create(Model.object.prototype);

    	    	
        return Role;

    }
]);