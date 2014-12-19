module.exports = function(secrets, sender){
	// library imports
	var CronJob = require('cron').CronJob;

	// module imports
	var hitbox = require(__dirname + '/hitbox')(secrets, sender);
	var youTube = require(__dirname + '/youTube')(secrets, sender);

	// setup and start jobs
	new CronJob('0 */1 * * * *', hitbox.job, null, true);
	new CronJob('*/30 * * * * *', youTube.job, null, true);
	// TODO create job to tidy invalid APN ids
};