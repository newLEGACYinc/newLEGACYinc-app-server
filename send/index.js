module.exports = function(secrets, db){
	// module imports
	var gcm = require(__dirname + '/gcm')(secrets, db);

	function send(title, message, key){
		// TODO send meesage from each of the modules
		gcm.send(title, message, key);
	};

	return {
		send: send
	};
}