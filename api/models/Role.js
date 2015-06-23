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

    schema: true,

    attributes: {

        name: {
            type: 'string',
            required: true,
            max: 20
        },

        description: {
            type: 'string'
        },
        // the lower the higher it is
        // precedence: {
        //     type: 'integer',
        //     unique: true,
        //     //  min: 0
        // },

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

        badge: {
            type: 'string',
            defaultsTo: 'Vintage_badges1.png'
        },

        perishable: {
            type: 'boolean',
            defaultsTo: true
        }

    },

    beforeDestroy: function(role, next) {

        if (!role.id && !role.where.id )
            return next('Please include the role ID for updating this model');
        var id = role.id || role.where.id;

        Role.findOneById(id).then(function(r) {
            if (!r.perishable)
                return next("A model marked as nonperishable can not be altered or destroyed.");
            next();

        });
    },

    // this logic is completly wrong!!!!!
    beforeUpdate: function(role, next) {

        if (!role.id)
            return next('Please include the role ID for updating this model');

        Role.findOneById(role.id).then(function(r) {

            if (r.perishable != role.perishable)
                return next("A model marked as nonperishable can not be altered or destroyed.");
            
            next();

        });

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
                    description: "This role creates a system-level administrative role",
                    key: 'system_admin',
                    //precedence: 0,
                    perishable: false,
                    badge: 'Vintage_badges2.png'
                },

                {
                    name: 'Administrator',
                    description: "This role creates an administrative role",
                    key: 'admin',
                  //  precedence: 5,
                    perishable: false,
                    badge: 'Vintage_badges2.png'
                },

                // {
                //     name: 'Manager',
                //     description: "This role creates an object-level adminstrative role",
                //     key: 'manager',
                //    // precedence: 10,
                //     perishable: false,
                //     badge: 'Vintage_badges3.png'
                // },

                {
                    name: 'Member',
                    description: "This role is defined as a member of a space but generally has no administrative rights",
                    key: 'member_user',
                   // precedence: 15,
                    perishable: false
                },

                {
                    name: 'Visitor',
                    description: "This role is defined as a user who entered a public space but is not an actual member.",
                    key: 'visiting_user',
                   // precedence: 20,
                    perishable: false

                },

                {
                    name: 'Authenticated User',
                    description: "This role creates a basic user role and is the default for the system",
                    key: 'authenticated_user',
                  //  precedence: 25,
                    perishable: false,
                    badge: 'Vintage_badges2.png'
                },

                {
                    name: 'Anonymous User',
                    description: "This role creates a user that has not been defined yet",
                    key: 'anonymous_user',
                  //  precedence: 30,
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