module.exports = function( db ) {

	// Library import
	var util = require( 'util' );

	return function( req, res ) {
		var id = req.headers.id;
		var type = req.headers.type;

		// If id or type are missing
		if ( !id || !type ) {
			res.status( 400 ).send(
				util.format( 'Device ID and type Required. Got %s:%s',
					id, type )
			);
			return;
		}

		db.settings.update( id, type, req.body, function( err, data ) {
			if ( err ) {
				console.log( err );
				return res.status( 500 ).send( err );
			}
			return res.status( 200 ).send( data );
		} );
	};
};
