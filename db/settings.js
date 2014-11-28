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

	function update(id, type, data, callback){
		var sql = "UPDATE devices SET youTube=?, hitbox=?, twitch=? WHERE id=? and type=?";
		var inserts = [data.youTube, data.hitbox, data.twitch, id, type];
		pool.getConnection(function(err,connection){
			if(err){
				console.log(err);
				return callback(err);
			}
			connection.query(sql, inserts, function(err, data){
				connection.release();
				if (err){
					console.log(err);
					return callback(err);
				}
				return callback(false, data);
			});
		});
	}

	return {
		get: get,
		update: update
	}
}