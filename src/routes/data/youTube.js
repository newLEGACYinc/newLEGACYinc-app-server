module.exports = function() {
	var request = require( 'request' );

	// YouTube
	return function youTubeDataGet( req, res ) {
		var options = {
			url: 'https://www.googleapis.com/youtube/v3/search',
			qs: {
				channelId: process.env.YOUTUBE_CHANNEL_ID,
				key: process.env.YOUTUBE_API_KEY,
				order: 'date',
				part: 'snippet',
				maxResults: 1
			}
		};

		request( options, function( error, response, body ) {
			if ( !error && response.statusCode === 200 ) {
				res.status( 200 ).set( 'Content-Type', 'application/javascript' ).send( body );
			} else {
				if ( response ) {
					console.error( `Error response from YouTube API: ${response.statusCode}` );
				}
				console.error( error );
				res.status( 500 ).send( error );
			}
		} );
	};
};
