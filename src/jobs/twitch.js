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
		common.twitch.getProfileInfo( function( err, response ) {
			if ( err ) {
				// we weren't able to get our profile info from the network
				// use our previous value for the stream status
				console.error( err );
				callback( online );
			} else {
				console.log( 'twitch is live response \\/\\/\\/\\/\\/' );
				console.log( response );
				callback( response.stream );
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
				console.log( 'previously online = ' + previouslyOnline );
				console.log( 'online = ' + online );
				callback();
			}
		} );
	}

	return {
		job: job
	};
};
