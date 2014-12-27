/**
 * SiteController
 *
 * @description :: Server-side logic for managing Sites
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {


	define: function(req, res) {

		var m = req.param('model'),
		model = sails.models[m];

		if (!model)
			return res.badRequest("There is no definition for your model, '" + m + "'.");

		var attributes = _.clone(model._attributes);

		delete attributes.id;
		delete attributes.updatedAt;
		delete attributes.createdAt;

		res.send(attributes);

	},


	admin: function(req, res) {

		//can_manage_site_content




		res.view('admin/index');

	},

	count: function(req, res) {

		var m = req.param('model'),
		model = sails.models[m];

	
		if (!model)
			return res.badRequest("There is no definition for your model, '" + m + "'.");


		model.count(function(err, count) {

			if (err)
				return res.serverError(err);

			var c = {};

			res.json({count: count});
		});
		

	}
	
};

