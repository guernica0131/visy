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
        /*
         * Our first function manages application seeding
         * if there is a seed parameter as we lift, find the models with
         * seed objects and are active.
         */
        function(cb) {

            var params = sails.config._;
            // if we pass a seed parameter to the cli it will generate the default models
            if (sails.config.seed || _.contains(params, 'seed')) {
                /*
                 * The seed object manages our seeding process.
                 */
                var Seed = function() {
                    this.associations = [];
                };
                /*
                 * Common callback for displaying our the creation of models
                 *
                 * @param {Object} err : the error object
                 * @param {Object} model : the newly created object
                 */
                Seed.prototype.displayCallback = function(callback) {
                   
                    return function(err, model) {
                        if (err) sails.log.error(err);
                        sails.log(model);

                        if (callback && _.isFunction(callback)) {
                            callback();
                        }
                    }
                 
                };

                /*
                 * Init is used to run the seeding process
                 *
                 * @param {Function} callback
                 */
                Seed.prototype.init = function(callback) {
                    sails.config.bootstrap.seeding = true;
                    var self = this,
                        error = function(err) {
                            sails.log.error(err);
                            sails.config.bootstrap.seeding = false;
                            
                            if (_.isFunction(callback))
                                callback();
                        };



                    self.plant().then(function() {
                        self.associate().then(function() {
                            // potential security risk. Do not seed while taking traffic
                            setTimeout(function() {
                                sails.config.bootstrap.seeding = false;
                            }, 2000);

                            if (_.isFunction(callback))
                                callback();

                        }, error);
                    }, error);

                };
                /*
                 * Plants the seeds for model generation
                 *
                 * @return {promise}
                 */
                Seed.prototype.plant = function() {

                    var deferred = Q.defer(),
                        self = this;

                    async.forEach(Object.keys(sails.models), function(key, callback) {
                        var model = sails.models[key];
                        // if we have a seed
                        // function, we ensure it is defined and we can run it
                        if (model.seeds && model.seeds().seed) {
                            seed = model.seeds();

                            if (seed.associate && _.isFunction(seed.associate))
                                self.associations.push(seed.associate);

                            // if the seed parameter is truthy, we plant the seed.
                            if (seed.plant && _.isFunction(seed.plant))
                                seed.plant(self.displayCallback(callback) );
                            else
                                callback();

                            
                        } else {
                            callback();
                        }

                        //callback();
                    }, function(err) {
                        if (err) return deferred.reject(err);
                        deferred.resolve();
                    })

                    return deferred.promise;

                };

                /*
                 * The associate function is called once the inital planting
                 * takes place. This allow for us to create any dependent associations
                 */
                Seed.prototype.associate = function() {

                    var deferred = Q.defer(),
                        self = this;
                    
                    async.each(self.associations, function(associate, callback) {
                       
                        // the array contains the associate functions present in the models
                        associate(self.displayCallback());
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
                // need seed request so callback
                cb();

        },

        /*
         * This hack ensure that passport functions with websockets
         *
         * @see http://stackoverflow.com/questions/17365444/sails-js-passport-js-authentication-through-websockets#comment31049298_18343226
         */
        function(cb) {
            // pass through, fix is implemented in the policy
            // var passport = require('passport'),
            //     initialize = passport.initialize(),
            //     session = passport.session(),
            //     http = require('http'),
            //     methods = ['login', 'logIn', 'logout', 'logOut', 'isAuthenticated', 'isUnauthenticated'];

            // sails.removeAllListeners('router:request');

            // sails.on('router:request', function(req, res) {
            //     initialize(req, res, function() {
            //         session(req, res, function(err) {
            //             if (err) {
            //                 return sails.log.error(err); //res.serverError(err);
            //             }
            //             for (var i = 0; i < methods.length; i++) {
            //                 req[methods[i]] = http.IncomingMessage.prototype[methods[i]].bind(req);
            //             }
            //             sails.router.route(req, res);
            //         });
            //     });
            // });
            cb();
        },

        function(cb) {
            Permission.buildPermissions(cb);
        },


    ], function() {

        ////////////////////////////////
        // All bootstrapping is finished
        ////////////////////////////////

        // execute the callback to start the server
        cb();
    })


};