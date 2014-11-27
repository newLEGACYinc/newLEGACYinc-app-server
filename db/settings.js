module.exports = function(pool){
	function get(id, type, callback){
		var sql = "SELECT youTube, hitbox, twitch FROM devices WHERE id=? and type=?";
		var inserts = [id, type];
		pool.getConnection(function(err,connection){
			if(err){
				console.log(err);
				callback(err);
				return;
			}
			connection.query(sql, inserts, function(err, rows){
				connection.release();
				if (err){
					console.log(err);
					callback(err);
					return;
				}
				return callback(false, rows[0]);
			});
		});
	}

	return {
		get: get
	}
}