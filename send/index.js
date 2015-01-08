module.exports = function(secrets, db){
	// module imports
	var apn = require(__dirname + '/apn')(secrets, db);
	var gcm = require(__dirname + '/gcm')(secrets, db);


	function send(title, message, data, key){
		// TODO send meesage from each of the modules
		console.log('called send(' + title + ', ' + message + ', ' + data + ', ' + key + ')');
		gcm.send(title, message, data, key);
		apn.send(title, message, data, key);
	};

	return {
		send: send
	};
}