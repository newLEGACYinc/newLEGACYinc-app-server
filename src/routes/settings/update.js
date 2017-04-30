module.exports = function( db ) {

	// Library import
	var util = require( 'util' );

	return function( req, res ) {
		var id = req.headers.id;
		var type = req.headers.type;

		// If id or type are missing
		if ( !id || !type ) {
			// Something is sending malformed requests to the server.
			const errorString = util.format(
				'Device ID and type Required. Got %s:%s', id, type );

			console.warn( errorString );
			res.status( 400 ).send( errorString );
			return;
		}

		db.settings.update( id, type, req.body, function( error ) {
			if ( error ) {
				console.error( error );
				return res.status( 500 ).send( error );
			}
			return res.status( 200 ).send();
		} );
	};
};
