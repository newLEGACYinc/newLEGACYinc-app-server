module.exports = function() {
	var twitch = require( __dirname + '/twitch' )();

	return {
		twitch: twitch
	};
};
