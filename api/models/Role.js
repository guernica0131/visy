/**
 * Role.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

module.exports = {

    is: {
        permissible: true
    },

    attributes: {

        name: {
            type: 'string',
            max: 20
        },

        description: {
            type: 'string'
        },
        // the lower the higher it is
        precedence: {
            type: 'integer',
            unique: true,
            min: 0
        },

        key: {
            type: 'string',
            required: true,
            unique: true
        },


        permissions: {
            collection: 'permission',
            dominant: true,
            via: 'roles'
        },

        perishable: {
            type: 'boolean',
            defaultsTo: true
        }

    },

    beforeDestroy: function(role, next) {

        if (!role.perishable)
            return next("This role is defined by the system and cannot be destroyed");
        else
            return next(null, role);

    },


    beforeUpdate: function(role, next) {

        if (role.perishable || role.perishable === false)
            return next('You cannot update the perishable parameter. It can be only set upon role creation.');
        else
            next();
    },


    seeds: function() {


        var dependents = function(err, users) {

            // we iterate through the models 
            Object.keys(sails.models).forEach(function(key) {

                var model = sails.models[key];
                // if we have a seed function, we ensure it is defined and we can run it
                if (model.seeds && _.isFunction(model.seeds)) {
                    seed = model.seeds();
                    // if the seed parameter is truthy, we plant the seed.
                    if (seed.seed && _.contains(seed.dependent, 'role')) {
                        seed.plant(callback);
                    }
                }

            });

        };


        var plant = function(cb) {


            Role.create([

                {
                    name: 'System Administrator',
                    description: "This role creates a system-level adminstrative role",
                    key: 'system_admin',
                    precedence: 0,
                    perishable: false
                },

                {
                    name: 'Administrator',
                    description: "This role creates an adminstrative role",
                    key: 'admin',
                    precedence: 5,
                    perishable: false
                },

                {
                    name: 'Object Administrator',
                    description: "This role creates an object-level adminstrative role",
                    key: 'object_admin',
                    precedence: 10,
                    perishable: false
                },

                {
                    name: 'Member User',
                    description: "This role is defined as a member of a space but generally has no adminstrative rights",
                    key: 'member',
                    precedence: 15,
                    perishable: false
                },

                {
                    name: 'Visiting User',
                    description: "This role is defined as a user who enters a public space but is not an actual member.",
                    key: 'visiting_user',
                    precedence: 20,
                    perishable: false
                },

                {
                    name: 'Authenticated User',
                    description: "This role creates a basic user role and is the default for the system",
                    key: 'authenticated_user',
                    precedence: 25,
                    perishable: false
                },

                {
                    name: 'Anonymous User',
                    description: "This role creates a user that has not been defined yet",
                    key: 'anonymous_user',
                    precedence: 30,
                    perishable: false
                }

            ], cb);

        };

        return {
            seed: true,
            plant: plant
        }
    }

};