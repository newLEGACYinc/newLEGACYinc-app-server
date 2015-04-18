var proxyquire = require( 'proxyquire' );
var should = require( 'should' );
var sinon = require( 'sinon' );
require( 'should-sinon' );

describe( 'Send', function() {
	var gcmSender = {
		send: function send( message, chunk, n, callback ) {
			return callback( null, { results: [] } );
		}
	};
	var nodeGcmStub = {
		Sender: function Sender( apiKey ) {
			return gcmSender;
		}
	};
	var gcm = proxyquire( '../../src/send/gcm', { 'node-gcm': nodeGcmStub } );
	var path = __dirname + '/gcm';
	var send = proxyquire( '../../src/send', { './gcm': gcm } );

	it( 'should make correct function calls', function( done ) {
		var db = {
			getRegistrationIds: function getRegistrationIds( service, key, callback ) {
				callback( null, [ 123123, 123124 ] ); // TODO make this the actual format
			}
		};
		var sender = send( db );
		var dbSpy = sinon.spy( db, 'getRegistrationIds' );
		var gcmSpy = sinon.spy( gcmSender, 'send' );

		sender.send( 'title', 'message', 'key', function() {
			dbSpy.should.be.calledOnce();
			gcmSpy.should.be.calledOnce();

			// TODO have node-gcm mark IDs for updating and assert that updateDatabase(...)
			// is called and updates the database properly
			done();
		} );
	} );
} );
