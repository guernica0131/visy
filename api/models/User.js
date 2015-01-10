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
        can: function(keys, space, callback) {
            var user = this.toObject();
            User.can(user, keys, space, callback);
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
     * We first seek role within the current space. If that isn't found, we cascade
     * up to the parent space (if found) and attempt to find the role there. This continues
     * until either a role is found or we land at the root. In which case, we pull siterole
     * This function will need tons of testing once we have everything im place.
     * For now we will ignore spaces space = {name: 'domain', id: 1}
     * @param {object} user - the user object in session
     * @param {string|array} keys - a single permission or an array of permissions we want to validate
     * @param {object} space - the name and id of the current session space
     * @param {function} callback - this returns either true false depending on if the role is permitted
     */
    can: function(user, keys, space, callback) {

        // we check if we are dealing with and array or a string
        var obj = {};
        var responses = {};

        // because we want to skip all processing for user 1
        // we assume the user can perform the task
        if (_.isArray(keys)) { // if array
            // this creats an object with all values set to true
            _.times(keys.length, function(i) {
                responses[keys[i]] = true;
            });
        } else { // if string
            responses[keys] = true;
        }
        // our god-mode user, can always do anything
        if (user && user.id === 1)
            return callback(responses);

        var Can = function(user, space, key, more) {
            //this.key = key;
            console.log("Presetuo", user);
            this.user = user;
            this.space = space;
            this.more = more;
            this.key = key;
            this.setup();

        };

        Can.prototype.setResponse = function(can) {
            //console.log("My responses " + this.key);
            responses[this.key] = can;
            // else
            // responses = can;
            if (!this.more) // at 0 we bail
                callback(responses);

        };
        /*
         * The trick is in fiding the appropriate role
         * based on the current space
         * @param {string} current_key - the string of the role key
         * @return {callback} - if the role can or cannot perform the task
         */
        Can.prototype._can = function(current_key) {
            sails.log("User._CAN?", current_key);
            // if no current_key, we return
            if (!current_key)
                return this.setResponse(false);

            var self = this;
            //console.log("In little key", current_key);
            Role.findOneByKey(current_key).populate('permissions').exec(function(err, role) {
                // if we have an error, we reject the request
                if (err || !role) return self.setResponse(false);
                // we see what keys the role has
                var permits = _.pluck(role.permissions, 'key');
                // if it contains the key
                if (_.contains(permits, self.key))
                    return self.setResponse(true); // we proceed
                // otherwise, we default to false
                return self.setResponse(false);
            });
        };

        /*
         * We use pull to search for a model and role of the user under a ModelRole model
         */
        Can.prototype._pull = function(Model, space) {

            if (!Model) // if we don't have a model, we automatically return the default role
                return this._can(this.user.siterole.key);

            var self = this;

            Model.findOne({
                id: space.id,
                member: this.user.id
            }).populate('role').exec(function(err, r) {
                if (err) // if we have an error, we just return with the default
                    return self._can(self.user.siterole.key);
                // since we have a user but the user has no role, we define his 
                // role as a visiting_user
                if (!r || !r.role || !r.role.key) // if there is not site role. 
                    return self._find(sails.models[space.name], space); // we attempt to find the parent role
                // otherwise, we pull his role
                return self._can(r.role.key, more);
            });

        };

        /*
         * We use find to find the parent model and it's accociated ID
         */
        Can.prototype._find = function(Model, space) {


            // if there is a parent space, we try to find it
            if (Model && Model.is && Model.is.space && Model.is.space.parent) {

                if (Model.is.space.parent === 'root') // if the parent is the root
                    return this._pull(null, null); // we simply pull the users role

                // we need to get the name of the alias we created for the association
                var associations = Model.associations,
                    attributes = _.where(associations, {
                        collection: Model.is.space.parent
                    });

                if (!attributes || _.isEmpty(attributes))
                    return this._pull(null, null); // we simply pull the users role

                var self = this;

                Model.findOne({
                    id: space.id
                    ///member: user.id
                }).populate(attributes[0].alias).exec(function(err, model) {

                    if (err || !model) return self._can(self.user.siterole.key);

                    // now if we have a parent role model
                    var parent;
                    if (parent = sails.models[Model.is.space.parent + 'role']) {
                        self._pull(parent, {
                            name: Model.is.space.parent,
                            id: model.id
                        }); // we pull from the parent role
                    } else { // then we send portal back through in an attempt to find the parent role
                        var Mod = sails.models[Model.is.space.parent];
                        self._find(Mod, {
                            name: Model.is.space.parent,
                            id: model.id
                        });
                    }

                });

            } else // otherwise, we default to the users site role
                this._pull(null, null);

        };

        Can.prototype.setup = function(key, more) {

            var self = this;

            if (!self.user)
                return self._can('anonymous_user');
            else {
                // here we set a space and ask, whats the role
                if (space && space.name != 'root') {
                    //this._find(sails.models[space.name], this.space); /// LOGICAL ERROR
                    // // if we can pull from this scope, we proceed
                    if (sRole = sails.models[space.name + 'role']) //we create the inital case to avoid 
                        self._pull(sRole, space);
                    else // otherwise, we need to pull from up the hierarchy
                        self._find(sails.models[space.name], space);
                } else {
                    // if there is no has no object role, then we default to 
                    // the site role.
                    if (this.user.siterole && this.user.siterole.key)
                        self._can(this.user.siterole.key);
                    else //otherwise we default to annonymous
                        self._can('anonymous_user');
                }

            }


        };


        var more = 0;
        // if we have an array, we process each one
        if (_.isArray(keys)) {
            // we make sure we are not processing the same values
            var keys = _.unique(keys);
            // now we iterate
            keys.forEach(function(key, i) {
                // more decrements as the keys increment
                more = ((keys.length - 1) - i);
                new Can(user, space, key, more);
            });
        } else { // for a string
            new Can(user, space, keys, more);
        }


    },

    login: function(req, res, next) {
        passport.callback(req, res, function(err, user) {
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

                //console.log("My Role", role);

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
                    }



                ], cb);


            });

            Role.findOneByKey('authenticated_user').exec(function(err, role) {


                User.create([{
                        username: 'user',
                        email: 'guernica0131@yahoo.com',
                        first_name: 'Test',
                        last_name: 'User',
                        siterole: role.id,
                        passports: {
                            protocol: 'local',
                            password: sails.config.userpass
                        }
                    }

                ], cb);

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