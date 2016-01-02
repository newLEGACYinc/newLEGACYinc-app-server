module.exports = ( function() {
	var data = require( __dirname + '/data' );
	var register = require( __dirname + '/register' );
	var settings = require( __dirname + '/settings' );

	return {
		data: data,
		index: function( req, res ) {
			res.redirect( 'https://github.com/scowalt/newLEGACYinc-app-server' );
		},
		register: register,
		settings: settings
	};
} )();
