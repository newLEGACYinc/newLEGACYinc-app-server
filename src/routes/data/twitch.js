module.exports = function( common ) {
	return function twitchDataGet( req, res ) {
		common.twitch.getProfileInfo( function( err, response ) {
			if ( err ) {
				console.error( err );
				res.status( 500 ).send();
			} else {
				res.status( 200 ).send( response );
			}
		} );
	};
};
