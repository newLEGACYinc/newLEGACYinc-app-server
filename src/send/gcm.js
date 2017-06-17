module.exports = function( db ) {
	// Library imports
	var gcm = require( 'node-gcm' );

	// Setup
	var gcmSender = new gcm.Sender( process.env.GCM_API_KEY );

	function send( title, messageText, key, callback ) {

		// Construct message
		const message = constructMessage( title, messageText, key );
		console.log(message);

		// Get all of the registration ids from the database
		db.getRegistrationIds( 'GCM', key, function( err, ids ) {
			if ( err ) {
				console.log( err );
				return callback();
			}

			// Divide into groups based on max recipients
			var chunks = [];
			const chunkSize = 1000; // TODO move constant to config
			while ( ids.length > 0 ) {
				chunks.push( ids.splice( 0, chunkSize ) );
			}

			// For each chunk of ids
			chunks.forEach( function( chunk ) {
				const retryCount = 4; // TODO move constant to config
				gcmSender.send( message, chunk, retryCount, function( err, result ) {
					if ( err ) {
						console.error( 'Error sending message to GCM client' );
						console.error( err );
						return; // TODO handle errors properly
					}

					console.log(result);
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
