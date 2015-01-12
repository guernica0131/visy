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

        creator: {
            model: 'user'
        },

        key: {
            type: 'string',
            unique: true
        },

        path: {
            type: 'string'
        },

        view: {
            type: 'json'
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
                    creator: 1,
                    path: 'guernicasoftworks.com/about',
                    public: false,
                    domains: [2]
                },
                {
                    name: 'guernica Softworks',
                    key: 'gSoft',
                    creator: 1,
                    path: 'guernicasoftworks.com',
                    public: false,
                    domains: [2, 3]
                },

                {
                    name: 'Fake 1',
                    key: 'fake1',
                    creator: 1,
                    path: 'fake.com',
                    public: false,
                    domains: [1, 4]
                },

                {
                    name: 'Fake 2',
                    key: 'fake2',
                    creator: 1,
                    path: 'fake2.com',
                    public: false,
                    domains: [5]
                },

                {
                    name: 'Fake 3',
                    key: 'fake3',
                    creator: 2,
                    path: 'fake3.com',
                    public: false,
                    domains: [2, 3, 4, 5]
                }




            ], cb);
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