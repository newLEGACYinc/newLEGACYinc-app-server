module.exports = function( db ) {
	// Library imports
	var gcm = require( 'node-gcm' );

	// Setup
	var gcmSender = new gcm.Sender( process.env.GCM_API_KEY );

	function send( title, messageText, key, callback ) {

		// Construct message
		var message = constructMessage( title, messageText, key );

		// Get all of the registration ids from the database
		db.getRegistrationIds( 'GCM', key, function( err, ids ) {
			if ( err ) {
				console.log( err );
				return callback();
			}

			// Divide into groups based on max recipients
			var chunks = [];
			while ( ids.length > 0 ) {
				chunks.push( ids.splice( 0, 1000 ) ); // TODO move constant to config
			}

			// For each chunk of ids
			chunks.forEach( function( chunk ) {
				// Send the message to the registration ids using the sender
				// TODO move constant to config
				gcmSender.send( message, chunk, 4, function( err, result ) {
					if ( err ) {
						console.log( 'error in gcm ' + err ); // TODO handle errors properly
						return;
					}
					updateDatabase( chunk, result.results );
				} );
			} );

			// FIXME this callback should be fired after all of the gcmSender.send(...)
			// callbacks have finished executing this is a fine hack for now
			callback();
		} );
	}

	// Use feedback from message send of GCM to fix database
	function updateDatabase( deviceIds, results ) {

		// Iterate over the sent messages
		for ( var i = 0; i < results.length; i++ ) {

			// If the registration id for a device has changed
			// (this branch will be taken on the old device id)
			if ( results[ i ].registration_id ) {

				// Remove the old registration_id from the table
				// TODO attempt to save the old settings
				db.removeRegistrationId( deviceIds[ i ] );
			}
		}
	}

	function constructMessage( title, messageText, key ) {
		var message = new gcm.Message();
		message.addData( 'message', messageText );
		message.addData( 'title', title );
		message.addData( 'msgcnt', '1' ); // Notification in status bar
		message.collapseKey = key;
		message.delayWhileIdle = false; // Notify even when phone is idle
		message.timeToLive = 30 * 60; // 30 minutes to hold and retry before timing out
		return message;
	}

	return {
		send: send
	};
};
