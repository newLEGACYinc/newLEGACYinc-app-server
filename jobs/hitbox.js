module.exports = function(secrets, sender){
	// library imports
	var request = require('request');
	var moment = require('moment');

	// private variables
	var KEY = 'hitbox';
	var lastOnline = moment();

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

	function job(){
		isLive(function(error, body){
			if (error){
				return console.log(error);
			}
			if (body) {
				var liveSince = moment(new Date(body['live_since'] + ' UTC'));
				// if more recently online than last time
				if (liveSince.isAfter(lastOnline)) {
					lastOnline = liveSince;
					notify();
				}
			}
		});
	}

	function notify(){
		trySend();
	}

	function trySend(){
		var title = 'Live on hitbox!';
		getMessage(function(error, message){
			if (!error && message){
				sender.send(title, message, {}, KEY);
			} else {
				setTimeout(trySend, 5000);
			}
		});
	}

	function getMessage(callback){
		// try to get more information about the stream
		request('http://api.hitbox.tv/media', function(error, response, body){
			var message;
			if (!error && response.statusCode == 200){
				try {
					var media = JSON.parse(body);
					var livestream = media['livestream'];
					for (var i = 0; i < livestream.length; i++){
						var element = livestream[i];
						if (element['media_user_name'].toUpperCase() === secrets.hitbox.username.toUpperCase()) {
							message = element['media_status'];
							return callback(false, message);
						}
					}
				} catch(e){
					return callback(e);
				}
			} else if (error){
				return callback(error);
			}
			return callback(false, false);
		});
	}

	return {
		'job': job
	};
};