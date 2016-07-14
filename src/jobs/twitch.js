module.exports = function( sender ) {

	// Module imports
	var moment = require( 'moment' );
	var request = require( 'request' );
	var TwitchClient = require( 'node-twitchtv' );

	// Private variables
	var KEY = 'twitch';
	var online = false;

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

	function notify( info, callback ) {
		var title = 'Live on Twitch!';
		var message = info.channel.status;
		sender.send( title, message, KEY, callback );
	}

	function job( callback ) {
		isLive( function( error, info ) {
			if ( error ) {
				console.error( error );
				callback( error );
			} else if ( info ) {
				if ( !online ) {
					online = true;
					notify( info, callback );
				} else {
					// Do nothing
					callback();
				}
			} else {
				// No error or stream info, stream is offline
				online = false;
				callback();
			}
		} );
	}

	return {
		job: job
	};
};
