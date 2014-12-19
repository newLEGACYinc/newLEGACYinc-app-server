module.exports = function(secrets, sender){
	// library imports
	var request = require('request');
	var moment = require('moment');

	// module imports


	// private variables
	var KEY = 'HITBOX';
	var lastOnline = moment('2014-08-08 01:01:01');

	/**
	 * Is the hitbox stream currently live?
	 * @param callback(error, body))
	 */
	function isLive(callback){
		request('http://api.hitbox.tv/user/' + secrets.hitbox.username, function(error, response, body){
			if (error){
				return callback(error);
			} else if (response.statusCode != 200){
				return callback(response.statusCode);
			} else {
				body = JSON.parse(body);
				if (body['is_live'] === "1") {
					return callback(false, body);
				} else {
					return callback(false, false);
				}
			}
		});
	}

	function job(info, done){
		isLive(function(error, body){
			if(error){
				return console.log(error);
			}
			var liveSince = moment(body['live_since']);

			// if more recently online than last time
			if (liveSince.isAfter(lastOnline)){
				lastOnline = liveSince;
				notify(body, done);
			} else {
				done();
			}
		});
	}

	function notify(body, done){
		// try to get more information about the stream
		request('http://api.hitbox.tv/media', function(error, response, body){
			var title = 'Live on hitbox!';
			var message;
			if (!error && response.statusCode == 200){
				try {
					var media = JSON.parse(body);
					var livestream = media['livestream'];
					livestream.forEach(function (element) {
						if (element['media_user_name'] === secrets.hitbox.username) {
							message = element['media_status'];
						}
					});
				} catch(e){
					console.log(e.stack);
				}
			}
			if (!message){
				message = ' '; // TODO
			}
			sender.send(title, message, KEY);
			done();
		});
	}

	return {
		'job': job
	};
};