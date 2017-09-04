module.exports = function( db ) {
	var twitch = require( __dirname + '/twitch' )( db );

	return {
		twitch: twitch
	};
};
