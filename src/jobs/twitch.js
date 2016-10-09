module.exports = function( common, sender ) {
	// Module imports
	var moment = require( 'moment' );
	var request = require( 'request' );

	// Private variables
	var KEY = 'twitch';
	var online = false;

	// callback(streamInfo) if the stream is Live
	// callback(null) if the stream is offline
	function isLive( callback ) {
		common.twitch.getProfileInfo( function( err, stream ) {
			if ( err ) {
				// we weren't able to get our profile info from the network
				// use our previous value for the stream status
				callback( online );
			} else {
				callback( stream );
			}
		} );
	}

	// notify users that about the stream status
	function notify( info, callback ) {
		var title = 'Live on Twitch!';
		var message = info.channel.status;
		sender.send( title, message, KEY, callback );
	}

	function job( callback ) {
		console.log( 'Twitch job function' );
		isLive( function( info ) {
			var previouslyOnline = online;
			online = info;
			if ( online && !previouslyOnline ) {
				notify( info, callback );
			} else {
				callback();
			}
		} );
	}

	return {
		job: job
	};
};
