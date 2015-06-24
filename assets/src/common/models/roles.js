angular.module('models.role', ['lodash', 'services'])

.factory('RoleModel', ['$q', 'lodash', 'utils', "Model",
    function($q, lodash, utils, Model) {


        var Role = function($scope, modelName) {        	
        	Model.object.call(this, 'role', modelName, $scope);
        };

        Role.prototype = Object.create(Model.object.prototype);

        
        return Role;

    }
]);