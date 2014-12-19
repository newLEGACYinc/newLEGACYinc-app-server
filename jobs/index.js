module.exports = function(secrets, sender){
	// library imports
	var CronJob = require('cron').CronJob;

	// module imports
	var hitbox = require(__dirname + '/hitbox')(secrets, sender);

	// setup and start jobs
	new CronJob('0 */1 * * * *', hitbox.job, null, true, 'America/New_York');
	// TODO create job to tidy invalid APN ids
};