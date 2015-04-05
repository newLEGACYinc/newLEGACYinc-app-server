module.exports = function(db){
	// library imports
	var gcm = require('node-gcm');

	// setup
	var sender = new gcm.Sender(process.env.GCM_API_KEY);

	function send(title, messageText, key){
		// construct message
		var message = constructMessage(title, messageText, key);

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
						console.log('error in gcm ' + err);
						return;
					}

					updateDatabase(chunk, result.results);
				});
			});
		});
	}

	/**
	 * Use feedback from message send of GCM to fix database
	 * @param result
	 */
	function updateDatabase(deviceIds, results){
		// iterate over the sent messages
		for (var i = 0; i < results.length; i++){
			// if the registration id for a device has changed
			// (this branch will be taken on the old device id)
			if (results[i].registration_id){
				// remove the old registration_id from the table
				db.removeRegistrationId(deviceIds[i]);
			}
		}
	}

	function constructMessage(title, messageText, key){
		var message = new gcm.Message();
		message.addData('message', messageText);
		message.addData('title', title);
		message.addData('msgcnt', '1'); // notification in status bar
		message.collapseKey = key;
		message.delayWhileIdle = false; // notify even when phone is idle
		message.timeToLive = 30 * 60; // 30 minutes to hold and retry before timing out
		return message;
	}

	return {
		send: send
	}
}
