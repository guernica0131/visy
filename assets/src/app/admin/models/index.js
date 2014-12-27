(function() {

    angular.module('admin.models', [
        'admin.roles'
    ])

    .config(['$routeProvider', '$stateProvider', '$urlRouterProvider',
        function($routeProvider, $stateProvider, $urlRouterProvider) {



            $urlRouterProvider.when('/admin/models/', '/admin/models');


            // $urlRouterProvider.when('/admin/models', '/admin/models/');//.when('/admin/models/:/\w/i', '/admin/models/:/\w/i//');

            $stateProvider.state('models', {
                url: '/admin/models',
                controller: ['$scope', '$state', '$stateParams',
                    function($scope, $state, $stateParams) {
                        if ($state.is('models'))
                            $state.go('models.index');
                    }
                ],
                templateUrl: 'admin/models/layout.tpl.html', //'views/service/service.html',
            }).state('models.index', {
                //controller: 'ModelIndexController',
                templateUrl: 'admin/models/index.tpl.html'
            }).state('models.model', {
                url: '{param}',
                // controller: 'ModelIndexController',
                templateUrl: 'admin/models/models.tpl.html'
            }).state('models.association', {
                url: '/{model}/{id}/{association}',
                controller: 'ModelAssociationController',
                templateUrl: 'admin/models/association.tpl.html'
            }).state('models.model.render', {
                url: '/{model}',
                views: {
                    "admin.models": {
                        controller: 'ModelGeneratorController',
                        templateUrl: 'admin/models/render.tpl.html'
                    }
                },
                data: {
                    model: 'RoleModel',
                    name: 'role',
                    collection: 'roles',
                    heading: 'Role configuration'
                }
            });


        }


    ])

    .controller('ModelAssociationController', ['$scope', '$state', '$stateParams', '$injector', 'Plural', 'lodash',
        function ModelAssociationController($scope, $state, $stateParams, $injector, Plural, _) {

            var model = Plural($stateParams.model, 1),
                models = Plural($stateParams.model, 5),
                association = Plural($stateParams.association, 1),
                associations = Plural($stateParams.association, 5),
                cModel = _.capitalize(model),
                cAssociation = _.capitalize(association),
                Model,
                Association;


            var start = function() {

                try {

                    Model = $injector.get(cModel + "Model");
                    Association = $injector.get(cAssociation + "Model");

                } catch (e) {
                    return console.error(e);
                }


                var modeled = new Model($scope, model),
                    associated = new Association($scope, associations);


                //admin/models/roles/associations/permissions.tpl.html
                $scope.accTemplate = 'admin/models/' + models + '/associations/' + associations + '.tpl.html';

                $scope.Modeled = modeled;
                $scope.Associated = associated;


                // we need to assign scroll handlers to this and to the generic other

                modeled.get($stateParams.id).then(function() {
                    // console.log("Assoc controller", $scope.roles);
                }, console.error);
                // pulls the first 30 
                associated.get(null).then(function(res) {
                    //console.log(res);
                });


                associated.count().then(function(c) {
                    $scope.count = c.count;
                });

                $scope.isSelected = function(id) {

                    if (!$scope[model] || !$scope[model][0] || !$scope[model][0][associations])
                        return $scope.isSelected[id] = false;

                    $scope.isSelected[id] = _.contains(_.pluck($scope[model][0][associations], 'id' ), id)


                };

                $scope.setAssociation = function(id) {

                    



                    if ($scope.associating || !$scope[model] || !$scope[model][0] || !$scope[model][0][associations])
                        return;



                    var assoc = _.pluck($scope[model][0][associations], 'id'),
                        contains = _.contains(assoc, id);

                    
                    $scope.associating = true;

                    $scope.isSelected[id] = !contains;
                    if (contains)
                        assoc = _.pull(assoc, id);
                    else
                        assoc.push(id);

                    //assoc
                    var obj = {};

                    obj[associations] = assoc;

                    
                    $scope.Modeled.update($scope[model][0], obj).then(function(res) {
                        $scope.associating = false;
                    }, function(why) {
                        $scope.associating = false;
                        console.error(why);
                    });


                    



                };




            };


            if ($scope.ready)
                start();
            else
                $scope.$on('ready', function(e, ready) {
                    if (ready)
                        start();
                });


            $scope.isSelected = {};


        }
    ])




    .controller('ModelController', ['$scope', '$state', '$stateParams',
        function($scope, $state, $stateParams) {

        }
    ])


    .controller('ModelIndexController', ['$scope', '$state', '$stateParams',
        function($scope, $state, $stateParams, $injector) {





            // if (!$stateParams.model || !$state.get('models.model.' + $stateParams.model))
            // //if ($stateParams.model && $state.get('models.model.' + $stateParams.model))
            //    // $state.go('models.model.' + $stateParams.model , null , {replace:true});
            //     $state.go('models.index');
            //else 
            //  $state.go('models.index');

            // $scope.createModel = function() {
            //     console.log("hey");

            //     $scope.$broadcast('createModel');
            // }


        }
    ])





    .controller('ModelGeneratorController', ['$scope', '$state', '$injector', 'lodash', 'ModelEditor', '$stateParams', 'Plural',
        function($scope, $state, $injector, _, ModelEditor, $stateParams, Plural) {


            var model = Plural($stateParams.model, 1),
                models = Plural($stateParams.model, 5),
                cModel = _.capitalize(model),
                InjectedModel;




            try {

                if (model)
                    InjectedModel = $injector.get(cModel + "Model");
                else
                    return;
            } catch (e) {
                return console.error(e);
            }


            $scope.modelTemplate = 'admin/models/' + models + '/index.tpl.html';
            //console.log("Model gen controllers", model);
            var Model = new InjectedModel($scope, models)
            mView = new ModelEditor($scope, Model, models);


            $scope.Modeled = Model;
            $scope.Editor = mView;

            $scope.heading = cModel + ' configuration';
            $scope.modelName = model;
            $scope.collection = models;
            $scope.predicates = [{
                    name: 'Last Updated',
                    value: 'updatedAt'
                },

                {
                    name: 'Last Created',
                    value: 'createdAt'
                }, {
                    name: 'Name',
                    value: 'name'
                }

            ];

            $scope.buttonOptions = [{
                name: 'Edit',
                action: mView.edit.bind(mView)
            }, {
                name: 'Delete',
                action: mView.delete.bind(mView)
            }, {
                name: 'Save',
                action: mView.save.bind(mView)
            }, {
                name: 'Cancel',
                action: mView.cancel.bind(mView)
            }];
            /*
             * @consider
             */
            if ($scope.ready)
                mView.start(true);
            else
                $scope.$on('ready', function(e, ready) {
                    if (ready)
                        mView.start(true);
                });

            //$scope.$on('createModel', mView.create.bind(mView));
            $scope.$parent.createModel = mView.create.bind(mView);

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
    ])



})();