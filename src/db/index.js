// http://stackoverflow.com/a/16800702/1222411
module.exports = function() {
	// Import libraries
	var mongoose = require( 'mongoose' );
	mongoose.Promise = global.Promise;
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

	let redis = require( 'redis' );

	function getRedisClient() {
		return redis.createClient( {
			url: process.env.REDIS_URL
		} );
	}

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
		// If this device hasn't yet been added to the database,
		var deviceInfo = { id:id, type:type };
		Device.where( deviceInfo ).findOne( function findOneCallback( error, device ) {
			if ( error ) {
				console.error( 'Error retrieving device from database.' );
				console.error( error );
				callback( error );
			} else {
				if ( device ) {
					callback( );
				} else {
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
							console.error( 'Error retrieving connection to mysql database.' );
							console.error( error );
							insertNewDevice();
						} else {
							const selectOldDevice = 'SELECT youTube, hitbox, twitch FROM devices WHERE id=? and type=?';
							var inserts = [ id, type ];
							connection.query( selectOldDevice, inserts, function( error, rows ) {
								if ( error || ( rows.length != 1 ) ) {
									console.error( 'Error retrieving device from mysql database.' );
									console.error( error );
									connection.release();
								} else {
									oldDevice = rows[ 0 ];

									// Now that the device has been moved from the old to
									// the new server, delete the entry in the old server.
									const deleteOldDevice = 'DELETE from devices WHERE id=? and type=?';
									connection.query( deleteOldDevice, inserts, function( error, data ) {
										if ( error ) {
											console.error( 'Error deleting old device information from mysql database.' );
											console.error( error );
										} else if ( data.length != 1 ) {
											console.error( `Expected to remove one row from mysql database. Removed ${data.length} rows` );
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

		if ( key ) {
			queryConditions[ key ] = true;
		} else {
			console.error( 'getRegistrationIDs called without a key' );
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
				console.error( 'Error removing device from database' );
				console.error( error );
			}
		} );
	}

	return {
		addRegistrationId: addRegistrationId,
		getRedisClient: getRedisClient,
		getRegistrationIds: getRegistrationIds,
		removeRegistrationId: removeRegistrationId,
		settings: settings
	};
};
