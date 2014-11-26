module.exports = function(){
	var gcm = require(__dirname + '/gcm')();
	var sendMessage = require(__dirname + '/sendMessage');

	return {
		gcm : gcm,
		sendMessage : sendMessage
	}
};