module.exports = function() {
	var instagram = require( __dirname + '/instagram' )();
	var twitch = require( __dirname + '/twitch' )();
	var twitter = require( __dirname + '/twitter' )();
	var youTube = require( __dirname + '/youTube' )();

	return {
		instagram: instagram,
		twitch: twitch,
		twitter: twitter,
		youTube: youTube
	};
};
