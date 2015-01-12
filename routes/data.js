var express = require('express');
var router = express.Router();
var Twit = require('twit');


// twitter
var twitter = new Twit({
	consumer_key: process.env.TWITTER_CONSUMER_KEY,
	consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
	access_token: process.env.TWITTER_ACCESS_TOKEN,
	access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
});

router.get('/twitter', function(req, res){
	twitter.get('statuses/user_timeline', {
		'screen_name': process.env.TWITTER_USERNAME,
		'exclude_replies': true,
		'count': 1
	}, function(err,data,twitterResponse){
		if (err){
			console.error(error);
			return res.status(500).send();
		}

		res.status(200).set('Content-Type', 'application/javascript').send(data);
	});
});

module.exports = router;