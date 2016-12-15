// http://stackoverflow.com/a/16800702/1222411
module.exports = function() {
	// Import libraries
	var mongoose = require( 'mongoose' );
	mongoose.connect( proces.env.DB_URL, { config: { autoIndex: false } } );

	var Device = mongoose.model( 'Device', {
		// Indexes
		id: { type: String, required: true, unique: true, index: true },
		type: { type: [ 'GCM' ], required: true }, // other types may be available later

		// Notification settings
		twitch: { type: Boolean, default: true },
		hitbox: { type: Boolean, default: true },
		youTube: { type: Boolean, default: true }
	} );

	// Import modules
	var settings = require( __dirname + '/settings' )();

	var addRegistrationId = function( id, type, callback ) {
		var newDevice = new Device( { id: id, type: type } );
		newDevice.save( function( error, device ) {
			// There might be an error (for example, for a duplicate entry). For now, that's okay.
			callback( false, device );
		} );
	};

	var getRegistrationIds = function( type, key, callback ) {
		var sql = 'SELECT (id) from devices WHERE type = ?';
		var inserts = [ type ];
		if ( key ) {
			sql += ' AND ?? = 1';
			inserts.push( key );
		}
		pool.getConnection( function( err, connection ) {
			if ( err ) {
				console.log( err );
				callback( err );
				return;
			}
			connection.query( sql, inserts, function( err, rows ) {
				connection.release();
				if ( err ) {
					console.log( err );
					callback( err );
					return;
				}
				var results = [];
				rows.forEach( function( row ) {
					results.push( row.id );
				} );
				callback( false, results );
			} );
		} );
	};

	/**
	 * Remove row from database
	 * @param id
	 */
	function removeRegistrationId( id ) {
		var sql = 'DELETE from devices WHERE id = ?';
		var inserts = [ id ];
		pool.getConnection( function( err, connection ) {
			if ( err ) {
				console.log( err );
				return;
			}
			connection.query( sql, inserts, function( err, rows ) {
				connection.release();
				if ( err ) {
					console.log( err );
					return;
				}
			} );
		} );
	}

	return {
		addRegistrationId: addRegistrationId,
		getRegistrationIds: getRegistrationIds,
		removeRegistrationId: removeRegistrationId,
		settings: settings
	};
};
