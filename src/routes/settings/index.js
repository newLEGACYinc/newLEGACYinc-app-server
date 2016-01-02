module.exports = function( db ) {
	var update = require( __dirname + '/update' )( db );
	var get = require( __dirname + '/get' )( db );

	return {
		get: get,
		update: update
	};
};
