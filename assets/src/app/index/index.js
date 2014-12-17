angular.module('vissy.index', ['ngRoute'])

//     .config( ['$stateProvider', function config( $stateProvider ) {
//         $stateProvider.state( 'Index', {
// 		url: '/',
// 		views: {
// 			"index": {
// 				controller: 'IndexCtrl',
// 				templateUrl: 'index/index.tpl.html'
// 			}
// 		}
// 	});
// }])

.config(['$routeProvider',
    function($routeProvider) {
        $routeProvider.when('/', {
            templateUrl: 'index/index.tpl.html', //'views/service/service.html',
            controller: 'IndexCtrl',
            reloadOnSearch: false
        })

    }
]).service('ModelView' ['lodash',
    function(lodash) {


        var getIndex = function(id, models) {
            //console.log("My index " + id, index);
            if (id)
                return lodash.indexOf(lodash.pluck(models, 'id'), id);
            else
                return -1;
        };


        var buttons = {
                name: 'Edit',
                action: function(model) {
                    model.editor.pivot ^= 2;
                    model.editor.save = angular.copy(model);

                }
            },
            {
                name: 'Delete',
                action: function(model) {

                    var perform = function(index, mName) {

                        role.delete(model).then(function(res) {

                        }, console.error);
                    };

                    perform(model);




                    // var modalInstance = $modal.open({
                    //     template: '<h3>Im a modal!</h3><p>Are you sure?</p><button class="button" ng-click="ok()">OK</button><a class="close-reveal-modal" ng-click="cancel()">&#215;</a>',
                    //     // controller: 'IndexCtrl',
                    //     resolve: {
                    //         // items: function() {
                    //         //     return $scope.items;
                    //         // }
                    //     }
                    // });

                    // modalInstance.result.then(function(selectedItem) {
                    //     console.log(selectItem);
                    // }, function() {
                    //     console.info('Modal dismissed at: ' + new Date());
                    // });



                    //action('delete', index);

                }
            }, {
                name: 'Save',
                action: function(model) {
                    //var model = $scope[mName][index];

                    if (!model)
                        return;

                    // validations, need a better way more generic
                    if (!model.name) { // pull the definitions an find the required
                        // attributes // MUCHJCHCHCHCHCH MORE
                        return model.editor.required = {
                            name: true
                        };
                    }

                    model.editor.required = {};

                    // if we have a new object, we need to do a bit more
                    if (model.editor.isNew) {

                        var saved = angular.copy(model),
                            index = $scope.getIndex(model.id);

                        // now kill it
                        $scope[mName].splice(index, 1);

                        delete model.id;
                        delete model.editor;

                        return role.create(model, null, true).then(function(nModel) {}, function(why) {
                            // if we fail we spice the old model back in
                            $scope[mName].splice(index, 0, saved);
                        });


                    }

                    delete model.editor;

                    // let's toggle the editor
                    //$scope.editor[mName][index]['pivot'] ^= 2;
                    // call the model's update
                    role.update(model).then(function(res) {

                    }, console.error);
                }
            }, {
                name: 'Cancel',
                action: function(model) {

                    var index = $scope.getIndex(model.id);

                    if (model.editor.isNew)
                        return $scope[mName].splice(index, 1);

                    var saved = angular.copy(model.editor.save);
                    saved.editor = {
                        pivot: 0
                    };
                    $scope[mName][index] = angular.copy(saved);

                }
            }


        var MView = function(model, modelName, $scope) {

            this.$scope = $scope;
            this.mName = modelName;
            this.model = model;

        };


        MView.prototype.start = function(listen, callback) {

            var model = this.model;

            if (!model)
                throw "The model for this action is currently undefined";
            if (listen)
                model.listen();

            model.define().then(function(res) {
                console.log("Defining", res);
            })

            model.setPermissions();

            model.get().then(callback);


        };

        MView.prototype.create = function(model) {

        };


        MView.prototype.edit = function(model) {

        };

        MView.prototype.save = function(model) {

        };

        MView.prototype.delete = function(model) {
            this.model.delete(model).then(function(res) {}, console.error);
        };

        MView.prototype.cancel = function(model) {

            var index = getIndex(model.id);

            if (model.editor.isNew)
                return this.$scope[this.mName].splice(index, 1);

            var saved = angular.copy(model.editor.save);
            saved.editor = {
                pivot: 0
            };
            this.$scope[this.mName][index] = angular.copy(saved);

        };





        return MView


    }
])

