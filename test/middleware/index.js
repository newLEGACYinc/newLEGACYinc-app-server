// TODO figure out how to disable console.log(...) messages in code during testing
var assert = require( 'assert' );

describe( 'Middleware', function() {
	describe( 'security', function() {
		var middleware = require( '../../src/middleware' );
		var security = middleware.security;

		it( 'should call next() when req.secure is true', function( done ) {
			security( { secure: true }, {}, done );
		} );

		it( 'should call res.redirect when req.secure is false', function( done ) {
			var req = {
				seucre: false,
				headers:{ host: 'foo' },
				url: 'bar'
			};
			var responseRedirect = function( url ) {
				assert.equal( 'https://foobar', url );
				done();
			};
			security( req, { redirect: responseRedirect }, function() {} );
		} );
	} );
} );
