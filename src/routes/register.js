module.exports = function( db ) {
	return function( req, res ) {
		var id = req.body.id;
		var type = req.body.type;

		db.addRegistrationId( id, type, function( error ) {
			if ( error  ) {
				console.log( error );
				res.status( 500 ).send( );
			} else {
				res.status( 200 ).send( );
			}
		} );
	};
};
