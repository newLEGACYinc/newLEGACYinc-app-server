module.exports = function( db ) {
	return function( req, res ) {
		var id = req.body.id;
		var type = req.body.type;

		// TODO handle if the id or type are undefined
		db.addRegistrationId( id, type, function( err, results ) {
			// We're not concerned about creating duplicate entries
			// (we expect the same device to attempt to register multiple times)
			// any other error should be a server error
			if ( err && err.code !== 'ER_DUP_ENTRY' ) {
				console.log( err );
				res.status( 500 ).send( err );
			} else {
				res.status( 200 ).send( 'Ok' );
			}
		} );
	};
};
