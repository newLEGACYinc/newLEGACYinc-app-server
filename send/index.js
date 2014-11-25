module.exports = function(secrets, db){
	// module imports
	var gcm = require(__dirname + '/gcm')(secrets, db);

	function send(title, message){
		// TODO send meesage from each of the modules
	};
}