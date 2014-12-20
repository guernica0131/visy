(function() {

    angular.module('models', [
        // add models here
        'models.role',
        'models.user',
        'models.permission'


    ])

    .constant('Modeling', {
        role: {
            model: 'RoleModel'
        },

        user: {
            model: 'UserModel',
        },

        permission: {
            model: 'PermissionModel'
        }

    })


    .service('Model', ['$q', 'lodash', 'utils', '$sails', '$timeout', 'Authenticate',
        function($q, lodash, utils, $sails, $timeout, Authenticate) {

            /*
             * Privates
             */

            var _init = function(callback) {

                if ($sails.socket.connected)
                    return callback();
                // potential logical error. If the connection
                // happends before this, then what? Need to reconsider the function
                $sails.on('connect', function() {
                    callback();
                });

            };

            var _connect = function(method, url, params) {

                var deferred = $q.defer();


                _init(function() {
                    $sails[method](url, params).success(function(models) {
                        return deferred.resolve(models);
                    }).error(function(why) {
                        return deferred.reject(why);
                    });

                });

                return deferred.promise;
            };


            /*
             * Model
             *
             * @description : Constructor of the object function
             * @param {string} model : the object type being created
             */
            var Model = function(model, modelName, $scope) {

                this.url = utils.prepareUrl(model);
                this.$scope = $scope;
                this.modelName = modelName;
                this.model = model;

                var self = this;

                if (!this.$scope[this.modelName])
                    this.$scope[this.modelName] = [];
            };

            /*
             * setPermissions
             *
             * @description : this model calls the api, asks for the avaible permissions,
             * it then asks of the user can perform a model action
             * @param {number} user : optional user id. If ommitted, the session user is pulled
             * @params {object} space : the space for searching permits
             *
             */
            Model.prototype.setPermissions = function(user, space) {
                this.$scope.permits[this.model] = {};

                var self = this;

                var url = self.url + '/permissions';

                _connect('get', url, null).then(function(options) {

                    var u = new Authenticate.User();
                    // now we can user.can to see if the user can perform the various actions
                    u.can(options, user, space).then(function(res) {
                        self.$scope.permits[self.model] = res;
                    }, function(why) {
                        self.clearPermissions();
                        console.error("Rejected", why);
                    });

                }, console.error);


            };

            Model.prototype.clearPermissions = function() {
                this.$scope.permits[this.model] = {};
            }

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
            Model.prototype.listen = function(callback) {
                this.register(function(message) {

                    var id = parseInt(message.id),
                        index = lodash.indexOf(lodash.pluck(this.$scope[this.modelName], 'id'), id);

                    if (index === -1 && message.verb !== 'created')
                        return callback(message, index);

                    switch (message.verb) {
                        case 'created':
                            this.$scope[this.modelName].push(message.data);
                            index = this.$scope[this.modelName].length;
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

                    if (callback && lodash.isFunction(callback))
                        callback(message, index);

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


                _connect('get', url, params).then(function(res) {
                    if (!soft)
                        self.$scope[self.modelName] = (lodash.isArray(res)) ? res : [res];
                    return deferred.resolve(res);
                }, deferred.reject);



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

                _connect('post', self.url, newModel).then(function(res) {
                    // now we push the object into it's index
                    self.$scope[self.modelName].splice(index, 0, res);
                    deferred.resolve(res);
                }, function(why) {
                    if (!keep)
                        self.$scope[self.modelName].splice(index, 1);
                    // now we allert the dom
                    deferred.reject({
                        rejected: newModel,
                        why: why
                    });
                });


                return deferred.promise;
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
                //console.log("My preUpdate", preUpdate);

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

                _connect('put', url, changed).then(deferred.resolve, function(why) {
                    self.$scope[self.modelName][index] = preUpdate;
                    deferred.reject({
                        why: why,
                        rejected: preUpdate
                    }); // reject the promise
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


                _connect('delete', url, null).then(function(res) {
                    //console.log(res);
                    return deferred.resolve(res);
                }, function(why) {

                    self.$scope[self.modelName].splice(index, 0, deleted);
                    // here we would call the info directive
                    // console.error(why);
                    return deferred.reject({
                        why: why,
                        rejected: deleted
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


                _connect('get', url, null).then(function(res) {
                    return deferred.resolve(res);
                }, function(why) {
                    console.error(why);
                    return deferred.reject(why);
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
                _init(function() {
                    $sails.on(self.model, callback);
                });
            };

            return {
                object: Model
            }



        }
    ])

    .service('ModelEditor', ['lodash', '$q', '$rootScope',
        function(lodash, $q, $rootScope) {

            var getIndex = function(id, models) {
                //console.log("My index " + id, index);
                if (id)
                    return lodash.indexOf(lodash.pluck(models, 'id'), id);
                else
                    return -1;
            };

            var validate = function(model) {
                var definition = this.definition;

                var required = {};

                lodash.each(definition, function(el, key) {
                    // just doing required for now
                    if (el.required && !model[key]) {
                        required[key] = true;
                    }

                });

                return required;
            };

            var build = function(callback) {
                var unique = lodash.uniqueId('new_model_'),
                    // more generic from definitions
                    definition = this.definition,
                    obj = {
                        id: unique
                    };

                lodash.each(definition, function(el, key) {
                    // var type = {
                    // 	'boolean':false,
                    // 	'collection': [],
                    // 	'integer': 0,
                    // 	'json': {}, 
                    // }

                    if (!el.defaultsTo) {

                        switch (el.type) {
                            case 'boolean':
                                obj[key] = false;
                                break;
                            case 'collection':
                                obj[key] = [];
                                break;
                            case 'integer':
                                obj[key] = 0;
                                break;
                            case 'json':
                                obj[key] = {};
                                break;
                            default:
                                obj[key] = '';
                        };
                    } else
                        obj[key] = el.defaultsTo;

                });

                obj.editor = {
                    pivot: 2,
                    id: unique,
                    isNew: true
                };

                callback(obj);


            };



            var MView = function($scope, model, modelName) {


                this.$scope = $scope || $rootScope;
                this.mName = modelName || lodash.uniqueId('model_entities_');
                this.model = model;
                this.definition;

            };


            MView.prototype.start = function(listen, callback) {

                var model = this.model,
                    self = this;

                if (!model)
                    throw "The model for this action is currently undefined";
                if (listen)
                    model.listen();

                model.define().then(function(res) {
                    self.definition = res;
                })

                model.setPermissions();

                model.get().then(callback);


            };

            MView.prototype.create = function() {

                console.log("Creates");

                /*
                 * Here we create from the definitions
                 */
                var deferred = $q.defer(),
                    self = this,
                    builder = lodash.bind(build, this);
                builder(function(obj) {
                    self.$scope[self.mName].push(obj);
                    return deferred.resolve();
                });

                return deferred.promise;
            };


            MView.prototype.edit = function(model) {
                var deferred = $q.defer();

                model.editor.pivot ^= 2;
                model.editor.save = angular.copy(model);

                deferred.resolve();

                return deferred.promise;

            };

            MView.prototype.save = function(model) {

                var deferred = $q.defer();

                if (!model)
                    return;

                // we set our require variable
                var require = validate.bind(this);
                // this sets what is required
                model.editor.required = require(model);
                // if any are true we return;
                if (lodash.some(model.editor.required))
                    return;

                var self = this;
                // if we have a new object, we need to do a bit more
                if (model.editor.isNew) {

                    var saved = angular.copy(model),
                        index = getIndex(model.id, this.$scope[this.mName]);

                    // now kill it
                    this.$scope[this.mName].splice(index, 1);

                    delete model.id;
                    delete model.editor;

                    this.model.create(model, null, true).then(deferred.resolve, function(why) {
                        // if we fail we spice the old model back in
                        self.$scope[self.mName].splice(index, 0, saved);

                        return deferred.reject(nModel);
                    });

                    return deferred.promise;
                }

                var editor = angular.copy(model.editor);

                delete model.editor;
                // call the model's update
                this.model.update(model).then(deferred.resolve, function(rejection) {
                    console.error(rejection.why);
                    rejection.rejected.editor = editor;
                });

                return deferred.promise;

            };

            MView.prototype.delete = function(model) {
                var deferred = $q.defer();
                this.model.delete(model).then(deferred.resolve, deferred.reject);
                return deferred.promise;
            };

            MView.prototype.cancel = function(model) {

                var deferred = $q.defer(),
                    index = getIndex(model.id, this.$scope[this.mName]);

                if (model.editor.isNew)
                    return this.$scope[this.mName].splice(index, 1);

                var saved = angular.copy(model.editor.save);
                saved.editor = {
                    pivot: 0
                };

                this.$scope[this.mName][index] = angular.copy(saved);

                deferred.resolve();
                return deferred.promise;


            };


            return MView


        }
    ]);


})();