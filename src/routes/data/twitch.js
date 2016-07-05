module.exports = function() {
	var TwitchClient = require( 'node-twitchtv' );

	var twitchAccount = {
		client_id: process.env.TWITCH_CLIENT_ID,
		scope: 'channel_read'
	};

	var twitchClient = new TwitchClient( twitchAccount );

	return function twitchDataGet( req, res ) {
		client.channels( { channel: process.env.TWITCH_USERNAME }, function( err, response ) {
			if ( err ) {
				console.error( err );
				res.status( 500 ).send();
			} else {
				res.status( 200 ).send( res );
			}
		} );
	};
};
