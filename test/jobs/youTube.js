var Mitm = require( 'mitm' );
var moment = require( 'moment' );
var should = require( 'should' );
var sinon = require( 'sinon' );
require( 'should-sinon' );
var Url = require( 'url' );

describe( 'youTube', function() {
	beforeEach( function() {
		var test = this;

		// Enable network intercepting
		test.mitm = Mitm();

		// Set up process environment
		process.env.YOUTUBE_CHANNEL_ID = 'youTubeChannelId';
		process.env.YOUTUBE_API_KEY = 'youTubeAPIKey';

		test.sender = {
			send: function( title, message, key, callback ) {
				title.should.be.equal( 'New YouTube video!' );
				message.should.be.equal( 'message' );
				key.should.be.equal( 'youTube' );
				callback.should.be.ok();
				callback();
			}
		};
		test.sendSpy = sinon.spy( test.sender, 'send' );

		test.youTube = require( '../../src/jobs/youTube' )( test.sender );
	} );

	afterEach( function() {
		// Disable network intercepting
		this.mitm.disable();
		this.mitm = null;
	} );

	it( 'should notify when a new video is available', function( done ) {
		var test = this;

		test.mitm.on( 'request', function( req, res ) {
			var url = Url.parse( req.url, true /* parseQueryString */ );
			req.headers.host.should.be.equal( 'www.googleapis.com' );
			url.pathname.should.be.equal( '/youtube/v3/search' );
			url.query.channelId.should.be.equal( 'youTubeChannelId' );
			url.query.key.should.be.equal( 'youTubeAPIKey' );
			url.query.order.should.be.equal( 'date' );
			url.query.part.should.be.equal( 'snippet' );
			url.query.publishedAfter.should.be.ok();

			res.write( JSON.stringify( {
				items: [ {
					snippet: {
						publishedAt: moment().add( 1, 'days' ),
						title: 'message'
					}
				} ]
			} ) );
			res.end();
		} );

		test.youTube.job( function() {
			test.sendSpy.should.be.calledOnce();
			done();
		} );
	} );
} );
