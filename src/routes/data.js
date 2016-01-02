var express = require( 'express' );
var request = require( 'request' );
var router = express.Router();

// Instagram
var ig = require( 'instagram-node' ).instagram();
ig.use( {
	client_id: process.env.INSTAGRAM_CLIENT_ID,
	client_secret: process.env.INSTAGRAM_CLIENT_SECRET
} );

router.get( '/instagram', function( req, res ) {
	ig.user_media_recent( process.env.INSTAGRAM_USER_ID, function( err, results, remaining, limit ) {
		if ( err ) {
			console.error( err );
			return res.status( 500 ).send();
		}
		return res.status( 200 ).send( results[ 0 ] );
	} );
} );

// Twitter
var Twit = require( 'twit' );
var twitter = new Twit( {
	consumer_key: process.env.TWITTER_CONSUMER_KEY,
	consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
	access_token: process.env.TWITTER_ACCESS_TOKEN,
	access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
} );

router.get( '/twitter', function( req, res ) {
	twitter.get( 'statuses/user_timeline', {
		'screen_name': process.env.TWITTER_USERNAME,
		'exclude_replies': true,
		'count': 1
	}, function( err, data, twitterResponse ) {
		if ( err ) {
			console.error( error );
			return res.status( 500 ).send();
		}

		res.status( 200 ).set( 'Content-Type', 'application/javascript' ).send( data );
	} );
} );

// YouTube
router.get( '/youtube', function( req, res ) {
	var options = {
		url: 'https://www.googleapis.com/youtube/v3/search',
		qs: {
			channelId: process.env.YOUTUBE_CHANNEL_ID,
			key: process.env.YOUTUBE_API_KEY,
			order: 'date',
			part: 'snippet',
			maxResults: 1
		}
	};
	request( options, function( error, response, body ) {
		if ( !error && response.statusCode === 200 ) {
			res.status( 200 ).set( 'Content-Type', 'application/javascript' ).send( body );
		} else {
			if ( response ) {
				console.error( response.statusCode );
			}
			console.error( error );
			res.status( 500 ).send( error );
		}
	} );
} );

module.exports = router;
