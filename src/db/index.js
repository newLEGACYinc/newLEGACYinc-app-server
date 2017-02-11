// http://stackoverflow.com/a/16800702/1222411
module.exports = function() {
	// Import libraries
	var mongoose = require( 'mongoose' );
	mongoose.connect( process.env.MONGODB_URI );

	var mysql = require( 'mysql' );
	var mysqlConnectionPool = mysql.createPool( {
		'host': process.env.MYSQL_DB_HOST,
		'port': process.env.MYSQL_DB_PORT,
		'user': process.env.MYSQL_DB_USER,
		'password': process.env.MYSQL_DB_PASS,
		'database': process.env.MYSQL_DB_DATABASE,
		'connectionLimit': 5,
		'supportBigNumbers': true
	} );

	var deviceSchema = new mongoose.Schema( {
		// Indexes
		id: {
			type: String,
			required: true
		},
		type: {
			type: String,
			enum: [ 'GCM' ], // other types may be available later
			required: true
		},

		// Notification settings
		twitch: {
			type: Boolean,
			default: true
		},
		hitbox: {
			type: Boolean,
			default: true
		},
		youTube: {
			type: Boolean,
			default: true
		}
	} );

	// Only the pair (id, type) must be unique in this database. This is necessary
	// to allow multiple messaging services to register different devices with the
	// same ID.
	deviceSchema.index( { id:1, type:1 }, { unique: true } );
	var Device = mongoose.model( 'Device', deviceSchema );

	// Import modules
	var settings = require( __dirname + '/settings' )( mongoose, Device );

	var addRegistrationId = function( id, type, callback ) {
		console.log( 'addRegistrationId' );

		// If this device hasn't yet been added to the database,
		var deviceInfo = { id:id, type:type };
		Device.where( deviceInfo ).findOne( function findOneCallback( error, device ) {
			console.log( 'findOneCallback' );
			if ( error ) {
				console.log( 'Error finding device in database' );
				console.error( error );
				callback( error );
			} else {
				console.log( 'No error finding device in database' );
				if ( device ) {
					console.log( 'Device already exists in database, no further action is required' );
					callback( );
				} else {
					console.log( 'Device doesn\'t exist in current database.' );

					// Check the old database for settings for this device.
					var oldDevice = null;
					var insertNewDevice = function() {
						if ( oldDevice ) {
							deviceInfo.youTube = oldDevice.youTube;
							deviceInfo.hitbox = oldDevice.hitbox;
							deviceInfo.twitch = oldDevice.twitch;
						}

						var newDevice = new Device( deviceInfo );
						newDevice.save( callback );
					};

					mysqlConnectionPool.getConnection( function( error, connection ) {
						if ( error ) {
							console.log( 'Failed to get connection to old database.' );
							console.error( error );
							insertNewDevice();
						} else {
							console.log( 'Search for device in old server' );
							const selectOldDevice = 'SELECT youTube, hitbox, twitch FROM devices WHERE id=? and type=?';
							var inserts = [ id, type ];
							connection.query( selectOldDevice, inserts, function( error, rows ) {
								if ( error || ( rows.length != 1 ) ) {
									console.log( 'Device not found in old server' );
									console.error( error );
									connection.release();
								} else {
									console.log( 'Delete the entry in the old server.' );
									oldDevice = rows[ 0 ];

									// Now that the device has been moved from the old to
									// the new server, delete the entry in the old server.
									console.log( 'Delete the entry in the old server.' );
									const deleteOldDevice = 'DELETE from devices WHERE id=? and type=?';
									connection.query( deleteOldDevice, inserts, function( error, data ) {
										if ( error ) {
											console.error( error );
										} else {
											console.log( 'Deletion successful' );
											console.log( data );
										}

										connection.release();
									} );
								}
								insertNewDevice();
							} );
						}
					} );
				}
			}
		} );
	};

	var getRegistrationIds = function( type, key, callback ) {
		var queryConditions = {
			type: type
		};

		// TODO It's probably safe to assert that this function will be called
		// with a defined, valid key.
		if ( key ) {
			queryConditions[ key ] = true;
		}
		Device.find( queryConditions ).select( 'id -_id' ).exec( function( error, devices ) {
			if ( error ) {
				console.log( error );
				callback( error );
			} else {
				var ids = [];
				devices.forEach( function( device ) {
					ids.push( device.id );
				} );
				callback( false, devices );
			}
		} );
	};

	/**
	 * Remove row from database
	 * @param id
	 */
	function removeRegistrationId( id ) {
		Device.findOneAndRemove( { id: id }, function( error ) {
			if ( error ) {
				// Since this ID has previously been confirmed to be present in
				// the database, this operation should never error.
				console.error( error );
			}
		} );
	}

	return {
		addRegistrationId: addRegistrationId,
		getRegistrationIds: getRegistrationIds,
		removeRegistrationId: removeRegistrationId,
		settings: settings
	};
};
