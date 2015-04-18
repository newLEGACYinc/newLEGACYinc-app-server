module.exports = function( sender ) {

	// Library imports
	var CronJob = require( 'cron' ).CronJob;

	// Module imports
	var hitbox = require( __dirname + '/hitbox' )( sender );
	var twitch = require( __dirname + '/twitch' )( sender );
	var youTube = require( __dirname + '/youTube' )( sender );

	// Each job function expects a callback
	var callback = function( error ) {
		if ( error ) {
			console.error( error );
		}
	};

	// Setup and start jobs
	new CronJob( '0 */1 * * * *', function() { hitbox.job( callback ); }, null, true );
	new CronJob( '*/30 * * * * *', function() { youTube.job( callback ); }, null, true );
	new CronJob( '*/30 * * * * *', function() { twitch.job( callback ); }, null, true );
};
