// http://stackoverflow.com/a/16800702/1222411
module.exports = function(config){
	// import mysql library
	var mysql = require('mysql');

	// initialize connection pool
	var pool = mysql.createPool(config);

	// import modules
	var gcm = require(__dirname + '/gcm')(pool);
	var settings = require(__dirname + '/settings')(pool);

	return {
		gcm: gcm,
		settings: settings
	};
}