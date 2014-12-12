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

		res.send(model._attributes);

	}
	
};

