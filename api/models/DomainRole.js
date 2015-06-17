/**
* DomainRole.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {

  	member: {
  		model: 'user'
  	},

  	domain: {
  		model: 'domain'
  	},

  	role: {
  		model: 'role'
  	}

  },

   seeds: function(cb) {

    var associate = function(cb) {
       DomainRole.create({
        member: 1,
        domain: 1,
        role: 2
       }, cb);
    };

    var plant = function(cb) {
       return cb(null, "pass");
    };

    return {
        seed: true,
        plant: plant,
        associate: associate
    } 
  }
};

