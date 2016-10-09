module.exports = function() {
	var TwitchClient = require( 'twitch-sdk' );

	var twitchAccount = {
		clientId: process.env.TWITCH_CLIENT_ID,
		scope: 'channel_read'
	};

	TwitchClient.init( twitchAccount, function( error, status ) {
		if ( error ) {
			console.error( error );
		}
	} );

	function getProfileInfo( callback ) {
		TwitchClient.api( { method: 'streams', params: { channel: process.env.TWITCH_USERNAME } }, function( error, list ) {
			callback( error, list.streams[ 0 ] );
		} );
	}

	return {
		getProfileInfo: getProfileInfo
	};
};
