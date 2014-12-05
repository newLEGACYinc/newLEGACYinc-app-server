module.exports = (function(){
	var register = require(__dirname + '/register');
	var sendMessage = require(__dirname + '/sendMessage');
	var settings = require(__dirname + '/settings');

	return {
		register : register,
		sendMessage : sendMessage,
		settings: settings
	};
})();