module.exports = function( sender ) {

	// Library imports
	var request = require( 'request' );
	var moment = require( 'moment' );

	// Private variables
	var KEY = 'hitbox';
	var lastOnline = moment();

	/**
	 * Is the hitbox stream currently live?
	 * @param callback(error, body))
	 */
	function isLive( callback ) {
		request( 'http://api.hitbox.tv/media/live/' + process.env.HITBOX_USERNAME, function( error, response, body ) {
			if ( error ) {
				callback( error );
			} else if ( response.statusCode != 200 ) {
				callback( response.statusCode );
			} else {
				var parsedBody = null;

				// Attempt to parse the response body
				try {
					parsedBody = JSON.parse( body );
				} catch ( e ) {
					console.log( 'Failed to parse hitbox api message' );
					callback( e );
				}

				// If we parsed the response body, check to see if the stream is live
				if ( parsedBody ) {
					// There should be only one livestream with the username
					var livestream = parsedBody.livestream[ 0 ];

					if ( livestream.media_is_live === '1' ) {
						callback( false, livestream );
					} else {
						callback( false, false );
					}
				} else {
					callback( 'unknown error' );
				}
			}
		} );
	}

	function job( callback ) {
		isLive( function( error, body ) {
			if ( error ) {
				callback( error );
			} else if ( body ) {
				var liveSince = moment( new Date( body.channel.media_live_since + ' UTC' ) );

				// If more recently online than last time
				if ( liveSince && liveSince.isAfter( lastOnline ) ) {
					lastOnline = liveSince;

					// Notification function will handle callback
					notify( body, callback );
				} else {
					callback();
				}
			} else {
				// No error but stream isn't online
				callback();
			}
		} );
	}

	function notify( body, callback ) {
		var title = 'Live on hitbox!';
		var message = body.media_status;
		sender.send( title, message, KEY, callback );
	}

	return {
		'job': job
	};
};
