module.exports = function() {
	let redis = require( 'redis' );

	function getRedisClient() {
		return redis.createClient( {
			url: process.env.REDIS_URL
		} );
	}

	return {
		getRedisClient: getRedisClient,
	};
};
