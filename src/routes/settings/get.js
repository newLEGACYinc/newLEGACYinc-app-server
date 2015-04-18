module.exports = function( db ) {

	// Library import
	var util = require( 'util' );

	return function settingsGet( req, res ) {
		var id = req.headers.id;
		var type = req.headers.type;

		// If id or type are missing
		if ( !id || !type ) {
			res.status( 400 ).send(
				util.format( 'Device ID and type Required. Got %s:%s',
					id, type )
			);
		} else {
			// Get the settings for the device from the database
			db.settings.get( id, type, function( err, settings ) {
				if ( err ) {
					console.log( err );
					res.status( 500 ).send( err );
					return;
				}
				res.status( 200 ).send( settings );
			} );
		}
	};
};
