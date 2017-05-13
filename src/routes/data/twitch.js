module.exports = function( common ) {
	return function twitchDataGet( req, res ) {
		common.twitch.getProfileInfo( function( err, profileInfo ) {
			// Explicitly allow any client to access this resource.
			// (Necessary for client-side applications like the chrome extension)
			res.header( 'Access-Control-Allow-Origin', '*' );

			if ( err ) {
				console.error( 'Error retrieving information from twitch' );
				console.error( err );
				res.status( 500 ).send();
			} else {
				res.status( 200 ).send( profileInfo );
			}
		} );
	};
};
