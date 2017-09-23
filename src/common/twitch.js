module.exports = function( db ) {
	var request = require( 'request' );
	var moment = require( 'moment' );
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

			if ( bodyAsJSON.channel ) {
				console.log( `setting lastOnlineTime to ${moment().format()}` );
				redisClient.set( LAST_ONLINE_KEY, moment().format() );
			}

			callback( error, bodyAsJSON.stream );
		} );
	}

	function getLastOnline( callback ) {
		console.log( 'getLastOnline' );

		// Most of the time, the last online time will have previously been stored in the DB
		redisClient.get( LAST_ONLINE_KEY, function gotLastOnlineTime( redisGetError, lastOnlineTime ) {
			if ( redisGetError ) {
				console.error( `Failed to get ${LAST_ONLINE_KEY} from redis database` );
				console.error( redisGetError );
				callback( redisGetError );
			} else {
				console.log( `lastOnlineTime = ${lastOnlineTime}` );
				if ( lastOnlineTime ) {
					callback( null, lastOnlineTime );
				} else {
					// Fallback: query the channel last updated time
					const requestSettings = {
						url: `https://api.twitch.tv/kraken/channels/${process.env.TWITCH_USER_ID}`,
						headers: requestHeaders
					};
					request( requestSettings, function( error, response, body ) {
						const bodyAsJSON = JSON.parse( body );
						console.log( `got from channel info: ${bodyAsJSON.updated_at}` );
						callback( error, moment( bodyAsJSON.updated_at ).format() );
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
