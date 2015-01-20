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

var Q = require('q');

module.exports.bootstrap = function(cb) {

    // It's very important to trigger this callback method when you are finished
    // with the bootstrap!  (otherwise your server will never lift, since it's waiting on the bootstrap)

    async.series([

        function(cb) {

            var params = sails.config._;
            // if we pass a seed parameter to the cli it will generate the default models
            if (sails.config.seed || _.contains(params, 'seed')) {

                var Seed = function() {
                    this.associations = [];
                };

                Seed.prototype.displayCallback = function(err, model) {
                    if (err) sails.log.error(err);
                     sails.log(model);
                };

                Seed.prototype.init = function(callback) {
                    sails.config.bootstrap.seeding = true;
                    var me = this,
                        error = function(err) {
                            sails.log.error(err);
                            sails.config.bootstrap.seeding = false;
                            callback();
                        };

                    me.plant().then(function() {
                        me.associate().then(function() {
                            // potential security risk. Do not seed while taking traffic
                            setTimeout(function() {
                                sails.config.bootstrap.seeding = false;
                            }, 2000);
                            
                            callback();
                        }, error);
                    }, error);

                };

                Seed.prototype.plant = function() {

                    var deferred = Q.defer(),
                        me = this;

                    async.forEach(Object.keys(sails.models), function(key, callback) {
                        var model = sails.models[key];
                        // if we have a seed
                        // function, we ensure it is defined and we can run it
                        if (model.seeds && model.seeds().seed) {
                            seed = model.seeds();
                            // if the seed parameter is truthy, we plant the seed.
                            if (seed.plant && _.isFunction(seed.plant))
                                seed.plant(me.displayCallback);

                            if (seed.associate && _.isFunction(seed.associate))
                                me.associations.push(seed.associate);
                        }

                        callback();
                    }, function(err) {
                        if (err) return deferred.reject(err);

                        deferred.resolve();
                    })

                    return deferred.promise;

                };

                Seed.prototype.associate = function() {

                    var deferred = Q.defer(),
                        me = this;

                    async.forEach(me.associations, function(associate, callback) {
                        //console.log("Associate", associate);
                        associate(me.displayCallback)
                        callback();
                    }, function(err) {
                        if (err) return deferred.reject(err);
                        deferred.resolve();
                    });

                    return deferred.promise;

                };

                var seed = new Seed();

                seed.init(cb);

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
                            return sails.log.error(err); //res.serverError(err);
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
        },

        // function(cb) {
        //     //console.log(sails.config.routes);
        //     var getPrefix = function() {
        //         return sails.config.blueprints.prefix;
        //     };


        //     var setRouteKey = function(routes, method, route, controller) {
        //         routes[method + " " + getPrefix() + route] = controller;
        //     };

        //     //setRouteKey(sails.config.routes, 'get', '/:model/permissions' ,'PermissionController.permissions');

        //     //console.log(sails.config.routes);

        //     cb();
        // }


    ], function() {

        ////////////////////////////////
        // All bootstrapping is finished
        ////////////////////////////////

        // execute the callback to start the server
        cb();
    })


};