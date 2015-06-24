angular.module('models.domain', ['lodash', 'services'])

.factory('DomainModel', ['$q', 'lodash', "Model",
    function($q, lodash, Model) {


        var Domain = function($scope, modelName) {        	
        	Model.object.call(this, 'domain', modelName, $scope);
        };

        Domain.prototype = Object.create(Model.object.prototype);

    	    	
        return Domain;

    }
]);