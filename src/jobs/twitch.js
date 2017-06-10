module.exports = function( common, sender ) {
	// Module imports
	var moment = require( 'moment' );
	var request = require( 'request' );

	// Private variables
	var KEY = 'twitch';
	const redisClient = db.getRedisClient();
	const LAST_ONLINE_KEY = 'twitchChannelStatus';

	function isLive( callback ) {
		common.twitch.getProfileInfo( function( err, stream ) {
			if ( err ) {
				console.error( 'Failure to get the twitch profile info');
				console.error( err );
				callback( err );
			} else {
				callback( err, stream );
			}
		} );
	}

	// notify users that about the stream status
	function notify( message, callback ) {
		const title = 'Live on Twitch!';
		sender.send( title, message, KEY, callback );
	}

	function job( callback ) {
		isLive( function( isLiveError, newInfo ) {
			redisClient.get( LAST_ONLINE_KEY, function gotLastOnline( redisError, previousInfo ) {
				if ( redisError ) {
					console.error( `Failed to get ${LAST_ONLINE_KEY} from redis database` );
					console.error( redisError );
					callback( redisError );
				} else {
					const currentInfo = ( isLiveError ) ? previousInfo : newInfo.channel.status;
					redisClient.set( LAST_ONLINE_KEY, currentInfo, function setLastOnline( redisSetError ) {
						if ( redisSetError ) {
							console.error( `Failed to set ${LAST_ONLINE_KEY} from redis database` );
							console.error( redisSetError );
						}

						if ( currentInfo ) {
							notify( currentInfo, callback );
						} else {
							callback();
						}
					} );
				}
			} );
		} );
	}

	return {
		job: job
	};
};
