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

        creator: {
            model: 'user'
        },

        hosts: {
            collection: 'host',
            via: 'domain'
            //type: 'string',
            //unique: true
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

        view: {
            type: 'json'
        },

        tags: {
            collection: 'tag',
            via: 'domains',
            dominant: true
        }

    },

    establish: function(host, callback) {
        // we pull pull from the host model to find our domain
        Host.findOneByPath(host).populate('domain').exec(callback);
    },

    seeds: function(cb) {
        var plant = function(cb) {

            /*


    name: {
        type: 'string'
    },

    path: {
        type: 'string'
    },

    owner: {
        model: 'user'
    },  

    domain: {
        model: 'domain'
    }


            */


            Domain.create(
                [

                // {
                //         name: 'visy',
                //         key: 'root',
                //         owner: 1,
                //         hosts: [{
                //             path: 'localhost',
                //             name: 'LocalHost',
                //             owner: 1
                //         }, {
                //             path: 'visy.com',
                //             name: 'Visy',
                //             owner: 1
                //         }],
                //         public: false
                //     }, 

                    {
                        name: 'guernica Softworks',
                        key: 'gSoft',
                        creator: 1,
                        hosts: [{
                            path: 'guernicasoftworks.com',
                            name: 'guernica Softworsks',
                            creator: 1
                        }, {
                            path: 'gsoft',
                            name: 'guernica Softworsks Local',
                            creator: 1
                        }],
                        public: false
                    },

                    {
                        name: 'Fake 1',
                        key: 'fake1',
                        creator: 1,
                        hosts: [{
                            path: 'fake.com',
                            name: 'Fake 1'
                        }],
                        public: false
                    },

                    {
                        name: 'Fake 2',
                        key: 'fake2',
                        creator: 2,
                        hosts: [{
                            path: 'fake2.com',
                            name: 'Fake 2'
                        }],
                        public: false
                    },

                    {
                        name: 'Fake 3',
                        key: 'fake3',
                        creator: 2,
                        hosts: [{
                            path: 'fake3.com',
                            name: 'Fake 3'
                        }],
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