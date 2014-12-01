/**
* Feature.js
*
* @description :: The feautres model is used to run system features. These features are adapted for each deployment use case. 
* The purpose of fearus is to create ducuments and run functions on document attributes. Additionally features can make API calls 
* or access SDK resources. Likewise, features will be made available through the features controller for client access. 
* Utimately, it is features that define the model functionality for the various deployments.
* 
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {

  	// features API HERE!
	name: {
		type: 'string'
	},

	meta: {
		type: 'json'
	},

	key: {
		type: 'string',
		unique: true,
		required: true
	},

	description: {
		type: 'string'
	}
	

  }
};

