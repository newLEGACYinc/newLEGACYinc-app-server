module.exports = function() {
	var TwitchClient = require( 'node-twitchtv' );

	var twitchAccount = {
		client_id: process.env.TWITCH_CLIENT_ID,
		scope: 'channel_read'
	};

	console.log( 'client id = ' + process.env.TWITCH_CLIENT_ID );

	var twitchClient = new TwitchClient( twitchAccount );

	function getProfileInfo( callback ) {
		twitchClient.streams( { channel: process.env.TWITCH_USERNAME }, function( err, response ) {
			callback( err, response );
		} );
	}

	return {
		getProfileInfo: getProfileInfo
	};
};
