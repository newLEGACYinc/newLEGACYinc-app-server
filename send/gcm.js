module.exports = function(secrets, db){
	// library imports
	var gcm = require('node-gcm');

	// setup
	var sender = new gcm.Sender(secrets.gcm.apiKey);

	function send(title, message){
		// get all of the registration ids from the database]
		db.gcm.getRegistraionIds(function(err, ids){
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
				// TODO send the message to the registration ids using the sender

			});
		});


	}
}