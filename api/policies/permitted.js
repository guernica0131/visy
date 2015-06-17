/**
 * Permission Middleware
 *
 * Creates a middeware for for defining if a user can access certain models.
 * We pull the user session check for the various roles and ask of the user can? access
 * the model and perform the given api function.
 *
 * @param {Object}   req
 * @param {Obecjt}   res
 * @param {Function} next
 */
module.exports = function(req, res, next) {
	// lets send it throught a service
	return permissions.resolve(req, res, next);
};