/**
 * Bootstrap
 * (sails.config.bootstrap)
 *
 * An asynchronous bootstrap function that runs before your Sails app gets lifted.
 * This gives you an opportunity to set up your data model, run jobs, or perform some special logic.
 *
 * For more information on bootstrapping your app, check out:
 * http://sailsjs.org/#/documentation/reference/sails.config/sails.config.bootstrap.html
 */

module.exports.bootstrap = function(cb) {

    // It's very important to trigger this callback method when you are finished
    // with the bootstrap!  (otherwise your server will never lift, since it's waiting on the bootstrap)

    async.series([

        function(cb) {
            var params = sails.config._;
            // if we pass a seed parameter to the cli it will generate the default models
            if (sails.config.seed || _.contains(params, 'seed')) {
                var callback = function(err, model) {
                    if (err) sails.log.error(err);
                    sails.log(model);
                };
                var associations = [];
                // we iterate through the models 
                Object.keys(sails.models).forEach(function(key) {
                    var model = sails.models[key];
                    // if we have a seed function, we ensure it is defined and we can run it
                    if (model.seeds && _.isFunction(model.seeds)) {
                        seed = model.seeds();
                        // if the seed parameter is truthy, we plant the seed.
                        if (seed.seed) {
                            seed.plant(callback);
                        }

                        if (seed.associate && _.isFunction(seed.associate))
                            associations.push(seed.associate);
                    }

                });
                // associations is used for any associations we might make once
                // all of the base models have been established
                associations.forEach(function(associate) {
                    associate(callback);
                });

                cb();
            } else
            // might need to callback else where
                cb();

        },


        function(cb) {
            var passport = require('passport'),
                initialize = passport.initialize(),
                session = passport.session(),
                http = require('http'),
                methods = ['login', 'logIn', 'logout', 'logOut', 'isAuthenticated', 'isUnauthenticated'];

            sails.removeAllListeners('router:request');
            sails.on('router:request', function(req, res) {
                initialize(req, res, function() {
                    session(req, res, function(err) {
                        if (err) {
                            return sails.config[500](500, req, res);
                        }
                        for (var i = 0; i < methods.length; i++) {
                            req[methods[i]] = http.IncomingMessage.prototype[methods[i]].bind(req);
                        }
                        sails.router.route(req, res);
                    });
                });
            });
            cb();
        },

        function(cb) {
            Permission.buildPermissions(cb);
        }


    ], function() {

        ////////////////////////////////
        // All bootstrapping is finished
        ////////////////////////////////

        // execute the callback to start the server
        cb();
    })


};