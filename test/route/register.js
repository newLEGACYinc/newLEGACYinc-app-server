var should = require( 'should' );
var sinon = require( 'sinon' );
require( 'should-sinon' );

describe( 'register', function() {
	beforeEach( function() {
		var test = this;

		test.db = {
			addRegistrationId: function( id, type, callback ) {
				id.should.be.equal( 'device id' );
				type.should.be.equal( 'TYPE' );
				callback( null, 'result' );
			}
		};
		test.dbSpy = sinon.spy( test.db, 'addRegistrationId' );

		test.register = require( '../../src/routes/register' )( test.db );
	} );

	it( 'should return status code 200 if the registration was successful', function( done ) {
		var test = this;

		var request = {
			body: {
				id: 'device id',
				type: 'TYPE'
			}
		};

		var response = {
			statusCode: 0,
			status: function( code ) {
				this.statuscode = code;
				return this;
			},
			send: function( message ) {
				this.statuscode.should.be.equal( 200 );
				test.dbSpy.should.be.calledOnce();
				done();
			}
		};

		test.register( request, response );
	} );
} );
