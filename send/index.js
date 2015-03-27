module.exports = function(secrets, db){
	// module imports
	if (process.env.NODE_ENV === 'production'){
		var apn = require(__dirname + '/apn')(secrets, db);
	}
	var gcm = require(__dirname + '/gcm')(secrets, db);


	function send(title, message, key){
		// TODO send meesage from each of the modules
		console.log('called send(' + title + ', ' + message + ', ' + key + ')');
		gcm.send(title, message, key);
		if (apn) {
			apn.send(title, message, key);
		}
	};

	return {
		send: send
	};
}
