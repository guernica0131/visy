/**
 * Domain.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

module.exports = {

    is: {
        permissible: true,
        space: {
            parent: 'root',
            child: 'portal'
        }
    },

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
            type: 'string',
            unique: true
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

    },

    seeds: function(cb) {
        var plant = function(cb) {


            Domain.create(
               [ {
                    name: 'visy',
                    key: 'root',
                    owner: 1,
                    path: 'visy.com',
                    public: false
                }, {
                    name: 'guernica Softworks',
                    key: 'gSoft',
                    owner: 1,
                    path: 'guernicasoftworks.com',
                    public: false
                }
            ], cb);
        }
        return {
            seed: true,
            plant: plant
        }

    }

};