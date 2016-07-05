module.exports = function() {
	// Instagram
	var ig = require( 'instagram-node' ).instagram();
	ig.use( {
		client_id: process.env.INSTAGRAM_CLIENT_ID,
		client_secret: process.env.INSTAGRAM_CLIENT_SECRET
	} );

	return function instagramDataGet( req, res ) {
		ig.user_media_recent( process.env.INSTAGRAM_USER_ID, function( err, results, remaining, limit ) {
			if ( err ) {
				console.error( err );
				return res.status( 500 ).send();
			}
			return res.status( 200 ).send( results[ 0 ] );
		} );
	};
};
