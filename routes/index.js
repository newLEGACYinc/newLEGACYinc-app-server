module.exports = (function(){
	var gcm = require(__dirname + '/gcm')();
	var sendMessage = require(__dirname + '/sendMessage');
	var settings = require(__dirname + '/settings');

	return {
		gcm : gcm,
		sendMessage : sendMessage,
		settings: settings
	}
})();