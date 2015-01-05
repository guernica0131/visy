/**
 * Portal.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

module.exports = {

    is: {
        permissible: {
            children: ['collection']
        },
        space: {
            parent: 'domain'
        }
    },

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
            type: 'string'
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

    },

    seeds: function(cb) {

        var associate = function(cb) {
            Portal.create([{
                name: 'About',
                key: 'gsoft-about',
                owner: 1,
                path: 'guernicasoftworks.com/about',
                public: false,
                domains: [2]
            }], cb);
        };

        var plant = function(cb) {
            return cb(null, "pass");
        }
        return {
            seed: true,
            plant: plant,
            associate: associate
        }

    }
};