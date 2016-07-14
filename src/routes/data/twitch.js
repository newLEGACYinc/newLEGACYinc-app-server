module.exports = function() {
	var TwitchClient = require( 'node-twitchtv' );

	var twitchAccount = {
		client_id: process.env.TWITCH_CLIENT_ID,
		scope: 'channel_read'
	};

	var twitchClient = new TwitchClient( twitchAccount );

	function isLive( callback ) {
		twitchClient.streams( { channel: process.env.TWITCH_USERNAME }, function( err, response ) {
			if ( err ) {
				console.error( err );
				callback( err );
			} else {
				callback( null, response.stream );
			}
		} );
	}

	function twitchDataGet( req, res ) {
		twitchClient.streams( { channel: process.env.TWITCH_USERNAME }, function( err, response ) {
			if ( err ) {
				console.error( err );
				res.status( 500 ).send();
			} else {
				res.status( 200 ).send( response );
			}
		} );
	}

	return twitchDataGet;
};
