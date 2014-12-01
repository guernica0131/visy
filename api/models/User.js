/**
 * User.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

module.exports = {

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

        //@TODO::: check to see if this user has permission 
        can: function(activity) {
            var user = this.toObject();

            if (user.id === 1)
            	return true;


            return false;
        }

    },

    login: function(req, res, next) {
        passport.callback(req, res, function(err, user) {
          //  sails.log('in callback 2 ', user);
            req.login(user, function(err) {
            	if (err) return next(err);
               user.online = true;
               user.save(function(err, user) {});
               next(null, user);
            });
        });

    },

    logout: function(req, next) {

    	var user = req.user;

        if (!user)
          return next("user undefined", null);

        User.update(user.id, {online:false}, function(err, user) {});

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

    can: function(user) {

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


        	Role.findOneByKey('sysadmin').exec(function(err, role) {

        		console.log("My Role", role);

        		User.create([
            		{
            			username: 'guernica0131',
            			email: 'design@guernicasoftworks.com',
            			first_name: 'gSoft',
            			last_name: 'admin',
            			siterole: role.id,
            			passports: {
            				protocol: 'local',
            				password:  sails.config.adminpass
            			}
            		},
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