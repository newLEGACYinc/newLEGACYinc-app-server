module.exports = function(){
	var gcmRegister = require(__dirname + '/gcmRegister');
	var sendMessage = require(__dirname + '/sendMessage');

	return {
		gcmRegister : gcmRegister,
		sendMessage : sendMessage
	}
};