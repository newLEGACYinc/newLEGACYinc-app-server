module.exports = function( common ) {
	var express = require( 'express' );
	var router = express.Router();

	router.get( '/lastOnline', function twitchGetLastOnline( req, res ) {
		common.twitch.getLastOnline( function( error, lastOnline ) {
			// Explicitly allow any client to access this resource.
			// (Necessary for client-side applications like the chrome extension)
			res.header( 'Access-Control-Allow-Origin', '*' );

			if ( err ) {
				console.error( 'Error retrieving information from twitch' );
				console.error( err );
				res.status( 500 ).send();
			} else {
				res.status( 200 ).send( lastOnline );
			}
		} );
	} );
	router.get( '/', function twitchDataGet( req, res ) {
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
		} ); }
	);

	return router;
};
