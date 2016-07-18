module.exports = function( common ) {
	var express = require( 'express' );
	var router = express.Router();

	var instagram = require( __dirname + '/instagram' )();
	var twitch = require( __dirname + '/twitch' )( common );
	var twitter = require( __dirname + '/twitter' )();
	var youTube = require( __dirname + '/youTube' )();

	router.get( '/instagram', instagram );
	router.get( '/twitch', twitch );
	router.get( '/twitter', twitter );
	router.get( '/youTube', youTube );

	return router;
};
