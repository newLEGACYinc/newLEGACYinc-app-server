module.exports = function() {
	var TwitchClient = require( 'twitch-sdk' );

	// var twitchAccount = {
	// 	client_id: process.env.TWITCH_CLIENT_ID,
	// 	scope: 'channel_read'
	// };

	var twitchAccount = {
		clientId: process.env.TWITCH_CLIENT_ID,
		scope: 'channel_read'
	};

	console.log( 'client id = ' + process.env.TWITCH_CLIENT_ID );

	// var twitchClient = new TwitchClient( twitchAccount );
	TwitchClient.init( twitchAccount, function( error, status ) {
		console.log( 'twitch init' );
		console.log( error );
		console.log( status );
	} );

	function getProfileInfo( callback ) {
		TwitchClient.api( { method: 'streams', params: { channel: process.env.TWITCH_USERNAME } }, function( error, list ) {
			console.log( 'twitch api callback' );
			console.log( error );
			console.log( list );
			callback( list.streams[ 0 ] );
		} );

		// twitchClient.streams( { channel: process.env.TWITCH_USERNAME }, function( err, response ) {
		// 	callback( err, response );
		// } );
	}

	return {
		getProfileInfo: getProfileInfo
	};
};
