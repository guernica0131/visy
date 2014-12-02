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
        var can = function(current_key) {
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
        }
        // space that will be search if it isn't root.
        var sRole;

        if (!user)
            return can('anonymous_user');
        else {
            // here we set a space and ask, whats the role
            if (space && space.name != 'root' && (sRole = sails.models[space.name + 'role'])) {
            // now we find the user's role within the space. 
                sRole.findOne({
                id: space.id,
                member: user.id
            }).populate('role').exec(function(err, role) {
                if (err) // if we have an error, we just return false
                    return can(false);
                // since we have a user but the user has no role, we define his 
                // role as a visiting_user
                if (!role || role.key) // if there is not site role. we assume visiting user
                    return can('visiting_user');
                // otherwise, we pull his role
                can( role.key ); 
            });
           
          } else {
            // if there is no has no object role, then we default to 
            // the site role.
            can(user.siterole.key);
          } 
            
        }
    },

    login: function(req, res, next) {
        passport.callback(req, res, function(err, user) {
            //  sails.log('in callback 2 ', user);
            req.login(user, function(err) {
                if (err) return next(err);
                user.online = true;
                user.save(function(err, user) {/* we can log if we want to */});
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