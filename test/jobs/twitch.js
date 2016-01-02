var Mitm = require( 'mitm' );
var should = require( 'should' );
var sinon = require( 'sinon' );
require( 'should-sinon' );

describe( 'twitch', function() {
	beforeEach( function() {
		var test = this;

		process.env.TWITCH_USERNAME = 'TWITCH_USERNAME';
		this.STATUS = 'status';

		// Enable network intercepting
		this.mitm = Mitm();

		// Set the Twitch client ID (the value doesn't matter)
		process.env.TWITCH_CLIENT_ID = 'foo';

		this.checkRequest = function( req ) {
			req.headers.host.should.be.equal( 'api.twitch.tv' );
			req.url.should.be.equal( '/kraken/streams/' + process.env.TWITCH_USERNAME );
			req.headers[ 'client-id' ].should.be.equal( process.env.TWITCH_CLIENT_ID );
			req.headers.accept.should.be.equal( 'application/vnd.twitchtv.v2+json' );
		};

		this.sender = {
			send: function( title, message, key, callback ) {
				title.should.be.equal( 'Live on Twitch!' );
				message.should.be.equal( test.STATUS );
				key.should.equal( 'twitch' );

				callback();
			}
		};
		this.sendspy = sinon.spy( this.sender, 'send' );
		this.twitch = require( '../../src/jobs/twitch' )( this.sender );
	} );

	afterEach( function() {
		// Disable network intercepting
		this.mitm.disable();
	} );

	it( 'should send a notification on live stream when previously not live', function( done ) {
		var test = this;

		// When the twitch job object is created, stream by default is not online
		// The job() function will check to see if the stream is live. We'll
		// intercept the request and respond that the stream is live
		test.mitm.on( 'request', function( req, res ) {
			test.checkRequest( req );

			res.write( JSON.stringify( {
				'stream': {
					'channel': {
						'status': test.STATUS
					}
				}
			} ) );
			res.end();
		} );

		test.twitch.job( function callback() {
			test.sendspy.should.be.calledOnce();
			done();
		} );
	} );

	it( 'should take no action when the request returns 404', function( done ) {
		var test = this;

		test.mitm.on( 'request', function( req, res ) {
			test.checkRequest( req );

			res.statusCode = 404;
			res.end();
		} );

		test.twitch.job( function callback() {
			// Since the status was 404, no notification should be sent
			test.sendspy.should.not.be.called();
			done();
		} );
	} );

	it( 'should take no action when the request returns an error', function( ) {
		// TODO reproduce a request error
	} );

	it( 'should not send notification for online stream if stream was previously online', function( done ) {
		var test = this;

		// Pretend the stream is online
		test.mitm.on( 'request', function( req, res ) {
			test.checkRequest( req );

			res.write( JSON.stringify( {
				'stream': {
					'channel': {
						'status': test.STATUS
					}
				}
			} ) );
			res.end();
		} );

		test.twitch.job( function callback() {
			// The stream was previously offline and is now online
			// notification should be sent
			test.sendspy.should.be.calledOnce();

			// Now we check for the status of the stream again
			test.twitch.job( function callback() {
				// Even though the stream is online, we should not send another notificaiton
				test.sendspy.should.be.calledOnce();
				done();
			} );
		} );
	} );
} );
