module.exports = function( common, sender ) {

	// Module imports
	var moment = require( 'moment' );
	var request = require( 'request' );

	// Private variables
	var KEY = 'twitch';
	var online = false;

	function isLive( callback ) {
		common.twitch.getProfileInfo( function( err, response ) {
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
