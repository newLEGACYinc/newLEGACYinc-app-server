// LIBRARY IMPORTS
var express = require( 'express' );
var app = express();
var fs = require( 'fs' );
var http = require( 'http' );
var bodyParser = require( 'body-parser' );

// MODULE IMPORTS
var db = require( './db' )();
var middleware = require( __dirname + '/middleware' );
var routes = require( __dirname + '/routes' );
var sender = require( __dirname + '/send' )( db );
var jobs = require( __dirname + '/jobs' )( sender );

// EXPRESS CONFIG
app.disable( 'etag' ); // more info here: http://stackoverflow.com/q/18811286/1222411
if ( process.env.NODE_ENV === 'production' ) {

	// Redirect http to https
	app.use( middleware.security );
}
app.use( express.static( __dirname + '/static' ) );
app.use( bodyParser.json() );

// EXPRESS ROUTING
app.get( '/', routes.index );
app.use( '/data', routes.data );
app.put( '/register', routes.register( db ) );
app.put( '/settings', routes.settings( db ).update );
app.get( '/settings', routes.settings( db ).get );

// Logging
if ( process.env.NODE_ENV !== 'production' ) {
	require( 'longjohn' );
}

// START SERVERS
// http
var serverHTTP = http.createServer( app ).listen( process.env.PORT, function() {
	var host = serverHTTP.address().address;
	var port = serverHTTP.address().port;

	console.log( 'Listening on ' + host + ':' + port );
} );

// Https
// only use https in production
if ( process.env.NODE_ENV === 'production' ) {
	var https = require( 'https' );
	var config = {
		key: fs.readFileSync( __dirname + '/' + process.env.SSL_KEY ),
		cert: fs.readFileSync( __dirname + '/' + process.env.SSL_CERT ),
		passphrase: ''
	};
	var serverHTTPS = https.createServer( config, app ).listen( 443, function() {
		var host = serverHTTPS.address().address;
		var port = serverHTTPS.address().port;

		console.log( 'Listening on ' + host + ':' + port );
	} );
}
