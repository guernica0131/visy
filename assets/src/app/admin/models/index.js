(function() {

    angular.module('admin.models', [
        'admin.roles',
        'admin.domain'
    ])

    .config(['$stateProvider', 
        function($stateProvider) {



           // $urlRouterProvider.when('/admin/models/', '/admin/models');


            // $urlRouterProvider.when('/admin/models', '/admin/models/');//.when('/admin/models/:/\w/i', '/admin/models/:/\w/i//');

            $stateProvider.state('models', {
                url: '/admin/{domain}/models',
                controller: ['$scope', '$state', '$stateParams', 'DomainModel',
                    function($scope, $state, $stateParams, DomainModel) {
                        console.log("What is my domain", $stateParams.domain);

                        var domain = new DomainModel($scope, 'domain'),
                        dId = $stateParams.domain || 1;

                        domain.get(dId).then(function(d) {
                            console.log(d);
                        });

                        if ($state.is('models'))
                            $state.go('models.index');
                    }
                ],
                templateUrl: 'admin/models/layout.tpl.html', //'views/service/service.html',
            })
            // .state('models.domain', {
            //     url: '/{domain}/admin/models',
            //     controller: ['$scope', '$state', '$stateParams',
            //         function($scope, $state, $stateParams) {
            //             if ($state.is('models.domain'))
            //                 $state.go('models.domain.index');
            //         }
            //     ],
            //     templateUrl: 'admin/models/layout.tpl.html', //'views/service/service.html',
            // })
            // .state('models.domain.index', {
            //     //controller: 'ModelIndexController',
            //     templateUrl: 'admin/models/index.tpl.html'
            // })
            .state('models.index', {
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

    .controller('ModelAssociationController', ["$scope", "AssociateModel",
        function($scope, AssociateModel) {

            var aModel = new AssociateModel($scope, true);

            $scope.setAssociation = aModel.setAssociation.bind(aModel);

        }
    ])




    .controller('ModelController', ['$scope', '$state', '$stateParams',
        function($scope, $state, $stateParams) {

        }
    ])


    .controller('ModelIndexController', ['$scope', '$state', '$stateParams',
        function($scope, $state, $stateParams, $injector) {



        }
    ])





    .controller('ModelGeneratorController', ['$scope', '$state', '$injector', 'lodash', 'ModelEditor', '$stateParams', 'Plural',
        function($scope, $state, $injector, _, ModelEditor, $stateParams, Plural) {

            // @todo :: We should model this as well
            var model = Plural($stateParams.model, 1),
                models = Plural($stateParams.model, 5),
                cModel = _.capitalize(model),
                domain = $stateParams.domain,
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
            mView = new ModelEditor($scope, Model, models, true);


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