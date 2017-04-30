module.exports = function( db ) {
	return function( req, res ) {
		var id = req.body.id;
		var type = req.body.type;

		db.addRegistrationId( id, type, function( error ) {
			if ( error  ) {
				console.error( error );
				res.status( 500 ).send( );
			} else {
				console.trace( `New device added with ID ${id} and type ${type}` );
				res.status( 200 ).send( );
			}
		} );
	};
};
