module.exports = function(db){
	// library imports
	var gcm = require('node-gcm');

	// setup
	var sender = new gcm.Sender(process.env.GCM_API_KEY);

	function send(title, messageText, data, key){
		// construct message
		var message = constructMessage(title, messageText, data, key);

		// get all of the registration ids from the database
		db.getRegistrationIds('GCM', key, function(err, ids){
			if (err){
				console.log(err);
				return;
			}

			// divide into groups based on max recipients
			var chunks = [];
			while (ids.length > 0){
				chunks.push(ids.splice(0, 1000)); // TODO move constant to config
			}

			// for each chunk of ids
			chunks.forEach(function(chunk){
				// send the message to the registration ids using the sender
				// TODO move constant to config
				sender.send(message, chunk, 4, function (err, result){
					if (err){
						// TODO handle errors properly
						console.log(err);
						return;
					}
					//console.log(result);
					// TODO iterate through results to prune invalid GCM ids
				});
			});
		});
	}

	function constructMessage(title, messageText, data, key){
		var message = new gcm.Message();
		message.addData('message', messageText);
		message.addData('title', title);
		message.addData('msgcnt', '1'); // notification in status bar
		message.collapseKey = key;
		message.delayWhileIdle = false; // notify even when phone is idle
		message.timeToLive = 30 * 60; // 30 minutes to hold and retry before timing out
		message.addDataWithObject(data);
		return message;
	}

	return {
		send: send
	}
}