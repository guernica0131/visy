module.exports = function(req, res, next) {


	/*
	* Purpse: filters out the  
	*
	*
	*
	*/


 console.log("Filtering", res.locals.can );

	 ///req.params.all()['id'] = '3';
	// //req.param('id') = '1';
	// console.log("Filtering 2", req.params.all() )



//	req.params['id'] = 1;	


	next();
}