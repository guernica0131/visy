angular.module('models', [
    // add models here
    'models.role'

])


.service('Model', ['$q', 'lodash', 'utils', '$sails', '$timeout',
    function($q, lodash, utils, $sails, $timeout) {



        /*
         * Model
         *
         * @description : Constructor of the object function
         * @param {string} model : the object type being created
         */
        var Model = function(model, modelName, $scope) {

            this.url = utils.prepareUrl(model);
            this.connected = false;
            this.$scope = $scope;
            this.modelName = modelName;
            this.model = model;
            var self = this;

            if (!this.$scope[this.modelName])
                this.$scope[this.modelName] = [];

            this.init = function(callback) {

                if ($sails.socket.connected)
                    return callback();

                $sails.on('connect', function() {
                    self.connected = true;
                    callback();
                });

            };

            this.connect = function(method, url, params) {

                var deferred = $q.defer();

                $sails[method](url, params).success(function(models) {
                    return deferred.resolve(models);
                }).error(function(why) {
                    return deferred.reject(why);
                });

                return deferred.promise;
            }


        };

        /*
         * getScoped
         *
         * @description : accessor for the scoped models
         * @return {array} models 
         */

        Model.prototype.getScoped = function() {
            return this.$scope[this.modelName];
        };

        /*
         * listen
         *
         * @description : activate auto listening for model changes
         */
        Model.prototype.listen = function() {
            this.register(function(message) {
                console.log("Socket message", message);

                var id = parseInt(message.id),
                    index = lodash.indexOf(lodash.pluck(this.$scope[this.modelName], 'id'), id);

                if (index === -1 && message.verb !== 'created')
                    return;

                switch (message.verb) {
                    case 'created':
                        this.$scope[this.modelName].push(message.data);
                        break;
                    case 'destroyed':
                        this.$scope[this.modelName].splice(index, 1);
                        break;
                    case 'updated':
                        this.$scope[this.modelName][index] = message.data;
                        break;
                        // @TODO ::  TEST, SHOULD BE COVERED BY UPDATE
                        // case 'addedTo':
                        // 	//{id: "20", verb: "addedTo", attribute: "permissions", addedId: 8}
                        // 	 var index = lodash.indexOf(lodash.pluck(this.$scope[this.modelName], 'id'), id);
                        //     if (index === -1)
                        //         return;

                        //     // I'll need to find the data
                        //     //this.$scope[this.modelName][index][message.attribute]

                        // break;
                        // case 'removedFrom': // dont know
                        // 	//{id: "16", verb: "removedFrom", attribute: "permissions", removedId: 8}
                        // 	var index = lodash.indexOf(lodash.pluck(this.$scope[this.modelName], 'id'), id);
                        //     if (index === -1)
                        //         return;

                        //     var obj = this.$scope[this.modelName][index],
                        //      removedIndex = lodash.indexOf(lodash.pluck(obj[this.modelName], 'id'), id);
                        // break;
                }

            }.bind(this));

        };

        /*
         * get
         *
         * @description : gets all or a single instance of a model.
         * @param {number|object} id : optional id for the one model
         * @param {object} params : the option query parameters
         * @param {boolean} soft : if true, the the element is not put
         *	into the scope.
         * @return {promise}
         */
        Model.prototype.get = function(id, params, soft) {
            var deferred = $q.defer();

            var url = this.url;

            if (id)
                url = url + '/' + id;

            var self = this;
            this.init(function() {

                self.connect('get', url, params).then(function(res) {
                	if (!soft)
                    	self.$scope[self.modelName] = (lodash.isArray(res)) ? res : [res];
                    return deferred.resolve(res);

                }, function(why) {
                    console.err(why);
                    return deferred.reject(why);
                })

            });

            return deferred.promise;
        };



        /*
         * create
         *
         * @description : creates a single instance of a model.
         * @param {object} newModel : the new model we create
         * @param {integer} posision : the placement for the model (@TODO: RETHINK)
         * @param {boolean} keep : if true, the function will not destrop the model
         * on error.
         * @return {promise}
         */

        Model.prototype.create = function(newModel, position, keep) {
            var deferred = $q.defer()
            index = position || this.$scope[this.modelName].length,
            self = this;

            this.$scope[this.modelName].splice(index, 0, newModel);



            this.init(function() {

                self.connect('post', self.url, newModel).then(function(res) {
                    console.log(res);
                    deferred.resolve(res);
                }, function(why) {
                    console.error(why);
                    if (!keep)
                        $timeout(function() {
                            self.$scope[self.modelName].splice(index, 1);
                        }, 500);

                    // now we allert the dom
                    deferred.reject(why);
                });
            });

            return deferred.promise;
        };


        var update = function() {

        };

        /*
         * update
         *
         * @TODO :::: MORE TESTING WITH VARIOUS OBJECTS
         * @description : updates a single instance of a model.
         * @param {number|object} model :  id or instance of a model
         * @param {object} updatedAttributes : the updated attributes
         * @param {string} options : tells the merge function how to deal with arrays
         * @return {promise}
         */
        Model.prototype.update = function(model, updatedAttributes, options) {
            // create the deferral
            var deferred = $q.defer(),
                id;

            if (!model) {
                deferred.reject('An id or an instance of your model is required for deletion.');
                return deferred.promise;
            }

            if (lodash.isObject(model) && model.id)
                id = model.id
            else
                id = model;

            var url = this.url + '/' + id,
                self = this,
                preUpdate = lodash.find(lodash.cloneDeep(this.$scope[this.modelName]), {
                    id: id
                }),
                index = lodash.indexOf(lodash.pluck(this.$scope[this.modelName], 'id'), id);
            // reject if we don't have a valid index
            if (index === -1) {
                deferred.reject('Invalid object');
                return deferred.promise;
            }
            // we merge the two inorder to ensure that changes made to one part of an object parameter does not change the other attribues
            /*
             * @example :
             * var old = {
             *   name: {
             *		first: "guernica",
             *		last: "Softworks"
             *	}
             * }
             *
             * var new = {
             *   name: {
             *		last: "Rocks!"
             *	}
             * }
             *
             * var update = {
             *   name: {
             *		first: "guernica",
             *		last: "Rocks!"
             *	}
             * }
             *
             */
            var changed = lodash.cloneDeep((lodash.merge(self.$scope[self.modelName][index], updatedAttributes, function(a, b) {
                if (lodash.isArray(a)) {
                    switch (options) {
                        case 'merge':
                            return a.concat(b);
                        default:
                            return a = b;
                    }
                }

            })));
            // call init to ensure we are conntected to our sockets
            this.init(function() {
                self.connect('put', url, changed).then(function(res) {
                    return deferred.resolve(res); // return the promise
                }, function(why) {
                    //self.$scope[self.modelName][index] = deleted;
                    $timeout(function() {
                        self.$scope[self.modelName][index] = preUpdate;
                    }, 500);
                    // here we would call the info directive
                    console.error(why);
                    return deferred.reject(why); // reject the promise
                });
            });

            return deferred.promise;

        };

        /*
         * delete
         *
         * @description : deletes a single instance of a model.
         * @param {object} model : the new model we create
         * @return {promise}
         */

        Model.prototype.delete = function(model) {
            var deferred = $q.defer();
            var id;

            if (!model) {
                defered.reject('An id or an instance of your model is required for deletion.');
                return deferred.promise;
            }

            if (lodash.isObject(model) && model.id)
                id = model.id
            else
                id = model;

            var url = this.url + '/' + id,
                self = this,
                deleted = lodash.find(this.$scope[this.modelName], {
                    id: id
                }),
                index = lodash.indexOf(lodash.pluck(this.$scope[this.modelName], 'id'), id);

            if (index === -1) {
                deferred.reject('Invalid object');
                return deferred.promise;
            }

            // now remove it from the dom!;
            this.$scope[this.modelName].splice(index, 1);

            this.init(function() {
                self.connect('delete', url, null).then(function(res) {
                    console.log(res);
                    return deferred.resolve(res);
                }, function(why) {
                    $timeout(function() {
                        self.$scope[self.modelName].splice(index, 0, deleted);
                    }, 500);
                    // here we would call the info directive
                    console.error(why);
                    return deferred.reject(why);
                });
            });

            return deferred.promise;


        };

        /*
         * define
         *
         * @description : pulls the json definition of the model from the api.
         * @example : Used for form building or validation
         * @return {promise}
         */
        Model.prototype.define = function() {
            var deferred = $q.defer(),
             url = this.url + '/define';

             var self = this;

            this.init(function() {
            	self.connect('get', url, null).then(function(res) {
            		return deferred.resolve(res);
            	}, function(why) {
					console.error(why);
                    return deferred.reject(why);
            	});
            });

            return deferred.promise;
        };

        /*
        * register
        *
        * @description : registers a function to the socket callback for changes.
        * @param {function} callback : calback that will be registered
        */
        Model.prototype.register = function(callback) {
            var self = this;
            this.init(function() {
                $sails.on(self.model, callback);
            });
        };

        return {
            object: Model
        }



    }
]);