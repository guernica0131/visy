/**
* Portal.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {


  	name: {
  		type: 'string'
  	},

  	owner: {
  		model: 'user'
  	},

  	key: {
		type: 'string',
		unique: true
	},

	path: {
		type: 'urlish'
	},

	meta: {
  		type: 'json'
  	},

  	public: {
		type: 'boolean',
		defaultsTo: false
	},

  	domains: {
  		collection: 'domain',
  		via: 'portals'
  	},

  	collections: {
  		collection: 'collection',
  		via: 'portals',
  		dominant: true
  	},

  	categories: {
		collection: 'category',
		via: 'portals',
		dominant: true
	},

	tags: {
		collection: 'tag',
		via: 'portals',
		dominant: true
	}

  }
};