.controller('IndexCtrl', ['$scope', 'RoleModel', '$timeout', 'lodash', '$modal',
    function IndexController($scope, RoleModel, $timeout, lodash, $modal) {
        console.log("I am in a state");


        var mName = 'roles',
            role = new RoleModel($scope, mName);

        // $scope.editor = {};
        // $scope.editor[mName] = [];


        $scope.buttonOptions = [{
            name: 'Edit',
            action: function(model) {

                model.editor.pivot ^= 2;
                model.editor.save = angular.copy(model);

            }
        }, {
            name: 'Delete',
            action: function(model) {

                var perform = function(index, mName) {

                    role.delete(model).then(function(res) {

                    }, console.error);
                };

                perform(model);




                // var modalInstance = $modal.open({
                //     template: '<h3>Im a modal!</h3><p>Are you sure?</p><button class="button" ng-click="ok()">OK</button><a class="close-reveal-modal" ng-click="cancel()">&#215;</a>',
                //     // controller: 'IndexCtrl',
                //     resolve: {
                //         // items: function() {
                //         //     return $scope.items;
                //         // }
                //     }
                // });

                // modalInstance.result.then(function(selectedItem) {
                //     console.log(selectItem);
                // }, function() {
                //     console.info('Modal dismissed at: ' + new Date());
                // });



                //action('delete', index);

            }
        }, {
            name: 'Save',
            action: function(model) {
                //var model = $scope[mName][index];

                if (!model)
                    return;

                // validations, need a better way more generic
                if (!model.name) { // pull the definitions an find the required
                    // attributes // MUCHJCHCHCHCHCH MORE
                    return model.editor.required = {
                        name: true
                    };
                }

                model.editor.required = {};

                // if we have a new object, we need to do a bit more
                if (model.editor.isNew) {

                    var saved = angular.copy(model),
                        index = $scope.getIndex(model.id);

                    // now kill it
                    $scope[mName].splice(index, 1);

                    delete model.id;
                    delete model.editor;

                    return role.create(model, null, true).then(function(nModel) {}, function(why) {
                        // if we fail we spice the old model back in
                        $scope[mName].splice(index, 0, saved);
                    });


                }

                delete model.editor;

                // let's toggle the editor
                //$scope.editor[mName][index]['pivot'] ^= 2;
                // call the model's update
                role.update(model).then(function(res) {

                }, console.error);
            }
        }, {
            name: 'Cancel',
            action: function(model) {

                var index = $scope.getIndex(model.id);

                if (model.editor.isNew)
                    return $scope[mName].splice(index, 1);

                var saved = angular.copy(model.editor.save);
                saved.editor = {
                    pivot: 0
                };
                $scope[mName][index] = angular.copy(saved);

            }
        }];

        var init = function(model, mName callback) {

            if (!model)
                throw "I am stuck";

            model.listen();

            model.define().then(function(res) {
                console.log("Defining", res);
            })

            model.setPermissions();

            model.get().then(callback);

        }


        /*
         * @consider
         */
        $scope.$on('ready', function(e, ready) {
            if (ready)
                init(role);
        });

        $scope.getIndex = function(id, index) {
            //console.log("My index " + id, index);
            if (id)
                return lodash.indexOf(lodash.pluck($scope[mName], 'id'), id);
            else if (index)
                return index;
            else
                return -1;
        };

        $scope.create = function() {
            console.log("HEy");

            var unique = lodash.uniqueId('new_model_');
            // more generic from definitions
            var role = {

                name: '',
                id: unique,
                description: '',
                key: 'generic_key',
                precedence: -100,
                editor: {
                    pivot: 2,
                    id: unique,
                    isNew: true
                }

            };


            $scope[mName].push(role);

            // console.log("Pushing it" , $scope[mName]);

            // $scope.editor[mName].push({
            //     pivot: 2,
            //     isNew: true
            // });


            /*
        	*"permissions": [],
    "name": "Administrator",
    "description": "This role creates an administrative role",
    "key": "admin",
    "precedence": 5,
    "perishable": false,
    "badge": "Vintage_badges2.png",
    "createdAt": "2014-12-16T11:01:13.936Z",
    "updatedAt": "2014-12-16T11:01:13.936Z",
    "id": 2
        	*
        	*/

        };

        $scope.changeModelState = function(model, state) {

            state = state || 0;

            if (!model.editor)
                model.editor = {
                    pivot: 0
                };

            s = $scope.buttonOptions[(model.editor.pivot + state)];
            if (s && s.action)
                s.action(model);
        };




    }
]);