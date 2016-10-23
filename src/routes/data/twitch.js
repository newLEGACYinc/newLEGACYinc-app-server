module.exports = function( common ) {
	return function twitchDataGet( req, res ) {
		common.twitch.getProfileInfo( function( err, profileInfo ) {
			// Explicitly allow any chrome extension to access this resource
			res.header( 'Access-Control-Allow-Origin', 'chrome-extension://*' );

			if ( err ) {
				console.error( err );
				res.status( 500 ).send();
			} else {
				res.status( 200 ).send( profileInfo );
			}
		} );
	};
};
