var fileSystem = require( 'fs' );
var Mitm = require( 'mitm' );
var moment = require( 'moment' );
var path = require( 'path' );
var should = require( 'should' );
var sinon = require( 'sinon' );
require( 'should-sinon' );

describe( 'hitbox', function() {
	beforeEach( function() {
		var test = this;

		this.STATUS = 'Losing ELO ;>>>';

		// Enable network intercepting
		this.mitm = Mitm();

		// Set the hitbox username environment variable
		process.env.HITBOX_USERNAME = 'masta';

		// Set up hitbox module with a spy to detect when the send() functino is called
		this.sender = {
			send: function( title, message, key, callback ) {
				title.should.be.equal( 'Live on hitbox!' );
				message.should.be.equal( test.STATUS );
				key.should.equal( 'hitbox' );
				callback();
			}
		};
		this.sendspy = sinon.spy( this.sender, 'send' );
		this.hitbox = require( '../../src/jobs/hitbox' )( this.sender );
	} );

	afterEach( function() {
		// Disable network intercepting
		this.mitm.disable();
	} );

	it( 'should send a notification on newly live stream', function( done ) {
		var test = this;

		// When the hitbox job object is created, stream by default is not online
		// The job() function will check to see if the stream is live. We'll
		// intercept the request and respond that the stream is live
		test.mitm.on( 'request', function( req, res ) {
			switch ( req.url ){
				case ( '/media/live/' + process.env.HITBOX_USERNAME ): {
					var filePath = path.join( __dirname, '../res/hitbox-media-response.json' );
					var stat = fileSystem.statSync( filePath );

					res.writeHead( 200, {
						'Content-Type': 'application/json',
						'Content-Length': stat.size
					} );

					var readStream = fileSystem.createReadStream( filePath );
					readStream.pipe( res );
					break;
				}
				default: {
					res.statusCode = 404;
					res.end();
				}
			}

		} );

		test.hitbox.job( function callback( error ) {
			should.not.exist( error );
			test.sendspy.should.be.calledOnce();
			done();
		} );
	} );

	it( 'should take no action when the request returns 404', function( done ) {
		var test = this;

		test.mitm.on( 'request', function( req, res ) {
			res.statusCode = 404;
			res.end();
		} );

		test.hitbox.job( function callback( error ) {
			error.should.be.equal( 404 );

			// Since the status was 404, no notification should be sent
			test.sendspy.should.not.be.called();
			done();
		} );
	} );

	it( 'should take no action when the request returns an error', function( ) {
		// TODO reproduce a request error
	} );

	it( 'should take no action when the stream is offline', function( done ) {
		var test = this;

		test.mitm.on( 'request', function( req, res ) {
			switch ( req.url ){
				case ( '/media/live/' + process.env.HITBOX_USERNAME ): {
					var filePath = path.join( __dirname, '../res/hitbox-media-response-offline.json' );
					var stat = fileSystem.statSync( filePath );

					res.writeHead( 200, {
						'Content-Type': 'application/json',
						'Content-Length': stat.size
					} );

					var readStream = fileSystem.createReadStream( filePath );
					readStream.pipe( res );
					break;
				}
				default: {
					res.statusCode = 404;
					res.end();
				}
			}

		} );

		test.hitbox.job( function callback( error ) {
			should.not.exist( error );
			test.sendspy.should.not.be.called();
			done();
		} );
	} );

	it( 'should not send notification for online stream if is not newly online', function( done ) {
		var test = this;

		test.mitm.on( 'request', function( req, res ) {
			switch ( req.url ){
				case ( '/media/live/' + process.env.HITBOX_USERNAME ): {
					var filePath = path.join( __dirname, '../res/hitbox-media-response-old-online.json' );
					var stat = fileSystem.statSync( filePath );

					res.writeHead( 200, {
						'Content-Type': 'application/json',
						'Content-Length': stat.size
					} );

					var readStream = fileSystem.createReadStream( filePath );
					readStream.pipe( res );
					break;
				}
				default: {
					res.statusCode = 404;
					res.end();
				}
			}

		} );

		test.hitbox.job( function callback( error ) {
			should.not.exist( error );
			test.sendspy.should.not.be.called();
			done();
		} );
	} );
} );
