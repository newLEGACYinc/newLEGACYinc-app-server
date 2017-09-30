module.exports = function( sender ) {

	// Library imports
	var moment = require( 'moment' );
	var request = require( 'request' );

	// Private variables
	var KEY = 'YouTube';
	var lastVideoTime = moment(); // Time of last new video, initialized to server start

	/**
	 * New YouTube video? video underfined if no new video
	 * @param callback(error, video)
	 */
	function newVideo( callback ) {
		var options = {
			url: 'https://www.googleapis.com/youtube/v3/search',
			qs: {
				channelId: process.env.YOUTUBE_CHANNEL_ID,
				key: process.env.YOUTUBE_API_KEY,
				order: 'date',
				part: 'snippet',
				publishedAfter: lastVideoTime.format( 'YYYY-MM-DDTHH:mm:ssZ' )
			}
		};
		request( options, function( error, response, body ) {
			if ( !error && ( response.statusCode === 200 ) ) {
				body = JSON.parse( body );
				var items = body.items;
				var latestVideo = items[ 0 ];
				if ( !latestVideo ) {
					callback( false, false );
					return;
				}
				var latestVideoInfo = latestVideo.snippet;
				var latestVideoPublished = moment( latestVideoInfo.publishedAt );
				if ( latestVideoPublished.isAfter( lastVideoTime ) ) {
					lastVideoTime = latestVideoPublished;
					return callback( false, latestVideo );
				} else {
					return callback( false, false );
				}
			} else {
				console.error( 'Error retrieving response from YouTube.' );
				console.error( error );
				console.error( response );
				return callback( error );
			}
		} );
	}

	function notify( info, callback ) {
		if ( !info ) {
			console.error( 'Notify called without any video information.' );
			callback();
		} else {
			var title = 'New YouTube video!';
			var message = info.snippet.title;
			sender.send( title, message, KEY, callback );
		}
	}

	function job( callback ) {
		newVideo( function( error, info ) {
			if ( error ) {
				console.error( 'Error retrieving new video information' );
				console.error( error );
				callback( error );
			} else if ( info ) {
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
