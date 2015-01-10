/**
 * SiteController
 *
 * @description :: Server-side logic for managing Sites
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {

    /*
     * permissions
     *
     * @description :: Here we can make a call to the
     *	api to determine what permission keys are available for a model
     * @param {Object} req
     * @param {Object} res
     * @param {Function} next
     */
    permissions: function(req, res, next) {

        var pModel = req.param('model'),
            model = sails.models[pModel];
        // if the model doesn't exist, move on
        if (!model)
            return res.badRequest("No model found for the parameter " + pModel);
        // if it isn't permissible, move on
        if (!model.is || !model.is.permissible)
            return res.badRequest("The model " + pModel + " has no permissible attributes");
        // now we pull our permissions from the model and the associations
        var permissions = Permission.permissions(pModel, model.associations);
        // now we send just the keys
        res.send(_.pluck(permissions, 'key'));

    },


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

    /*
     * admin
     *
     * @description: sets the admin view.
     * @todo: ensure user permissions
     * @param {Object} req
     * @param {Object} res
     *
     */

    admin: function(req, res) {
        //can_manage_site_content
        res.view('admin/index');
    },

    /*
     * admin
     *
     * @description: counts the number of objects in a model
     * @todo: chang for domain/portal
     * @param {Object} req
     * @param {Object} res
     *
     */

    count: function(req, res) {

        var m = req.param('model'),
            model = sails.models[m];


        if (!model)
            return res.badRequest("There is no definition for your model, '" + m + "'.");


        model.count(function(err, count) {

            if (err)
                return res.serverError(err);

            //var c = {};

            res.json({
                count: count
            });
        });


    },

    /*
     * setDomain
     *
     * @description: sets the domain in session
     * @todo: ensure user permissions
     * @param {Object} req
     * @param {Object} res
     *
     */
    setDomain: function(req, res, next) {
        // sails currently does not support req.host using sockets
        if (req.isSocket)
            return res.badRequest('Visy cannot process this request over web sockets');
        // first we find the host then populate the domain
        Domain.establish(req.host, function(err, host) {

            var domain = {
                name: "Root",
                id: 0,
                key: 'root'
            }; // if a domain is not found. We default to our root domain

            if (host)
                domain = host.domain;
            // If we have an establish parameter
            // then bootstrap the session with the domain/space info
            if (req.param('establish')) {
                var space = {
                    id: domain.id
                };
                space.name = (host) ? 'domain' : 'root';
                req.session.space = space; // we are setting our initial space
                req.session.domain = domain; // we store the domain in session
            }

            res.json(domain); // we now send the domain object to the requestor
        });


    },

    /*
     * setSpace
     *
     * @description: set the space for the either the domain or portal
     *
     */
    setSpace: function(req, res) {
        res.serverError('Not yet implemented');
    }

};