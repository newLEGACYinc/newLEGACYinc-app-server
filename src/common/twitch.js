module.exports = function( db ) {
	var request = require( 'request' );
	const redisClient = db.getRedisClient();
	const LAST_ONLINE_KEY = 'twitchChannelLastOnlineTime';

	var requestHeaders = {
		'Accept': 'application/vnd.twitchtv.v5+json',
		'Client-ID': process.env.TWITCH_CLIENT_ID
	};

	function getProfileInfo( callback ) {
		var requestSettings = {
			url: 'https://api.twitch.tv/kraken/streams/' + process.env.TWITCH_USER_ID,
			headers: requestHeaders
		};
		request( requestSettings, function( error, response, body ) {
			var bodyAsJSON = JSON.parse( body );
			callback( error, bodyAsJSON.stream );
		} );
	}

	function getLastOnline( callback ) {
		// Most of the time, the last online time will have previously been stored in the DB
		redisClient.get( LAST_ONLINE_KEY, function gotLastOnlineTime( redisGetError, lastOnlineTime ) {
			if ( redisGetError ) {
				console.error( `Failed to get ${LAST_ONLINE_KEY} from redis database` );
				console.error( redisGetError );
				callback( redisGetError );
			} else {
				if ( lastOnlineTime ) {
					callback( null, lastOnlineTime );
				} else {
					// Fallback: query the channel last updated time
					const requestSettings = {
						url: `https://api.twitch.tv/kraken/channels/${process.env.TWITCH_USERNAME}`,
						headers: requestHeaders
					};
					request( requestSettings, function( error, response, body ) {
						const bodyAsJSON = JSON.parse( body );
						callback( error, bodyAsJSON.updated_at );
					} );
				}
			}
		} );
	}

	return {
		getProfileInfo: getProfileInfo,
		getLastOnline: getLastOnline
	};
};
