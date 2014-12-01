/**
* Tag.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

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
  		via: 'tags'
  	},

  	portals: {
  		collection: 'portal',
  		via: 'tags'
  	},

  	collections: {
  		collection: 'collection',
  		via: 'tags'
  	},

  }
};

