/**
 * DomainController
 *
 * @description :: Server-side logic for managing Domains
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */



module.exports = {

	// we will need to override these controller actions
    find: function(req, res, next) {
    	permissions.controllers.domain.find(req, res);
    },

    // we will need to override these controller actions
    findOne: function(req, res) {
    	permissions.controllers.domain.find(req, res);
    }	



};