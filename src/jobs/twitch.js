module.exports = function( common, db, sender ) {
	// Module imports
	var moment = require( 'moment' );
	var request = require( 'request' );

	// Private variables
	var KEY = 'Twitch';
	const redisClient = db.getRedisClient();
	const LAST_ONLINE_KEY = 'twitchChannelStatus';

	function isLive( callback ) {
		common.twitch.getProfileInfo( function( err, stream ) {
			if ( err ) {
				console.error( 'Failure to get the twitch profile info' );
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
			console.log( 'isLive callback' );
			redisClient.get( LAST_ONLINE_KEY, function gotLastOnline( redisGetError, previousInfo ) {
				if ( redisGetError ) {
					console.error( `Failed to get ${LAST_ONLINE_KEY} from redis database` );
					console.error( redisGetError );
					callback( redisGetError );
				} else {
					if ( isLiveError ) {
						callback();
					} else {
						const currentInfo = newInfo ? newInfo.channel.status : null;

						var generateAfterRedisActionFunction = function( shouldNotifiy, currentInfo ) {
							return function( redisError ) {
								if ( redisError ) {
									console.error( `Failed to set ${LAST_ONLINE_KEY} from redis database` );
									console.error( redisError );
								}

								if ( shouldNotifiy ) {
									notify( currentInfo, callback );
								} else {
									console.log( `\tpreviousInfo or no currentInfo, return` );
									callback();
								}
							};
						};

						console.log( `\tpreviousInfo (${previousInfo})` );
						const shouldNotifiy = ( !previousInfo ) && currentInfo;
						console.log( `\tshouldNotify? (${shouldNotify})` );
						if ( currentInfo ) {
							console.log( `\tcurrentInfo (${currentInfo}), setting currentInfo to the channel status` );
							redisClient.set( LAST_ONLINE_KEY, currentInfo, generateAfterRedisActionFunction( shouldNotifiy, currentInfo ) );
						} else {
							console.log( `\tno currentInfo, deleting the channel status` );
							redisClient.del( LAST_ONLINE_KEY, generateAfterRedisActionFunction( shouldNotifiy, currentInfo ) );
						}
					}
				}
			} );
		} );
	}

	return {
		job: job
	};
};
