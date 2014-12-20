(function() {

    angular.module('admin.models', [
        'admin.roles'
    ])

    .config(['$routeProvider', '$stateProvider', '$urlRouterProvider',
        function($routeProvider, $stateProvider, $urlRouterProvider) {



            //$urlRouterProvider.when('/admin/models/:o', '/admin/models/:o/');


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
                controller: 'ModelIndexController',
                templateUrl: 'admin/models/index.tpl.html'
            }).state('models.model', {
                url: '{model}',
                controller: 'ModelIndexController',
                templateUrl: 'admin/models/models.tpl.html'
            }).state('models.association', {
                url: '/{model}/{id}/{association}',
                controller: 'ModelAssociationController',
                templateUrl: 'admin/models/association.tpl.html'
            }).state('models.model.roles', {
                url: '/roles',
                views: {
                    "admin.models": {
                        controller: 'ModelGeneratorController',
                        templateUrl: 'admin/models/roles/index.tpl.html'
                    }
                },
                data: {
                    model: 'RoleModel',
                    name: 'role',
                    collection: 'roles',
                    heading: 'Role configuration'
                }
            }).state('models.model.users', {
                url: '/users',
                views: {
                    "admin.models": {
                        controller: 'ModelGeneratorController',
                        templateUrl: 'admin/models/users/index.tpl.html'
                    }
                },
                data: {
                    model: 'UserModel',
                    name: 'user',
                    collection: 'users',
                    heading: 'User configuration'
                }
            })



        }


    ])

    .controller('ModelAssociationController', ['$scope', '$state', '$stateParams', '$injector', 'Plural', 'lodash',
        function ModelAssociationController($scope, $state, $stateParams, $injector, Plural, _) {
            console.log("Permission controller", $stateParams);



            var model = Plural($stateParams.model, 1),
                models = Plural($stateParams.model, 5),
                association = Plural($stateParams.association, 1),
                associations = Plural($stateParams.association, 5),
                cModel = _.capitalize(model),
                cAssociation = _.capitalize(association),
                Model,
                Association;

            try {

                Model = $injector.get(cModel + "Model");
                Association = $injector.get(cAssociation + "Model");

            } catch (e) {
                return console.error(e);
            }


            var modeled = new Model($scope, model),
                associated = new Model($scope, associations);


            //admin/models/roles/associations/permissions.tpl.html
            $scope.accTemplate = 'admin/models/roles/associations/permissions.tpl.html'; //'admin/models/' + models + '/associations/' + associations + '.tpl.html';

            $scope.modeled = modeled;
            $scope.associated = associated;


            // console.log("ASSOC1 model", 'admin/models/roles/associations/permissions.tpl.html');

            // console.log("ASSOC2 model", $scope.template);



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





    .controller('ModelGeneratorController', ['$scope', '$state', '$injector', 'lodash', 'ModelEditor',
        function($scope, $state, $injector, _, ModelEditor) {
            console.log("Model gen controllers", $state.current.data);



            var data = $state.current.data,
                InjectedModel;

            try {

                if (data.model)
                    InjectedModel = $injector.get(data.model);
                else
                    return;
            } catch (e) {
                return console.error(e);
            }

            var Model = new InjectedModel($scope, data.collection)
            mView = new ModelEditor($scope, Model, data.collection);

            $scope.heading = data.heading;
            $scope.modelName = data.name;
            $scope.collection = data.collection;
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


            // $scope.editor = {};
            // $scope.editor[mName] = [];
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