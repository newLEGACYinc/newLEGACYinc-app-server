module.exports = function(secrets, db){
	// library imports
	var apn = require('apn');

	var connection = new apn.Connection(secrets.apn);

	function send(title, message, data, key){
		db.getRegistrationIds('APNs', key, function(error, ids){
			if (error){
				console.log(error);
				return;
			}

			// construct message
			var note = new apn.Notification();
			note.expiry = Math.floor(Date.now() / 1000) + 3600; // Expires 1 hour from now.
			note.badge = 0; // don't need a badge
			//note.sound = "ping.aiff"; // don't need a sound
			note.alert = title + ' ' + message;
			note.payload = {'key': key};

			// for each device
			ids.forEach(function(id){
				// send message to device
				var device = new apn.Device(id);
				connection.pushNotification(note, device);
			});
		});
	}

	return {
		send: send
	}
}