module.exports = function() {
	// Instagram
	var ig = require( 'instagram-node' ).instagram();
	ig.use( { access_token: process.env.INSTAGRAM_ACCESS_TOKEN } );

	return function instagramDataGet( req, res ) {
		ig.user_media_recent( process.env.INSTAGRAM_USER_ID, function( err, results, remaining, limit ) {
			if ( err ) {
				console.error( 'Error retrieving information from instagram' );
				console.error( err );
				return res.status( 500 ).send();
			}
			return res.status( 200 ).send( results[ 0 ] );
		} );
	};
};
