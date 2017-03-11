module.exports = function() {
	var request = require( 'request' );

	var requestHeaders = {
		'Accept': 'application/vnd.twitchtv.v5+json',
		'Client-ID': process.env.TWITCH_CLIENT_ID
	};

	function getProfileInfo( callback ) {
		var requestSettings = {
			url: 'https://api.twitch.tv/kraken/streams/' + process.env.TWITCH_USER_ID,
			headers: requestHeaders
		};
		request( requestSettings, function( error, response, body ) {
			var bodyAsJSON = JSON.parse( body );
			callback( error, bodyAsJSON.stream );
		} );
	}

	return {
		getProfileInfo: getProfileInfo
	};
};
