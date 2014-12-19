module.exports = function(secrets, sender){
	// library imports
	var Agenda = require('agenda');
	var agenda = new Agenda({db: { address: 'localhost:27017/newLEGACYinc-jobs'}});

	// module imports
	var hitbox = require(__dirname + '/hitbox')(secrets, sender);

	// setup and start jobs
	agenda.define('hitbox check', hitbox.job);
	agenda.every('1 minutse', ['hitbox check']);
	// TODO create job to tidy invalid APN ids

	agenda.start();
};