module.exports = function(){
	var register = require(__dirname + '/register');
	var settings = require(__dirname + '/settings');

	return {
		register: register,
		settings: settings
	};
};