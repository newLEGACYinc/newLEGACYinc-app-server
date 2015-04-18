var proxyquire = require( 'proxyquire' );
var should = require( 'should' );
var sinon = require( 'sinon' );
require( 'should-sinon' );

describe( 'db', function() {
	beforeEach( function() {
		var test = this;

		// Setup the process environment
		process.env.DB_HOST = 'DB_HOST';
		process.env.DB_USER = 'DB_USER';
		process.env.DB_PASS = 'DB_PASS';
		process.env.DB_DATABASE = 'DB_DATABASE';

		// The object recieved once a database connection is established
		test.connection = {
			query: function( sql, inserts, callback ) {
				// Function parameters should be asserted in each test
				var result = [ {
					id: 'id1'
				} ];
				callback( null, result );
			},
			release: function() {
				// Do nothing
			}
		};
		test.querySpy = sinon.spy( test.connection, 'query' );
		test.releaseSpy = sinon.spy( test.connection, 'release' );

		// The pool of connections available after setting up the database
		test.pool = {
			getConnection: function( callback ) {
				callback( null, test.connection );
			}
		};
		test.getConnectionSpy = sinon.spy( test.pool, 'getConnection' );

		// Library to allow setting up database connection
		test.mysql = {
			createPool: function( options ) {
				options.host.should.be.equal( 'DB_HOST' );
				options.user.should.be.equal( 'DB_USER' );
				options.password.should.be.equal( 'DB_PASS' );
				options.database.should.be.equal( 'DB_DATABASE' );
				options.connectionLimit.should.be.equal( 5 );
				options.supportBigNumbers.should.be.true();
				return test.pool;
			}
		};
		test.db = proxyquire( '../../src/db', { 'mysql': test.mysql } )();
	} );

	it( 'should correctly add a registration ID', function( done ) {
		var test = this;

		test.db.addRegistrationId( 'REGID', 'TYPE', function( err, result ) {
			test.querySpy.should.be.calledOnce(); // Only call one database query for add
			test.querySpy.should.be.calledWithMatch( 'INSERT INTO devices (id, type) VALUES (?, ?)', [ 'REGID', 'TYPE' ] );

			test.getConnectionSpy.should.be.calledOnce(); // Only need one database connection
			test.releaseSpy.should.be.calledOnce(); // Should release the database connection after add

			err.should.be.false();
			result.should.be.ok(); // Should return some sort of result
			done();
		} );
	} );

	it( 'should retrieve registration IDs without a key', function( done ) {
		var test = this;

		test.db.getRegistrationIds( 'TYPE', null, function( err, results ) {
			test.querySpy.should.be.calledOnce();
			test.querySpy.should.be.calledWithMatch( 'SELECT (id) from devices WHERE type = ?', [ 'TYPE' ] );

			test.getConnectionSpy.should.be.calledOnce();
			test.releaseSpy.should.be.calledOnce();

			err.should.be.false();
			results.should.be.eql( [ 'id1' ] );
			done();
		} );
	} );
} );
