/**
 * DomainController
 *
 * @description :: Server-side logic for managing Domains
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */



module.exports = {

	// we will need to override these controller actions
    find: function(req, res, next) {
    	permissions.controllers.owner(req, res);
    },

    // we will need to override these controller actions
    findOne: function(req, res) {
    	permissions.controllers.owner(req, res);
    },

    /*
    * TODO::: NEED A MECHANISM FOR CREATE WHERE THE USER CAN 
    * HAVE A TEMP TOKEN FOR PURCHASING DOMAINS
    */

    destroy: function(req, res) {
        permissions.controllers.owner(req, res);
    },

    update: function(req, res) {
        permissions.controllers.owner(req, res);
    }





};