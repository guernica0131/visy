/**
 * Permission.js
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
            type: 'string'
        },

        description: {
            type: 'string'
        },

        controller: {
            type: 'string'
        },

        action: {
            type: 'string'
        },
        // this is a name for the reqested role. For example user.can('perform_some_task') returns boolean
        key: {
            type: 'string',
            //@TODO:: Create a method to pull the activity by name
            unique: true,
            required: true
        },

        roles: {
            collection: 'role',
            via: 'permissions'
        },
        // permission marked perishable cannot be deleted
        perishable: {
            type: 'boolean',
            defaultsTo: true
        }

    },

    /*
     * lifecycle callback for ensuring perishible functions are not deleted
     * @param {object} perm
     * @param {callback} next
     */
    beforeDestroy: function(perm, next) {

        if (!perm.perishable)
            return next("This permission is defined by the system and cannot be destroyed");
        else
            return next(null, perm);

    },
    /*
     * lifecycle callback for ensuring perishible functions are not updated
     * @param {object} perm
     * @param {callback} next
     */
    beforeUpdate: function(perm, next) {
        console.log("MY PERERERE", perm);
        // if (perm.perishable || perm.perishable === false)
        //     return next('You cannot update the perishable parameter. It can be only set upon permission creation.');
        // else
        next();
    },


    /*
     * Our seed function for defining system-level permissions
     */
    seeds: function() {

        var plant = function(cb) {
            
            Permission.create([
                {
                    name: "Manage Site Content ",
                    description: 'Allows permission for managing site content',
                    controller: 'site',
                    action: 'admin',
                    key: 'can_manage_site_content' ,
                    perishable: false
                }

            ], cb);


        };

        return {
            seed: true,
            plant: plant
        }
    },

    permissions: function(model, associations) {


            var modelVowel = _.contains(['a', 'e', 'i', 'o', 'u'], model.charAt(0));
            perms = [{
                    name: "View " + model,
                    description: 'Allows permission for viewing ' + ((modelVowel) ? 'an ' : 'a ') + model + ' object model.',
                    controller: model,
                    action: 'find',
                    key: 'can_find_' + model,
                    perishable: false
                },

                {
                    name: "Create " + model,
                    description: 'Allows permission for creating ' + ((modelVowel) ? 'an ' : 'a ') + model + ' object model.',
                    controller: model,
                    action: 'create',
                    key: 'can_create_' + model,
                    perishable: false
                },

                {
                    name: "Update " + model,
                    description: 'Allows permission for updating ' + ((modelVowel) ? 'an ' : 'a ') + model + ' object model.',
                    controller: model,
                    action: 'update',
                    key: 'can_update_' + model,
                    perishable: false
                }, {
                    name: "Destroy " + model,
                    description: 'Allows permission for destroying ' + ((modelVowel) ? 'an ' : 'a ') + model + ' object model.',
                    controller: model,
                    action: 'destroy',
                    key: 'can_destroy_' + model,
                    perishable: false
                },

                // if we have own, model can we update or destry?
                {
                    name: "Update own " + model,
                    description: 'Allows permission for updating ' + ((modelVowel) ? 'an ' : 'a ') + model + ' that the authenticated user owns',
                    controller: model,
                    action: 'update',
                    key: 'can_update_own_' + model,
                    perishable: false
                }, {
                    name: "Destroy own " + model,
                    description: 'Allows permission for deleting ' + ((modelVowel) ? 'an ' : 'a ') + model + ' that the authenticated user owns',
                    controller: model,
                    action: 'destroy',
                    key: 'can_destroy_own_' + model,
                    perishable: false
                }


            ];

            /*
             * If the models contain associations, we need some additional permissions
             */
            if (associations) {
                // first we filter the assicated models to only those associations 
                // that contain the permissible flag
                var a = _.filter(associations, function(a, index) {
                    var model = a.type,
                        Model = sails.models[a[model]];
                    if (Model && Model.is && Model.is.permissible)
                        return !!(Model.is.permissible);
                    else
                        return false;
                });

                // now we iterate our permitted associatsions
                a.forEach(function(a, index) {
                    // this is the asocation's name
                    as = a.alias,
                    type = a.type; // if it is a model or collection

                    var vowel = false;
                    if (as) // if the assicated name starts with a vowel
                        vowel = _.contains(['a', 'e', 'i', 'o', 'u'], as.charAt(0));

                    // now we create our permissions
                    perms.push(

                        {
                            name: "Remove " + model + " " + as,
                            description: 'Allows permission for removing' + ((type === 'model') ? ((vowel) ? ' an ' : ' a ') : ' ') + as + ' from' + ((modelVowel) ? ' an ' : ' a ') + model,
                            controller: model,
                            action: 'remove',
                            key: 'can_remove_' + as + "_from_" + model,
                            perishable: false
                        },

                        {
                            name: "View " + model + " " + as,
                            description: 'Allows permission for viewing' + ((type === 'model') ? ((vowel) ? ' an ' : ' a ') : ' ') + as + ' of' + ((modelVowel) ? ' an ' : ' a ') + model,
                            controller: model,
                            action: 'populate',
                            key: 'can_populate_' + as + "_from_" + model,
                            perishable: false
                        }


                    );

                });


            }


            return perms;

    },

    /*
     * Here we build a series of permission that are
     * user to generate permissible models
     */
    buildPermissions: function(cb) {

      
        var createPermission = function(key, associations) {
            var perms = Permission.permissions(key, associations);

            perms.forEach(function(perm) {
                Permission.findOrCreate({
                    key: perm.key // here we either find or create our permssion
                }, perm, function() {});
            });
        };

        Object.keys(sails.models).forEach(function(key) {
            var model = sails.models[key];
            // we only take models that have the permissible flag
            if (model.is && model.is.permissible) {
                createPermission(key, model.associations);
            }

        });

        cb();

    }

};