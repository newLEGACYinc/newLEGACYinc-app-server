module.exports = function( db, sender ) {

	// Library imports
	var request = require( 'request' );
	var moment = require( 'moment' );

	// Private variables
	var KEY = 'Hitbox';
	const redisClient = db.getRedisClient();
	const LAST_ONLINE_KEY = 'HITBOX_LAST_ONLINE';

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
				parseHitboxResponse( body, callback );
			}
		} );
	}

	function parseHitboxResponse( body, callback ) {
		var parsedBody = null;
		let jsonParseError;

		// Attempt to parse the response body
		try {
			parsedBody = JSON.parse( body );
		} catch ( e ) {
			// The hitbox API feeds us invalid JSON **CONSTANTLY**.
			// Since this API is known to be unreliable, we'll only
			// warn (and not error) when parsing the hitbox response fails.
			console.warn( `Failed to parse hitbox api message
							(did the hitbox api give you invalid JSON again?)` );
			jsonParseError = e;
		}

		// If we parsed the response body, check to see if the stream is live
		if ( parsedBody && !jsonParseError ) {
			// There should be only one livestream with the username
			var livestream = parsedBody.livestream[ 0 ];

			if ( livestream.media_is_live === '1' ) {
				callback( false, livestream );
			} else {
				callback( false, false );
			}
		} else {
			callback( jsonParseError );
		}
	}

	function job( callback ) {
		isLive( function( error, body ) {
			if ( error ) {
				callback( error );
			} else if ( body ) {
				var liveSince = moment( new Date( body.channel.media_live_since + ' UTC' ) );

				// Attempt to get the last time the stream was online
				redisClient.get( LAST_ONLINE_KEY, function gotLastOnline( redisError, lastOnline ) {
					if ( redisError ) {
						console.error( `Failed to get ${LAST_ONLINE_KEY} from redis database` );
						console.error( redisError );
						callback( redisError );
					} else {
						if ( !lastOnline ) {
							console.warn( `Value for key ${LAST_ONLINE_KEY} not previously set` );
						}

						// If more recently online than last time
						if ( !lastOnline || ( liveSince && liveSince.isAfter( lastOnline ) ) ) {
							redisClient.set( LAST_ONLINE_KEY, liveSince.toISOString(), function setLastOnline( redisSetError ) {
								if ( redisSetError ) {
									console.error( `Failed to set ${LAST_ONLINE_KEY} from redis database` );
									console.error( redisSetError );
								}

								// Notification function will handle callback
								notify( body, callback );
							} );
						} else {
							callback();
						}
					}
				} );
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
