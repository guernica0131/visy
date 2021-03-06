/**
 * Collection.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

module.exports = {

    is: {
        permissible: {
            children: ['document']
        }
        // space: {
        //     parent: 'portal'
        // } // feature Collections is not a space... yet
    },

    attributes: {

        name: {
            type: 'string'
        },

        owner: {
            model: 'user'
        },
        // @TODO:: consider making a set of modles the define/describe the 
        // functionality of a feature, making it more generic
        feature: { // features are responsible for creating documents that conform to a particular 
            // set of attributes. Features can run function, make api calls, or be accessed through the features controller
            model: 'feature'
        },

        meta: {
            type: 'json'
        },

        portals: {
            collection: 'portal',
            via: 'collections'
        },

        documents: {
            collection: 'document',
            via: 'collections',
            dominant: true
        },

        categories: {
            collection: 'category',
            via: 'collections',
            dominant: true
        },

        tags: {
            collection: 'tag',
            via: 'collections',
            dominant: true
        }

    },

    seeds: function(cb) {

        var associate = function(cb) {
            Collection.create([{
                name: 'I am a collection of features',
                key: 'gsoft-features',
                owner: 1,
                portals: [1]
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