/**
* Category.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  is: {
        permissible: true
    },

  attributes: {

  	name: {
  		type: 'string'
  	},

  	meta: {
  		type: 'json'
  	},

  	key: {
  		type: 'string',
  		unique: true
  	},

  	domains: {
  		collection: 'domain',
  		via: 'categories'
  	},

  	portals: {
  		collection: 'portal',
  		via: 'categories'
  	},

  	collections: {
  		collection: 'collection',
  		via: 'categories'
  	},

    owner: {
      model: 'user'
    }

  }
};

