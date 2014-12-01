/**
* Permission.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {

  	name: {
  		type: 'string'
  	},

  	description: {
  		type: 'string'
  	},

  	controller: {
  		type: 'string'
  	},

  	action: {
  		type: 'string'
  	},
  	// this is a name for the reqested role. For example user.can('perform_some_task') returns boolean
  	activity: {	
  		type: 'string',
  		//@TODO:: Create a method to pull the activity by name
  		unique: true,
  		required: true
  	},

  	roles: {
  		collection: 'role',
  		via: 'permissions'
  	}

  }
};

