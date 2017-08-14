module.exports = function( ) {

	// Module imports
	var gcm = require( __dirname + '/gcm' )( );

	function send( title, message, key, callback ) {

		// Send meesage from each of the modules
		console.log( 'called send(' + title + ', ' + message + ', ' + key + ')' );

		// NOTE if adding more notification services, write new code to ensure
		// that callback only gets called once, after each service has finished
		gcm.send( title, message, key, callback );
	}

	return {
		send: send
	};
};
