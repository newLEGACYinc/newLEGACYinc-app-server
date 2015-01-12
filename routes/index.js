module.exports = (function(){
	var data = require(__dirname + '/data');
	var register = require(__dirname + '/register');
	var sendMessage = require(__dirname + '/sendMessage');
	var settings = require(__dirname + '/settings');

	return {
		data: data,
		register : register,
		sendMessage : sendMessage,
		settings: settings
	};
})();