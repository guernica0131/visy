/**
 * PermissionController
 *
 * @description :: Server-side logic for managing Permissions
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {

	// /*
	// * permissions
	// *
	// * @description :: Here we can make a call to the 
	// *	api to determine what permission keys are available for a model
	// * @param {Object} req
	// * @param {Object} res
	// * @param {Function} next
	// */
	// permissions: function(req, res, next) {

	// 	var pModel = req.param('model'),
	// 	model = sails.models[pModel];
	// 	// if the model doesn't exist, move on
	// 	if (!model)
	// 		return res.badRequest("No model found for the parameter " + pModel);
	// 	// if it isn't permissible, move on
	// 	if (!model.is || !model.is.permissible)
	// 		return res.badRequest("The model "+  pModel  + " has no permissible attributes" );
	// 	// now we pull our permissions from the model and the associations
	// 	var permissions = Permission.permissions(pModel, model.associations);
	// 	// now we send just the keys
	// 	res.send(_.pluck(permissions, 'key' ));

	// }
	
};

