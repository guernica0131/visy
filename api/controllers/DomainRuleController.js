/**
 * DomainRulesController
 *
 * @description :: Server-side logic for managing Domainrules
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {

    populate: function(req, res) {

        var domain = req.param('domain'),
            role = req.param('role'),
            permission = req.param('permission'),
            query = {
                role: role,
                domain: domain
            },
            method = req.method,
            actions = {
                // alter performs two actions based on the 
                // various action option, either add or remove
                alter: function(action, rule) {
                    // a quick check to ensure that the correct method is called
                    if (!_.contains(['remove', 'add'], action))
                        return res.badRequest();
                    // we perform the action
                    rule.permissions[action](permission);
                    // then save
                    rule.save(function(err, populated) {

                        if (err)
                            return res.serverError(err);
                        res.ok(populated); // send the data
                    });
                },

                PUT: function(rule) {
                    this.alter('add', rule);
                },
                POST: function(rule) {
                    this.alter('add', rule);
                },
                DELETE: function(rule) {
                    this.alter('remove', rule);
                },
                GET: function(rule) {
                    // a get function returns a boolean value if the data exists
                    // since findOrDelete does not populate as of v0.1.5 we need to run another query
                    DomainRule.findOneById(rule.id).populate('permissions').exec(function(err, rule) {
                        // pluck ids
                        var ids = _.pluck(rule.permissions, 'id');
                        // and send
                        res.json({
                            avaiable: _.contains(ids, parseInt(permission))
                        });
                    });
                }
            }

        /*
         * We find or create the rule using the domain and role param
         */
        DomainRule.findOrCreate(query, query).exec(function(err, rule) {

            if (err || !rule)
                return res.serverError(err);

            if (_.isFunction(actions[method]))
                return actions[method](rule);
            else
                res.badRequest();

        });


    },


};