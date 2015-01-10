module.exports = function(req, res, next) {
	// first we find the domian
	console.log("Find the domian", req.param('domain') );

	if (req.isSocket)
		sails.log.info(req.url);

	var domain;
	if (req.param('domain') )
		domain = req.param('domain');


	// ok, first we look for a domian param. If found we load.

	// then we look in session. Hopefully it is there

	// then we look at the host.

	// then we fail the check

	next();
};