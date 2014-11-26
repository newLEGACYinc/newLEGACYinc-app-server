module.exports = function(secrets, db){
	// library imports
	var gcm = require('node-gcm');

	// setup
	var sender = new gcm.Sender(secrets.gcm.apiKey);

	function send(title, messageText, key){
		// construct message
		var message = new gcm.Message();
		message.addData('message', messageText);
		message.addData('title', title);
		message.addData('msgcnt', '1'); // notification in status bar
		message.collapseKey = key;
		message.delayWhileIdle = false; // notify even when phone is idle
		message.timeToLive = 30 * 60; // 30 minutes to hold and retry before timing out
		// get all of the registration ids from the database
		db.gcm.getRegistrationIds(function(err, ids){
			if (err){
				console.log(err);
				return;
			}

			// divide into groups based on max recipients
			var chunks = [];
			while (ids.length > 0){
				chunks.push(ids.splice(0, secrets.gcm.maxRecipients));
			}

			// for each chunk of ids
			chunks.forEach(function(chunk){
				// send the message to the registration ids using the sender
				sender.send(message, chunk, secrets.gcm.retries, function (err, result){
					if (err){
						// TODO handle errors properly
						console.log(err);
						return;
					}
					console.log(result);
				});
			});
		});
	}

	return {
		send: send
	}
}