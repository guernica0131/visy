/**
* PortalRole.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {


  	member: {
  		model: 'user'
  	},

  	portal: {
  		model: 'portal'
  	},

  	role: {
  		model: 'role'
  	}

  },

   seeds: function(cb) {

    var associate = function(cb) {
       PortalRole.create({
        member: 1,
        domain: 1,
        role: 3
       }, cb);
    };

    var plant = function(cb) {
       return cb(null, "pass");
    };

    return {
        seed: false,
        plant: plant,
        associate: associate
    } 
  }
};

