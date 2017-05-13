module.exports = function( mongoose, Device ) {
	function get( id, type, callback ) {
		Device.findOne( { id: id, type: type } ).select( 'youTube hitbox twitch -_id' ).exec( function( error, device ) {
			if ( error ) {
				console.error( 'Error retrieving device from database.' );
				console.error( error );
				callback( error );
			} else {
				callback( false, device );
			}
		} );
	}

	function update( id, type, data, callback ) {
		Device.update( { id: id, type: type }, {
			youTube: data.youTube,
			hitbox: data.hitbox,
			twitch: data.twitch
		}, function( error ) {
			if ( error ) {
				console.error( 'Error updating device settings.' );
				console.error( error );
				callback( error );
			} else {
				callback( false );
			}
		} );
	}

	return {
		get: get,
		update: update
	};
};
