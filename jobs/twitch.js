module.exports = function(sender){
	// module imports
	var moment = require('moment');
	var request = require('request');

	// private variables
	var KEY = 'twitch';
	var online = false;

	function isLive(callback){
		var options = {
			url: 'https://api.twitch.tv/kraken/streams/' + process.env.TWITCH_USERNAME,
			headers: {
				'Client-ID': process.env.TWITCH_CLIENT_ID,
				'Accept': 'application/vnd.twitchtv.v2+json'
			}
		};
		request(options, function(error, response, body){
			if (!error && response.statusCode === 200){
				body = JSON.parse(body);
				var stream = body['stream'];
				callback(false, stream);
			} else {
				console.error(error);
				if (response) {
					console.error(response.statusCode);
				}
				callback(error);
			}
		});
	}

	function notify(info){
		var title = 'Live on Twitch!';
		var message = info['channel']['status'];
		sender.send(title, message, {}, KEY);
	}

	function job(){
		isLive(function(error, info){
			if (error){
				console.error(error)
			} else if (info) {
				if (!online){
					online = true;
					notify(info);
				} else {
					// do nothing
				}
			} else {
				online = false;
			}
		})
	}

	return {
		job: job
	}
};