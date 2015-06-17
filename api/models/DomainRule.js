/**
 * DomainRules.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

module.exports = {

    attributes: {

    	root: {
    		type: 'boolean',
    		defaultsTo: false
    	},

        domain: {
            model: 'domain'
        },

        role: {
            model: 'role'
        },

        permissions: {
            collection: 'permission'
        }

    },

    beforeCreate: function(params, next) {
    	// only when an application seeds, do we allow a root setup
    	if (!sails.config.bootstrap.seeding)
    		delete params.root;

    	next();
    },

    beforeUpdate: function(params, next) {
    	// only when an application seeds, do we allow a root setup
    	// update will not be called
    	delete params.root;
    	next();
    },


    seeds: function() {

        var associate = function(cb) {
            Role.find().exec(function(err, roles) {
                var ids = _.pluck(roles, 'id'),
                    dRule = {
                        //domain: 0,
                        root: true

                    },
                    elements = [];
                    ids.forEach(function(id) {
                    	var dR = _.clone(dRule);
                    	dR.role = id;
                    	elements.push(dR);
                    });

                    // we can also set default permissions
                    DomainRule.create(elements, cb);

            });

             DomainRule.create([ {
                domain: 2,
                role: 3
             },{
                domain: 2,
                role: 5
             }], cb)

        }

        var plant = function(cb) {
             cb();
        };

        return {
            seed: true,
            plant: plant,
            associate: associate
        }
    }

};