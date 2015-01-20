var blueprintFind = require("../../node_modules/sails/lib/hooks/blueprints/actions/find"),
	blueprintFindOne = require("../../node_modules/sails/lib/hooks/blueprints/actions/findOne"),
	blueprintUpdate = require("../../node_modules/sails/lib/hooks/blueprints/actions/update"),
	blueprintCreate = require("../../node_modules/sails/lib/hooks/blueprints/actions/create"),
	blueprintDestroy = require("../../node_modules/sails/lib/hooks/blueprints/actions/destroy"),
	blueprintPopulate = require("../../node_modules/sails/lib/hooks/blueprints/actions/populate"),
	blueprintRemove = require("../../node_modules/sails/lib/hooks/blueprints/actions/remove");

/*
* Because of its multidomain behavior, there are several use cases 
* that require overriding the behaivior of the sails blueprints.
* This service allows ups to make changes in the controller and then call the 
* default services for processing the request. 
*/
module.exports =  {

	PASS: 'pass',

	find: blueprintFind,
	findOne: blueprintFindOne,
	update: blueprintUpdate,
	create: blueprintCreate,
	destroy: blueprintDestroy,
	popluate: blueprintPopulate,
	remove: blueprintRemove,

	/*
	* @TODO::: CONSIDER PUBLIC VS PRIVATE DATA
	*/
	findOwn: function(params, callback) {

		var model = sails.models[params.model];

		var query = {creator: params.user};

		sails.models[params.model].find(query).exec(function(err, models) {

				if (err)
					callback(err);
					
				var ids = _.pluck(models, 'id');

				if (params.id && _.contains(ids, parseInt( params.id ))) // why call pass. Because if there
					callback(null, prints.PASS); // is an id attribute we know that it is available to our user
												// so we just allow it to be processed as normal
				else if (params.id && !_.contains(models, params.id)) // this is no their object
					callback(null, {error: 'Model restrict' } );
				else
					callback(null, ids);

			});
	}

};