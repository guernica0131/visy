/**
 * UserController
 *
 * @description :: Server-side logic for managing Users
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {

    getAll: function(req, res) {
        User.getAll()
            .spread(function(models) {
                console.log('in getAll user', models)

                res.json({
                    data: models
                });
            })
            .fail(function(err) {
                // An error occured
            });
    },


    getOne: function(req, res) {
        User.getOne(req.param('id'))
            .spread(function(model) {
                console.log('in getOne user', model)
                res.json(model);
            })
            .fail(function(err) {
                // res.send(404);
            });
    },

    /*
    * @TODO::  Use HTTP methods for extra functionality
    */
    can: function(req, res, next) {

        var can = req.param('can'),
            space = req.param('space') || req.session.space,
            user = req.param('user') || req.user;

        if (!can)
        	return res.badRequest("Can what? I need a valid question to process request");

        if (!user)
            return res.badRequest("I need a valid user to process request");

        if (!space)
            return res.badRequest("I need a valid space to process request");


        if (_.isObject(user))
            user = user.id;
        // make this a promise
        User.findOneById(user).populate('siterole').exec(function(err, user) {
            if (err)
                res.serverError("There was an error processing this user");

            user.can(can, space, function canDo(can) {
            	res.send(can);
            });



        });



    },

    /*
model for roles
switch (project.role) {
 case -3:
 project.roleText = "Administrator";
 break;
 case -2:
 project.roleText = "Manager (Primary)";
 break;
 case -1:
 project.roleText = "Manager";
 break;
 case 0:
 project.roleText = "Viewer";
 break;
 case 1:
 project.roleText = "User";
 break;
 }*/
    // create: function(req, res) {
    //     console.log(req.params.all);
    //     var model = {
    //         username: req.param('username'),
    //         email: req.param('email'),
    //         first_name: req.param('first_name'),
    //         role: req.param('role')
    //     };

    //     User.create(model)
    //         .exec(function(err, model) {
    //             if (err) {
    //                 return console.log(err);
    //             } else {
    //                 User.publishCreate(model.toJSON());
    //                 res.json(model);
    //             }
    //         });
    // }

};