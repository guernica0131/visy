/**
 * Document.js
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

        owner: {
            model: 'user'
        },

        attributes: {
            type: 'json'
        },

        meta: {
            type: 'json'
        },

        collections: {
            collection: 'collection',
            via: 'documents'
        }

    }
};