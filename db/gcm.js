module.exports = function(pool){
	function addRegistrationId(id, callback){
		var sql = 'INSERT INTO devices (id, type) VALUES (?,"GCM")';
		var inserts = [id];
		pool.getConnection(function(err, connection){
			if (err){
				console.log(err);
				callback(err);
				return;
			}
			connection.query(sql, inserts, function(err, result){
				connection.release();
				if(err){
					console.log(err);
					callback(err);
					return;
				}
				callback(false, result);
			});
		});
	}

	function getRegistrationIds(callback){
		var sql = 'SELECT (id) from devices WHERE type="GCM"';
		pool.getConnection(function(err, connection){
			if (err){
				console.log(err);
				callback(err);
				return;
			}
			connection.query(sql,[],function(err, rows, fields){
				connection.release();
				if (err){
					console.log(err);
					callback(err);
					return;
				}
				var results = []
				rows.forEach(function(row){
					results.push(row.id);
				});
				callback(false, results);
			});
		})
	}

	return {
		addRegistrationId: addRegistrationId,
		getRegistrationIds: getRegistrationIds
	};
}