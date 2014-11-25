module.exports = function(secrets){
	var basicAuth = require(__dirname + '/basicAuth')(secrets);

	return {
		basicAuth: basicAuth
	}
}