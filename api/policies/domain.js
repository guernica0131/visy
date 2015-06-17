var Q = require('q');

module.exports = function(req, res, next) {
	// first we find the domian
	

	// if (req.isSocket)
	// 	sails.log.info(req.url);

	var domain;
	// if we have a request for a specific domain object
	// we honor that
	if (req.param('domain') ) 
		domain = req.param('domain');
	// we will then look in the session
	else if (req.session.domain && req.session.domain.id)
		domain = req.session.domain.id
	// if none is found we default to root
	else // we will assume that our domain ID of 0 is always root
		domain = 0;

	res.locals.domain = domain;

	// console.log("Find the domian", domain);


	// ok, first we look for a domian param. If found we load.

	// then we look in session. Hopefully it is there

	// then we look at the host.

	// then we fail the check

	next();
};