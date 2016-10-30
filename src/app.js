// LIBRARY IMPORTS
var express = require( 'express' );
var app = express();
var fs = require( 'fs' );
var http = require( 'http' );
var bodyParser = require( 'body-parser' );
require( 'log-timestamp' );

// MODULE IMPORTS
var common = require( __dirname + '/common' )();
var db = require( __dirname + '/db' )();
var routes = require( __dirname + '/routes' )( common, db );
var sender = require( __dirname + '/send' )( db );
var jobs = require( __dirname + '/jobs' )( common, sender );

// EXPRESS CONFIG
app.disable( 'etag' ); // more info here: http://stackoverflow.com/q/18811286/1222411
app.use( express.static( __dirname + '/static' ) );
app.use( bodyParser.json() );

// EXPRESS ROUTING
app.get( '/', routes.index );
app.use( '/data', routes.data );
app.put( '/register', routes.register );
app.put( '/settings', routes.settings.update );
app.get( '/settings', routes.settings.get );

// Logging
if ( process.env.NODE_ENV !== 'production' ) {
	require( 'longjohn' );
}

// START SERVERS
var serverHTTP = http.createServer( app ).listen( process.env.PORT, function() {
	var host = serverHTTP.address().address;
	var port = serverHTTP.address().port;

	console.log( 'Listening on ' + host + ':' + port );
} );
