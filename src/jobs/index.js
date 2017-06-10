module.exports = function( common, db, sender ) {
	// private Variables
	var THIRTY_SECOND_INTERVAL = '*/30 * * * * *';
	var ONE_MINUTE_INTERVAL = '0 */1 * * * *';

	// Library imports
	var CronJob = require( 'cron' ).CronJob;

	// Module imports
	var hitbox = require( __dirname + '/hitbox' )( db, sender );
	var twitch = require( __dirname + '/twitch' )( common, db, sender );
	var youTube = require( __dirname + '/youTube' )( sender );

	// Each job function expects a callback
	function getCallbackFunction( jobName ) {
		return function cronJobCallback( error ) {
			if ( error ) {
				// We don't necessarily want to error if our job fails.
				// Each job is charged with deciding what is error-worthy.
				console.warn( `${jobName} CronJob error'd` );
				console.warn( error );
			}
		};
	}

	// Setup and start jobs
	new CronJob(    ONE_MINUTE_INTERVAL,   function hitboxJob() { hitbox.job( getCallbackFunction( 'hitbox' ) ); }, null, true );
	new CronJob( THIRTY_SECOND_INTERVAL, function youTubeJob() { youTube.job( getCallbackFunction( 'youTube' ) ); }, null, true );
	new CronJob( THIRTY_SECOND_INTERVAL,   function twitchJob() { twitch.job( getCallbackFunction( 'twitch' ) ); }, null, true );
};
