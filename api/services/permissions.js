// @TODO::: CONSIDER
var Permits = function() {};

/*
 * This service is responsible for access control. Only users with the correct corresponding
 * permission will be marked true.
 *
 */

var Q = require('q');

module.exports = {

    /*
     * This object contains the access controll for our controllers
     */

    controllers: {

        domain: {

            find: function(req, res) {
                // first we need to pull the user. 
                var sessionUser = req.user, 
                    user = req.param('user') || sessionUser.id; // if we have a user param, we default

                
                // debugging
                // res.locals.can['can_find_domain'] = false;
                // res.locals.can['can_find_own_domain'] = true;

                // base case:: if the user is permitted to find domains. Do it
                if (res.locals.can['can_find_domain']) {
                    return prints.find(req, res);
                }
                // now if we can find our own domains
                else if (res.locals.can['can_find_own_domain']) {
                    // we used the findOwn method to check
                    prints.findOwn({
                        model: 'domain',
                        id: req.param('id'),
                        user: user
                    }, function(err, response) {
                        // if error. We return
                        if (err)
                            return res.serverError(err);
                        // if there is another error, we assume the user is forbidden
                        if (_.isObject(response) && response.error)
                            return res.forbidden(req.__(response.error))
                        // if it is an array we adjust the query for only those
                        // domains that the user owns
                        if (_.isArray(response)) {  
                            req.params.all()['where'] = {
                                id: response
                            };

                        }
                        // we return the query 
                        return prints.find(req, res);

                    });


                } else {
                    // we forbid the user to view the domain model
                    return res.forbidden(req.__('Model restrict', {
                        model: 'Domain'
                    }));
                }


            }


        }


    },

    /*
     * Build permission strings for the
     * @param {object} request
     * @return {Array} the array of permissions for the controller action
     */
    build: function(request, attributes) {

        var action = request.action;

        action = action.replace('One', '');

        /*
         * Remove and popluate for associations
         */
        if (action === 'populate' || action === 'remove') {
            //return 'can_' + request.action + '_' + request.alias + '_from_' + request.controller;
            var cans = ['can_' + action + '_' + request.alias + '_from_' + request.controller];

            if (attributes['owner'] || attributes['creator'])
                cans.push('can_' + action + '_' + request.alias + '_from_own_' + request.controller);

            return cans;
        }
        // make sure these are actual permisison
        // Permission.findByKey(keys).populate('roles').then(function(permissions) {
        //     return permissions;  
        // });
        //return 'can_' + request.action + '_' + request.controller;
        var cans = ['can_' + action + '_' + request.controller];

        if (attributes['owner'] || attributes['creator'])
            cans.push('can_' + action + '_own_' + request.controller);

        return cans;

    },

    /*
     * Conditions:::
     * 1) We are sitelevel and we want to CRUD models
     * 2) We are subsite level and we want to CRUD
     * 3) We have a populate request /api/user/1/siterole
     * 4) We have a request to change own objects
     */
    resolve: function(req, res, next) {
        // we see of there is a pace in session, if not we default
        // it to the root space
        if (!req.session.space) // @TODO::: DEFINE HERE
            req.session.space = {
            name: 'root', // 'collection' testing
            //id: 1 // testing
        };

        var options = req.options,
            model = sails.models[options.model],
            self = this;
        // if the model isn't permissible return next();
        if (!model || (model.is && !model.is.permissible))
            return next();
        // here if we have a user parameter, we are asking for that user's specific
        // permission
        var findUser = function() {
            if (req.param('user'))
                return User.findOneById(req.param('user'))
            else
                return req.user;
        };

        var process = function(user) {
            var keys = self.build(options, model._attributes);
            // once we have our key bult we ask if the user can? perform the key  
            User.can(user, keys, req.session.space, function(can) {
                sails.log("Can I ?????", can);

                if (!_.some(can)) // the we don't hav that permission for the space role we return and reject
                    return res.forbidden("Your role lacks the required permissions for this action");
                // now we descide what we need to do with that he/she can can't do
                res.locals.can = can;

                next();
            });

        };

        /*
         * We wrap the find userfunction in a Q.when since
         * we don't know if the return will be a promise or simply a user
         */
        Q.when(findUser()).then(function(user) {
            process(user);
        }).catch(function(err) {
            sails.log.error(err);
            return next(err);
        });








    }


}