// LIBRARY IMPORTS
var express = require( 'express' );
var app = express();
var fs = require( 'fs' );
var http = require( 'http' );
var bodyParser = require( 'body-parser' );

// MODULE IMPORTS
var common = require( __dirname + '/common' )();
var db = require( __dirname + '/db' )();
var routes = require( __dirname + '/routes' )( common, db );
var sender = require( __dirname + '/send' )( );
var jobs = require( __dirname + '/jobs' )( common, db, sender );
require( 'log4js' ).replaceConsole();

// EXPRESS CONFIG
app.set( 'port', process.env.PORT || 3000 );
app.disable( 'etag' ); // more info here: http://stackoverflow.com/q/18811286/1222411
app.use( express.static( __dirname + '/static' ) );
app.use( bodyParser.json() );

// EXPRESS ROUTING
app.get( '/', routes.index );
app.use( '/data', routes.data );

// START SERVER
var serverHTTP = http.createServer( app ).listen( process.env.PORT, function() {
	const host = serverHTTP.address().address;
	const port = serverHTTP.address().port;

	console.log( 'Listening on ' + host + ':' + port );
} );
