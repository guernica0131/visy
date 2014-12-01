/**
* Domain.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {

  	name: {
		type: 'string'
	},

	key: {
		type: 'string',
		unique: true
	},

	owner: {
  		model: 'user'
  	},

	path: {
		type: 'urlish'
	},

	meta: {
  		type: 'json'
  	},

	members: {
		collection: 'user',
		via: 'domains',
		dominant: true
	},

	public: {
		type: 'boolean',
		defaultsTo: false
	},

	portals: {
		collection: 'portal',
		via: 'domains',
		dominant: true
	},

	categories: {
		collection: 'category',
		via: 'domains',
		dominant: true
	},

	tags: {
		collection: 'tag',
		via: 'domains',
		dominant: true
	}

  }
};

