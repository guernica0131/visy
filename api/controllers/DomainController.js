/**
 * DomainController
 *
 * @description :: Server-side logic for managing Domains
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

var blueprintFind = require("../../node_modules/sails/lib/hooks/blueprints/actions/find");

module.exports = {



	find: function(req, res, next) {
		//console.log("THIS IS WORKING", blueprintFind);
		//return res.send("Fuck");
		//next();

		//req.params.all()['where'] = {id: [1,3] };

		// we need the domain



		return blueprintFind(req, res, next);
	}
	
	
	
};

