module.exports = function( db ) {

	// Library import
	var util = require( 'util' );

	return function settingsGet( req, res ) {
		var id = req.headers.id;
		var type = req.headers.type;

		// If id or type are missing
		if ( !id || !type ) {
			// Something is sending malformed requests to the server.
			const errorString = util.format(
				'Device ID and type Required. Got %s:%s', id, type );

			console.warn( errorString );
			res.status( 400 ).send( errorString );
		} else {
			// Get the settings for the device from the database
			db.settings.get( id, type, function( error, settings ) {
				if ( error ) {
					console.error( 'Error retrieving settings for device' );
					console.error( error );
					res.status( 500 ).send( error );
					return;
				}
				res.status( 200 ).send( settings );
			} );
		}
	};
};
