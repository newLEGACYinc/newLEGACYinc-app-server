module.exports = function( common, db ) {
	var data = require( __dirname + '/data' )( common );
	var register = require( __dirname + '/register' )( db );
	var settings = require( __dirname + '/settings' )( db );

	return {
		data: data,
		index: function( req, res ) {
			res.redirect( 'https://github.com/scowalt/newLEGACYinc-app-server' );
		},
		register: register,
		settings: settings
	};
};
