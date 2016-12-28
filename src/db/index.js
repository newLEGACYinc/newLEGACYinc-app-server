// http://stackoverflow.com/a/16800702/1222411
module.exports = function() {
	// Import libraries
	var mongoose = require( 'mongoose' );
	mongoose.connect( process.env.MONGODB_URI );

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
		},

		// Acive devices are ones that have accessed the "new" server. Inactive
		// devices are still receiving notifications from the "old" server and
		// shouldn't receive notifications from this server.
		active: {
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
		var query = { id: id, type: type };
		var update = { active: true };
		var options = {
			// If document is found with query, update. Otherwise, create the
			// document with the data provided in update.
			upsert: true,

			// If a document is found with query, don't update the existing
			// values on the document (besides the ones in update)
			setDefaultsOnInsert: false
		};
		Device.findOneAndUpdate( query, update, options, function( error, device ) {
			if ( !error ) {
				callback( false, device );
			} else {
				callback( error );
			}
		} );
	};

	var getRegistrationIds = function( type, key, callback ) {
		var queryConditions = {
			type: type,
			active: true
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
