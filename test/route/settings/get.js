var should = require( 'should' );
var sinon = require( 'sinon' );
require( 'should-sinon' );

describe( 'settings', function() {
	describe( 'get', function() {
		beforeEach( function() {
			var test = this;

			test.db = {
				settings: {
					get: function( id, type, callback ) {
						id.should.be.equal( 'device id' );
						type.should.be.equal( 'TYPE' );
						callback( null, 'settings' );
					}
				}
			};
			test.dbSpy = sinon.spy( test.db.settings, 'get' );

			test.get = require( '../../../src/routes/settings/get' )( test.db );
		} );

		it( 'should return an error when a device ID is not provided', function( done ) {
			var test = this;

			var request = {
				headers: {
					type: 'TYPE'
				}
			};

			var response = {
				statusCode: 0,
				status: function( code ) {
					this.statusCode = code;
					return this;
				},
				send: function( message ) {
					this.statusCode.should.be.equal( 400 );
					test.dbSpy.should.not.be.called();
					done();
				}
			};

			test.get( request, response );
		} );

		it( 'should return an error when a type is not provided', function( done ) {
			var test = this;

			var request = {
				headers: {
					id: 'device id'
				}
			};

			var response = {
				statusCode: 0,
				status: function( code ) {
					this.statusCode = code;
					return this;
				},
				send: function( message ) {
					this.statusCode.should.be.equal( 400 );
					test.dbSpy.should.not.be.called();
					done();
				}
			};

			test.get( request, response );
		} );

		it( 'should return device settings when provided an id and type', function( done ) {
			var test = this;

			var request = {
				headers: {
					id: 'device id',
					type: 'TYPE'
				}
			};

			var response = {
				statusCode: 0,
				status: function( code ) {
					this.statusCode = code;
					return this;
				},
				send: function( message ) {
					this.statusCode.should.be.equal( 200 );
					message.should.be.equal( 'settings' );
					test.dbSpy.should.be.calledOnce();
					done();
				}
			};

			test.get( request, response );
		} );
	} );
} );
