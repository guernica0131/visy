angular.module('models.domain', ['lodash', 'services', 'ngSails'])

.service('DomainModel', ['$q', 'lodash', "Model",
    function($q, lodash, Model) {


        var Domain = function($scope, modelName) {        	
        	Model.object.call(this, 'domain', modelName, $scope);
        	//this.strip = ['createdAt', 'updatedAt', 'id', '$$hashKey', 'key'];
        	//this.$scope = $scope;
        };

        Domain.prototype = Object.create(Model.object.prototype);

        Domain.prototype.constructor = Model.object.prototype.constructor;

    	    	
        return Domain;

    }
]);