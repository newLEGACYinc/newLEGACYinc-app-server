module.exports = function( common, sender ) {
	// private Variables
	var THIRTY_SECOND_INTERVAL = '*/30 * * * * *';
	var ONE_MINUTE_INTERVAL = '0 */1 * * * *';

	// Library imports
	var CronJob = require( 'cron' ).CronJob;

	// Module imports
	var hitbox = require( __dirname + '/hitbox' )( sender );
	var twitch = require( __dirname + '/twitch' )( common, sender );
	var youTube = require( __dirname + '/youTube' )( sender );

	// Each job function expects a callback
	var callback = function( error ) {
		if ( error ) {
			console.error( 'CronJob error\'d' );
			console.error( error );
		}
	};

	// Setup and start jobs
	new CronJob(    ONE_MINUTE_INTERVAL,   function hitboxJob() { hitbox.job( callback ); }, null, true );
	new CronJob( THIRTY_SECOND_INTERVAL, function youTubeJob() { youTube.job( callback ); }, null, true );
	new CronJob( THIRTY_SECOND_INTERVAL,   function twitchJob() { twitch.job( callback ); }, null, true );
};
