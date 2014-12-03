/**
 * User.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

var Q = require('q');

module.exports = {
    is: {
        permissible: true
    },

    attributes: {

        username: {
            type: 'string',
            required: false,
            unique: true
        },
        email: {
            type: 'email',
            required: true,
            unique: true
        },
        first_name: {
            type: 'string',
            required: false
        },
        last_name: {
            type: 'string',
            required: true
        },
        // system-level roles
        siterole: {
            model: 'role',
        },

        domains: {
            collection: 'domain',
            via: 'members'
        },

        apitoken: {
            type: 'uuidv4',
            unique: true
        },

        online: {
            type: 'boolean',
            defaultsTo: false
        },

        passports: {
            collection: 'Passport',
            via: 'user'
        },

        creator: {
            model: 'user'
        },

        //@TODO::: check to see if this user has permission 
        can: function(activities, callback) {
            console.log("Littel can");
            var user = this.toObject();
            User.can(user, activities, callback);
        }

    },

    /*
     * Is the user a member of a space. Is the space public?
     * If neither, reject it. If the user is not a member but it is
     * public, we need to define rules for what this user can do as a
     * non-member role
     */
    space: function() {

    },

    /*
     * We use can for determining is a user has permission within a certain role
     * This function will need tons of testing once we have everything im place.
     * For now we will ignore spaces space = {name: 'domain', id: 1}
     */
    can: function(user, key, space, callback) {
        // our god-mode user, can always do anything
        if (user && user.id === 1)
            return callback(true);
        /*
         * The trick is in fiding the appropriate role
         * based on the current space
         */
        var _can = (function(current_key) {
                console.log("In _CAN!!!!!!!", current_key);
                // if no current_key, we return
                if (!current_key)
                    return callback(false);
                //console.log("In little key", current_key);
                Role.findOneByKey(current_key).populate('permissions').exec(function(err, role) {
                    // if we have an error, we reject the request
                    if (err) return callback(false);
                    // we see what keys the role has
                    var permits = _.pluck(role.permissions, 'key');
                    // if it contains the key
                    if (_.contains(permits, key))
                        return callback(true); // we proceed
                    // otherwise, we default to false
                    callback(false);
                });
            });

        /*
        * We use pull to search for a model and role of the user under a ModelRole model
        */
        var _pull = (function(Model, space, user) {



            if (!Model) // if we don't have a model, we authomatically return the default role
                return _can(user.siterole.key);

                 Model.findOne({
                    id: space.id,
                    member: user.id
                }).populate('role').exec(function(err, r) {
                    if (err) // if we have an error, we just return with the default
                        return _can(user.siterole.key);
                    // since we have a user but the user has no role, we define his 
                    // role as a visiting_user
                    if (!r || !r.role || !r.role.key) // if there is not site role. 
                        return _find(sails.models[space.name], space, user); // we attempt to find the parent role
                    // otherwise, we pull his role
                    return _can(r.role.key);
                });

        });
        
        /*
        * We use find to find the parent model and it's accociated ID
        */
        var _find = (function(Model, space, user) {
            // if there is a parent space, we try to find it
             if (Model && Model.is && Model.is.space && Model.is.space.parent) { 

                if (Model.is.space.parent === 'root') // if the parent is the root
                     return _pull(null, null, user); // we simply pull the users role

                // we need to get the name of the alias we created for the association
                var associations = Model.associations,
                    attributes = _.where(associations, {collection: Model.is.space.parent});

                if (!attributes || _.isEmpty(attributes))
                    return _pull(null, null, user); // we simply pull the users role

                Model.findOne({  
                    id: space.id
                    ///member: user.id
                }).populate(attributes[0].alias).exec(function(err, model) {

                    if (err || !model) return _can(user.siterole.key);                    
                    
                    // now if we have a parent role model
                    var parent;
                    if (parent = sails.models[Model.is.space.parent + 'role']) {
                        _pull(parent, {name: Model.is.space.parent , id: model.id}, user); // we pull from the parent role
                    }
                         
                    else { // then we send portal back through in an attempt to find the parent role
                        var Mod = sails.models[Model.is.space.parent];
                        _find(Mod, {name: Model.is.space.parent , id: model.id}, user);
                    } 
                   
                });

            } else // otherwise, we default to the users site role
                _pull(null, null, user);

        }); 
            // space that will be search if it isn't root.
        var sRole;

        if (!user)
            return _can('anonymous_user');
        else {
            // here we set a space and ask, whats the role
            if (space && space.name != 'root') {
                // if we can pull from this scope, we proceed
                if (sRole = sails.models[space.name + 'role'])
                    _pull(sRole, space, user);
                else  // otherwise, we need to pull from up the hierarchy
                   _find(sails.models[space.name], space, user);
            } else {
                // if there is no has no object role, then we default to 
                // the site role.
                _can(user.siterole.key);
            }

        }
    },

    login: function(req, res, next) {
        passport.callback(req, res, function(err, user) {
            //  sails.log('in callback 2 ', user);
            req.login(user, function(err) {
                if (err) return next(err);
                user.online = true;
                user.save(function(err, user) { /* we can log if we want to */ });
                next(null, user);
            });
        });

    },

    logout: function(req, next) {

        var user = req.user;

        if (!user)
            return next("user undefined", null);

        User.update(user.id, {
            online: false
        }, function(err, user) {});

        req.session.authenticated = false; //jrt
        req.session.user = ''; //jrt
        req.logout();

        next(user);

    },

    beforeCreate: function(user, next) {

        user.apitoken = uuid();
        // I need some way to define 

        next(null, user);
    },

    getRole: function(user) {

    },

    getAll: function() {
        return User.find()
            .then(function(models) {
                return [models];
            });
    },

    getOne: function(id) {
        return User.findOne(id)
            .then(function(model) {
                return [model];
            });
    },
    insert: function(userObject) {

        User.create(userObject)
            .exec(function(err, newUser) {
                if (err) {

                    return err;
                } else {
                    sails.log(newUser);
                    return newUser;
                }
            });
    },


    seeds: function() {
        // @TODO:: look at associations
        var associate = function(cb) {


            Role.findOneByKey('system_admin').exec(function(err, role) {

                console.log("My Role", role);

                User.create([{
                    username: 'guernica0131',
                    email: 'design@guernicasoftworks.com',
                    first_name: 'gSoft',
                    last_name: 'admin',
                    siterole: role.id,
                    passports: {
                        protocol: 'local',
                        password: sails.config.adminpass
                    }
                }, ], cb);


            });
            // User.create([
            // ], cb);

        };

        var plant = function(cb) {
            cb(null, 'Create durring associations')
        };

        return {
            associate: associate,
            seed: true,
            plant: plant
        }
    }
};