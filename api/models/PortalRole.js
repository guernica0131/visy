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

  }
};

