var Permits = function() {

}




module.exports = {
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
        if (action === 'populate' || action === 'remove' ) {
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
            model = sails.models[options.model];
        // if the model isn't permissible return next();
        if (!model || (model.is && !model.is.permissible))
            return next();

        var user = req.user,
            keys = this.build(options, model._attributes);

            console.log(keys);
        // once we have our key bult we ask if the user can? perform the key  
        User.can(user, keys, req.session.space, function(can) {
            sails.log("Can I ?????", can);
        
            if (!_.some(can)) // the we don't hav that permission for the space role we return and reject
                return res.forbidden("Your role lacks the required permissions for this action");
            // now we descide what we need to do with that he/she can can't do
            res.locals.can = can;

            next();
        });

    }


}